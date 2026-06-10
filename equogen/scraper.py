import os
import json
import re
import urllib.parse
from datetime import datetime
import requests
from bs4 import BeautifulSoup

# Configurazione percorsi relativi alla directory dello script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PRODUCTS_FILE = os.path.join(SCRIPT_DIR, "products.json")
PRICES_FILE = os.path.join(SCRIPT_DIR, "prices.json")

# Headers per simulare un browser reale ed evitare blocchi base
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "it-IT,it;q=0.8,en-US;q=0.5,en;q=0.3",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1"
}

def clean_price(price_str):
    if not price_str:
        return None
    
    # Rimuove simboli valuta, spazi vuoti e caratteri strani
    price_str = price_str.upper()
    price_str = price_str.replace("€", "").replace("EUR", "").replace("DA", "").replace("A", "").strip()
    
    # Pulisce spazi bianchi non standard (es. nbsp)
    price_str = re.sub(r'\s+', '', price_str)
    
    if not price_str:
        return None

    # Gestione separatori decimali e migliaia (es. 1.250,50 o 12,50)
    # Se ci sono sia punti che virgole
    if "," in price_str and "." in price_str:
        if price_str.rfind(",") > price_str.rfind("."):
            # Caso 1.250,50 -> 1250.50
            price_str = price_str.replace(".", "").replace(",", ".")
        else:
            # Caso 1,250.50 -> 1250.50
            price_str = price_str.replace(",", "")
    elif "," in price_str:
        # Se c'è solo la virgola, la trattiamo come separatore decimale se ci sono 2 decimali dopo,
        # altrimenti potrebbe essere migliaia. In Italia la virgola è per i decimali.
        parts = price_str.split(",")
        if len(parts) == 2:
            price_str = price_str.replace(",", ".")
            
    # Estrae il primo numero decimale valido trovato nella stringa pulita
    match = re.search(r'\d+(\.\d+)?', price_str)
    if match:
        try:
            return round(float(match.group()), 2)
        except ValueError:
            return None
    return None

def extract_price_from_json_ld(soup):
    scripts = soup.find_all("script", type="application/ld+json")
    for script in scripts:
        try:
            data = json.loads(script.string or "")
            
            # Helper ricorsivo per cercare oggetti "Product" o "Offer"
            def search_data(obj):
                if isinstance(obj, list):
                    for item in obj:
                        res = search_data(item)
                        if res:
                            return res
                elif isinstance(obj, dict):
                    # Cerca tipo Product con offers
                    if obj.get("@type") == "Product" or "offers" in obj:
                        offers = obj.get("offers")
                        if offers:
                            if isinstance(offers, list) and len(offers) > 0:
                                price = offers[0].get("price")
                                if price: return str(price)
                            elif isinstance(offers, dict):
                                price = offers.get("price")
                                if price: return str(price)
                    
                    # Cerca tipo Offer direttamente
                    if obj.get("@type") == "Offer" and "price" in obj:
                        return str(obj.get("price"))
                    
                    # Cerca ricorsivamente in tutte le chiavi
                    for val in obj.values():
                        res = search_data(val)
                        if res:
                            return res
                return None
            
            price = search_data(data)
            if price:
                return price
        except Exception as e:
            continue
    return None

def extract_price_from_meta(soup):
    # Lista di meta tag comuni per il prezzo
    meta_properties = [
        ("property", "product:price:amount"),
        ("property", "og:price:amount"),
        ("itemprop", "price"),
        ("name", "twitter:data1"),  # A volte usato per il prezzo nei tweet cards
        ("property", "product:sale_price:amount")
    ]
    
    for attr, name in meta_properties:
        meta_tag = soup.find("meta", {attr: name})
        if meta_tag and meta_tag.get("content"):
            return meta_tag.get("content")
            
    return None

def extract_price_from_itemprop(soup):
    # Cerca tag HTML con itemprop="price"
    price_tag = soup.find(attrs={"itemprop": "price"})
    if price_tag:
        if price_tag.get("content"):
            return price_tag.get("content")
        return price_tag.get_text()
    return None

