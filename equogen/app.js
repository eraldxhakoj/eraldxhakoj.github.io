/**
 * EQUOGEN - Calcolatore Budget Edile
 * Logica di funzionamento client-side
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- STATO DELL'APPLICAZIONE ---
  let products = [];
  let prices = {};
  let overrides = JSON.parse(localStorage.getItem("equogen_overrides") || "{}");
  let budget = JSON.parse(localStorage.getItem("equogen_budget") || "[]");
  let activeCategory = "all";
  let searchQuery = "";
  let showVat = localStorage.getItem("equogen_show_vat") !== "false"; // default true
  let currentOverrideProductId = null;

  // --- ELEMENTI DEL DOM ---
  const productsListContainer = document.getElementById("products-list-container");
  const categoryFiltersContainer = document.getElementById("category-filters-container");
  const searchInput = document.getElementById("search-input");
  const budgetItemsContainer = document.getElementById("budget-items-container");
  const subtotalVal = document.getElementById("subtotal-val");
  const vatVal = document.getElementById("vat-val");
  const totalVal = document.getElementById("total-val");
  const statBudgetTotal = document.getElementById("stat-budget-total");
  const statLastUpdate = document.getElementById("stat-last-update");
  const statScrapedCount = document.getElementById("stat-scraped-count");
  const vatCheckbox = document.getElementById("vat-checkbox");
  const btnClearBudget = document.getElementById("btn-clear-budget");
  const btnExportPdf = document.getElementById("btn-export-pdf");
  const btnCopyClipboard = document.getElementById("btn-copy-clipboard");
  const customProductForm = document.getElementById("custom-product-form");
  
  // Modal Override
  const overrideModal = document.getElementById("override-modal");
  const overrideProductName = document.getElementById("override-product-name");
  const overridePriceInput = document.getElementById("override-price-input");
  const btnCloseModal = document.getElementById("btn-close-modal");
  const btnSaveOverride = document.getElementById("btn-save-override");
  const btnResetPrice = document.getElementById("btn-reset-price");

  // --- FASE 1: INIZIALIZZAZIONE DATI ---
  async function init() {
    try {
      // Imposta il valore iniziale della checkbox IVA
      vatCheckbox.checked = showVat;

      // Carica contemporaneamente prodotti e prezzi
      const [productsResponse, pricesResponse] = await Promise.all([
        fetch("products.json"),
        fetch("prices.json")
      ]);

      if (!productsResponse.ok || !pricesResponse.ok) {
        throw new Error("Errore durante il recupero dei dati JSON");
      }

      products = await productsResponse.json();
      prices = await pricesResponse.json();

      // Aggiorna le statistiche nel banner
      updateStatsBanner();

      // Genera i filtri per categoria
      renderCategoryFilters();

      // Mostra la lista dei prodotti
      renderProducts();

      // Inizializza il preventivo salvato
      renderBudget();

    } catch (error) {
      console.error(error);
      productsListContainer.innerHTML = `
        <div class="error-state">
          <i class="fa-solid fa-triangle-exclamation loading-icon" style="color: var(--accent-orange)"></i>
          <h3>Impossibile caricare i dati</h3>
          <p>Si è verificato un errore nel caricamento dei materiali. Verifica la tua connessione.</p>
          <button class="btn btn-primary" onclick="window.location.reload()">Riprova</button>
        </div>
      `;
    }
  }

  // Aggiorna i dati nel banner delle statistiche / footer
  function updateStatsBanner() {
    // Trova l'ultimo aggiornamento valido
    let latestUpdate = null;
    let successCount = 0;

    Object.values(prices).forEach(item => {
      if (item.status === "success") {
        successCount++;
      }
      if (item.last_updated) {
        const date = new Date(item.last_updated);
        if (!latestUpdate || date > latestUpdate) {
          latestUpdate = date;
        }
      }
    });

    if (latestUpdate) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
      if (statLastUpdate) {
        const valEl = statLastUpdate.querySelector(".stat-value");
        if (valEl) valEl.textContent = latestUpdate.toLocaleDateString("it-IT", options);
      }
    } else {
      if (statLastUpdate) {
        const valEl = statLastUpdate.querySelector(".stat-value");
        if (valEl) valEl.textContent = "N/D";
      }
    }

    if (statScrapedCount) {
      const valEl = statScrapedCount.querySelector(".stat-value");
      if (valEl) valEl.textContent = `${successCount} / ${products.length}`;
    }
  }

  // Ottieni il prezzo effettivo (considerando gli override dell'utente)
  function getProductPrice(productId) {
    if (overrides[productId] !== undefined) {
      return overrides[productId];
    }
    if (prices[productId]) {
      return prices[productId].price;
    }
    // Cerca il fallback nel prodotto
    const product = products.find(p => p.id === productId);
    return product ? product.fallback_price : 0.0;
  }

  // --- FASE 2: RENDER COMPONENTI ---

  // Genera i filtri categoria in base ai prodotti esistenti
  function renderCategoryFilters() {
    const categories = new Set();
    products.forEach(p => {
      if (p.category) categories.add(p.category);
    });

    categoryFiltersContainer.innerHTML = `
      <button class="filter-btn ${activeCategory === 'all' ? 'active' : ''}" data-category="all">Tutti</button>
    `;

    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = `filter-btn ${activeCategory === cat ? 'active' : ''}`;
      btn.setAttribute("data-category", cat);
      btn.textContent = cat;
      categoryFiltersContainer.appendChild(btn);
    });

    // Aggiungi gestori evento ai nuovi pulsanti
    categoryFiltersContainer.querySelectorAll(".filter-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        categoryFiltersContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeCategory = btn.getAttribute("data-category");
        renderProducts();
      });
    });
  }

  // Renderizza la lista dei prodotti filtrati
  function renderProducts() {
    // Filtra prodotti
    const filteredProducts = products.filter(p => {
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filteredProducts.length === 0) {
      productsListContainer.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-box-open empty-icon"></i>
          <p>Nessun materiale trovato.</p>
          <span class="empty-sub">Prova a modificare i termini di ricerca o la categoria.</span>
        </div>
      `;
      return;
    }

    productsListContainer.innerHTML = "";

    filteredProducts.forEach(product => {
      const pId = product.id;
      const price = getProductPrice(pId);
      const isOverridden = overrides[pId] !== undefined;
      const priceInfo = prices[pId] || { status: "fallback" };
      const statusClass = isOverridden ? "cached" : priceInfo.status;
      const statusLabel = isOverridden ? "modificato" : (priceInfo.status === "success" ? "attivo" : (priceInfo.status === "cached" ? "storico" : "fallback"));
      
      const card = document.createElement("div");
      card.className = "product-card card-glass";
      card.setAttribute("data-id", pId);

      // Struttura della card
      card.innerHTML = `
        <span class="product-category-tag">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        
        <div class="product-price-info">
          <div class="price-box">
            <span class="price-label">Prezzo Attuale ${isOverridden ? '<i class="fa-solid fa-user-pen" title="Modificato da utente"></i>' : ''}</span>
            <span class="price-amount">
              ${price.toFixed(2)} €
              <span class="price-unit">/${product.item_unit_name}</span>
            </span>
          </div>
          <span class="price-status-badge ${statusClass}">${statusLabel}</span>
        </div>

        <div style="margin-bottom: 16px;">
          <a href="${product.url}" target="_blank" rel="noopener" class="source-link">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Vedi su e-commerce
          </a>
        </div>

        <div class="card-calculation-area">
          <div class="calc-input-row">
            <span class="calc-label">Quantità richiesta (${product.unit === 'mq' ? 'Metri Quadri' : 'Unità'}):</span>
            <div class="calc-input-wrapper">
              <input type="number" class="qty-input" min="1" value="${product.unit === 'mq' ? '10' : '1'}" />
              <span class="input-unit">${product.unit}</span>
            </div>
          </div>
          
          <div class="calc-result-row">
            <span>Fabbisogno Stimato:</span>
            <span class="result-value needed-items-text">Calcolo...</span>
          </div>
          
          <div class="calc-result-row">
            <span>Prezzo Totale:</span>
            <span class="result-value calc-total total-cost-text">0.00 €</span>
          </div>
        </div>

        <button class="btn btn-primary btn-add-budget">
          <i class="fa-solid fa-cart-plus"></i> Aggiungi al Preventivo
        </button>
      `;

      productsListContainer.appendChild(card);

      // Inizializza i calcoli per questa card
      const qtyInput = card.querySelector(".qty-input");
      
      const updateCardCalculation = () => {
        const val = parseFloat(qtyInput.value) || 0;
        let neededItems = val;
        
        if (product.unit === "mq") {
          // Arrotonda per eccesso (es. 10 mq richiesti / 2.4 mq a lastra = 5 lastre)
          neededItems = Math.ceil(val / product.coverage_per_item);
        }
        
        const totalCost = neededItems * price;
        
        const neededText = product.unit === "mq" 
          ? `${neededItems} ${neededItems === 1 ? 'unità' : 'unità'} (${product.item_unit_name})`
          : `${neededItems} ${neededItems === 1 ? 'unità' : 'unità'}`;

        card.querySelector(".needed-items-text").textContent = neededText;
        card.querySelector(".total-cost-text").textContent = `${totalCost.toFixed(2)} €`;
      };

      // Listener per ricalcolo in tempo reale
      qtyInput.addEventListener("input", updateCardCalculation);
      updateCardCalculation(); // Primo calcolo immediato

      // Bottone per inserimento nel preventivo
      card.querySelector(".btn-add-budget").addEventListener("click", () => {
        const quantity = parseFloat(qtyInput.value) || 1;
        addToBudget(product, quantity);
      });
    });
  }

  // --- FASE 3: GESTIONE BUDGET/PREVENTIVO ---

  // Aggiungi un articolo al preventivo
  function addToBudget(product, quantity) {
    // Controlla se è già presente per aggiornarlo
    const existingIndex = budget.findIndex(item => item.product_id === product.id && !item.is_custom);
    
    let neededItems = quantity;
    if (product.unit === "mq") {
      neededItems = Math.ceil(quantity / product.coverage_per_item);
    }

    if (existingIndex > -1) {
      budget[existingIndex].quantity = quantity;
      budget[existingIndex].calculated_items = neededItems;
    } else {
      budget.push({
        product_id: product.id,
        is_custom: false,
        name: product.name,
        category: product.category,
        unit: product.unit,
        item_unit_name: product.item_unit_name,
        coverage_per_item: product.coverage_per_item,
        quantity: quantity,
        calculated_items: neededItems
      });
    }

    saveBudget();
    renderBudget();
    
    // Feedback visivo temporaneo sul pulsante della card
    const card = document.querySelector(`.product-card[data-id="${product.id}"]`);
    if (card) {
      const btn = card.querySelector(".btn-add-budget");
      const originalText = btn.innerHTML;
      btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Aggiunto!`;
      btn.style.backgroundColor = "var(--accent-green)";
      btn.style.boxShadow = "0 0 15px rgba(54, 211, 153, 0.4)";
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = "";
        btn.style.boxShadow = "";
      }, 1500);
    }
  }

  // Rimuovi articolo dal preventivo
  function removeFromBudget(index) {
    budget.splice(index, 1);
    saveBudget();
    renderBudget();
  }

  // Modifica quantità direttamente dalla lista preventivo
  function updateBudgetItemQty(index, newQty) {
    if (newQty <= 0) {
      removeFromBudget(index);
      return;
    }

    const item = budget[index];
    item.quantity = newQty;
    
    if (!item.is_custom) {
      item.calculated_items = Math.ceil(newQty / item.coverage_per_item);
    } else {
      item.calculated_items = newQty;
    }

    saveBudget();
    renderBudget();
  }

  // Salva stato budget in localStorage
  function saveBudget() {
    localStorage.setItem("equogen_budget", JSON.stringify(budget));
  }

  // Renderizza la lista degli elementi del preventivo ed effettua i calcoli finali
  function renderBudget() {
    // Aggiorna data di stampa
    const printDateEl = document.getElementById("print-date-element");
    if (printDateEl) {
      printDateEl.textContent = "Data: " + new Date().toLocaleDateString("it-IT");
    }

    if (budget.length === 0) {
      budgetItemsContainer.innerHTML = `
        <div class="empty-state-budget">
          <i class="fa-solid fa-calculator empty-icon"></i>
          <p>Il preventivo è vuoto.</p>
          <span class="empty-sub">Aggiungi materiali dalla lista per calcolare il budget.</span>
        </div>
      `;
      subtotalVal.textContent = "0.00 €";
      vatVal.textContent = "0.00 €";
      totalVal.textContent = "0.00 €";
      if (statBudgetTotal) statBudgetTotal.textContent = "0.00 €";
      return;
    }

    budgetItemsContainer.innerHTML = "";
    let subtotal = 0;

    budget.forEach((item, index) => {
      let price = 0;
      if (item.is_custom) {
        price = item.price;
      } else {
        price = getProductPrice(item.product_id);
      }

      const itemTotal = item.calculated_items * price;
      subtotal += itemTotal;

      const div = document.createElement("div");
      div.className = "budget-item";
      
      const qtyLabel = item.unit === "mq" 
        ? `${item.quantity} mq (${item.calculated_items} ${item.item_unit_name})`
        : `${item.quantity} ${item.unit}`;

      div.innerHTML = `
        <div class="item-left">
          <span class="item-name">${item.name}</span>
          <div class="item-qty-info">${qtyLabel}</div>
          <div class="item-actions">
            <!-- Pulsanti per incrementare/decrementare -->
            <button class="action-icon-btn btn-qty-dec" data-index="${index}"><i class="fa-solid fa-minus"></i></button>
            <button class="action-icon-btn btn-qty-inc" data-index="${index}"><i class="fa-solid fa-plus"></i></button>
            ${!item.is_custom ? `<button class="action-icon-btn btn-override" data-id="${item.product_id}" title="Forza prezzo"><i class="fa-solid fa-pen"></i> Forza Prezzo</button>` : ''}
            <button class="action-icon-btn delete" data-index="${index}" title="Elimina"><i class="fa-solid fa-trash"></i> Rimuovi</button>
          </div>
        </div>
        <div class="item-right">
          <span class="item-price-calc">${itemTotal.toFixed(2)} €</span>
          <span class="item-price-unit">${price.toFixed(2)} €/${item.is_custom ? item.unit : 'unità'}</span>
        </div>
      `;

      budgetItemsContainer.appendChild(div);
    });

    // Calcolo tasse
    let vatAmount = 0;
    let total = subtotal;

    if (showVat) {
      // Se mostriamo i prezzi IVA inclusa e i prezzi base sono già IVA inclusa (come negli e-commerce),
      // scorporiamo l'imponibile per la visualizzazione corretta.
      // Assumiamo che i prezzi degli e-commerce italiani siano IVA inclusa (22%).
      const imponibile = subtotal / 1.22;
      vatAmount = subtotal - imponibile;
      
      subtotalVal.textContent = `${imponibile.toFixed(2)} €`;
      vatVal.textContent = `${vatAmount.toFixed(2)} €`;
      totalVal.textContent = `${total.toFixed(2)} €`;
      if (statBudgetTotal) statBudgetTotal.textContent = `${total.toFixed(2)} €`;
    } else {
      // Altrimenti mostriamo solo imponibile
      subtotalVal.textContent = `${subtotal.toFixed(2)} €`;
      vatVal.textContent = "0.00 €";
      totalVal.textContent = `${subtotal.toFixed(2)} €`;
      if (statBudgetTotal) statBudgetTotal.textContent = `${subtotal.toFixed(2)} €`;
    }

    // Aggiungi gestori eventi per i bottoni nella lista budget
    budgetItemsContainer.querySelectorAll(".btn-qty-inc").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-index"));
        updateBudgetItemQty(idx, budget[idx].quantity + (budget[idx].unit === 'mq' ? 5 : 1));
      });
    });

    budgetItemsContainer.querySelectorAll(".btn-qty-dec").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-index"));
        updateBudgetItemQty(idx, budget[idx].quantity - (budget[idx].unit === 'mq' ? 5 : 1));
      });
    });

    budgetItemsContainer.querySelectorAll(".delete").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-index"));
        removeFromBudget(idx);
      });
    });

    budgetItemsContainer.querySelectorAll(".btn-override").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        openOverrideModal(id);
      });
    });
  }

  // --- FASE 4: INTERAZIONE MODALE (OVERRIDE PREZZO) ---

  function openOverrideModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentOverrideProductId = productId;
    overrideProductName.value = product.name;
    
    const currentPrice = getProductPrice(productId);
    overridePriceInput.value = currentPrice.toFixed(2);

    overrideModal.classList.add("open");
    overrideModal.setAttribute("aria-hidden", "false");
  }

  function closeOverrideModal() {
    overrideModal.classList.remove("open");
    overrideModal.setAttribute("aria-hidden", "true");
    currentOverrideProductId = null;
  }

  // --- EVENT LISTENERS ---

  // Ricerca testuale
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderProducts();
  });

  // Checkbox IVA
  vatCheckbox.addEventListener("change", (e) => {
    showVat = e.target.checked;
    localStorage.setItem("equogen_show_vat", showVat);
    renderBudget();
  });

  // Pulisci Budget
  btnClearBudget.addEventListener("click", () => {
    if (confirm("Sei sicuro di voler svuotare il preventivo attuale?")) {
      budget = [];
      saveBudget();
      renderBudget();
    }
  });

  // Form Prodotto Custom
  customProductForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("custom-name").value.strip ? document.getElementById("custom-name").value.strip() : document.getElementById("custom-name").value;
    const price = parseFloat(document.getElementById("custom-price").value) || 0;
    const quantity = parseFloat(document.getElementById("custom-quantity").value) || 1;
    const unit = document.getElementById("custom-unit").value;

    const customItem = {
      product_id: "custom_" + Date.now(),
      is_custom: true,
      name: name,
      category: "Personalizzati",
      unit: unit,
      item_unit_name: unit,
      coverage_per_item: 1,
      quantity: quantity,
      calculated_items: quantity,
      price: price
    };

    budget.push(customItem);
    saveBudget();
    renderBudget();

    customProductForm.reset();
  });

  // Chiusura Modale Override
  btnCloseModal.addEventListener("click", closeOverrideModal);
  
  // Salva Override
  btnSaveOverride.addEventListener("click", () => {
    if (!currentOverrideProductId) return;
    const newPrice = parseFloat(overridePriceInput.value);
    
    if (isNaN(newPrice) || newPrice < 0) {
      alert("Inserisci un prezzo valido e maggiore di zero.");
      return;
    }

    overrides[currentOverrideProductId] = newPrice;
    localStorage.setItem("equogen_overrides", JSON.stringify(overrides));
    
    closeOverrideModal();
    renderProducts();
    renderBudget();
  });

  // Reset Override (Ripristina originale)
  btnResetPrice.addEventListener("click", () => {
    if (!currentOverrideProductId) return;
    
    delete overrides[currentOverrideProductId];
    localStorage.setItem("equogen_overrides", JSON.stringify(overrides));
    
    closeOverrideModal();
    renderProducts();
    renderBudget();
  });

  // Copia negli appunti
  btnCopyClipboard.addEventListener("click", () => {
    if (budget.length === 0) return;

    let text = `*** EQUOGEN - PREVENTIVO MATERIALI EDILI ***\n`;
    text += `Data: ${new Date().toLocaleDateString("it-IT")}\n`;
    text += `--------------------------------------------------\n`;
    
    budget.forEach(item => {
      const price = item.is_custom ? item.price : getProductPrice(item.product_id);
      const total = item.calculated_items * price;
      const qtyLabel = item.unit === "mq" 
        ? `${item.quantity} mq (${item.calculated_items} ${item.item_unit_name})`
        : `${item.quantity} ${item.unit}`;
      
      text += `- ${item.name}\n  Quantità: ${qtyLabel}\n  Prezzo Unitario: ${price.toFixed(2)} € | Totale: ${total.toFixed(2)} €\n\n`;
    });

    text += `--------------------------------------------------\n`;
    text += `Totale Imponibile: ${subtotalVal.textContent}\n`;
    if (showVat) {
      text += `IVA (22%): ${vatVal.textContent}\n`;
      text += `Totale Finanziario (IVA Incl.): ${totalVal.textContent}\n`;
    } else {
      text += `Totale Finanziario (Escl. IVA): ${totalVal.textContent}\n`;
    }
    text += `--------------------------------------------------\n`;
    text += `Generato tramite https://eraldxhakoj.github.io/equogen/`;

    navigator.clipboard.writeText(text).then(() => {
      const originalText = btnCopyClipboard.innerHTML;
      btnCopyClipboard.innerHTML = `<i class="fa-solid fa-clipboard-check"></i> Copiato!`;
      btnCopyClipboard.style.borderColor = "var(--accent-green)";
      setTimeout(() => {
        btnCopyClipboard.innerHTML = originalText;
        btnCopyClipboard.style.borderColor = "";
      }, 2000);
    }).catch(err => {
      console.error("Errore di copia: ", err);
      alert("Impossibile copiare il testo. Copia manualmente dallo schermo.");
    });
  });

  // Esporta in PDF (Utilizza stampa nativa con layout ottimizzato)
  btnExportPdf.addEventListener("click", () => {
    window.print();
  });

  // Avvia l'app
  init();
});