def scrape_product_price(url):
    print(f"Scraping URL: {url}")
    try:
        response = requests.get(url, headers=HEADERS, timeout=15)
        if response.status_code != 200:
            print(f"Errore: Status code {response.status_code}")
            return None
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Metodo 1: JSON-LD (Dati strutturati) - Più affidabile per e-commerce
        price_raw = extract_price_from_json_ld(soup)
        if price_raw:
            price = clean_price(price_raw)
            if price:
                print(f"-> Trovato prezzo tramite JSON-LD: {price} €")
                return price
                
        # Metodo 2: Meta tag (OpenGraph / SEO)
        price_raw = extract_price_from_meta(soup)
        if price_raw:
            price = clean_price(price_raw)
            if price:
                print(f"-> Trovato prezzo tramite Meta Tag: {price} €")
                return price
                
        # Metodo 3: Microdati HTML (itemprop="price")
        price_raw = extract_price_from_itemprop(soup)
        if price_raw:
            price = clean_price(price_raw)
            if price:
                print(f"-> Trovato prezzo tramite itemprop: {price} €")
                return price
                
        # Metodo 4: Fallback classi CSS comuni per PrestaShop / WooCommerce
        common_classes = [
            ".current-price-value", ".current-price", ".product-price", 
            ".price", ".woocommerce-Price-amount", ".price-sales"
        ]
        for css_selector in common_classes:
            tag = soup.select_one(css_selector)
            if tag:
                price = clean_price(tag.get_text())
                if price:
                    print(f"-> Trovato prezzo tramite CSS class '{css_selector}': {price} €")
                    return price
                    
        print("-> Impossibile trovare il prezzo nella pagina.")
        return None
        
    except Exception as e:
        print(f"Errore durante lo scraping dell'URL {url}: {e}")
        return None

def main():
    # 1. Carica i prodotti configurati
    if not os.path.exists(PRODUCTS_FILE):
        print(f"File prodotti non trovato: {PRODUCTS_FILE}")
        return
        
    with open(PRODUCTS_FILE, "r", encoding="utf-8") as f:
        products = json.load(f)
        
    # 2. Carica i prezzi esistenti (se presenti) per non perderli in caso di errore
    existing_prices = {}
    if os.path.exists(PRICES_FILE):
        try:
            with open(PRICES_FILE, "r", encoding="utf-8") as f:
                existing_prices = json.load(f)
        except Exception as e:
            print(f"Impossibile leggere il file dei prezzi esistente: {e}")
            
    updated_prices = {}
    timestamp_now = datetime.utcnow().isoformat() + "Z"
    
    print(f"Inizio scraping di {len(products)} prodotti...")
    
    for product in products:
        p_id = product["id"]
        url = product["url"]
        fallback_price = product.get("fallback_price", 0.0)
        
        # Esegue lo scraping
        scraped_price = scrape_product_price(url)
        
        if scraped_price is not None:
            # Successo
            updated_prices[p_id] = {
                "price": scraped_price,
                "last_updated": timestamp_now,
                "status": "success"
            }
        else:
            # Fallimento: recupera il prezzo precedente o usa il fallback
            if p_id in existing_prices:
                print(f"-> Mantenuto prezzo storico per '{p_id}': {existing_prices[p_id]['price']} €")
                updated_prices[p_id] = existing_prices[p_id]
                updated_prices[p_id]["status"] = "cached"  # Segnala che è un dato cache/storico
            else:
                print(f"-> Usato prezzo di fallback per '{p_id}': {fallback_price} €")
                updated_prices[p_id] = {
                    "price": fallback_price,
                    "last_updated": timestamp_now,
                    "status": "fallback"
                }
                
    # 3. Salva i prezzi aggiornati
    with open(PRICES_FILE, "w", encoding="utf-8") as f:
        json.dump(updated_prices, f, indent=2, ensure_ascii=False)
        
    print("Scraping completato e prezzi salvati con successo!")

if __name__ == "__main__":
    main()
