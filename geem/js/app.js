/**
 * GEEM - Application Controller
 * UI logic, rendering, event listeners, and interactive mobile-first UX
 */

import { store, calcQuoteTotals } from './state.js';

// SVG Icons Helpers per render rapido senza emoji
const ICONS = {
  edit: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  delete: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  map: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
  site: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l8-4v18M13 11l6 3v7M9 9h1M9 13h1M9 17h1"/></svg>`,
  user: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  company: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  doc: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  note: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  clip: `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; flex-shrink:0;"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,
  download: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  wallet: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 3H4a2 2 0 0 0-2 2v2"/><circle cx="16" cy="14" r="1"/></svg>`,
  trend: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  check: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  alert: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" style="fill:currentColor; stroke:none; flex-shrink:0;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`,
  navigation: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`,
  print: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  rocket: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`
};

export const QUOTE_PRESETS = {
  bagno: {
    title: 'Ristrutturazione Completa Bagno Chiavi in Mano',
    vatRate: 10,
    paymentTerms: '30% acconto firma contratto, 40% a metà opere (impianti e massetto), 30% a collaudo e consegna chiavi',
    estimatedDays: '15 giorni lavorativi',
    notes: 'Prezzi comprensivi di mano d\'opera specializzata, attrezzature, trasporto e smaltimento a rifiuto autorizzato con formulario FIR. Sanitari, rubinetterie e piastrelle forniti dal committente salvo accordi.',
    sections: [
      {
        id: 'sec_b1',
        title: '1. Demolizioni, Rimozioni & Smaltimento',
        items: [
          { id: 'it_b1', desc: 'Demolizione pavimento e sottofondo compreso calo calcinacci e carico su automezzo', um: 'mq', qty: 6, price: 35.00, total: 210.00 },
          { id: 'it_b2', desc: 'Demolizione rivestimento pareti e spicconatura intonaco ammalorato', um: 'mq', qty: 22, price: 26.00, total: 572.00 },
          { id: 'it_b3', desc: 'Smontaggio vecchi sanitari (wc, bidet, lavabo, piatto/vasca) e tubazioni fino alle colonne principali', um: 'a corpo', qty: 1, price: 220.00, total: 220.00 },
          { id: 'it_b4', desc: 'Oneri di conferimento e smaltimento macerie a discarica autorizzata', um: 'a corpo', qty: 1, price: 250.00, total: 250.00 }
        ]
      },
      {
        id: 'sec_b2',
        title: '2. Nuovi Impianti Idrico-Sanitari & Scarichi',
        items: [
          { id: 'it_b5', desc: 'Realizzazione nuovo impianto idrico in multistrato coibentato (4 punti acqua: lavabo, bidet, wc, doccia)', um: 'punto', qty: 4, price: 240.00, total: 960.00 },
          { id: 'it_b6', desc: 'Fornitura e posa cassetta di scarico incasso Geberit Kombifix con placca Sigma cromata', um: 'cad', qty: 1, price: 290.00, total: 290.00 },
          { id: 'it_b7', desc: 'Adeguamento impianto elettrico bagno (punti presa, specchio, interruttori e collegamento equipotenziale)', um: 'a corpo', qty: 1, price: 420.00, total: 420.00 }
        ]
      },
      {
        id: 'sec_b3',
        title: '3. Sottofondi, Impermeabilizzazione & Massetto',
        items: [
          { id: 'it_b8', desc: 'Chiusura tracce impiantistiche con malta cementizia e rasatura pareti a gesso/cemento', um: 'mq', qty: 26, price: 24.00, total: 624.00 },
          { id: 'it_b9', desc: 'Formazione nuovo massetto alleggerito per quota e pendenze scarico', um: 'mq', qty: 6, price: 38.00, total: 228.00 },
          { id: 'it_b10', desc: 'Impermeabilizzazione zona doccia con bicomponente elastico Mapelastic e bandelle sigillanti agli angoli', um: 'mq', qty: 8, price: 34.00, total: 272.00 }
        ]
      },
      {
        id: 'sec_b4',
        title: '4. Posa Pavimenti, Rivestimenti & Sanitari',
        items: [
          { id: 'it_b11', desc: 'Posa in opera piastrelle/gres a pavimento compresa colla C2TE e stuccatura fughe', um: 'mq', qty: 6, price: 36.00, total: 216.00 },
          { id: 'it_b12', desc: 'Posa in opera rivestimento pareti fino ad h 2.20m compresa stuccatura', um: 'mq', qty: 22, price: 38.00, total: 836.00 },
          { id: 'it_b13', desc: 'Montaggio rubinetterie, sanitari filo parete, piatto doccia e box doccia con sigillatura siliconica antimuffa', um: 'a corpo', qty: 1, price: 450.00, total: 450.00 },
          { id: 'it_b14', desc: 'Tinteggiatura soffitto con idropittura traspirante antimuffa (2 mani)', um: 'mq', qty: 6, price: 18.00, total: 108.00 }
        ]
      }
    ]
  },
  appartamento: {
    title: 'Ristrutturazione Globale Appartamento Residenziale',
    vatRate: 10,
    paymentTerms: '25% acconto inizio lavori, 25% a fine demolizioni e tracce, 25% a posa pavimenti, 25% a saldo fine lavori',
    estimatedDays: '60 giorni lavorativi',
    notes: 'Opere eseguite a perfetta regola d\'arte con rilascio dichiarazione di conformità impianti ex DM 37/08. Pulizia di cantiere giornaliera inclusa.',
    sections: [
      {
        id: 'sec_a1',
        title: '1. Demolizioni, Rimozioni & Nuove Tramezzature',
        items: [
          { id: 'it_a1', desc: 'Demolizione tramezze interne spessore 8-10 cm compreso carico e trasporto a rifiuto autorizzato', um: 'mq', qty: 45, price: 28.00, total: 1260.00 },
          { id: 'it_a2', desc: 'Demolizione pavimentazioni e battiscopa esistenti compreso calo calcinacci', um: 'mq', qty: 85, price: 22.00, total: 1870.00 },
          { id: 'it_a3', desc: 'Costruzione nuove tramezzature in cartongesso doppia lastra con isolante acustico in lana di roccia', um: 'mq', qty: 38, price: 54.00, total: 2052.00 }
        ]
      },
      {
        id: 'sec_a2',
        title: '2. Nuovi Impianti Tecnologici (Elettrico & Idraulico)',
        items: [
          { id: 'it_a4', desc: 'Nuovo impianto elettrico sfilabile a norma CEI 64-8 livello 1 (quadro generale, linee forza motrice, 60 punti luce/presa)', um: 'a corpo', qty: 1, price: 4200.00, total: 4200.00 },
          { id: 'it_a5', desc: 'Nuovo impianto idrico sanitario cucina e bagno in multistrato coibentato compresi scarichi Geberit', um: 'a corpo', qty: 1, price: 2600.00, total: 2600.00 },
          { id: 'it_a6', desc: 'Predisposizione impianto climatizzazione dual split con linee frigorifere e scarico condensa', um: 'a corpo', qty: 1, price: 850.00, total: 850.00 }
        ]
      },
      {
        id: 'sec_a3',
        title: '3. Massetti, Pavimentazioni & Porte Interne',
        items: [
          { id: 'it_a7', desc: 'Formazione massetto sabbia e cemento tirato a staggia per incollaggio pavimenti', um: 'mq', qty: 85, price: 32.00, total: 2720.00 },
          { id: 'it_a8', desc: 'Posa in opera gres porcellanato / parquet prefinito incollato compresa colla professionale e tagli', um: 'mq', qty: 85, price: 35.00, total: 2975.00 },
          { id: 'it_a9', desc: 'Posa in opera battiscopa coordinato in legno o ceramica compresa siliconatura', um: 'ml', qty: 70, price: 9.00, total: 630.00 },
          { id: 'it_a10', desc: 'Posa in opera porte interne a battente / scrigno compresi controtelai e maniglieria', um: 'cad', qty: 5, price: 130.00, total: 650.00 }
        ]
      },
      {
        id: 'sec_a4',
        title: '4. Rasatura, Tinteggiature & Rifiniture',
        items: [
          { id: 'it_a11', desc: 'Rasatura completa pareti e soffitti a base gesso con rete di rinforzo sulle giunzioni', um: 'mq', qty: 260, price: 16.00, total: 4160.00 },
          { id: 'it_a12', desc: 'Carteggiatura meccanica, applicazione fissativo acrilico e tinteggiatura lavabile supercoprente a due mani', um: 'mq', qty: 260, price: 14.00, total: 3640.00 }
        ]
      }
    ]
  },
  tinteggiatura: {
    title: 'Opere di Rasatura Armata & Tinteggiatura Completa Interni',
    vatRate: 10,
    paymentTerms: '40% acconto avvio lavori, 60% a saldo a lavoro ultimato e verificato',
    estimatedDays: '8 giorni lavorativi',
    notes: 'Inclusa accurata mascheratura e protezione con teli in nylon e cartone di pavimenti, porte, finestre e battiscopa. Pulizia finale compresa.',
    sections: [
      {
        id: 'sec_t1',
        title: '1. Protezioni & Preparazione Superfici',
        items: [
          { id: 'it_t1', desc: 'Fornitura e posa protezioni antipolvere per arredi, pavimenti e serramenti con feltro assorbente', um: 'a corpo', qty: 1, price: 280.00, total: 280.00 },
          { id: 'it_t2', desc: 'Spazzolatura e raschiatura vecchie pitture non aderenti, stuccatura buchi e fessurazioni con stucco rapido', um: 'mq', qty: 180, price: 6.50, total: 1170.00 }
        ]
      },
      {
        id: 'sec_t2',
        title: '2. Rasatura e Fondo Uniformante',
        items: [
          { id: 'it_t3', desc: 'Rasatura armata con interposta rete in fibra di vetro antifessurazione e rasante minerale', um: 'mq', qty: 60, price: 22.00, total: 1320.00 },
          { id: 'it_t4', desc: 'Carteggiatura meccanica con aspirazione e applicazione primer isolante consolidante', um: 'mq', qty: 180, price: 5.50, total: 990.00 }
        ]
      },
      {
        id: 'sec_t3',
        title: '3. Tinteggiatura e Trattamenti Specifici',
        items: [
          { id: 'it_t5', desc: 'Tinteggiatura pareti con idropittura traspirante superlavabile alta copertura (2 mani)', um: 'mq', qty: 180, price: 12.00, total: 2160.00 },
          { id: 'it_t6', desc: 'Trattamento igienizzante antimuffa e pittura anticondensa per locali umidi (bagno e cucina)', um: 'mq', qty: 45, price: 16.00, total: 720.00 }
        ]
      }
    ]
  },
  pavimenti: {
    title: 'Fornitura Massetto e Posa Pavimentazioni Nuove',
    vatRate: 10,
    paymentTerms: '35% avvio opere, 35% a massetto completato, 30% a posa e stuccatura ultimata',
    estimatedDays: '12 giorni lavorativi',
    notes: 'Esclusa la fornitura delle piastrelle (a scelta committente). Inclusi collanti professionali e materiali di sigillatura.',
    sections: [
      {
        id: 'sec_p1',
        title: '1. Preparazione Piano di Posa & Isolamento',
        items: [
          { id: 'it_p1', desc: 'Pulizia e aspirazione piano di posa solaio da polveri e residui', um: 'mq', qty: 70, price: 4.50, total: 315.00 },
          { id: 'it_p2', desc: 'Posa barriera al vapore in polietilene e materassino anticalpestio acustico spessore 6mm', um: 'mq', qty: 70, price: 9.50, total: 665.00 }
        ]
      },
      {
        id: 'sec_p2',
        title: '2. Massetto di Sottofondo Calpestabile',
        items: [
          { id: 'it_p3', desc: 'Formazione massetto tradizionale sabbia-cemento spessore medio 6 cm rinforzato con fibre polimeriche', um: 'mq', qty: 70, price: 34.00, total: 2380.00 }
        ]
      },
      {
        id: 'sec_p3',
        title: '3. Posa Pavimento & Battiscopa',
        items: [
          { id: 'it_p4', desc: 'Posa in opera pavimenti in gres porcellanato di grande formato con distanziatori autolivellanti', um: 'mq', qty: 70, price: 38.00, total: 2660.00 },
          { id: 'it_p5', desc: 'Stuccatura fughe con sigillante cementizio e pulizia con detergente neutro', um: 'mq', qty: 70, price: 7.00, total: 490.00 },
          { id: 'it_p6', desc: 'Posa battiscopa coordinato compresi tagli a 45 gradi e sigillatura elastica', um: 'ml', qty: 55, price: 9.00, total: 495.00 }
        ]
      }
    ]
  },
  tetto: {
    title: 'Rifacimento Manto di Copertura, Impermeabilizzazione & Lattoneria',
    vatRate: 10,
    paymentTerms: '30% inizio cantiere e ponteggi, 40% a guaina ultimata, 30% a saldo smontaggio opere provvisionali',
    estimatedDays: '20 giorni lavorativi',
    notes: 'Oneri di sicurezza e redazione POS compresi. Garanzia decennale sulle membrane impermeabilizzanti.',
    sections: [
      {
        id: 'sec_k1',
        title: '1. Allestimento Cantiere & Rimozione Manto',
        items: [
          { id: 'it_k1', desc: 'Allestimento ponteggio metallico fisso o parapetti anticaduta certificati con linea vita temporanea', um: 'a corpo', qty: 1, price: 1800.00, total: 1800.00 },
          { id: 'it_k2', desc: 'Smontaggio tegole/coppi esistenti con calo a terra e accatastamento per eventuale recupero', um: 'mq', qty: 120, price: 16.00, total: 1920.00 },
          { id: 'it_k3', desc: 'Rimozione vecchia guaina ammalorata e smaltimento a discarica autorizzata', um: 'mq', qty: 120, price: 11.00, total: 1320.00 }
        ]
      },
      {
        id: 'sec_k2',
        title: '2. Impermeabilizzazione Bituminosa ad Alta Resistenza',
        items: [
          { id: 'it_k4', desc: 'Applicazione primer bituminoso di ancoraggio a rapida essiccazione', um: 'mq', qty: 120, price: 4.50, total: 540.00 },
          { id: 'it_k5', desc: 'Fornitura e posa prima membrana bitume-polimero elastoplastica 4 mm armata TNT poliestere', um: 'mq', qty: 120, price: 18.00, total: 2160.00 },
          { id: 'it_k6', desc: 'Fornitura e posa seconda membrana con finitura ardesiata minerale autoprotetta contro raggi UV (4.5 kg/mq)', um: 'mq', qty: 120, price: 21.00, total: 2520.00 }
        ]
      },
      {
        id: 'sec_k3',
        title: '3. Riposizionamento Coppi, Colmi & Lattonerie',
        items: [
          { id: 'it_k7', desc: 'Riposizionamento manto in coppi con listellatura di ventilazione e ganci fermacoppo antisfilamento', um: 'mq', qty: 120, price: 26.00, total: 3120.00 },
          { id: 'it_k8', desc: 'Fissaggio colmi di ventilazione a secco e scossaline perimetrali in alluminio preverniciato spessore 8/10', um: 'ml', qty: 35, price: 32.00, total: 1120.00 }
        ]
      }
    ]
  }
};

export const PLACE_GRADIENTS = {
  cantiere: 'linear-gradient(135deg, #f59e0b, #d97706)',
  discarica: 'linear-gradient(135deg, #10b981, #047857)',
  deposito: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  fornitore: 'linear-gradient(135deg, #f97316, #c2410c)',
  studio: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  ufficio: 'linear-gradient(135deg, #14b8a6, #0f766e)',
  altro: 'linear-gradient(135deg, #64748b, #334155)'
};

export const PLACE_ICONS = {
  cantiere: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l8-4v18M13 11l6 3v7M9 9h1M9 13h1M9 17h1"/></svg>`,
  discarica: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  deposito: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  fornitore: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  studio: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  ufficio: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="22.01"/><line x1="15" y1="22" x2="15" y2="22.01"/><line x1="9" y1="6" x2="9.01" y2="6"/><line x1="15" y1="6" x2="15.01" y2="6"/><line x1="9" y1="10" x2="9.01" y2="10"/><line x1="15" y1="10" x2="15.01" y2="10"/><line x1="9" y1="14" x2="9.01" y2="14"/><line x1="15" y1="14" x2="15.01" y2="14"/><line x1="9" y1="18" x2="9.01" y2="18"/><line x1="15" y1="18" x2="15.01" y2="18"/></svg>`,
  altro: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`
};

// Utilità di formattazione
const fmtMoney = (val) => {
  if (typeof window !== 'undefined' && window.app && window.app.hideEconomicData) {
    return '****';
  }
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val || 0);
};
const fmtDocMoney = (val) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val || 0);

const escapeHTML = (str) => {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const fmtDate = (dStr) => {
  if (!dStr) return '';
  const [y, m, d] = dStr.split('-');
  return `${d}/${m}/${y}`;
};

const getWhatsAppUrl = (phone) => {
  if (!phone) return '';
  let clean = phone.replace(/[^\d+]/g, '');
  if (clean.startsWith('+')) clean = clean.substring(1);
  if (clean.length === 10 && clean.startsWith('3')) {
    clean = '39' + clean;
  }
  return `https://wa.me/${clean}`;
};

class GeemApp {
  constructor() {
    this.currentTab = 'home';
    this.currentAdminSubTab = 'workers';
    this.editingTimesheetId = null;
    this.editingExpenseId = null;
    this.editingWorkerId = null;
    this.editingClientId = null;
    this.editingSiteId = null;
    this.activeDetailSiteId = null;
    this.editingPersonId = null;
    this.currentPersonAvatar = null;
    this.activeDetailPersonId = null;
    this.peopleFilter = 'all';
    this.peopleSort = 'name_asc';
    this.peopleSearchQuery = '';
    this.peopleContactInfo = 'all';
    this.peopleStatus = 'all';
    this.peopleCompany = 'all';

    // Ripristino filtri e ordinamento contatti da localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        const savedPeopleFilters = localStorage.getItem('geem_people_filters');
        if (savedPeopleFilters) {
          const parsed = JSON.parse(savedPeopleFilters);
          if (parsed && typeof parsed === 'object') {
            this.peopleFilter = parsed.peopleFilter || 'all';
            this.peopleSort = parsed.peopleSort || 'name_asc';
            this.peopleSearchQuery = parsed.peopleSearchQuery || '';
            this.peopleContactInfo = parsed.peopleContactInfo || 'all';
            this.peopleStatus = parsed.peopleStatus || 'all';
            this.peopleCompany = parsed.peopleCompany || 'all';
          }
        }
      }
    } catch (e) {
      console.warn('Errore lettura filtri contatti da localStorage:', e);
    }

    // Calendario per il registro ore
    this.selectedCalendarDate = new Date().toISOString().split('T')[0];
    this.calendarMode = 'day'; // 'day' | 'week' | 'month'
    this.calendarWeekOffset = 0; // 0 = settimana corrente, -1 = precedente, +1 = successiva
    this.calendarMonthOffset = 0; // 0 = mese corrente, -1 = precedente, +1 = successivo

    this.filters = {
      timesheetSite: 'all',
      timesheetWorker: 'all',
      timesheetSort: 'date_desc',
      timesheetSearch: '',
      timesheetPeriod: 'selected_day',
      expenseSite: 'all',
      expenseCategory: 'all',
      expenseSort: 'date_desc',
      expenseSearch: '',
      expenseDoc: 'all',
      expensePeriod: 'all',
      siteStatus: 'all',
      siteSort: 'status_startdate',
      siteSearch: '',
      siteClient: 'all',
      siteFinancial: 'all',
      siteBudget: 'all'
    };

    // Ripristino filtri e ordinamento ore da localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        const savedHoursFilters = localStorage.getItem('geem_hours_filters');
        if (savedHoursFilters) {
          const parsed = JSON.parse(savedHoursFilters);
          if (parsed && typeof parsed === 'object') {
            this.filters.timesheetSite = parsed.timesheetSite || 'all';
            this.filters.timesheetWorker = parsed.timesheetWorker || 'all';
            this.filters.timesheetSort = parsed.timesheetSort || 'date_desc';
            this.filters.timesheetSearch = parsed.timesheetSearch || '';
            this.filters.timesheetPeriod = parsed.timesheetPeriod || 'selected_day';
          }
        }
      }
    } catch (e) {
      console.warn('Errore lettura filtri ore da localStorage:', e);
    }

    // Ripristino filtri e ordinamento spese da localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        const savedExpensesFilters = localStorage.getItem('geem_expenses_filters');
        if (savedExpensesFilters) {
          const parsed = JSON.parse(savedExpensesFilters);
          if (parsed && typeof parsed === 'object') {
            this.filters.expenseSite = parsed.expenseSite || 'all';
            this.filters.expenseCategory = parsed.expenseCategory || 'all';
            this.filters.expenseSort = parsed.expenseSort || 'date_desc';
            this.filters.expenseSearch = parsed.expenseSearch || '';
            this.filters.expenseDoc = parsed.expenseDoc || 'all';
            this.filters.expensePeriod = parsed.expensePeriod || 'all';
          }
        }
      }
    } catch (e) {
      console.warn('Errore lettura filtri spese da localStorage:', e);
    }

    // Ripristino filtri e ordinamento cantieri da localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        const savedSitesFilters = localStorage.getItem('geem_sites_filters');
        if (savedSitesFilters) {
          const parsed = JSON.parse(savedSitesFilters);
          if (parsed && typeof parsed === 'object') {
            this.filters.siteStatus = parsed.siteStatus || 'all';
            this.filters.siteSort = parsed.siteSort || 'status_startdate';
            this.filters.siteSearch = parsed.siteSearch || '';
            this.filters.siteClient = parsed.siteClient || 'all';
            this.filters.siteFinancial = parsed.siteFinancial || 'all';
            this.filters.siteBudget = parsed.siteBudget || 'all';
          }
        }
      }
    } catch (e) {
      console.warn('Errore lettura filtri cantieri da localStorage:', e);
    }

    // Filtri e ordinamento scheda Luoghi
    this.placeFilter = 'all'; // 'all', 'cantiere', 'discarica', 'deposito', 'fornitore', 'studio', 'ufficio', 'altro'
    this.placeSort = 'name_asc'; // 'name_asc', 'name_desc', 'type_asc', 'address_asc'
    this.placeSource = 'all'; // 'all', 'cantieri', 'custom'
    this.placeStatus = 'all'; // 'all', 'active', 'inactive'
    this.placeContact = 'all'; // 'all', 'has_phone', 'no_phone'
    this.placeSearchQuery = '';
    this.editingPlaceId = null;

    try {
      if (typeof localStorage !== 'undefined') {
        const savedPlacesFilters = localStorage.getItem('geem_places_filters');
        if (savedPlacesFilters) {
          const parsed = JSON.parse(savedPlacesFilters);
          if (parsed && typeof parsed === 'object') {
            this.placeFilter = parsed.placeFilter || 'all';
            this.placeSort = parsed.placeSort || 'name_asc';
            this.placeSource = parsed.placeSource || 'all';
            this.placeStatus = parsed.placeStatus || 'all';
            this.placeContact = parsed.placeContact || 'all';
            this.placeSearchQuery = parsed.placeSearchQuery || '';
          }
        }
      }
    } catch (e) {
      console.warn('Errore lettura filtri luoghi da localStorage:', e);
    }

    // Filtro Periodo Finanziario Dashboard ('year' | 'month' | 'last_month' | 'active' | 'all')
    try {
      this.dashboardPeriod = (typeof localStorage !== 'undefined' && localStorage.getItem('geem_dashboard_period')) || 'year';
    } catch (e) {
      this.dashboardPeriod = 'year';
    }

    // Modalità Privacy Dati Economici (censura asterischi ****)
    try {
      this.hideEconomicData = (typeof localStorage !== 'undefined' && localStorage.getItem('geem_hide_economic') === 'true');
    } catch (e) {
      this.hideEconomicData = false;
    }

    // Modulo Preventivi & Computi Edili Apple-Style
    this.quoteSubView = 'list'; // 'list' | 'editor'
    this.quoteFilterStatus = 'all'; // 'all' | 'draft' | 'sent' | 'accepted' | 'rejected'
    this.quoteSearchQuery = '';
    this.editingQuoteId = null;
    this.currentQuoteEditorData = null;
  }

  init() {
    this.bindEvents();
    this.subscribeState();
    this.updateEconomicPrivacyUI();
    this.renderAll();
    this.initDates();
    this.initRouting();

    // Sincronizza stato pulsante periodo selezionato
    document.querySelectorAll('.period-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.period === this.dashboardPeriod);
    });

    if (store.mode === 'github') {
      this.showToast('Connesso al database GitHub', 'success');
      // Sincronizza i dati freschi da GitHub in background
      store.refreshDataFromGitHub().catch(err => {
        console.warn('Errore sync automatico GitHub:', err);
      });
    } else {
      this.showToast('Modalità Demo Locale attiva', 'info');
    }
  }

  initRouting() {
    const validTabs = ['home', 'hours', 'expenses', 'sites', 'people', 'places', 'quotes', 'admin'];
    const getHashTab = () => {
      if (typeof window === 'undefined' || !window.location || !window.location.hash) return '';
      return window.location.hash.replace(/^#/, '').trim();
    };

    const applyRoute = () => {
      const hash = getHashTab();
      if (validTabs.includes(hash)) {
        this.switchTab(hash, false);
      } else {
        let fallback = 'home';
        try {
          const saved = typeof localStorage !== 'undefined' && localStorage.getItem('geem_active_tab');
          if (validTabs.includes(saved)) fallback = saved;
        } catch (e) {}
        this.switchTab(fallback, true);
      }
    };

    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('hashchange', () => {
        const hash = getHashTab();
        if (validTabs.includes(hash) && hash !== this.currentTab) {
          this.switchTab(hash, false);
        }
      });
    }

    applyRoute();

    try {
      const savedSubTab = typeof localStorage !== 'undefined' && localStorage.getItem('geem_active_admin_subtab');
      if (savedSubTab) this.switchAdminSubTab(savedSubTab);
    } catch (e) {}
  }

  initDates() {
    const today = new Date().toISOString().split('T')[0];
    const tsDate = document.getElementById('ts-date');
    const expDate = document.getElementById('exp-date');
    if (tsDate) tsDate.value = today;
    if (expDate) expDate.value = today;
  }

  subscribeState() {
    store.subscribe((state, changedType) => {
      this.renderSyncStatus();
      if (changedType === 'sync') return;
      this.renderAll();
    });
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${message}</span>
      <button style="background:transparent;border:none;color:inherit;font-size:1.1rem;cursor:pointer;margin-left:8px;" onclick="this.parentElement.remove()">&times;</button>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 3200);
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // --- GESTIONE SIDEBAR DRAWER (DESTRA) ---
  openSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    if (sidebar && sidebar.classList.contains('open')) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  switchTab(tabId, updateHash = true) {
    const validTabs = ['home', 'hours', 'expenses', 'sites', 'people', 'places', 'quotes', 'admin'];
    if (!validTabs.includes(tabId)) {
      tabId = 'home';
    }

    this.currentTab = tabId;

    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('geem_active_tab', tabId);
      }
    } catch (e) {}

    if (updateHash && typeof window !== 'undefined' && window.location) {
      if (window.location.hash !== `#${tabId}`) {
        window.location.hash = `#${tabId}`;
      }
    }

    document.querySelectorAll('.bottom-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.sidebar-link[data-sidebar-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.sidebarTab === tabId);
    });

    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.toggle('active', sec.id === `view-${tabId}`);
    });

    if (tabId === 'quotes') {
      this.renderQuotes();
    }

    if (typeof window !== 'undefined' && window.scrollTo) {
      window.scrollTo(0, 0);
    }
  }

  toggleFilterPanel(viewName) {
    const panel = document.getElementById(`filter-panel-${viewName}`);
    const toggle = document.getElementById(`toggle-filter-${viewName}`);
    if (!panel) return;

    const isCurrentlyHidden = panel.classList.contains('hidden');
    if (isCurrentlyHidden) {
      panel.classList.remove('hidden');
      if (toggle) toggle.classList.add('active');
    } else {
      panel.classList.add('hidden');
      if (toggle) toggle.classList.remove('active');
    }
  }

  filterSiteStatus(status) {
    this.setSiteStatusFilter(status);
  }

  saveSitesFilters() {
    try {
      if (typeof localStorage !== 'undefined') {
        const payload = {
          siteStatus: this.filters.siteStatus,
          siteSort: this.filters.siteSort,
          siteSearch: this.filters.siteSearch,
          siteClient: this.filters.siteClient,
          siteFinancial: this.filters.siteFinancial,
          siteBudget: this.filters.siteBudget
        };
        localStorage.setItem('geem_sites_filters', JSON.stringify(payload));
      }
    } catch (e) {
      console.warn('Errore salvataggio filtri cantieri in localStorage:', e);
    }
  }

  setSiteStatusFilter(status) {
    this.filters.siteStatus = status || 'all';
    this.saveSitesFilters();
    this.renderSites();
  }

  setSiteSort(sortValue) {
    this.filters.siteSort = sortValue || 'status_startdate';
    this.saveSitesFilters();
    this.renderSites();
  }

  setSiteClientFilter(clientId) {
    this.filters.siteClient = clientId || 'all';
    this.saveSitesFilters();
    this.renderSites();
  }

  setSiteFinancialFilter(financialValue) {
    this.filters.siteFinancial = financialValue || 'all';
    this.saveSitesFilters();
    this.renderSites();
  }

  setSiteBudgetFilter(budgetValue) {
    this.filters.siteBudget = budgetValue || 'all';
    this.saveSitesFilters();
    this.renderSites();
  }

  handleSiteSearch(query) {
    this.filters.siteSearch = (query || '').trim();
    const clearBtn = document.getElementById('site-search-clear');
    if (clearBtn) {
      clearBtn.style.display = this.filters.siteSearch ? 'block' : 'none';
    }
    this.saveSitesFilters();
    this.renderSites();
  }

  clearSiteSearch() {
    this.filters.siteSearch = '';
    const input = document.getElementById('site-search-input');
    const clearBtn = document.getElementById('site-search-clear');
    if (input) input.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    this.saveSitesFilters();
    this.renderSites();
  }

  resetSiteFilters() {
    this.filters.siteStatus = 'all';
    this.filters.siteSort = 'status_startdate';
    this.filters.siteSearch = '';
    this.filters.siteClient = 'all';
    this.filters.siteFinancial = 'all';
    this.filters.siteBudget = 'all';

    const searchInput = document.getElementById('site-search-input');
    const clearBtn = document.getElementById('site-search-clear');
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';

    this.saveSitesFilters();
    this.renderSites();
    this.showToast('Filtri cantieri ripristinati', 'info');
  }

  syncSiteFiltersUI() {
    // Sincronizza chip stato
    document.querySelectorAll('[data-site-status]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.siteStatus === this.filters.siteStatus);
    });

    // Sincronizza select ordinamento
    const sortSelect = document.getElementById('filter-site-sort');
    if (sortSelect && sortSelect.value !== this.filters.siteSort) {
      sortSelect.value = this.filters.siteSort;
    }

    // Sincronizza select cliente
    const clientSelect = document.getElementById('filter-site-client');
    if (clientSelect && clientSelect.value !== this.filters.siteClient) {
      clientSelect.value = this.filters.siteClient;
    }

    // Sincronizza select stato pagamenti
    const finSelect = document.getElementById('filter-site-financial');
    if (finSelect && finSelect.value !== this.filters.siteFinancial) {
      finSelect.value = this.filters.siteFinancial;
    }

    // Sincronizza select budget
    const budgetSelect = document.getElementById('filter-site-budget');
    if (budgetSelect && budgetSelect.value !== this.filters.siteBudget) {
      budgetSelect.value = this.filters.siteBudget;
    }

    // Sincronizza input ricerca
    const searchInput = document.getElementById('site-search-input');
    const clearBtn = document.getElementById('site-search-clear');
    if (searchInput && searchInput.value !== this.filters.siteSearch) {
      searchInput.value = this.filters.siteSearch;
    }
    if (clearBtn) {
      clearBtn.style.display = this.filters.siteSearch ? 'block' : 'none';
    }
  }

  switchAdminSubTab(subTabId) {
    this.currentAdminSubTab = subTabId;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('geem_active_admin_subtab', subTabId);
      }
    } catch (e) {}
    document.querySelectorAll('.admin-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.subtab === subTabId);
    });
    document.querySelectorAll('.admin-subview').forEach(view => {
      view.style.display = view.id === `admin-${subTabId}` ? 'block' : 'none';
    });
  }

  // ==========================================================================
  // Renderers
  // ==========================================================================
  renderAll() {
    this.renderSyncStatus();
    this.renderKPIs();
    this.renderTimesheets();
    this.renderExpenses();
    this.renderSites();
    this.renderAdminWorkers();
    this.renderAdminClients();
    this.renderAdminSites();
    this.renderAdminTypes();
    this.renderCompanyProfile();
    this.populateSelectDropdowns();
    this.renderPeople();
    this.renderPlaces();
    this.renderQuotes();
  }

  renderSyncStatus() {
    const badge = document.getElementById('sync-badge');
    const text = document.getElementById('sync-text');
    if (!badge || !text) return;

    badge.className = `sync-badge ${store.syncStatus}`;

    if (store.mode === 'demo') {
      text.textContent = 'Demo Locale';
    } else if (store.syncStatus === 'saving') {
      text.textContent = 'Salvataggio...';
    } else if (store.syncStatus === 'error') {
      text.textContent = 'Errore Connessione';
    } else {
      const timeStr = store.lastSaved ? store.lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ora';
      text.textContent = `GitHub (${timeStr})`;
    }
  }

  setDashboardPeriod(period) {
    this.dashboardPeriod = period;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('geem_dashboard_period', period);
      }
    } catch (e) {}

    document.querySelectorAll('.period-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.period === period);
    });

    this.renderKPIs();
  }

  toggleEconomicPrivacy() {
    this.hideEconomicData = !this.hideEconomicData;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('geem_hide_economic', this.hideEconomicData ? 'true' : 'false');
      }
    } catch (e) {}

    this.updateEconomicPrivacyUI();
    this.renderAll();
    this.showToast(this.hideEconomicData ? 'Dati economici censurati' : 'Dati economici visibili', 'info');
  }

  updateEconomicPrivacyUI() {
    const btn = document.getElementById('header-privacy-btn');
    if (!btn) return;

    if (this.hideEconomicData) {
      btn.innerHTML = ICONS.eyeOff;
      btn.classList.add('active');
      btn.setAttribute('title', 'Dati economici censurati (clicca per mostrare)');
      btn.setAttribute('aria-label', 'Mostra importi economici');
    } else {
      btn.innerHTML = ICONS.eye;
      btn.classList.remove('active');
      btn.setAttribute('title', 'Dati economici visibili (clicca per censurare)');
      btn.setAttribute('aria-label', 'Censura importi economici');
    }
  }

  renderKPIs() {
    const stats = store.getStats();
    const period = this.dashboardPeriod || 'year';
    const fin = store.getFinancialSummary(period);
    
    // Financial Overview Cards (Cash Flow & Margini)
    const kpiBalanceDue = document.getElementById('kpi-balance-due');
    const kpiBalanceSub = document.getElementById('kpi-balance-sub');
    const kpiPaid = document.getElementById('kpi-paid');
    const kpiPaidTitle = document.getElementById('kpi-paid-title');
    const kpiPaidSub = document.getElementById('kpi-paid-sub');
    const kpiProfit = document.getElementById('kpi-profit');
    const kpiProfitTitle = document.getElementById('kpi-profit-title');
    const kpiProfitSub = document.getElementById('kpi-profit-sub');
    const kpiCosts = document.getElementById('kpi-costs');
    const kpiCostsTitle = document.getElementById('kpi-costs-title');
    const kpiCostsSub = document.getElementById('kpi-costs-sub');

    // 1. Da Incassare (Crediti Aperti)
    if (kpiBalanceDue) kpiBalanceDue.textContent = fmtMoney(fin.totalBalanceDue);
    if (kpiBalanceSub) {
      if (fin.completedWithBalanceCount > 0) {
        kpiBalanceSub.innerHTML = `<span style="color:var(--danger); font-weight:800;">🚨 ${fin.completedWithBalanceCount} chiusi non saldati!</span>`;
      } else {
        kpiBalanceSub.textContent = `${fin.pendingCount} cantieri con saldo`;
      }
    }

    // 2. Incassato
    if (kpiPaid) kpiPaid.textContent = fmtMoney(fin.totalPaid);
    if (kpiPaidTitle) {
      if (fin.periodKey === 'month') kpiPaidTitle.textContent = 'Incassato Mese';
      else if (fin.periodKey === 'last_month') kpiPaidTitle.textContent = 'Incassato Mese Prec.';
      else if (fin.periodKey === 'year') kpiPaidTitle.textContent = 'Incassato Anno';
      else if (fin.periodKey === 'active') kpiPaidTitle.textContent = 'Incassato Commesse';
      else kpiPaidTitle.textContent = 'Incassato Totale';
    }
    if (kpiPaidSub) {
      if (fin.periodType === 'date') {
        kpiPaidSub.textContent = `Entrate ${fin.periodLabel}`;
      } else {
        kpiPaidSub.textContent = `${fin.overallPaidPercent}% di ${fmtMoney(fin.totalQuotes)}`;
      }
    }

    // 3. Utile / Flusso Netto del Periodo
    if (kpiProfit) {
      kpiProfit.textContent = (fin.totalProfit >= 0 ? '+' : '') + fmtMoney(fin.totalProfit);
      kpiProfit.style.color = fin.totalProfit >= 0 ? 'var(--success)' : 'var(--danger)';
    }
    if (kpiProfitTitle) {
      if (fin.periodType === 'date') kpiProfitTitle.textContent = 'Flusso Netto';
      else kpiProfitTitle.textContent = 'Utile Stimato';
    }
    if (kpiProfitSub) {
      if (fin.periodType === 'date') {
        kpiProfitSub.textContent = fin.totalProfit >= 0 
          ? `Saldo positivo ${fin.periodLabel}` 
          : `Uscite > Entrate (${fin.periodLabel})`;
      } else {
        kpiProfitSub.textContent = fin.avgProfitMargin !== null ? `Margine: ${fin.avgProfitMargin}%` : 'N/D';
      }
    }

    // 4. Costi Lavori
    if (kpiCosts) kpiCosts.textContent = fmtMoney(fin.totalCosts);
    if (kpiCostsTitle) {
      if (fin.periodKey === 'month') kpiCostsTitle.textContent = 'Uscite Mese';
      else if (fin.periodKey === 'last_month') kpiCostsTitle.textContent = 'Uscite Mese Prec.';
      else if (fin.periodKey === 'year') kpiCostsTitle.textContent = 'Uscite Anno';
      else kpiCostsTitle.textContent = 'Costi Lavori';
    }
    if (kpiCostsSub) {
      kpiCostsSub.textContent = `Ore: ${fmtMoney(fin.totalLaborCost)} | Mat.: ${fmtMoney(fin.totalExpenses)}`;
    }

    // Today Strip
    const todayHours = document.getElementById('kpi-today-hours');
    const todayHoursCost = document.getElementById('kpi-today-hours-cost');
    const todayExpenses = document.getElementById('kpi-today-expenses');
    const todaySites = document.getElementById('kpi-today-sites');

    if (todayHours) todayHours.textContent = `${stats.todayHours}h`;
    if (todayHoursCost) todayHoursCost.textContent = fmtMoney(stats.todayHoursCost);
    if (todayExpenses) todayExpenses.textContent = fmtMoney(stats.todayExpensesTotal);
    if (todaySites) todaySites.textContent = `${stats.activeSites}`;

    // Render Scadenzario Incassi & Budget Alerts
    this.renderHomePendingPayments(fin);
    this.renderHomeBudgetAlerts(fin);
  }

  scrollToPendingPayments() {
    const el = document.getElementById('section-pending-payments');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  quickAddPaymentToSite(siteId) {
    this.openSiteModal(siteId);
    this.addPaymentRow('', 'Acconto / Saldo', new Date().toISOString().split('T')[0]);
    this.showToast('Nuovo pagamento aggiunto. Inserisci l\'importo e premi Salva.', 'info');
    setTimeout(() => {
      const box = document.getElementById('site-payments-list');
      if (box) {
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const inputs = box.querySelectorAll('input[type="number"]');
        if (inputs.length > 0) {
          inputs[inputs.length - 1].focus();
        }
      }
    }, 180);
  }

  renderHomePendingPayments(fin) {
    const list = document.getElementById('home-pending-payments-list');
    const badge = document.getElementById('home-pending-badge');
    const totalDueEl = document.getElementById('home-pending-total-due');

    if (badge) badge.textContent = `${fin.pendingCount}`;
    if (totalDueEl) totalDueEl.textContent = fmtMoney(fin.totalBalanceDue);

    if (!list) return;

    if (fin.sitesWithPendingBalance.length === 0) {
      list.innerHTML = `
        <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:20px; text-align:center;">
          <div style="font-size:1.8rem; margin-bottom:8px;">✅</div>
          <div style="font-weight:800; color:#fff; font-size:0.95rem;">Tutti i cantieri sono saldati!</div>
          <div style="font-size:0.78rem; color:var(--text-muted); margin-top:4px;">
            Nessun cantiere ha pagamenti o saldi in sospeso. Ottimo lavoro con gli incassi!
          </div>
        </div>
      `;
      return;
    }

    list.innerHTML = fin.sitesWithPendingBalance.map(({ site, cost, percentPaid, isCompleted }) => {
      const client = store.data.clients.find(c => c.id === site.clientId) || { name: 'Cliente N/D', phone: '' };
      
      const lastPayment = Array.isArray(site.payments) && site.payments.length > 0
        ? site.payments[site.payments.length - 1]
        : null;

      const alertClass = isCompleted ? 'card-alert-urgent' : '';

      return `
        <div class="pending-payment-card ${alertClass}">
          <div class="pending-payment-head">
            <div class="pending-payment-site">
              <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                <strong>${site.code} - ${site.name}</strong>
              </div>
              <div>
                ${isCompleted
                  ? `<span class="item-badge badge-red" style="font-size:0.68rem; font-weight:800;">🚨 LAVORI FINITI - SALDARE SUBITO</span>`
                  : `<span class="item-badge badge-amber" style="font-size:0.68rem;">Saldo Aperto</span>`
                }
              </div>
            </div>
            <div class="pending-payment-due">
              <small>Saldo Residuo</small>
              <strong>${fmtMoney(cost.balanceRemaining)}</strong>
            </div>
          </div>

          <div class="pending-payment-client-row">
            <span>Cliente: <strong style="color:#fff;">${client.name}</strong></span>
            ${client.phone ? `
              <div style="display:flex; align-items:center; gap:6px;">
                <a href="tel:${client.phone}" class="quick-call-link" title="Chiama cliente per sollecito">
                  ${ICONS.phone}
                  <span>Chiama</span>
                </a>
                <a href="${getWhatsAppUrl(client.phone)}" target="_blank" rel="noopener" class="quick-whatsapp-link" title="Scrivi su WhatsApp al cliente">
                  ${ICONS.whatsapp}
                  <span>WhatsApp</span>
                </a>
              </div>
            ` : ''}
          </div>

          <div class="pending-payment-progress-container">
            <div class="pending-payment-progress-bar">
              <div class="pending-payment-progress-fill" style="width:${percentPaid}%;"></div>
            </div>
            <div class="pending-payment-progress-labels">
              <span>Incassato: <strong style="color:var(--success);">${fmtMoney(cost.paymentsTotal)}</strong> (${percentPaid}%)</span>
              <span>Preventivo: ${fmtMoney(cost.quoteAmount)}</span>
            </div>
          </div>

          ${lastPayment ? `
            <div class="pending-payment-last-note">
              <span>Ultimo acconto: <strong>${fmtMoney(lastPayment.amount)}</strong> il ${fmtDate(lastPayment.date)}${lastPayment.note ? ` (${lastPayment.note})` : ''}</span>
            </div>
          ` : `
            <div class="pending-payment-last-note" style="border-left-color:var(--text-dim); color:var(--text-dim);">
              <span>Ancora nessun acconto ricevuto su questo cantiere.</span>
            </div>
          `}

          <div class="pending-payment-actions">
            <button type="button" class="btn btn-secondary btn-sm" onclick="app.openSiteDetailModal('${site.id}')">
              Dettagli
            </button>
            <button type="button" class="btn btn-primary btn-sm" onclick="app.quickAddPaymentToSite('${site.id}')">
              + Registra Incasso
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  renderHomeBudgetAlerts(fin) {
    const container = document.getElementById('home-budget-alerts-container');
    if (!container) return;

    if (!fin.sitesAtRisk || fin.sitesAtRisk.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = fin.sitesAtRisk.map(({ site, cost }) => {
      const isLoss = cost.profit < 0;
      return `
        <div class="home-alert-card ${isLoss ? 'danger' : ''}">
          <div class="home-alert-icon">
            ${ICONS.alert}
          </div>
          <div class="home-alert-body">
            <div class="home-alert-title">
              ${isLoss ? `🚨 Budget Superato: ${site.code} - ${site.name}` : `⚠️ Margine a Rischio (85%+ speso): ${site.code} - ${site.name}`}
            </div>
            <div class="home-alert-desc">
              Costi sostenuti: <strong>${fmtMoney(cost.totalCost)}</strong> su <strong>${fmtMoney(cost.quoteAmount)}</strong> di preventivo. 
              ${isLoss 
                ? `Perdita attuale: <strong style="color:var(--danger);">${fmtMoney(cost.profit)} (${cost.profitMargin}%)</strong>.` 
                : `Utile residuo: <strong>${fmtMoney(cost.profit)} (+${cost.profitMargin}%)</strong>.`
              }
            </div>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" onclick="app.openSiteDetailModal('${site.id}')" style="align-self:center; white-space:nowrap;">
            Verifica
          </button>
        </div>
      `;
    }).join('');
  }

  populateSelectDropdowns() {
    const workers = store.data.workers.filter(w => w.active);
    const sites = store.data.sites;
    const clients = store.data.clients;
    const roles = store.data.config.workerRoles;
    const expenseCats = store.data.config.expenseCategories;

    const tsWorker = document.getElementById('ts-worker');
    if (tsWorker) {
      const current = tsWorker.value;
      tsWorker.innerHTML = '<option value="">-- Seleziona Lavoratore --</option>' +
        workers.map(w => `<option value="${w.id}" data-rate="${w.hourlyRate}">${w.name} (${w.role})</option>`).join('');
      if (current) tsWorker.value = current;
    }

    const tsSite = document.getElementById('ts-site');
    if (tsSite) {
      const current = tsSite.value;
      tsSite.innerHTML = '<option value="">-- Seleziona Cantiere --</option>' +
        sites.map(s => `<option value="${s.id}">${s.code} - ${s.name}</option>`).join('');
      if (current) tsSite.value = current;
    }

    const expSite = document.getElementById('exp-site');
    if (expSite) {
      const current = expSite.value;
      expSite.innerHTML = '<option value="generale">Spesa Generale Aziendale</option>' +
        sites.map(s => `<option value="${s.id}">${s.code} - ${s.name}</option>`).join('');
      if (current) expSite.value = current;
    }

    const expCat = document.getElementById('exp-category');
    if (expCat) {
      const current = expCat.value;
      expCat.innerHTML = expenseCats.map(c => `<option value="${c}">${c}</option>`).join('');
      if (current) expCat.value = current;
    }

    const workerRoleSelect = document.getElementById('worker-role');
    if (workerRoleSelect) {
      const current = workerRoleSelect.value;
      workerRoleSelect.innerHTML = roles.map(r => `<option value="${r}">${r}</option>`).join('');
      if (current) workerRoleSelect.value = current;
    }

    const siteClientSelect = document.getElementById('site-client');
    if (siteClientSelect) {
      const current = siteClientSelect.value;
      siteClientSelect.innerHTML = '<option value="">-- Seleziona Cliente --</option>' +
        clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
      if (current) siteClientSelect.value = current;
    }

    const filterTsSite = document.getElementById('filter-ts-site');
    if (filterTsSite) {
      const current = this.filters.timesheetSite || 'all';
      filterTsSite.innerHTML = '<option value="all">Tutti i Cantieri</option>' +
        sites.map(s => `<option value="${s.id}">${s.code} - ${s.name}</option>`).join('');
      filterTsSite.value = current;
    }

    const filterTsWorker = document.getElementById('filter-ts-worker');
    if (filterTsWorker) {
      const current = this.filters.timesheetWorker || 'all';
      filterTsWorker.innerHTML = '<option value="all">Tutti i lavoratori</option>' +
        (store.data.workers || []).map(w => `<option value="${w.id}">${w.name} (${w.role || 'Operaio'})</option>`).join('');
      filterTsWorker.value = current;
    }

    const filterExpSite = document.getElementById('filter-exp-site');
    if (filterExpSite) {
      const current = this.filters.expenseSite || 'all';
      filterExpSite.innerHTML = '<option value="all">Tutti i Cantieri e Spese Generali</option><option value="generale">Solo Spese Generali Aziendali</option>' +
        sites.map(s => `<option value="${s.id}">${s.code} - ${s.name}</option>`).join('');
      filterExpSite.value = current;
    }

    const filterSiteClient = document.getElementById('filter-site-client');
    if (filterSiteClient) {
      const current = this.filters.siteClient || 'all';
      filterSiteClient.innerHTML = '<option value="all">Tutti i clienti</option>' +
        clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
      filterSiteClient.value = current;
    }
  }

  // --- NAVIGAZIONE CALENDARIO REGISTRO ORE ---
  setCalendarMode(mode) {
    this.calendarMode = mode;
    ['day', 'week', 'month'].forEach(m => {
      const btn = document.getElementById(`cal-mode-${m}`);
      if (btn) btn.classList.toggle('active', m === mode);
    });

    const daySection = document.getElementById('day-view-section');
    const weekSection = document.getElementById('week-view-section');
    const monthSection = document.getElementById('month-view-section');
    const strip = document.getElementById('calendar-week-strip');

    if (daySection) daySection.style.display = (mode === 'day') ? 'block' : 'none';
    if (weekSection) weekSection.style.display = (mode === 'week') ? 'block' : 'none';
    if (monthSection) monthSection.style.display = (mode === 'month') ? 'block' : 'none';
    if (strip) strip.style.display = (mode === 'day') ? 'grid' : 'none';

    this.renderTimesheets();
  }

  navigateCalendar(delta) {
    if (this.calendarMode === 'month') {
      this.calendarMonthOffset += delta;
    } else {
      this.calendarWeekOffset += delta;
      const weekDates = this.getWeekDates(this.calendarWeekOffset);
      if (!weekDates.some(w => w.isoString === this.selectedCalendarDate)) {
        this.selectedCalendarDate = weekDates[0].isoString;
      }
    }
    this.renderTimesheets();
  }

  changeCalendarWeek(delta) {
    this.navigateCalendar(delta);
  }

  goToCalendarToday() {
    this.calendarWeekOffset = 0;
    this.calendarMonthOffset = 0;
    this.selectedCalendarDate = new Date().toISOString().split('T')[0];
    this.filters.timesheetPeriod = 'selected_day';
    this.saveTimesheetFilters();
    this.renderTimesheets();
  }

  selectCalendarDate(isoStr, switchModeToDay = false) {
    this.selectedCalendarDate = isoStr;
    this.filters.timesheetPeriod = 'selected_day';
    this.saveTimesheetFilters();
    if (switchModeToDay) {
      this.setCalendarMode('day');
      return;
    }
    this.renderTimesheets();
  }

  getWeekDates(offsetWeeks = 0) {
    const now = new Date();
    // Inizio della settimana dal lunedì
    const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Lunedì, 6 = Domenica
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek + (offsetWeeks * 7));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      dates.push({
        date: d,
        isoString: iso,
        dayNum: d.getDate(),
        dayName: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'][i]
      });
    }
    return dates;
  }

  getMonthGridData(offsetMonths = 0) {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Primo giorno visibile: lunedì prima o coincidente col 1° del mese
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // 0 = Lun
    const startDate = new Date(year, month, 1 - firstDayOfWeek);

    const days = [];
    for (let i = 0; i < 42; i++) { // 6 righe x 7 colonne
      const current = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
      // Se abbiamo superato il mese e completato almeno una riga completa oltre la fine del mese, possiamo fermarci se siamo a 35
      if (i >= 35 && current.getMonth() !== month) break;

      const iso = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
      days.push({
        date: current,
        isoString: iso,
        dayNum: current.getDate(),
        isCurrentMonth: current.getMonth() === month
      });
    }

    return {
      year,
      month,
      days
    };
  }

  // ==========================================================================
  // GESTIONE SEZIONE ORE (TIMESHEETS)
  // ==========================================================================
  saveTimesheetFilters() {
    try {
      if (typeof localStorage !== 'undefined') {
        const payload = {
          timesheetSite: this.filters.timesheetSite,
          timesheetWorker: this.filters.timesheetWorker,
          timesheetSort: this.filters.timesheetSort,
          timesheetSearch: this.filters.timesheetSearch,
          timesheetPeriod: this.filters.timesheetPeriod
        };
        localStorage.setItem('geem_hours_filters', JSON.stringify(payload));
      }
    } catch (e) {
      console.warn('Errore salvataggio filtri ore in localStorage:', e);
    }
  }

  setTimesheetSiteFilter(siteId) {
    this.filters.timesheetSite = siteId || 'all';
    this.saveTimesheetFilters();
    this.renderTimesheets();
  }

  setTimesheetWorkerFilter(workerId) {
    this.filters.timesheetWorker = workerId || 'all';
    this.saveTimesheetFilters();
    this.renderTimesheets();
  }

  setTimesheetSort(sortVal) {
    this.filters.timesheetSort = sortVal || 'date_desc';
    this.saveTimesheetFilters();
    this.renderTimesheets();
  }

  setTimesheetPeriodFilter(periodVal) {
    this.filters.timesheetPeriod = periodVal || 'selected_day';
    this.saveTimesheetFilters();
    this.renderTimesheets();
  }

  handleTimesheetSearch(query) {
    this.filters.timesheetSearch = (query || '').trim();
    const clearBtn = document.getElementById('hours-search-clear');
    if (clearBtn) {
      clearBtn.style.display = this.filters.timesheetSearch ? 'block' : 'none';
    }
    this.saveTimesheetFilters();
    this.renderTimesheets();
  }

  clearTimesheetSearch() {
    this.filters.timesheetSearch = '';
    const input = document.getElementById('hours-search-input');
    const clearBtn = document.getElementById('hours-search-clear');
    if (input) input.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    this.saveTimesheetFilters();
    this.renderTimesheets();
  }

  resetTimesheetFilters() {
    this.filters.timesheetSite = 'all';
    this.filters.timesheetWorker = 'all';
    this.filters.timesheetSort = 'date_desc';
    this.filters.timesheetSearch = '';
    this.filters.timesheetPeriod = 'selected_day';

    const searchInput = document.getElementById('hours-search-input');
    const clearBtn = document.getElementById('hours-search-clear');
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';

    this.saveTimesheetFilters();
    this.renderTimesheets();
    this.showToast('Filtri ore ripristinati', 'info');
  }

  syncTimesheetFiltersUI() {
    // Sincronizza input di ricerca
    const searchInput = document.getElementById('hours-search-input');
    if (searchInput && searchInput.value !== this.filters.timesheetSearch) {
      searchInput.value = this.filters.timesheetSearch || '';
    }
    const clearBtn = document.getElementById('hours-search-clear');
    if (clearBtn) {
      clearBtn.style.display = this.filters.timesheetSearch ? 'block' : 'none';
    }

    // Sincronizza select cantiere
    const siteSelect = document.getElementById('filter-ts-site');
    if (siteSelect && siteSelect.value !== this.filters.timesheetSite) {
      siteSelect.value = this.filters.timesheetSite;
    }

    // Sincronizza select lavoratore
    const workerSelect = document.getElementById('filter-ts-worker');
    if (workerSelect && workerSelect.value !== this.filters.timesheetWorker) {
      workerSelect.value = this.filters.timesheetWorker;
    }

    // Sincronizza select ordinamento
    const sortSelect = document.getElementById('filter-ts-sort');
    if (sortSelect && sortSelect.value !== this.filters.timesheetSort) {
      sortSelect.value = this.filters.timesheetSort;
    }

    // Sincronizza select periodo
    const periodSelect = document.getElementById('filter-ts-period');
    if (periodSelect && periodSelect.value !== this.filters.timesheetPeriod) {
      periodSelect.value = this.filters.timesheetPeriod;
    }
  }

  // --- RENDERING ORE (TIMESHEETS CON CALENDARIO) ---
  renderTimesheets() {
    const list = document.getElementById('timesheets-list');
    const strip = document.getElementById('calendar-week-strip');
    const monthLabel = document.getElementById('cal-month-label');
    const summary = document.getElementById('selected-day-summary');
    const weekSection = document.getElementById('week-view-section');
    const monthSection = document.getElementById('month-view-section');
    if (!list) return;

    this.syncTimesheetFiltersUI();

    const todayIso = new Date().toISOString().split('T')[0];
    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

    // Filtra i timesheets complessivi in base ai filtri generali (cantiere, lavoratore, ricerca)
    let filteredTimesheets = store.data.timesheets || [];

    if (this.filters.timesheetSite !== 'all') {
      filteredTimesheets = filteredTimesheets.filter(e => e.siteId === this.filters.timesheetSite);
    }

    if (this.filters.timesheetWorker !== 'all') {
      filteredTimesheets = filteredTimesheets.filter(e => e.workerId === this.filters.timesheetWorker);
    }

    if (this.filters.timesheetSearch) {
      const q = this.filters.timesheetSearch.toLowerCase();
      filteredTimesheets = filteredTimesheets.filter(t => {
        const w = store.data.workers.find(worker => worker.id === t.workerId) || { name: '', role: '' };
        const s = store.data.sites.find(site => site.id === t.siteId) || { code: '', name: '' };
        return (w.name && w.name.toLowerCase().includes(q)) ||
               (w.role && w.role.toLowerCase().includes(q)) ||
               (s.name && s.name.toLowerCase().includes(q)) ||
               (s.code && s.code.toLowerCase().includes(q)) ||
               (t.notes && t.notes.toLowerCase().includes(q));
      });
    }

    // Gestione intestazione titolo in base alla modalità
    if (this.calendarMode === 'month') {
      const monthData = this.getMonthGridData(this.calendarMonthOffset);
      if (monthLabel) {
        monthLabel.textContent = `${months[monthData.month]} ${monthData.year}`;
      }
    } else {
      const weekDates = this.getWeekDates(this.calendarWeekOffset);
      if (monthLabel && weekDates.length > 0) {
        const firstDay = weekDates[0].date;
        const lastDay = weekDates[6].date;
        if (firstDay.getMonth() === lastDay.getMonth()) {
          monthLabel.textContent = `${months[firstDay.getMonth()]} ${firstDay.getFullYear()}`;
        } else {
          monthLabel.textContent = `${months[firstDay.getMonth()].substr(0, 3)} - ${months[lastDay.getMonth()].substr(0, 3)} ${lastDay.getFullYear()}`;
        }
      }
    }

    // ==========================================
    // VISTA COMPATTA SETTIMANALE
    // ==========================================
    if (this.calendarMode === 'week') {
      const weekDates = this.getWeekDates(this.calendarWeekOffset);
      let weekTotalHours = 0;
      let weekTotalCost = 0;

      const dayCardsHtml = weekDates.map(w => {
        const dayEntries = filteredTimesheets.filter(t => t.date === w.isoString);
        const dayHours = dayEntries.reduce((acc, t) => acc + (t.hours || 0), 0);
        const dayCost = dayEntries.reduce((acc, t) => acc + (t.total || 0), 0);
        weekTotalHours += dayHours;
        weekTotalCost += dayCost;

        const isToday = w.isoString === todayIso;
        const hasData = dayHours > 0;

        return `
          <div class="cal-compact-day-card ${isToday ? 'today' : ''} ${hasData ? 'has-data' : ''}" 
               onclick="app.selectCalendarDate('${w.isoString}', true)" 
               title="Clicca per aprire il dettaglio della giornata">
            <div class="cal-card-head">
              <span class="cal-card-dayname">${w.dayName}</span>
              <span class="cal-card-daynum">${w.dayNum}</span>
            </div>
            <div class="cal-card-stats">
              ${hasData ? `
                <div class="cal-card-hours">${dayHours} ore</div>
                <div class="cal-card-cost">${fmtMoney(dayCost)}</div>
              ` : `
                <span class="cal-card-empty">Nessuna ora</span>
              `}
            </div>
          </div>
        `;
      }).join('');

      if (weekSection) {
        weekSection.innerHTML = `
          <div class="compact-period-banner">
            <div class="compact-period-title">
              Riepilogo Settimana (${fmtDate(weekDates[0].isoString)} - ${fmtDate(weekDates[6].isoString)})
            </div>
            <div class="compact-period-metrics">
              <div class="compact-period-stat">
                <span class="stat-lbl">Totale Ore</span>
                <span class="stat-num" style="color:var(--primary);">${weekTotalHours}h</span>
              </div>
              <div class="compact-period-stat">
                <span class="stat-lbl">Costo Manodopera</span>
                <span class="stat-num" style="color:var(--success);">${fmtMoney(weekTotalCost)}</span>
              </div>
            </div>
          </div>
          <div class="cal-compact-week-grid">
            ${dayCardsHtml}
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted); text-align:center; margin-top:12px;">
            Suggerimento: tocca una giornata per visualizzare e registrare le ore dei singoli lavoratori.
          </div>
        `;
      }

      // Aggiorna indicatore filtri compatto
      const displayedCountEl = document.getElementById('hours-displayed-count');
      const displayedTotalHoursEl = document.getElementById('hours-displayed-total-hours');
      const displayedTotalCostEl = document.getElementById('hours-displayed-total-cost');
      if (displayedCountEl) displayedCountEl.textContent = filteredTimesheets.length;
      if (displayedTotalHoursEl) displayedTotalHoursEl.textContent = `${weekTotalHours}h`;
      if (displayedTotalCostEl) displayedTotalCostEl.textContent = fmtMoney(weekTotalCost);

      return;
    }

    // ==========================================
    // VISTA COMPATTA MENSILE
    // ==========================================
    if (this.calendarMode === 'month') {
      const monthData = this.getMonthGridData(this.calendarMonthOffset);
      let monthTotalHours = 0;
      let monthTotalCost = 0;

      const dayHeaders = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
      const headersHtml = dayHeaders.map(h => `<div class="cal-month-head-cell">${h}</div>`).join('');

      const cellsHtml = monthData.days.map(d => {
        if (!d.isCurrentMonth) {
          return `
            <div class="cal-month-day-cell other-month">
              <div class="cal-m-num">${d.dayNum}</div>
            </div>
          `;
        }

        const dayEntries = filteredTimesheets.filter(t => t.date === d.isoString);
        const dayHours = dayEntries.reduce((acc, t) => acc + (t.hours || 0), 0);
        const dayCost = dayEntries.reduce((acc, t) => acc + (t.total || 0), 0);
        monthTotalHours += dayHours;
        monthTotalCost += dayCost;

        const isToday = d.isoString === todayIso;
        const hasData = dayHours > 0;

        return `
          <div class="cal-month-day-cell ${isToday ? 'today' : ''} ${hasData ? 'has-data' : ''}"
               onclick="app.selectCalendarDate('${d.isoString}', true)"
               title="${d.isoString}: ${dayHours}h (${fmtMoney(dayCost)})">
            <div class="cal-m-num">${d.dayNum}</div>
            ${hasData ? `
              <div class="cal-m-info">
                <span class="cal-m-hours">${dayHours}h</span>
                <span class="cal-m-cost">${fmtMoney(dayCost)}</span>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');

      if (monthSection) {
        monthSection.innerHTML = `
          <div class="compact-period-banner">
            <div class="compact-period-title">
              Riepilogo ${months[monthData.month]} ${monthData.year}
            </div>
            <div class="compact-period-metrics">
              <div class="compact-period-stat">
                <span class="stat-lbl">Totale Ore</span>
                <span class="stat-num" style="color:var(--primary);">${monthTotalHours}h</span>
              </div>
              <div class="compact-period-stat">
                <span class="stat-lbl">Costo Manodopera</span>
                <span class="stat-num" style="color:var(--success);">${fmtMoney(monthTotalCost)}</span>
              </div>
            </div>
          </div>
          <div class="cal-month-grid">
            ${headersHtml}
            ${cellsHtml}
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted); text-align:center; margin-top:12px;">
            Suggerimento: tocca qualsiasi giorno del mese per aprire la visuale giornaliera con il dettaglio dei lavoratori.
          </div>
        `;
      }

      // Aggiorna indicatore filtri compatto
      const displayedCountEl = document.getElementById('hours-displayed-count');
      const displayedTotalHoursEl = document.getElementById('hours-displayed-total-hours');
      const displayedTotalCostEl = document.getElementById('hours-displayed-total-cost');
      if (displayedCountEl) displayedCountEl.textContent = filteredTimesheets.length;
      if (displayedTotalHoursEl) displayedTotalHoursEl.textContent = `${monthTotalHours}h`;
      if (displayedTotalCostEl) displayedTotalCostEl.textContent = fmtMoney(monthTotalCost);

      return;
    }

    // ==========================================
    // VISTA GIORNO (DEFAULT)
    // ==========================================
    const weekDates = this.getWeekDates(this.calendarWeekOffset);

    // Render della striscia dei giorni per la vista giorno
    if (strip) {
      strip.innerHTML = weekDates.map(w => {
        const hasHours = filteredTimesheets.some(t => t.date === w.isoString);
        const isActive = w.isoString === this.selectedCalendarDate;
        const isToday = w.isoString === todayIso;

        return `
          <div class="cal-day-cell ${isActive ? 'active' : ''} ${isToday ? 'today' : ''} ${hasHours ? 'has-hours' : ''}" 
               onclick="app.selectCalendarDate('${w.isoString}')">
            <span class="cal-day-name">${w.dayName}</span>
            <span class="cal-day-num">${w.dayNum}</span>
            <span class="cal-day-dot"></span>
          </div>
        `;
      }).join('');
    }

    // In vista Giorno, applichiamo l'ambito periodo e l'ordinamento
    let entries = [...filteredTimesheets];
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = String(now.getMonth() + 1).padStart(2, '0');
    const curYearMonth = `${curYear}-${curMonth}`;
    const lastMonthDate = new Date(curYear, now.getMonth() - 1, 1);
    const lastYearMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;
    const curYearStr = String(curYear);
    const weekIsoDates = new Set(weekDates.map(w => w.isoString));

    let periodLabel = fmtDate(this.selectedCalendarDate);

    if (this.filters.timesheetPeriod === 'selected_day') {
      entries = entries.filter(e => e.date === this.selectedCalendarDate);
      periodLabel = fmtDate(this.selectedCalendarDate);
    } else if (this.filters.timesheetPeriod === 'this_week') {
      entries = entries.filter(e => weekIsoDates.has(e.date));
      periodLabel = `Settimana (${fmtDate(weekDates[0].isoString)} - ${fmtDate(weekDates[6].isoString)})`;
    } else if (this.filters.timesheetPeriod === 'this_month') {
      entries = entries.filter(e => (e.date || '').startsWith(curYearMonth));
      periodLabel = `Mese corrente (${months[now.getMonth()]} ${curYear})`;
    } else if (this.filters.timesheetPeriod === 'last_month') {
      entries = entries.filter(e => (e.date || '').startsWith(lastYearMonth));
      periodLabel = `Mese precedente (${months[lastMonthDate.getMonth()]} ${lastMonthDate.getFullYear()})`;
    } else if (this.filters.timesheetPeriod === 'this_year') {
      entries = entries.filter(e => (e.date || '').startsWith(curYearStr));
      periodLabel = `Anno corrente (${curYear})`;
    } else if (this.filters.timesheetPeriod === 'all') {
      periodLabel = 'Tutto lo storico';
    }

    // Ordinamento
    const sort = this.filters.timesheetSort || 'date_desc';
    entries.sort((a, b) => {
      if (sort === 'date_asc') {
        return (a.date || '').localeCompare(b.date || '') || (b.hours || 0) - (a.hours || 0);
      }
      if (sort === 'hours_desc') {
        return (b.hours || 0) - (a.hours || 0) || (b.date || '').localeCompare(a.date || '');
      }
      if (sort === 'hours_asc') {
        return (a.hours || 0) - (b.hours || 0) || (b.date || '').localeCompare(a.date || '');
      }
      if (sort === 'cost_desc') {
        return (b.total || 0) - (a.total || 0) || (b.date || '').localeCompare(a.date || '');
      }
      if (sort === 'worker_asc') {
        const wA = store.data.workers.find(w => w.id === a.workerId)?.name || '';
        const wB = store.data.workers.find(w => w.id === b.workerId)?.name || '';
        return wA.localeCompare(wB, 'it', { sensitivity: 'base' }) || (b.date || '').localeCompare(a.date || '');
      }
      if (sort === 'site_asc') {
        const sA = store.data.sites.find(s => s.id === a.siteId)?.name || '';
        const sB = store.data.sites.find(s => s.id === b.siteId)?.name || '';
        return sA.localeCompare(sB, 'it', { sensitivity: 'base' }) || (b.date || '').localeCompare(a.date || '');
      }
      // Predefinito: date_desc
      return (b.date || '').localeCompare(a.date || '') || (b.hours || 0) - (a.hours || 0);
    });

    // Aggiornamento riepilogo del periodo / giorno selezionato
    const dayTotalHours = entries.reduce((acc, t) => acc + (parseFloat(t.hours) || 0), 0);
    const dayTotalCost = entries.reduce((acc, t) => acc + (parseFloat(t.total) || 0), 0);

    if (summary) {
      const isSelToday = (this.filters.timesheetPeriod === 'selected_day' && this.selectedCalendarDate === todayIso);
      summary.innerHTML = `
        <span><strong>${periodLabel}</strong> ${isSelToday ? '<span class="day-badge">(Oggi)</span>' : ''}</span>
        <span>Totale: <strong style="color:var(--primary);">${dayTotalHours}h</strong> (${fmtMoney(dayTotalCost)})</span>
      `;
    }

    // Aggiorna indicatore filtri compatto
    const displayedCountEl = document.getElementById('hours-displayed-count');
    const displayedTotalHoursEl = document.getElementById('hours-displayed-total-hours');
    const displayedTotalCostEl = document.getElementById('hours-displayed-total-cost');
    if (displayedCountEl) displayedCountEl.textContent = entries.length;
    if (displayedTotalHoursEl) displayedTotalHoursEl.textContent = `${dayTotalHours}h`;
    if (displayedTotalCostEl) displayedTotalCostEl.textContent = fmtMoney(dayTotalCost);

    if (entries.length === 0) {
      list.innerHTML = `
        <div class="empty-state" style="padding:44px 16px;">
          <svg viewBox="0 0 24 24" style="width:44px; height:44px; stroke:var(--text-dim); fill:none; stroke-width:1.5; margin-bottom:10px;"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>
          <h3 style="font-size:0.98rem; font-weight:700;">Nessuna ora trovata</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:14px;">
            ${this.filters.timesheetSearch ? `Nessun risultato trovato per "${this.filters.timesheetSearch}"` : `Nessuna ora registrata per il periodo selezionato.`}
          </p>
          <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
            <button class="btn btn-secondary btn-sm" onclick="app.resetTimesheetFilters()">Ripristina filtri</button>
            <button class="btn btn-primary btn-sm" onclick="app.openTimesheetModalForDate('${this.selectedCalendarDate}')">
              <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Registra Ore
            </button>
          </div>
        </div>
      `;
      return;
    }

    list.innerHTML = entries.map(item => {
      const worker = store.data.workers.find(w => w.id === item.workerId) || { name: 'Lavoratore non trovato', role: '-' };
      const site = store.data.sites.find(s => s.id === item.siteId) || { code: 'N/D', name: 'Cantiere' };

      return `
        <div class="item-card">
          <div class="item-card-top">
            <div>
              <div class="item-card-title">${worker.name}</div>
              <div class="item-card-sub">
                <span class="item-badge badge-amber">${worker.role}</span>
                <span class="sub-icon">${ICONS.site} ${site.code} - ${site.name}</span>
              </div>
            </div>
            <div style="text-align: right;">
              <span class="item-badge badge-gray">${fmtDate(item.date)}</span>
            </div>
          </div>
          <div class="item-card-body">
            <div class="item-card-metrics">
              <div class="metric-item">
                <span class="metric-label">Ore</span>
                <span class="metric-val highlight">${item.hours}h</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Tariffa</span>
                <span class="metric-val">${fmtMoney(item.hourlyRate)}/h</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Totale Costo</span>
                <span class="metric-val" style="color:var(--success);">${fmtMoney(item.total)}</span>
              </div>
            </div>
            ${item.notes ? `<div style="font-size:0.78rem; color:var(--text-muted); width:100%; margin-top:4px;" class="sub-icon">${ICONS.note} ${item.notes}</div>` : ''}
            <div class="item-card-actions">
              <button class="btn-icon" title="Modifica" onclick="app.openTimesheetModal('${item.id}')">${ICONS.edit}</button>
              <button class="btn-icon" title="Elimina" onclick="app.deleteTimesheet('${item.id}')">${ICONS.delete}</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // ==========================================================================
  // GESTIONE SEZIONE SPESE & FATTURE
  // ==========================================================================
  saveExpenseFilters() {
    try {
      if (typeof localStorage !== 'undefined') {
        const payload = {
          expenseSite: this.filters.expenseSite,
          expenseCategory: this.filters.expenseCategory,
          expenseSort: this.filters.expenseSort,
          expenseSearch: this.filters.expenseSearch,
          expenseDoc: this.filters.expenseDoc,
          expensePeriod: this.filters.expensePeriod
        };
        localStorage.setItem('geem_expenses_filters', JSON.stringify(payload));
      }
    } catch (e) {
      console.warn('Errore salvataggio filtri spese in localStorage:', e);
    }
  }

  setExpenseCategoryFilter(cat) {
    this.filters.expenseCategory = cat || 'all';
    this.saveExpenseFilters();
    this.renderExpenses();
  }

  setExpenseSiteFilter(siteId) {
    this.filters.expenseSite = siteId || 'all';
    this.saveExpenseFilters();
    this.renderExpenses();
  }

  setExpenseSort(sortVal) {
    this.filters.expenseSort = sortVal || 'date_desc';
    this.saveExpenseFilters();
    this.renderExpenses();
  }

  setExpensePeriodFilter(periodVal) {
    this.filters.expensePeriod = periodVal || 'all';
    this.saveExpenseFilters();
    this.renderExpenses();
  }

  setExpenseDocFilter(docVal) {
    this.filters.expenseDoc = docVal || 'all';
    this.saveExpenseFilters();
    this.renderExpenses();
  }

  handleExpenseSearch(query) {
    this.filters.expenseSearch = (query || '').trim();
    const clearBtn = document.getElementById('expense-search-clear');
    if (clearBtn) {
      clearBtn.style.display = this.filters.expenseSearch ? 'block' : 'none';
    }
    this.saveExpenseFilters();
    this.renderExpenses();
  }

  clearExpenseSearch() {
    this.filters.expenseSearch = '';
    const input = document.getElementById('expense-search-input');
    const clearBtn = document.getElementById('expense-search-clear');
    if (input) input.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    this.saveExpenseFilters();
    this.renderExpenses();
  }

  resetExpenseFilters() {
    this.filters.expenseSite = 'all';
    this.filters.expenseCategory = 'all';
    this.filters.expenseSort = 'date_desc';
    this.filters.expenseSearch = '';
    this.filters.expenseDoc = 'all';
    this.filters.expensePeriod = 'all';

    const searchInput = document.getElementById('expense-search-input');
    const clearBtn = document.getElementById('expense-search-clear');
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';

    this.saveExpenseFilters();
    this.renderExpenses();
    this.showToast('Filtri spese ripristinati', 'info');
  }

  syncExpenseFiltersUI() {
    // Sincronizza input di ricerca
    const searchInput = document.getElementById('expense-search-input');
    if (searchInput && searchInput.value !== this.filters.expenseSearch) {
      searchInput.value = this.filters.expenseSearch || '';
    }
    const clearBtn = document.getElementById('expense-search-clear');
    if (clearBtn) {
      clearBtn.style.display = this.filters.expenseSearch ? 'block' : 'none';
    }

    // Sincronizza chip categoria
    document.querySelectorAll('[data-exp-category]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.expCategory === this.filters.expenseCategory);
    });

    // Sincronizza select ordinamento
    const sortSelect = document.getElementById('filter-exp-sort');
    if (sortSelect && sortSelect.value !== this.filters.expenseSort) {
      sortSelect.value = this.filters.expenseSort;
    }

    // Sincronizza select cantiere
    const siteSelect = document.getElementById('filter-exp-site');
    if (siteSelect && siteSelect.value !== this.filters.expenseSite) {
      siteSelect.value = this.filters.expenseSite;
    }

    // Sincronizza select periodo
    const periodSelect = document.getElementById('filter-exp-period');
    if (periodSelect && periodSelect.value !== this.filters.expensePeriod) {
      periodSelect.value = this.filters.expensePeriod;
    }

    // Sincronizza select doc
    const docSelect = document.getElementById('filter-exp-doc');
    if (docSelect && docSelect.value !== this.filters.expenseDoc) {
      docSelect.value = this.filters.expenseDoc;
    }
  }

  renderExpenseCategoryChips(allExpenses) {
    const container = document.getElementById('expense-category-chips');
    if (!container) return;

    const configCats = (store.data.config && store.data.config.expenseCategories) || [];
    const usedCats = (allExpenses || []).map(e => e.category).filter(Boolean);
    const allUniqueCats = [...new Set([...configCats, ...usedCats])];

    const currentCat = this.filters.expenseCategory || 'all';

    let html = `
      <button type="button" class="filter-chip ${currentCat === 'all' ? 'active' : ''}" data-exp-category="all" onclick="app.setExpenseCategoryFilter('all')">
        Tutte (${allExpenses.length})
      </button>
    `;

    allUniqueCats.forEach(cat => {
      const count = allExpenses.filter(e => e.category === cat).length;
      const escapedCat = cat.replace(/'/g, "\\'");
      html += `
        <button type="button" class="filter-chip ${currentCat === cat ? 'active' : ''}" data-exp-category="${cat}" onclick="app.setExpenseCategoryFilter('${escapedCat}')">
          ${cat} (${count})
        </button>
      `;
    });

    container.innerHTML = html;
  }

  // --- RENDERING SPESE (EXPENSES) ---
  renderExpenses() {
    const list = document.getElementById('expenses-list');
    if (!list) return;

    this.syncExpenseFiltersUI();

    const allExpenses = store.data.expenses || [];
    this.renderExpenseCategoryChips(allExpenses);

    let entries = [...allExpenses];

    // 1. Filtro Cantiere
    if (this.filters.expenseSite !== 'all') {
      entries = entries.filter(e => e.siteId === this.filters.expenseSite);
    }

    // 2. Filtro Categoria
    if (this.filters.expenseCategory !== 'all') {
      entries = entries.filter(e => e.category === this.filters.expenseCategory);
    }

    // 3. Filtro Stringa di Ricerca
    if (this.filters.expenseSearch) {
      const q = this.filters.expenseSearch.toLowerCase();
      entries = entries.filter(e => {
        const site = e.siteId === 'generale' 
          ? { code: 'AZI', name: 'Spesa Generale Aziendale' }
          : (store.data.sites.find(s => s.id === e.siteId) || { code: '', name: '' });
        return (e.description && e.description.toLowerCase().includes(q)) ||
               (e.category && e.category.toLowerCase().includes(q)) ||
               (e.docNumber && e.docNumber.toLowerCase().includes(q)) ||
               (e.notes && e.notes.toLowerCase().includes(q)) ||
               (site.name && site.name.toLowerCase().includes(q)) ||
               (site.code && site.code.toLowerCase().includes(q));
      });
    }

    // 4. Filtro Periodo Temporale
    if (this.filters.expensePeriod && this.filters.expensePeriod !== 'all') {
      const now = new Date();
      const curYear = now.getFullYear();
      const curMonth = String(now.getMonth() + 1).padStart(2, '0');
      const curYearMonth = `${curYear}-${curMonth}`;
      const lastMonthDate = new Date(curYear, now.getMonth() - 1, 1);
      const lastYearMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;
      const curYearStr = String(curYear);
      const lastYearStr = String(curYear - 1);
      const thirtyDaysAgoStr = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      if (this.filters.expensePeriod === 'this_month') {
        entries = entries.filter(e => (e.date || '').startsWith(curYearMonth));
      } else if (this.filters.expensePeriod === 'last_month') {
        entries = entries.filter(e => (e.date || '').startsWith(lastYearMonth));
      } else if (this.filters.expensePeriod === 'this_year') {
        entries = entries.filter(e => (e.date || '').startsWith(curYearStr));
      } else if (this.filters.expensePeriod === 'last_year') {
        entries = entries.filter(e => (e.date || '').startsWith(lastYearStr));
      } else if (this.filters.expensePeriod === 'last_30_days') {
        entries = entries.filter(e => (e.date || '') >= thirtyDaysAgoStr);
      }
    }

    // 5. Filtro Documento Fiscale
    if (this.filters.expenseDoc === 'has_doc') {
      entries = entries.filter(e => Boolean(e.docNumber && e.docNumber.trim()));
    } else if (this.filters.expenseDoc === 'no_doc') {
      entries = entries.filter(e => !e.docNumber || !e.docNumber.trim());
    }

    // 6. Ordinamento
    const sort = this.filters.expenseSort || 'date_desc';
    entries.sort((a, b) => {
      if (sort === 'date_asc') {
        return (a.date || '').localeCompare(b.date || '') || (a.amount || 0) - (b.amount || 0);
      }
      if (sort === 'amount_desc') {
        return (b.amount || 0) - (a.amount || 0) || (b.date || '').localeCompare(a.date || '');
      }
      if (sort === 'amount_asc') {
        return (a.amount || 0) - (b.amount || 0) || (b.date || '').localeCompare(a.date || '');
      }
      if (sort === 'desc_asc') {
        return (a.description || a.category || '').localeCompare(b.description || b.category || '', 'it', { sensitivity: 'base' }) || (b.date || '').localeCompare(a.date || '');
      }
      if (sort === 'desc_desc') {
        return (b.description || b.category || '').localeCompare(a.description || a.category || '', 'it', { sensitivity: 'base' }) || (b.date || '').localeCompare(a.date || '');
      }
      if (sort === 'category_asc') {
        return (a.category || '').localeCompare(b.category || '', 'it', { sensitivity: 'base' }) || (b.date || '').localeCompare(a.date || '');
      }
      if (sort === 'site_asc') {
        const getSiteName = (item) => {
          if (item.siteId === 'generale') return 'AZI Spesa Generale';
          const s = store.data.sites.find(st => st.id === item.siteId);
          return s ? `${s.code} ${s.name}` : 'ZZZ';
        };
        return getSiteName(a).localeCompare(getSiteName(b), 'it', { sensitivity: 'base' }) || (b.date || '').localeCompare(a.date || '');
      }
      // Predefinito: date_desc
      return (b.date || '').localeCompare(a.date || '') || (b.amount || 0) - (a.amount || 0);
    });

    // 7. Aggiornamento indicatori di conteggio e importo totale
    const totalFilteredAmount = entries.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const displayedCountEl = document.getElementById('expenses-displayed-count');
    const displayedTotalEl = document.getElementById('expenses-displayed-total');
    if (displayedCountEl) displayedCountEl.textContent = entries.length;
    if (displayedTotalEl) displayedTotalEl.textContent = fmtMoney(totalFilteredAmount);

    if (allExpenses.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="17" cy="15" r="1.5"/></svg>
          <h3>Nessuna spesa registrata</h3>
          <p>Tieni traccia delle spese per camion, benzina, materiali e scontrini.</p>
          <button class="btn btn-primary" onclick="app.openExpenseModal()">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nuova Spesa
          </button>
        </div>
      `;
      return;
    }

    if (entries.length === 0) {
      list.innerHTML = `
        <div class="empty-state" style="padding:44px 16px;">
          <svg viewBox="0 0 24 24" style="width:44px; height:44px; stroke:var(--text-dim); fill:none; stroke-width:1.5; margin-bottom:10px;"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="17" cy="15" r="1.5"/></svg>
          <h3 style="font-size:0.98rem; font-weight:700;">Nessuna spesa trovata</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:14px;">
            ${this.filters.expenseSearch ? `Nessun risultato trovato per "${this.filters.expenseSearch}"` : 'Nessuna spesa corrisponde ai filtri selezionati.'}
          </p>
          <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
            <button class="btn btn-secondary btn-sm" onclick="app.resetExpenseFilters()">Ripristina filtri</button>
            <button class="btn btn-primary btn-sm" onclick="app.openExpenseModal()">+ Nuova Spesa</button>
          </div>
        </div>
      `;
      return;
    }

    list.innerHTML = entries.map(item => {
      const site = item.siteId === 'generale' 
        ? { code: 'AZI', name: 'Spesa Generale Aziendale' }
        : (store.data.sites.find(s => s.id === item.siteId) || { code: 'N/D', name: 'Cantiere' });

      return `
        <div class="item-card">
          <div class="item-card-top">
            <div>
              <div class="item-card-title">${item.description || item.category}</div>
              <div class="item-card-sub">
                <span class="item-badge badge-blue">${item.category}</span>
                <span class="sub-icon">${ICONS.site} ${site.code} - ${site.name}</span>
              </div>
            </div>
            <div style="text-align: right;">
              <span class="metric-val" style="color:var(--primary); font-size:1.1rem;">${fmtMoney(item.amount)}</span>
              <div style="font-size:0.72rem; color:var(--text-dim);">${fmtDate(item.date)}</div>
            </div>
          </div>
          <div class="item-card-body">
            <div style="font-size:0.8rem; color:var(--text-muted); display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
              ${item.docNumber ? `<span class="sub-icon">${ICONS.doc} Doc: <strong>${item.docNumber}</strong></span>` : ''}
              ${item.notes ? `<span class="sub-icon">${ICONS.note} ${item.notes}</span>` : ''}
            </div>
            <div class="item-card-actions">
              <button class="btn-icon" title="Modifica" onclick="app.openExpenseModal('${item.id}')">${ICONS.edit}</button>
              <button class="btn-icon" title="Elimina" onclick="app.deleteExpense('${item.id}')">${ICONS.delete}</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- RENDERING CANTIERI (OVERVIEW) ---
  renderSites() {
    const list = document.getElementById('sites-list');
    if (!list) return;

    this.syncSiteFiltersUI();

    const allSites = store.data.sites || [];

    // Aggiorna contatori per chip di stato
    const countAll = allSites.length;
    const countInCorso = allSites.filter(s => s.status === 'in_corso').length;
    const countSospeso = allSites.filter(s => s.status === 'sospeso').length;
    const countCompletato = allSites.filter(s => s.status === 'completato').length;

    const elCountAll = document.getElementById('site-count-all');
    const elCountInCorso = document.getElementById('site-count-in_corso');
    const elCountSospeso = document.getElementById('site-count-sospeso');
    const elCountCompletato = document.getElementById('site-count-completato');

    if (elCountAll) elCountAll.textContent = countAll;
    if (elCountInCorso) elCountInCorso.textContent = countInCorso;
    if (elCountSospeso) elCountSospeso.textContent = countSospeso;
    if (elCountCompletato) elCountCompletato.textContent = countCompletato;

    // 1. FILTRAGGIO
    let sites = [...allSites];

    // Filtro per stato
    if (this.filters.siteStatus && this.filters.siteStatus !== 'all') {
      sites = sites.filter(s => s.status === this.filters.siteStatus);
    }

    // Filtro per cliente
    if (this.filters.siteClient && this.filters.siteClient !== 'all') {
      sites = sites.filter(s => s.clientId === this.filters.siteClient);
    }

    // Filtro per stringa di ricerca (codice, nome, indirizzo, note, nome cliente)
    if (this.filters.siteSearch) {
      const q = this.filters.siteSearch.toLowerCase();
      sites = sites.filter(s => {
        const client = store.data.clients.find(c => c.id === s.clientId);
        const clientName = client ? client.name.toLowerCase() : '';
        return (s.code && s.code.toLowerCase().includes(q)) ||
               (s.name && s.name.toLowerCase().includes(q)) ||
               (s.address && s.address.toLowerCase().includes(q)) ||
               (s.notes && s.notes.toLowerCase().includes(q)) ||
               clientName.includes(q);
      });
    }

    // Filtro per stato pagamenti
    if (this.filters.siteFinancial && this.filters.siteFinancial !== 'all') {
      sites = sites.filter(s => {
        const cost = store.getSiteCost(s.id);
        const payments = Array.isArray(s.payments) ? s.payments : [];
        if (this.filters.siteFinancial === 'has_balance') {
          return cost.quoteAmount > 0 && cost.balanceRemaining > 0;
        } else if (this.filters.siteFinancial === 'fully_paid') {
          return cost.quoteAmount > 0 && cost.balanceRemaining <= 0;
        } else if (this.filters.siteFinancial === 'no_payments') {
          return payments.length === 0 || cost.paymentsTotal === 0;
        }
        return true;
      });
    }

    // Filtro per budget e rischio
    if (this.filters.siteBudget && this.filters.siteBudget !== 'all') {
      sites = sites.filter(s => {
        const cost = store.getSiteCost(s.id);
        const hasAttachments = Array.isArray(s.attachments) && s.attachments.length > 0;
        if (this.filters.siteBudget === 'loss') {
          return cost.quoteAmount > 0 && cost.profit < 0;
        } else if (this.filters.siteBudget === 'at_risk') {
          return cost.quoteAmount > 0 && (cost.profit < 0 || (cost.costBudgetUsage !== null && cost.costBudgetUsage >= 85));
        } else if (this.filters.siteBudget === 'profitable') {
          return cost.quoteAmount > 0 && cost.profit >= 0 && (cost.costBudgetUsage === null || cost.costBudgetUsage < 85);
        } else if (this.filters.siteBudget === 'has_attachments') {
          return hasAttachments;
        }
        return true;
      });
    }

    // Aggiorna indicatore conteggio cantieri mostrati
    const displayedCountEl = document.getElementById('sites-displayed-count');
    if (displayedCountEl) displayedCountEl.textContent = sites.length;

    if (sites.length === 0) {
      const hasActiveFilters = (this.filters.siteStatus !== 'all') ||
                               (this.filters.siteClient !== 'all') ||
                               (this.filters.siteFinancial !== 'all') ||
                               (this.filters.siteBudget !== 'all') ||
                               Boolean(this.filters.siteSearch);

      list.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l8-4v18M13 11l6 3v7M9 9h1M9 13h1M9 17h1"/></svg>
          <h3>${hasActiveFilters ? 'Nessun cantiere corrisponde ai filtri' : 'Nessun cantiere presente'}</h3>
          <p>${hasActiveFilters ? 'Prova a modificare o azzerare i criteri di ricerca e filtro.' : 'Aggiungi il tuo primo cantiere nella sezione Admin o cliccando sul pulsante in alto.'}</p>
          ${hasActiveFilters ? `
            <button class="btn btn-secondary btn-sm" onclick="app.resetSiteFilters()">
              Ripristina tutti i filtri
            </button>
          ` : `
            <button class="btn btn-primary" onclick="app.openSiteModal()">
              <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Aggiungi Cantiere
            </button>
          `}
        </div>
      `;
      return;
    }

    // 2. ORDINAMENTO
    // Ordine di priorità per lo stato (1. In corso, 2. Sospeso, 3. Completato)
    const statusOrder = {
      'in_corso': 1,
      'sospeso': 2,
      'completato': 3
    };

    const sortMode = this.filters.siteSort || 'status_startdate';

    sites.sort((a, b) => {
      if (sortMode === 'status_startdate') {
        const orderA = statusOrder[a.status] || 99;
        const orderB = statusOrder[b.status] || 99;
        if (orderA !== orderB) return orderA - orderB;

        // Se lo stato è uguale, ordina per data di inizio (dal più recente, con date vuote in coda)
        const dateA = a.startDate || '';
        const dateB = b.startDate || '';
        if (dateA && dateB) return dateB.localeCompare(dateA);
        if (dateA && !dateB) return -1;
        if (!dateA && dateB) return 1;
        return (a.name || '').localeCompare(b.name || '');
      }

      if (sortMode === 'startdate_desc') {
        const dateA = a.startDate || '';
        const dateB = b.startDate || '';
        if (dateA && dateB) return dateB.localeCompare(dateA);
        if (dateA && !dateB) return -1;
        if (!dateA && dateB) return 1;
        return (a.name || '').localeCompare(b.name || '');
      }

      if (sortMode === 'startdate_asc') {
        const dateA = a.startDate || '';
        const dateB = b.startDate || '';
        if (dateA && dateB) return dateA.localeCompare(dateB);
        if (dateA && !dateB) return -1;
        if (!dateA && dateB) return 1;
        return (a.name || '').localeCompare(b.name || '');
      }

      if (sortMode === 'name_asc') {
        return (a.name || '').localeCompare(b.name || '');
      }

      if (sortMode === 'name_desc') {
        return (b.name || '').localeCompare(a.name || '');
      }

      if (sortMode === 'code_asc') {
        return (a.code || '').localeCompare(b.code || '');
      }

      if (sortMode === 'quote_desc') {
        const qA = parseFloat(a.quoteAmount) || 0;
        const qB = parseFloat(b.quoteAmount) || 0;
        return qB - qA;
      }

      if (sortMode === 'quote_asc') {
        const qA = parseFloat(a.quoteAmount) || 0;
        const qB = parseFloat(b.quoteAmount) || 0;
        return qA - qB;
      }

      if (sortMode === 'cost_desc') {
        const costA = store.getSiteCost(a.id).totalCost || 0;
        const costB = store.getSiteCost(b.id).totalCost || 0;
        return costB - costA;
      }

      if (sortMode === 'balance_desc') {
        const balA = store.getSiteCost(a.id).balanceRemaining || 0;
        const balB = store.getSiteCost(b.id).balanceRemaining || 0;
        return balB - balA;
      }

      if (sortMode === 'profit_asc') {
        const profA = store.getSiteCost(a.id).profit || 0;
        const profB = store.getSiteCost(b.id).profit || 0;
        return profA - profB;
      }

      return 0;
    });

    list.innerHTML = sites.map(site => {
      const client = store.data.clients.find(c => c.id === site.clientId) || { name: 'Cliente N/D', phone: '' };
      const cost = store.getSiteCost(site.id);

      const statusBadges = {
        'in_corso': '<span class="item-badge badge-green">In Corso</span>',
        'sospeso': '<span class="item-badge badge-amber">Sospeso</span>',
        'completato': '<span class="item-badge badge-gray">Completato</span>'
      };

      const attachmentsBadge = (site.attachments && site.attachments.length > 0)
        ? `<span class="item-badge badge-gray" style="font-size:0.7rem; display:inline-flex; align-items:center; gap:4px;" title="${site.attachments.length} allegati">${ICONS.clip}<span>${site.attachments.length}</span></span>`
        : '';

      const profitBadge = (cost.quoteAmount > 0 && cost.profitMargin !== null)
        ? (cost.profit >= 0
            ? `<span class="item-badge badge-green" style="font-size:0.7rem;">+${cost.profitMargin}% utile</span>`
            : `<span class="item-badge badge-red" style="font-size:0.7rem;">${cost.profitMargin}% perdita</span>`)
        : '';

      const dateBadge = site.startDate 
        ? `<span class="sub-icon" style="font-size:0.74rem; color:var(--text-dim);">${ICONS.calendar} Dal ${fmtDate(site.startDate)}</span>`
        : '';

      return `
        <div class="site-card-compact" onclick="app.openSiteDetailModal('${site.id}')">
          <div class="site-card-compact-head">
            <div class="site-card-compact-title">${site.code} - ${site.name}</div>
            <span class="site-card-compact-arrow">
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </span>
          </div>

          <div class="site-card-compact-badges">
            ${statusBadges[site.status] || ''}
            ${profitBadge}
            ${attachmentsBadge}
          </div>

          <div class="site-card-compact-sub">
            <span class="sub-icon">${ICONS.user} ${client.name}</span>
            ${site.address ? `<span class="sub-icon">${ICONS.map} ${site.address}</span>` : ''}
            ${dateBadge}
          </div>

          <div class="site-card-compact-footer">
            <div>
              <span>Ore: <strong>${cost.hoursTotal}h</strong></span>
              <span style="margin: 0 4px; opacity:0.4;">|</span>
              <span>Speso: <span class="footer-cost">${fmtMoney(cost.totalCost)}</span></span>
            </div>
            ${cost.quoteAmount > 0 ? `
              <div class="footer-quote">
                <span>Prev: <strong>${fmtMoney(cost.quoteAmount)}</strong></span>
                ${cost.balanceRemaining > 0 ? `<span style="color:var(--warning); margin-left:4px;">(Saldo ${fmtMoney(cost.balanceRemaining)})</span>` : ''}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  // --- MODAL DETTAGLIO CANTIERE (VISTA APPROFONDITA) ---
  openSiteDetailModal(siteId) {
    this.activeDetailSiteId = siteId;
    const site = store.data.sites.find(s => s.id === siteId);
    if (!site) return;

    const client = store.data.clients.find(c => c.id === site.clientId) || { name: 'Cliente non assegnato', phone: '', notes: '' };
    const cost = store.getSiteCost(site.id);

    const titleEl = document.getElementById('site-detail-title');
    const subEl = document.getElementById('site-detail-sub');
    const bodyEl = document.getElementById('site-detail-body');
    const editBtn = document.getElementById('site-detail-edit-btn');
    const quickActionBtn = document.getElementById('site-detail-quick-action');

    if (titleEl) titleEl.textContent = `${site.code} - ${site.name}`;
    if (subEl) subEl.textContent = `Cliente: ${client.name}`;

    const handleEditSite = () => {
      this.closeModal('modal-site-detail');
      this.openSiteModal(site.id);
    };

    if (editBtn) editBtn.onclick = handleEditSite;
    if (quickActionBtn) quickActionBtn.onclick = handleEditSite;

    const statusBadges = {
      'in_corso': '<span class="item-badge badge-green">In Corso</span>',
      'sospeso': '<span class="item-badge badge-amber">Sospeso</span>',
      'completato': '<span class="item-badge badge-gray">Completato</span>'
    };

    const siteTimesheets = store.data.timesheets.filter(t => t.siteId === site.id);
    const siteExpenses = store.data.expenses.filter(e => e.siteId === site.id);

    bodyEl.innerHTML = `
      <!-- Stato & Contatti Rapidi -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
        <div style="display:flex; align-items:center; gap:6px;">
          ${statusBadges[site.status] || ''}
          ${site.startDate ? `<span class="sub-icon" style="font-size:0.75rem; color:var(--text-muted);">${ICONS.calendar} Dal ${fmtDate(site.startDate)} ${site.endDate ? `al ${fmtDate(site.endDate)}` : ''}</span>` : ''}
        </div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          ${client.phone ? `<a href="tel:${client.phone}" class="action-link">${ICONS.phone} Chiama</a>` : ''}
          ${client.phone ? `<a href="${getWhatsAppUrl(client.phone)}" target="_blank" rel="noopener" class="action-link action-whatsapp">${ICONS.whatsapp} WhatsApp</a>` : ''}
          ${site.address ? `<a href="https://maps.google.com/?q=${encodeURIComponent(site.address)}" target="_blank" rel="noopener" class="action-link">${ICONS.map} Mappa</a>` : ''}
        </div>
      </div>

      ${site.address ? `<div style="font-size:0.78rem; color:var(--text-muted); margin-bottom:10px;"><strong>Indirizzo:</strong> ${site.address}</div>` : ''}
      ${site.notes ? `<div style="font-size:0.78rem; color:var(--text-muted); background:var(--bg-input); padding:8px 10px; border-radius:var(--radius-sm); margin-bottom:12px;">${site.notes}</div>` : ''}

      <!-- Redditività & Margine Operativo in Tempo Reale -->
      ${cost.quoteAmount > 0 ? (() => {
        const isLoss = cost.profit < 0;
        const isWarning = !isLoss && cost.costBudgetUsage > 80;
        const boxClass = isLoss ? 'profit-danger' : (isWarning ? 'profit-warning' : 'profit-positive');
        const textClass = isLoss ? 'red' : (isWarning ? 'yellow' : 'green');
        const pillClass = isLoss ? 'pill-red' : (isWarning ? 'pill-yellow' : 'pill-green');
        const progressColor = isLoss ? 'var(--danger)' : (isWarning ? 'var(--warning)' : 'var(--success)');
        const progressPercent = Math.min(100, Math.max(0, cost.costBudgetUsage || 0));

        return `
          <div class="profit-box ${boxClass}">
            <div class="profit-header">
              <span class="profit-title">
                <svg viewBox="0 0 24 24" style="width:16px; height:16px; stroke:currentColor; stroke-width:2.2; fill:none;"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Redditività & Margine Operativo
              </span>
              <span class="profit-pill ${pillClass}">
                ${isLoss ? 'In Perdita' : `${cost.profitMargin}% Margine`}
              </span>
            </div>
            <div class="profit-val-big ${textClass}">
              ${isLoss ? '-' : '+'}${fmtMoney(Math.abs(cost.profit))}
              <span style="font-size:0.75rem; font-weight:600; color:var(--text-dim); margin-left:6px;">
                ${isLoss ? 'perdita sui costi sostenuti' : 'utile netto stimato finora'}
              </span>
            </div>

            <div class="profit-progress-wrap">
              <div class="profit-progress-bar-bg">
                <div class="profit-progress-fill" style="width:${progressPercent}%; background:${progressColor};"></div>
              </div>
              <div class="profit-progress-labels">
                <span>Costi sostenuti: <strong>${cost.costBudgetUsage}%</strong> del preventivo</span>
                <span>Budget preventivo: <strong>${fmtMoney(cost.quoteAmount)}</strong></span>
              </div>
            </div>
          </div>
        `;
      })() : ''}

      <!-- Bilancio Economico Cantiere -->
      <div class="site-finance-box" style="margin-top:0;">
        <div class="site-finance-header">
          <span>Bilancio Costi Cantiere</span>
          <span style="color:var(--primary); font-weight:800;">Totale Speso: ${fmtMoney(cost.totalCost)}</span>
        </div>
        <div class="site-finance-metrics" style="grid-template-columns:repeat(3, 1fr);">
          <div class="finance-metric">
            <span class="finance-lbl">Ore (${cost.hoursTotal}h)</span>
            <span class="finance-val">${fmtMoney(cost.laborCost)}</span>
          </div>
          <div class="finance-metric">
            <span class="finance-lbl">Spese Mat.</span>
            <span class="finance-val">${fmtMoney(cost.expensesTotal)}</span>
          </div>
          <div class="finance-metric">
            <span class="finance-lbl">Costo Totale</span>
            <span class="finance-val" style="color:var(--primary);">${fmtMoney(cost.totalCost)}</span>
          </div>
        </div>
      </div>

      <!-- Preventivo e Pagamenti Clienti -->
      ${cost.quoteAmount > 0 || (site.payments && site.payments.length > 0) ? `
        <div class="site-finance-box">
          <div class="site-finance-header">
            <span>Preventivo & Incassi Cliente</span>
            <span>${site.payments ? site.payments.length : 0} Versamenti</span>
          </div>
          <div class="site-finance-metrics" style="grid-template-columns:repeat(3, 1fr); margin-bottom:10px;">
            <div class="finance-metric">
              <span class="finance-lbl">Preventivo</span>
              <span class="finance-val val-quote">${fmtMoney(cost.quoteAmount)}</span>
            </div>
            <div class="finance-metric">
              <span class="finance-lbl">Incassato</span>
              <span class="finance-val val-paid">${fmtMoney(cost.paymentsTotal)}</span>
            </div>
            <div class="finance-metric">
              <span class="finance-lbl">Da Incassare</span>
              <span class="finance-val ${cost.balanceRemaining > 0 ? 'val-due' : 'val-zero'}">
                ${fmtMoney(cost.balanceRemaining)}
              </span>
            </div>
          </div>

          ${site.payments && site.payments.length > 0 ? `
            <div style="font-size:0.72rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Elenco Rate / Acconti:</div>
            <div class="detail-table-list">
              ${site.payments.map(p => `
                <div class="detail-table-row">
                  <div>
                    <strong style="color:#fff;">${p.note || 'Pagamento'}</strong>
                    <div style="font-size:0.7rem; color:var(--text-dim);">${fmtDate(p.date)}</div>
                  </div>
                  <strong style="color:var(--success); font-size:0.86rem;">+${fmtMoney(p.amount)}</strong>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- Allegati e Documenti -->
      ${site.attachments && site.attachments.length > 0 ? `
        <div class="site-attachments-box">
          <div class="site-attachments-header">
            <span class="sub-icon">${ICONS.clip} Documenti Allegati (${site.attachments.length})</span>
            <span style="font-size:0.68rem; color:var(--text-dim); text-transform:none;">Tocca per aprire/scaricare</span>
          </div>
          <div class="attachment-chips-list">
            ${site.attachments.map((att, attIdx) => `
              <button type="button" class="attachment-chip" onclick="app.openOrDownloadAttachment('${site.id}', '${att.id || attIdx}')" title="${att.name} (${att.sizeStr || ''})">
                ${ICONS.doc}
                <span class="attachment-chip-name">${att.name}</span>
                <span class="attachment-chip-size">${att.sizeStr || ''}</span>
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Ultimi Movimenti Ore sul Cantiere -->
      <div class="detail-section-title">Ore Lavorate Recenti (${siteTimesheets.length} registrazioni)</div>
      ${siteTimesheets.length > 0 ? `
        <div class="detail-table-list" style="margin-bottom:12px;">
          ${siteTimesheets.slice(0, 6).map(t => {
            const w = store.data.workers.find(worker => worker.id === t.workerId) || { name: 'Operatore' };
            return `
              <div class="detail-table-row">
                <div>
                  <strong>${w.name}</strong> (${t.hours}h)
                  <div style="font-size:0.7rem; color:var(--text-dim);">${fmtDate(t.date)} ${t.notes ? `• ${t.notes}` : ''}</div>
                </div>
                <strong style="color:var(--text-main); font-size:0.82rem;">${fmtMoney(t.total)}</strong>
              </div>
            `;
          }).join('')}
        </div>
      ` : `<div style="font-size:0.75rem; color:var(--text-dim); margin-bottom:12px;">Nessuna ora registrata su questo cantiere.</div>`}

      <!-- Ultime Spese sul Cantiere -->
      <div class="detail-section-title">Spese & Materiali Recenti (${siteExpenses.length} movimenti)</div>
      ${siteExpenses.length > 0 ? `
        <div class="detail-table-list">
          ${siteExpenses.slice(0, 6).map(e => `
            <div class="detail-table-row">
              <div>
                <strong>${e.description || e.category}</strong>
                <div style="font-size:0.7rem; color:var(--text-dim);">${fmtDate(e.date)} • ${e.category}</div>
              </div>
              <strong style="color:var(--primary); font-size:0.82rem;">${fmtMoney(e.amount)}</strong>
            </div>
          `).join('')}
        </div>
      ` : `<div style="font-size:0.75rem; color:var(--text-dim);">Nessuna spesa registrata su questo cantiere.</div>`}
    `;

    this.openModal('modal-site-detail');
  }

  // --- RENDERING ADMIN LAVORATORI ---
  renderAdminWorkers() {
    const list = document.getElementById('admin-workers-list');
    if (!list) return;

    const workers = store.data.workers;
    list.innerHTML = workers.map(w => `
      <div class="item-card">
        <div class="item-card-top">
          <div>
            <div class="item-card-title">${w.name} ${!w.active ? '<span class="item-badge badge-red">Inattivo</span>' : ''}</div>
            <div class="item-card-sub">
              <span class="item-badge badge-amber">${w.role}</span>
              ${w.phone ? `<span class="sub-icon">${ICONS.phone} ${w.phone}</span>` : ''}
            </div>
          </div>
          <div class="item-card-actions">
            <button class="btn-icon" onclick="app.openWorkerModal('${w.id}')">${ICONS.edit}</button>
            <button class="btn-icon" onclick="app.deleteWorker('${w.id}')">${ICONS.delete}</button>
          </div>
        </div>
        <div class="item-card-body">
          <div class="metric-item">
            <span class="metric-label">Costo Orario Base</span>
            <span class="metric-val highlight">${fmtMoney(w.hourlyRate)}/h</span>
          </div>
          ${w.phone ? `
            <div style="display:flex; gap:6px; align-items:center;">
              <a href="tel:${w.phone}" class="action-link">${ICONS.phone} Chiama</a>
              <a href="${getWhatsAppUrl(w.phone)}" target="_blank" rel="noopener" class="action-link action-whatsapp">${ICONS.whatsapp} WhatsApp</a>
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  // --- RENDERING ADMIN CLIENTI ---
  renderAdminClients() {
    const list = document.getElementById('admin-clients-list');
    if (!list) return;

    const clients = store.data.clients;
    list.innerHTML = clients.map(c => `
      <div class="item-card">
        <div class="item-card-top">
          <div>
            <div class="item-card-title">${c.name}</div>
            <div class="item-card-sub">
              ${c.phone ? `<span class="sub-icon">${ICONS.phone} ${c.phone}</span>` : ''}
              ${c.notes ? `<span class="sub-icon">${ICONS.note} ${c.notes}</span>` : ''}
            </div>
          </div>
          <div class="item-card-actions">
            <button class="btn-icon" onclick="app.openClientModal('${c.id}')">${ICONS.edit}</button>
            <button class="btn-icon" onclick="app.deleteClient('${c.id}')">${ICONS.delete}</button>
          </div>
        </div>
        ${c.phone ? `
          <div class="item-card-body" style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <a href="tel:${c.phone}" class="action-link">${ICONS.phone} Chiama</a>
            <a href="${getWhatsAppUrl(c.phone)}" target="_blank" rel="noopener" class="action-link action-whatsapp">${ICONS.whatsapp} WhatsApp</a>
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  // --- RENDERING ADMIN CANTIERI ---
  renderAdminSites() {
    const list = document.getElementById('admin-sites-list');
    if (!list) return;

    const sites = store.data.sites;
    list.innerHTML = sites.map(s => {
      const client = store.data.clients.find(c => c.id === s.clientId) || { name: 'Cliente N/D' };
      const cost = store.getSiteCost(s.id);

      const dateRangeText = (s.startDate || s.endDate) ? `
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:3px;" class="sub-icon">
          ${ICONS.calendar} ${s.startDate ? `Inizio: <strong>${fmtDate(s.startDate)}</strong>` : ''}${s.startDate && s.endDate ? ' • ' : ''}${s.endDate ? `Fine: <strong>${fmtDate(s.endDate)}</strong>` : ''}
        </div>
      ` : '';

      const financeSummary = (cost.quoteAmount > 0) ? `
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:3px; display:flex; gap:10px; flex-wrap:wrap;">
          <span>Prev: <strong style="color:#fff;">${fmtMoney(cost.quoteAmount)}</strong></span>
          <span>Incassato: <strong style="color:var(--success);">${fmtMoney(cost.paymentsTotal)}</strong></span>
          <span>Saldo: <strong style="color:var(--warning);">${fmtMoney(cost.balanceRemaining)}</strong></span>
        </div>
      ` : '';

      return `
        <div class="item-card">
          <div class="item-card-top">
            <div>
              <div class="item-card-title">${s.code} - ${s.name}</div>
              <div class="item-card-sub">
                <span class="sub-icon">${ICONS.company} Cliente: <strong>${client.name}</strong></span>
                <span>• Stato: ${s.status}</span>
              </div>
            </div>
            <div class="item-card-actions">
              <button class="btn-icon" onclick="app.openSiteModal('${s.id}')">${ICONS.edit}</button>
              <button class="btn-icon" onclick="app.deleteSite('${s.id}')">${ICONS.delete}</button>
            </div>
          </div>
          <div class="item-card-body">
            <div style="font-size:0.8rem; color:var(--text-muted); width:100%;" class="sub-icon">
              ${ICONS.map} ${s.address || 'Nessun indirizzo'}
            </div>
            ${dateRangeText}
            ${financeSummary}
          </div>
        </div>
      `;
    }).join('');
  }

  // --- RENDERING TIPOLOGIE / CONFIG ---
  renderAdminTypes() {
    const rolesContainer = document.getElementById('tags-roles');
    const catsContainer = document.getElementById('tags-categories');

    if (rolesContainer) {
      rolesContainer.innerHTML = store.data.config.workerRoles.map(role => `
        <span class="tag-item">
          ${role}
          <button class="tag-remove" onclick="app.deleteWorkerRole('${role}')">&times;</button>
        </span>
      `).join('');
    }

    if (catsContainer) {
      catsContainer.innerHTML = store.data.config.expenseCategories.map(cat => `
        <span class="tag-item">
          ${cat}
          <button class="tag-remove" onclick="app.deleteExpenseCategory('${cat}')">&times;</button>
        </span>
      `).join('');
    }
  }

  // --- RENDERING PROFILO DITTA & LOGO ---
  renderCompanyProfile() {
    const company = (store && typeof store.getCompany === 'function') ? store.getCompany() : {};

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    };

    setVal('company-name', company.name);
    setVal('company-short-name', company.shortName);
    setVal('company-logo-url', company.logoUrl);
    setVal('company-vat', company.vatNumber);
    setVal('company-cf', company.fiscalCode);
    setVal('company-rea', company.rea);
    setVal('company-address', company.address);
    setVal('company-phone', company.phone);
    setVal('company-email', company.email);
    setVal('company-pec', company.pec);
    setVal('company-website', company.website);
    setVal('company-iban', company.iban);
    setVal('company-bank-name', company.bankName);
    setVal('company-insurance', company.insurance);
    setVal('company-quote-footer', company.quoteFooterNote);

    const logoPreview = document.getElementById('company-logo-preview');
    if (logoPreview) {
      logoPreview.src = company.logoUrl || 'assets/logo.png?v=7';
    }

    this.updateLetterheadLivePreview();
  }

  updateLetterheadLivePreview() {
    const previewBox = document.getElementById('company-letterhead-live-preview');
    if (!previewBox) return;

    const company = (store && typeof store.getCompany === 'function') ? store.getCompany() : {};
    const logoSrc = company.logoUrl || 'assets/logo.png?v=7';
    const compName = escapeHTML(company.name || 'Impresa Edile');
    const compAddr = escapeHTML(company.address || 'Sede da definire');
    const vatStr = company.vatNumber ? `P.IVA: ${escapeHTML(company.vatNumber)}` : '';
    const cfStr = company.fiscalCode ? ` &bull; C.F.: ${escapeHTML(company.fiscalCode)}` : '';
    const phoneStr = company.phone ? ` &bull; Tel: ${escapeHTML(company.phone)}` : '';
    const emailStr = company.email ? `Email: ${escapeHTML(company.email)}` : '';
    const pecStr = company.pec ? ` &bull; PEC: ${escapeHTML(company.pec)}` : '';
    const webStr = company.website ? ` &bull; ${escapeHTML(company.website)}` : '';
    const ibanStr = company.iban ? `<div style="margin-top:6px; font-size:0.75rem; color:#0284c7; font-weight:600;">IBAN: ${escapeHTML(company.iban)}${company.bankName ? ` (${escapeHTML(company.bankName)})` : ''}</div>` : '';

    previewBox.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:20px; flex-wrap:wrap; border-bottom:2px solid #0284c7; padding-bottom:14px;">
        <div style="display:flex; align-items:center; gap:14px;">
          <img src="${escapeHTML(logoSrc)}" alt="${compName}" style="max-height:56px; max-width:130px; object-fit:contain;" onerror="this.style.display='none'">
          <div>
            <div style="font-size:1.15rem; font-weight:800; color:#0f172a; letter-spacing:-0.02em;">${compName}</div>
            <div style="font-size:0.75rem; color:#475569; margin-top:2px; line-height:1.4;">
              ${compAddr}<br>
              ${vatStr}${cfStr}${phoneStr}<br>
              ${emailStr}${pecStr}${webStr}
            </div>
            ${ibanStr}
          </div>
        </div>
        <div style="text-align:right; font-size:0.72rem; color:#64748b; line-height:1.4;">
          <span style="display:inline-block; padding:3px 8px; background:#e0f2fe; color:#0369a1; border-radius:4px; font-weight:700; text-transform:uppercase; font-size:0.65rem; margin-bottom:4px;">Intestazione Ufficiale</span>
          <div>Documentazione di Cantiere & Contabilità</div>
          <div>Conforme D.Lgs 81/08</div>
        </div>
      </div>
    `;
  }

  handleCompanyLogoUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.showToast('Seleziona un file immagine valido (PNG, JPG, SVG, WebP)', 'error');
      return;
    }

    if (typeof resizeAndCompressImage === 'function') {
      resizeAndCompressImage(file, 400, 400, 0.9).then(dataUrl => {
        const logoUrlInput = document.getElementById('company-logo-url');
        const logoPreview = document.getElementById('company-logo-preview');
        if (logoUrlInput) logoUrlInput.value = dataUrl;
        if (logoPreview) logoPreview.src = dataUrl;
        this.updateLetterheadLivePreview();
        this.showToast('Nuovo logo caricato (clicca Salva per confermare)', 'info');
      }).catch(err => {
        console.error('Errore compressione logo:', err);
        this.showToast('Errore nel caricamento del logo', 'error');
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const logoUrlInput = document.getElementById('company-logo-url');
        const logoPreview = document.getElementById('company-logo-preview');
        if (logoUrlInput) logoUrlInput.value = dataUrl;
        if (logoPreview) logoPreview.src = dataUrl;
        this.updateLetterheadLivePreview();
        this.showToast('Nuovo logo caricato (clicca Salva per confermare)', 'info');
      };
      reader.readAsDataURL(file);
    }
  }

  resetCompanyLogo() {
    const defaultLogo = 'assets/logo.png?v=7';
    const logoUrlInput = document.getElementById('company-logo-url');
    const logoPreview = document.getElementById('company-logo-preview');
    if (logoUrlInput) logoUrlInput.value = defaultLogo;
    if (logoPreview) logoPreview.src = defaultLogo;
    this.updateLetterheadLivePreview();
    this.showToast('Logo reimpostato al default', 'info');
  }

  onCompanyLogoUrlInput(val) {
    const logoPreview = document.getElementById('company-logo-preview');
    if (logoPreview) {
      logoPreview.src = val || 'assets/logo.png?v=7';
    }
    this.updateLetterheadLivePreview();
  }

  saveCompanyProfile(e) {
    if (e && e.preventDefault) e.preventDefault();

    const getVal = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    const updated = {
      name: getVal('company-name') || 'GEEM Costruzioni & Restauri S.r.l.',
      shortName: getVal('company-short-name') || 'GEEM Edilizia',
      logoUrl: getVal('company-logo-url') || 'assets/logo.png?v=7',
      vatNumber: getVal('company-vat'),
      fiscalCode: getVal('company-cf'),
      rea: getVal('company-rea'),
      address: getVal('company-address'),
      phone: getVal('company-phone'),
      email: getVal('company-email'),
      pec: getVal('company-pec'),
      website: getVal('company-website'),
      iban: getVal('company-iban'),
      bankName: getVal('company-bank-name'),
      insurance: getVal('company-insurance'),
      quoteFooterNote: getVal('company-quote-footer')
    };

    if (store && typeof store.updateCompany === 'function') {
      store.updateCompany(updated);
    }

    this.renderCompanyProfile();
    this.showToast('Intestazione aziendale e Logo salvati con successo!', 'success');
  }

  // ==========================================================================
  // Modals & Action Triggers
  // ==========================================================================

  openTimesheetModalForDate(dateStr) {
    this.openTimesheetModal();
    const dateInput = document.getElementById('ts-date');
    if (dateInput && dateStr) {
      dateInput.value = dateStr;
    }
  }

  // --- MODAL ORE ---
  openTimesheetModal(id = null) {
    this.editingTimesheetId = id;
    const title = document.getElementById('modal-ts-title');
    const form = document.getElementById('form-timesheet');
    if (!form) return;

    if (id) {
      title.textContent = 'Modifica Registrazione Ore';
      const item = store.data.timesheets.find(t => t.id === id);
      if (item) {
        document.getElementById('ts-date').value = item.date;
        document.getElementById('ts-worker').value = item.workerId;
        document.getElementById('ts-site').value = item.siteId;
        document.getElementById('ts-hours').value = item.hours;
        document.getElementById('ts-rate').value = item.hourlyRate;
        document.getElementById('ts-notes').value = item.notes || '';
      }
    } else {
      title.textContent = 'Registra Ore Lavoratore';
      form.reset();
      this.initDates();
      document.getElementById('ts-hours').value = 8;
    }

    this.updateTimesheetTotal();
    this.openModal('modal-timesheet');
  }

  updateTimesheetTotal() {
    const hours = parseFloat(document.getElementById('ts-hours').value) || 0;
    const rate = parseFloat(document.getElementById('ts-rate').value) || 0;
    const totalEl = document.getElementById('ts-total-preview');
    if (totalEl) {
      totalEl.textContent = fmtMoney(hours * rate);
    }
  }

  saveTimesheet(e) {
    e.preventDefault();
    const workerId = document.getElementById('ts-worker').value;
    const siteId = document.getElementById('ts-site').value;
    const date = document.getElementById('ts-date').value;
    const hours = parseFloat(document.getElementById('ts-hours').value);
    const hourlyRate = parseFloat(document.getElementById('ts-rate').value);
    const notes = document.getElementById('ts-notes').value;

    if (!workerId || !siteId || !date || isNaN(hours) || hours <= 0) {
      this.showToast('Compila lavoratore, cantiere e ore valide', 'error');
      return;
    }

    if (this.editingTimesheetId) {
      store.updateTimesheet(this.editingTimesheetId, { workerId, siteId, date, hours, hourlyRate, notes });
      this.showToast('Ore aggiornate con successo', 'success');
    } else {
      store.addTimesheet({ workerId, siteId, date, hours, hourlyRate, notes });
      this.showToast('Ore registrate con successo', 'success');
      // Sincronizza la vista del calendario con la data registrata
      this.selectedCalendarDate = date;
    }

    this.closeModal('modal-timesheet');
  }

  deleteTimesheet(id) {
    if (confirm('Sei sicuro di voler eliminare questa registrazione delle ore?')) {
      store.deleteTimesheet(id);
      this.showToast('Registrazione ore eliminata', 'info');
    }
  }

  // --- MODAL SPESE ---
  openExpenseModal(id = null) {
    this.editingExpenseId = id;
    const title = document.getElementById('modal-exp-title');
    const form = document.getElementById('form-expense');
    if (!form) return;

    if (id) {
      title.textContent = 'Modifica Spesa';
      const item = store.data.expenses.find(e => e.id === id);
      if (item) {
        document.getElementById('exp-date').value = item.date;
        document.getElementById('exp-category').value = item.category;
        document.getElementById('exp-site').value = item.siteId;
        document.getElementById('exp-amount').value = item.amount;
        document.getElementById('exp-desc').value = item.description || '';
        document.getElementById('exp-doc').value = item.docNumber || '';
        document.getElementById('exp-notes').value = item.notes || '';
      }
    } else {
      title.textContent = 'Nuova Spesa';
      form.reset();
      this.initDates();
    }

    this.openModal('modal-expense');
  }

  saveExpense(e) {
    e.preventDefault();
    const date = document.getElementById('exp-date').value;
    const category = document.getElementById('exp-category').value;
    const siteId = document.getElementById('exp-site').value;
    const amount = parseFloat(document.getElementById('exp-amount').value);
    const description = document.getElementById('exp-desc').value;
    const docNumber = document.getElementById('exp-doc').value;
    const notes = document.getElementById('exp-notes').value;

    if (!category || !date || isNaN(amount) || amount <= 0) {
      this.showToast('Inserisci categoria, data e un importo valido', 'error');
      return;
    }

    if (this.editingExpenseId) {
      store.updateExpense(this.editingExpenseId, { date, category, siteId, amount, description, docNumber, notes });
      this.showToast('Spesa aggiornata con successo', 'success');
    } else {
      store.addExpense({ date, category, siteId, amount, description, docNumber, notes });
      this.showToast('Spesa registrata con successo', 'success');
    }

    this.closeModal('modal-expense');
  }

  deleteExpense(id) {
    if (confirm('Sei sicuro di voler eliminare questa spesa?')) {
      store.deleteExpense(id);
      this.showToast('Spesa eliminata', 'info');
    }
  }

  // --- MODAL LAVORATORI ---
  openWorkerModal(id = null) {
    this.editingWorkerId = id;
    const title = document.getElementById('modal-worker-title');
    const form = document.getElementById('form-worker');
    if (!form) return;

    if (id) {
      title.textContent = 'Modifica Lavoratore';
      const w = store.data.workers.find(item => item.id === id);
      if (w) {
        document.getElementById('worker-name').value = w.name;
        document.getElementById('worker-role').value = w.role;
        document.getElementById('worker-phone').value = w.phone || '';
        document.getElementById('worker-rate').value = w.hourlyRate || 20;
        document.getElementById('worker-active').checked = !!w.active;
      }
    } else {
      title.textContent = 'Aggiungi Lavoratore';
      form.reset();
      document.getElementById('worker-rate').value = 20;
      document.getElementById('worker-active').checked = true;
    }

    this.openModal('modal-worker');
  }

  saveWorker(e) {
    e.preventDefault();
    const name = document.getElementById('worker-name').value;
    const role = document.getElementById('worker-role').value;
    const phone = document.getElementById('worker-phone').value;
    const hourlyRate = parseFloat(document.getElementById('worker-rate').value) || 20;
    const active = document.getElementById('worker-active').checked;

    if (!name.trim()) {
      this.showToast('Inserisci Nome e Cognome del lavoratore', 'error');
      return;
    }

    if (this.editingWorkerId) {
      store.updateWorker(this.editingWorkerId, { name, role, phone, hourlyRate, active });
      this.showToast('Lavoratore modificato', 'success');
    } else {
      store.addWorker({ name, role, phone, hourlyRate, active });
      this.showToast('Lavoratore aggiunto', 'success');
    }

    this.closeModal('modal-worker');
  }

  deleteWorker(id) {
    if (confirm('Sei sicuro di voler eliminare questo lavoratore?')) {
      store.deleteWorker(id);
      this.showToast('Lavoratore eliminato', 'info');
    }
  }

  // --- MODAL CLIENTI ---
  openClientModal(id = null) {
    this.editingClientId = id;
    const title = document.getElementById('modal-client-title');
    const form = document.getElementById('form-client');
    if (!form) return;

    if (id) {
      title.textContent = 'Modifica Cliente';
      const c = store.data.clients.find(item => item.id === id);
      if (c) {
        document.getElementById('client-name').value = c.name;
        document.getElementById('client-phone').value = c.phone || '';
        document.getElementById('client-notes').value = c.notes || '';
      }
    } else {
      title.textContent = 'Aggiungi Cliente';
      form.reset();
    }

    this.openModal('modal-client');
  }

  saveClient(e) {
    e.preventDefault();
    const name = document.getElementById('client-name').value;
    const phone = document.getElementById('client-phone').value;
    const notes = document.getElementById('client-notes').value;

    if (!name.trim()) {
      this.showToast('Inserisci il nome del cliente o azienda', 'error');
      return;
    }

    if (this.editingClientId) {
      store.updateClient(this.editingClientId, { name, phone, notes });
      this.showToast('Cliente aggiornato', 'success');
    } else {
      store.addClient({ name, phone, notes });
      this.showToast('Cliente aggiunto', 'success');
    }

    this.closeModal('modal-client');
  }

  deleteClient(id) {
    if (confirm('Sei sicuro di voler eliminare questo cliente?')) {
      store.deleteClient(id);
      this.showToast('Cliente eliminato', 'info');
    }
  }

  // ==========================================================================
  // GESTIONE SEZIONE CONTATTI & ANAGRAFICHE
  // ==========================================================================
  savePeopleFilters() {
    try {
      if (typeof localStorage !== 'undefined') {
        const payload = {
          peopleFilter: this.peopleFilter,
          peopleSort: this.peopleSort,
          peopleSearchQuery: this.peopleSearchQuery,
          peopleContactInfo: this.peopleContactInfo,
          peopleStatus: this.peopleStatus,
          peopleCompany: this.peopleCompany
        };
        localStorage.setItem('geem_people_filters', JSON.stringify(payload));
      }
    } catch (e) {
      console.warn('Errore salvataggio filtri contatti in localStorage:', e);
    }
  }

  setPeopleFilter(filter) {
    this.peopleFilter = filter || 'all';
    this.savePeopleFilters();
    this.renderPeople();
  }

  setPeopleSort(sortValue) {
    this.peopleSort = sortValue || 'name_asc';
    this.savePeopleFilters();
    this.renderPeople();
  }

  setPeopleContactInfoFilter(val) {
    this.peopleContactInfo = val || 'all';
    this.savePeopleFilters();
    this.renderPeople();
  }

  setPeopleStatusFilter(val) {
    this.peopleStatus = val || 'all';
    this.savePeopleFilters();
    this.renderPeople();
  }

  setPeopleCompanyFilter(val) {
    this.peopleCompany = val || 'all';
    this.savePeopleFilters();
    this.renderPeople();
  }

  handlePeopleSearch(query) {
    this.peopleSearchQuery = (query || '').trim();
    const clearBtn = document.getElementById('people-search-clear');
    if (clearBtn) {
      clearBtn.style.display = this.peopleSearchQuery ? 'block' : 'none';
    }
    this.savePeopleFilters();
    this.renderPeople();
  }

  clearPeopleSearch() {
    this.peopleSearchQuery = '';
    const input = document.getElementById('people-search-input');
    const clearBtn = document.getElementById('people-search-clear');
    if (input) input.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    this.savePeopleFilters();
    this.renderPeople();
  }

  resetPeopleFilters() {
    this.peopleFilter = 'all';
    this.peopleSort = 'name_asc';
    this.peopleSearchQuery = '';
    this.peopleContactInfo = 'all';
    this.peopleStatus = 'all';
    this.peopleCompany = 'all';

    const searchInput = document.getElementById('people-search-input');
    const clearBtn = document.getElementById('people-search-clear');
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';

    this.savePeopleFilters();
    this.renderPeople();
    this.showToast('Filtri contatti ripristinati', 'info');
  }

  syncPeopleFiltersUI() {
    // Sincronizza chip categoria
    document.querySelectorAll('[data-people-filter]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.peopleFilter === this.peopleFilter);
    });

    // Sincronizza input di ricerca
    const searchInput = document.getElementById('people-search-input');
    if (searchInput && searchInput.value !== this.peopleSearchQuery) {
      searchInput.value = this.peopleSearchQuery || '';
    }
    const clearBtn = document.getElementById('people-search-clear');
    if (clearBtn) {
      clearBtn.style.display = this.peopleSearchQuery ? 'block' : 'none';
    }

    // Sincronizza dropdown ordinamento
    const sortSelect = document.getElementById('filter-people-sort');
    if (sortSelect && sortSelect.value !== this.peopleSort) {
      sortSelect.value = this.peopleSort;
    }

    // Sincronizza dropdown recapiti
    const contactInfoSelect = document.getElementById('filter-people-contact-info');
    if (contactInfoSelect && contactInfoSelect.value !== this.peopleContactInfo) {
      contactInfoSelect.value = this.peopleContactInfo;
    }

    // Sincronizza dropdown stato
    const statusSelect = document.getElementById('filter-people-status');
    if (statusSelect && statusSelect.value !== this.peopleStatus) {
      statusSelect.value = this.peopleStatus;
    }

    // Sincronizza dropdown azienda
    const companySelect = document.getElementById('filter-people-company');
    if (companySelect && companySelect.value !== this.peopleCompany) {
      companySelect.value = this.peopleCompany;
    }
  }

  renderPeople() {
    const list = document.getElementById('people-cards-list');
    if (!list) return;

    this.syncPeopleFiltersUI();

    const allPeople = store.getAllPeople ? store.getAllPeople() : [];

    // Precalcolo cantieri assegnati/associati per ciascun contatto
    const sites = store.data.sites || [];
    const timesheets = store.data.timesheets || [];
    allPeople.forEach(p => {
      if (p.source === 'client') {
        p._computedSitesCount = sites.filter(s => s.clientId === p.id).length;
      } else if (p.source === 'worker') {
        const workerSiteIds = new Set(timesheets.filter(t => t.workerId === p.id).map(t => t.siteId));
        p._computedSitesCount = workerSiteIds.size;
      } else {
        p._computedSitesCount = p.sitesCount || 0;
      }
    });

    // Aggiornamento contatori per ciascuna tipologia/filtro
    const counts = {
      all: allPeople.length,
      dipendente: allPeople.filter(p => p.type === 'dipendente' || p.source === 'worker').length,
      cliente: allPeople.filter(p => p.type === 'cliente' || p.source === 'client').length,
      tecnico: allPeople.filter(p => p.type === 'tecnico').length,
      commercialista: allPeople.filter(p => p.type === 'commercialista').length,
      fornitore: allPeople.filter(p => p.type === 'fornitore').length,
      subappaltatore: allPeople.filter(p => p.type === 'subappaltatore').length,
      sicurezza: allPeople.filter(p => p.type === 'sicurezza').length,
      altro: allPeople.filter(p => p.type === 'altro' || p.type === 'collaboratore').length
    };

    for (const [key, count] of Object.entries(counts)) {
      const el = document.getElementById(`people-count-${key}`);
      if (el) el.textContent = count;
    }

    // 1. Filtraggio per tipologia
    let filtered = allPeople;
    if (this.peopleFilter !== 'all') {
      if (this.peopleFilter === 'altro') {
        filtered = filtered.filter(p => p.type === 'altro' || p.type === 'collaboratore');
      } else if (this.peopleFilter === 'dipendente') {
        filtered = filtered.filter(p => p.type === 'dipendente' || p.source === 'worker');
      } else if (this.peopleFilter === 'cliente') {
        filtered = filtered.filter(p => p.type === 'cliente' || p.source === 'client');
      } else {
        filtered = filtered.filter(p => p.type === this.peopleFilter);
      }
    }

    // 2. Filtraggio per stringa di ricerca
    if (this.peopleSearchQuery) {
      const q = this.peopleSearchQuery.toLowerCase();
      filtered = filtered.filter(p => {
        return (p.name && p.name.toLowerCase().includes(q)) ||
               (p.role && p.role.toLowerCase().includes(q)) ||
               (p.company && p.company.toLowerCase().includes(q)) ||
               (p.phone && p.phone.toLowerCase().includes(q)) ||
               (p.email && p.email.toLowerCase().includes(q)) ||
               (p.notes && p.notes.toLowerCase().includes(q));
      });
    }

    // 3. Filtro Recapiti & Comunicazione
    if (this.peopleContactInfo === 'has_phone') {
      filtered = filtered.filter(p => Boolean(p.phone && p.phone.trim()));
    } else if (this.peopleContactInfo === 'has_email') {
      filtered = filtered.filter(p => Boolean(p.email && p.email.trim()));
    } else if (this.peopleContactInfo === 'no_phone') {
      filtered = filtered.filter(p => !p.phone || !p.phone.trim());
    }

    // 4. Filtro Stato Operativo
    if (this.peopleStatus === 'active') {
      filtered = filtered.filter(p => p.active !== false);
    } else if (this.peopleStatus === 'inactive') {
      filtered = filtered.filter(p => p.active === false);
    }

    // 5. Filtro Azienda / Ditta
    if (this.peopleCompany === 'has_company') {
      filtered = filtered.filter(p => Boolean(p.company && p.company.trim()));
    } else if (this.peopleCompany === 'no_company') {
      filtered = filtered.filter(p => !p.company || !p.company.trim());
    }

    // 6. Ordinamento
    const sort = this.peopleSort || 'name_asc';
    filtered.sort((a, b) => {
      if (sort === 'name_desc') {
        return (b.name || '').localeCompare(a.name || '', 'it', { sensitivity: 'base' });
      }
      if (sort === 'company_asc') {
        const compA = (a.company || '').trim();
        const compB = (b.company || '').trim();
        if (compA && !compB) return -1;
        if (!compA && compB) return 1;
        const compDiff = compA.localeCompare(compB, 'it', { sensitivity: 'base' });
        if (compDiff !== 0) return compDiff;
        return (a.name || '').localeCompare(b.name || '', 'it', { sensitivity: 'base' });
      }
      if (sort === 'type_asc') {
        const typeA = a.typeLabel || a.type || '';
        const typeB = b.typeLabel || b.type || '';
        const typeDiff = typeA.localeCompare(typeB, 'it', { sensitivity: 'base' });
        if (typeDiff !== 0) return typeDiff;
        return (a.name || '').localeCompare(b.name || '', 'it', { sensitivity: 'base' });
      }
      if (sort === 'rate_desc') {
        const rateA = a.hourlyRate != null ? a.hourlyRate : -1;
        const rateB = b.hourlyRate != null ? b.hourlyRate : -1;
        if (rateB !== rateA) return rateB - rateA;
        return (a.name || '').localeCompare(b.name || '', 'it', { sensitivity: 'base' });
      }
      if (sort === 'rate_asc') {
        const rateA = a.hourlyRate != null ? a.hourlyRate : 999999;
        const rateB = b.hourlyRate != null ? b.hourlyRate : 999999;
        if (rateA !== rateB) return rateA - rateB;
        return (a.name || '').localeCompare(b.name || '', 'it', { sensitivity: 'base' });
      }
      if (sort === 'sites_desc') {
        const sitesA = a._computedSitesCount || 0;
        const sitesB = b._computedSitesCount || 0;
        if (sitesB !== sitesA) return sitesB - sitesA;
        return (a.name || '').localeCompare(b.name || '', 'it', { sensitivity: 'base' });
      }
      // Predefinito: name_asc
      return (a.name || '').localeCompare(b.name || '', 'it', { sensitivity: 'base' });
    });

    // Aggiornamento indicatore mostrati
    const displayedCountEl = document.getElementById('people-displayed-count');
    if (displayedCountEl) displayedCountEl.textContent = filtered.length;

    if (filtered.length === 0) {
      list.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; padding: 44px 16px;">
          <svg viewBox="0 0 24 24" style="width:44px; height:44px; stroke:var(--text-dim); fill:none; stroke-width:1.5; margin-bottom:10px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <h3 style="font-size:0.98rem; font-weight:700;">Nessun contatto trovato</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:14px;">
            ${this.peopleSearchQuery ? `Nessun risultato trovato per "${this.peopleSearchQuery}"` : 'Nessun contatto corrisponde ai filtri selezionati.'}
          </p>
          <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
            <button class="btn btn-secondary btn-sm" onclick="app.resetPeopleFilters()">Ripristina filtri</button>
            <button class="btn btn-primary btn-sm" onclick="app.openPersonModal()">+ Nuovo Contatto</button>
          </div>
        </div>
      `;
      return;
    }

    // Mappatura gradienti avatar
    const typeGradients = {
      dipendente: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
      cliente: 'linear-gradient(135deg, #047857, #10b981)',
      commercialista: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
      tecnico: 'linear-gradient(135deg, #0f766e, #14b8a6)',
      fornitore: 'linear-gradient(135deg, #c2410c, #f97316)',
      subappaltatore: 'linear-gradient(135deg, #b45309, #f59e0b)',
      sicurezza: 'linear-gradient(135deg, #be123c, #f43f5e)',
      collaboratore: 'linear-gradient(135deg, #334155, #64748b)',
      altro: 'linear-gradient(135deg, #334155, #64748b)'
    };

    const getInitials = (name) => {
      if (!name) return '??';
      const parts = name.trim().split(/\s+/);
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    list.innerHTML = filtered.map(person => {
      const gradient = typeGradients[person.type] || typeGradients.altro;
      const initials = getInitials(person.name);
      const avatarHtml = person.avatar 
        ? `<img src="${person.avatar}" alt="${person.name}" class="person-avatar-img">`
        : `<span>${initials}</span>`;

      return `
        <div class="person-card" onclick="app.openPersonDetailModal('${person.id}')" title="Clicca per visualizzare dettagli">
          <div class="person-card-identity">
            <div class="person-avatar" style="${!person.avatar ? `background:${gradient};` : ''}">
              ${avatarHtml}
            </div>
            <div class="person-info">
              <div class="person-name" title="${person.name}">${person.name}</div>
            </div>
          </div>

          <div class="person-card-actions">
            ${person.phone ? `
              <a href="tel:${person.phone}" class="person-card-btn person-card-btn-call" onclick="event.stopPropagation()" title="Chiama">
                ${ICONS.phone} Chiama
              </a>
              <a href="${getWhatsAppUrl(person.phone)}" target="_blank" rel="noopener" class="person-card-btn person-card-btn-whatsapp" onclick="event.stopPropagation()" title="Scrivi su WhatsApp">
                ${ICONS.whatsapp} WhatsApp
              </a>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  // --- GESTIONE FOTO PROFILO PERSONA ---
  async handlePersonPhotoUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.showToast('Seleziona un file immagine valido', 'error');
      return;
    }

    try {
      // Comprimi e ridimensiona l'immagine (max 256x256 WebP/JPEG)
      const compressedDataUrl = await this.resizeAndCompressImage(file, 256, 256, 0.85);
      this.currentPersonAvatar = compressedDataUrl;
      this.renderPersonPhotoPreview();
      this.showToast('Foto profilo caricata', 'success');
    } catch (err) {
      console.error('Errore compressione foto:', err);
      this.showToast('Impossibile elaborare l\'immagine', 'error');
    }
  }

  removePersonPhoto() {
    this.currentPersonAvatar = null;
    const fileInput = document.getElementById('person-photo-input');
    if (fileInput) fileInput.value = '';
    this.renderPersonPhotoPreview();
    this.showToast('Foto profilo rimossa', 'info');
  }

  renderPersonPhotoPreview() {
    const preview = document.getElementById('person-photo-preview');
    const removeBtn = document.getElementById('person-photo-remove-btn');
    if (!preview) return;

    if (this.currentPersonAvatar) {
      preview.innerHTML = `<img src="${this.currentPersonAvatar}" class="person-avatar-img" alt="Anteprima">`;
      preview.style.border = '2px solid var(--primary)';
      if (removeBtn) removeBtn.style.display = 'inline-block';
    } else {
      preview.innerHTML = `<span>+</span>`;
      preview.style.border = '1px dashed var(--border-subtle)';
      if (removeBtn) removeBtn.style.display = 'none';
    }
  }

  resizeAndCompressImage(file, maxWidth = 256, maxHeight = 256, quality = 0.85) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Supporta WebP se supportato, altrimenti fallback JPEG
          let dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl || dataUrl.indexOf('image/webp') === -1) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          resolve(dataUrl);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // --- MODAL DETTAGLIO PERSONA ---
  openPersonDetailModal(personId) {
    if (!personId) return;
    const allPeople = store.getAllPeople ? store.getAllPeople() : [];
    const person = allPeople.find(p => p.id === personId);
    if (!person) {
      this.showToast('Persona non trovata', 'error');
      return;
    }

    this.activeDetailPersonId = personId;

    const modalTitle = document.getElementById('person-detail-title');
    const modalSub = document.getElementById('person-detail-sub');
    const editBtn = document.getElementById('person-detail-edit-btn');
    const deleteBtn = document.getElementById('person-detail-delete-btn');
    const quickActionBtn = document.getElementById('person-detail-quick-action');
    const body = document.getElementById('person-detail-body');

    if (modalTitle) modalTitle.textContent = person.name;
    if (modalSub) modalSub.textContent = person.typeLabel || person.type;

    const handleEdit = () => {
      this.closeModal('modal-person-detail');
      this.openPersonModal(personId);
    };

    const handleDelete = () => {
      this.closeModal('modal-person-detail');
      this.deletePersonById(personId);
    };

    if (editBtn) editBtn.onclick = handleEdit;
    if (quickActionBtn) quickActionBtn.onclick = handleEdit;
    if (deleteBtn) deleteBtn.onclick = handleDelete;

    // Gradienti avatar initials
    const typeGradients = {
      dipendente: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
      cliente: 'linear-gradient(135deg, #047857, #10b981)',
      commercialista: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
      tecnico: 'linear-gradient(135deg, #0f766e, #14b8a6)',
      fornitore: 'linear-gradient(135deg, #c2410c, #f97316)',
      subappaltatore: 'linear-gradient(135deg, #b45309, #f59e0b)',
      sicurezza: 'linear-gradient(135deg, #be123c, #f43f5e)',
      collaboratore: 'linear-gradient(135deg, #334155, #64748b)',
      altro: 'linear-gradient(135deg, #334155, #64748b)'
    };
    const gradient = typeGradients[person.type] || typeGradients.altro;
    const parts = (person.name || '').trim().split(/\s+/);
    const initials = parts.length === 1 ? parts[0].substring(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();

    const avatarHtml = person.avatar 
      ? `<img src="${person.avatar}" alt="${person.name}" class="person-avatar-img">`
      : `<span>${initials}</span>`;

    if (body) {
      body.innerHTML = `
        <div class="person-detail-hero">
          <div class="person-detail-avatar" style="${!person.avatar ? `background:${gradient};` : ''}">
            ${avatarHtml}
          </div>
          <div style="flex:1; min-width:0;">
            <div class="person-detail-name">${person.name}</div>
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:6px;">
              <span class="item-badge badge-type-${person.type}">
                ${person.typeLabel || person.type}
              </span>
              ${!person.active ? '<span class="item-badge badge-red">Inattivo</span>' : '<span class="item-badge badge-green">Attivo</span>'}
            </div>
            ${person.company ? `<div style="font-size:0.82rem; color:var(--text-muted); font-weight:600;">${person.company}</div>` : ''}
          </div>
        </div>

        ${person.phone ? `
          <div class="person-detail-section">
            <div class="person-detail-section-title">
              ${ICONS.phone} Contatto Telefonico Rapido
            </div>
            <div style="font-size:0.95rem; font-weight:700; color:#fff; margin-bottom:8px;">
              ${person.phone}
            </div>
            <div class="person-detail-actions">
              <a href="tel:${person.phone}" class="btn btn-secondary btn-sm" style="color:var(--info); border-color:rgba(56,189,248,0.4); text-decoration:none;">
                ${ICONS.phone} Chiama
              </a>
              <a href="${getWhatsAppUrl(person.phone)}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm" style="color:#25d366; border-color:rgba(37,211,102,0.4); text-decoration:none;">
                ${ICONS.whatsapp} WhatsApp
              </a>
            </div>
          </div>
        ` : ''}

        <div class="person-detail-section">
          <div class="person-detail-section-title">
            ${ICONS.user} Dati Anagrafici & Profilo
          </div>
          <div class="person-detail-grid">
            <div class="person-detail-field">
              <span class="person-detail-label">Ruolo / Mansione</span>
              <span class="person-detail-value">${person.role || '—'}</span>
            </div>
            <div class="person-detail-field">
              <span class="person-detail-label">Azienda / Studio</span>
              <span class="person-detail-value">${person.company || '—'}</span>
            </div>
            <div class="person-detail-field">
              <span class="person-detail-label">Email</span>
              <span class="person-detail-value">
                ${person.email ? `<a href="mailto:${person.email}" style="color:var(--primary); text-decoration:none;">${person.email}</a>` : '—'}
              </span>
            </div>
            <div class="person-detail-field">
              <span class="person-detail-label">Costo Orario</span>
              <span class="person-detail-value" style="color:var(--primary);">
                ${person.hourlyRate ? `${fmtMoney(person.hourlyRate)} / ora` : '—'}
              </span>
            </div>
            <div class="person-detail-field">
              <span class="person-detail-label">Cantieri Assegnati / Associati</span>
              <span class="person-detail-value">
                ${person.sitesCount !== undefined && person.sitesCount > 0 ? `${person.sitesCount} cantieri` : 'Nessuno'}
              </span>
            </div>
            <div class="person-detail-field">
              <span class="person-detail-label">Stato Operativo</span>
              <span class="person-detail-value">
                ${person.active !== false ? 'Attivo' : 'Non Attivo / Archiviato'}
              </span>
            </div>
          </div>
        </div>

        ${person.notes ? `
          <div class="person-detail-section">
            <div class="person-detail-section-title">
              ${ICONS.note} Note & Dettagli
            </div>
            <div style="font-size:0.84rem; color:var(--text-muted); line-height:1.5; white-space:pre-wrap;">
              ${person.notes}
            </div>
          </div>
        ` : ''}
      `;
    }

    this.openModal('modal-person-detail');
  }

  // --- MODAL CONTATTI & ANAGRAFICHE ---
  openPersonModal(id = null) {
    this.editingPersonId = id;
    const title = document.getElementById('modal-person-title');
    const form = document.getElementById('form-person');
    if (!form) return;

    if (id) {
      title.textContent = 'Modifica Contatto';
      const allPeople = store.getAllPeople ? store.getAllPeople() : [];
      const p = allPeople.find(item => item.id === id);
      if (p) {
        document.getElementById('person-type').value = p.type || 'dipendente';
        document.getElementById('person-name').value = p.name || '';
        document.getElementById('person-role').value = p.role || '';
        document.getElementById('person-company').value = p.company || '';
        document.getElementById('person-phone').value = p.phone || '';
        document.getElementById('person-email').value = p.email || '';
        document.getElementById('person-rate').value = p.hourlyRate || '';
        document.getElementById('person-notes').value = p.notes || '';
        document.getElementById('person-active').checked = p.active !== false;
        this.currentPersonAvatar = p.avatar || null;
      }
    } else {
      title.textContent = 'Nuovo Contatto';
      form.reset();
      const defaultType = (this.peopleFilter !== 'all') ? this.peopleFilter : 'dipendente';
      document.getElementById('person-type').value = defaultType;
      document.getElementById('person-active').checked = true;
      this.currentPersonAvatar = null;
    }

    this.renderPersonPhotoPreview();
    this.handlePersonTypeChange();
    this.openModal('modal-person');
  }

  handlePersonTypeChange() {
    const typeSelect = document.getElementById('person-type');
    if (!typeSelect) return;
    const type = typeSelect.value;
    const rateGroup = document.getElementById('person-rate-group');
    const roleInput = document.getElementById('person-role');
    const companyInput = document.getElementById('person-company');

    // Mostra tariffa oraria solo per ruoli operativi
    if (rateGroup) {
      rateGroup.style.display = (type === 'dipendente' || type === 'subappaltatore' || type === 'tecnico') ? 'block' : 'none';
    }

    if (roleInput) {
      if (type === 'dipendente') roleInput.placeholder = 'Es. Capocantiere, Muratore, Manovale';
      else if (type === 'cliente') roleInput.placeholder = 'Es. Committente, Proprietario, Amministratore';
      else if (type === 'commercialista') roleInput.placeholder = 'Es. Dottore Commercialista, Buste Paga';
      else if (type === 'tecnico') roleInput.placeholder = 'Es. Geometra, Architetto, Strutturista, DL';
      else if (type === 'subappaltatore') roleInput.placeholder = 'Es. Idraulico, Elettricista, Cartongessi';
      else if (type === 'fornitore') roleInput.placeholder = 'Es. Magazzino Edile, Calcestruzzo, Noleggi';
      else if (type === 'sicurezza') roleInput.placeholder = 'Es. RSPP, Coordinatore Sicurezza CSP/CSE';
      else roleInput.placeholder = 'Es. Mansione o Ruolo';
    }

    if (companyInput) {
      if (type === 'commercialista') companyInput.placeholder = 'Es. Studio Tributario Associato';
      else if (type === 'tecnico') companyInput.placeholder = 'Es. Studio Tecnico Architettura';
      else if (type === 'fornitore') companyInput.placeholder = 'Es. EdilMarket Forniture Srl';
      else if (type === 'subappaltatore') companyInput.placeholder = 'Es. Termoidraulica Rossi Snc';
      else companyInput.placeholder = 'Es. Ragione Sociale o Ditta';
    }
  }

  handlePersonSubmit(e) {
    e.preventDefault();
    const type = document.getElementById('person-type').value;
    const name = document.getElementById('person-name').value.trim();
    const role = document.getElementById('person-role').value.trim();
    const company = document.getElementById('person-company').value.trim();
    const phone = document.getElementById('person-phone').value.trim();
    const email = document.getElementById('person-email').value.trim();
    const rateVal = document.getElementById('person-rate').value;
    const hourlyRate = rateVal ? parseFloat(rateVal) : null;
    const notes = document.getElementById('person-notes').value.trim();
    const active = document.getElementById('person-active').checked;

    if (!name) {
      this.showToast('Inserisci il nome o la ragione sociale', 'error');
      return;
    }

    const id = this.editingPersonId;
    const avatar = this.currentPersonAvatar;

    if (id) {
      // Modifica persona esistente
      if (id.startsWith('w_')) {
        if (type === 'dipendente') {
          store.updateWorker(id, { name, role: role || 'Operaio Edile', company, phone, email, hourlyRate: hourlyRate || 20, notes, active, avatar });
        } else {
          // Passaggio da lavoratore ad altra tipologia
          store.deleteWorker(id);
          if (type === 'cliente') {
            store.addClient({ name, company, phone, email, notes, avatar });
          } else {
            store.addPerson({ name, type, role, company, phone, email, hourlyRate, notes, active, avatar });
          }
        }
      } else if (id.startsWith('c_')) {
        if (type === 'cliente') {
          store.updateClient(id, { name, company, phone, email, notes, avatar });
        } else {
          // Passaggio da cliente ad altra tipologia
          store.deleteClient(id);
          if (type === 'dipendente') {
            store.addWorker({ name, role: role || 'Operaio Edile', company, phone, email, hourlyRate: hourlyRate || 20, notes, active, avatar });
          } else {
            store.addPerson({ name, type, role, company, phone, email, hourlyRate, notes, active, avatar });
          }
        }
      } else {
        // ID generico persona (p_)
        if (type === 'dipendente') {
          store.deletePerson(id);
          store.addWorker({ name, role: role || 'Operaio Edile', company, phone, email, hourlyRate: hourlyRate || 20, notes, active, avatar });
        } else if (type === 'cliente') {
          store.deletePerson(id);
          store.addClient({ name, company, phone, email, notes, avatar });
        } else {
          store.updatePerson(id, { name, type, role, company, phone, email, hourlyRate, notes, active, avatar });
        }
      }
      this.showToast('Contatto aggiornato con successo', 'success');
    } else {
      // Creazione nuova persona
      if (type === 'dipendente') {
        store.addWorker({ name, role: role || 'Operaio Edile', company, phone, email, hourlyRate: hourlyRate || 20, notes, active, avatar });
        this.showToast('Lavoratore aggiunto all\'organico', 'success');
      } else if (type === 'cliente') {
        store.addClient({ name, company, phone, email, notes, avatar });
        this.showToast('Cliente aggiunto con successo', 'success');
      } else {
        store.addPerson({ name, type, role, company, phone, email, hourlyRate, notes, active, avatar });
        this.showToast('Nuovo contatto registrato con successo', 'success');
      }
    }

    this.closeModal('modal-person');
    this.renderPeople();
  }

  deletePersonById(id) {
    if (!id) return;
    const allPeople = store.getAllPeople ? store.getAllPeople() : [];
    const person = allPeople.find(p => p.id === id);
    const name = person ? person.name : 'questo contatto';

    if (confirm(`Sei sicuro di voler eliminare "${name}" dai contatti?`)) {
      if (id.startsWith('w_')) {
        store.deleteWorker(id);
      } else if (id.startsWith('c_')) {
        store.deleteClient(id);
      } else {
        store.deletePerson(id);
      }
      this.showToast('Contatto rimosso con successo', 'info');
      this.renderPeople();
    }
  }

  // ==========================================================================
  // FILTRI, ORDINAMENTO & GESTIONE SCHEDA LUOGHI
  // ==========================================================================
  savePlaceFilters() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('geem_places_filters', JSON.stringify({
          placeFilter: this.placeFilter,
          placeSort: this.placeSort,
          placeSource: this.placeSource,
          placeStatus: this.placeStatus,
          placeContact: this.placeContact,
          placeSearchQuery: this.placeSearchQuery
        }));
      }
    } catch (e) {
      console.warn('Errore salvataggio filtri luoghi:', e);
    }
  }

  setPlaceFilter(filter) {
    this.placeFilter = filter || 'all';
    this.savePlaceFilters();
    this.renderPlaces();
  }

  setPlaceSort(sortValue) {
    this.placeSort = sortValue || 'name_asc';
    this.savePlaceFilters();
    this.renderPlaces();
  }

  setPlaceSourceFilter(val) {
    this.placeSource = val || 'all';
    this.savePlaceFilters();
    this.renderPlaces();
  }

  setPlaceStatusFilter(val) {
    this.placeStatus = val || 'all';
    this.savePlaceFilters();
    this.renderPlaces();
  }

  setPlaceContactFilter(val) {
    this.placeContact = val || 'all';
    this.savePlaceFilters();
    this.renderPlaces();
  }

  handlePlaceSearch(query) {
    this.placeSearchQuery = (query || '').trim();
    const clearBtn = document.getElementById('places-search-clear');
    if (clearBtn) {
      clearBtn.style.display = this.placeSearchQuery ? 'block' : 'none';
    }
    this.savePlaceFilters();
    this.renderPlaces();
  }

  clearPlaceSearch() {
    this.placeSearchQuery = '';
    const input = document.getElementById('places-search-input');
    const clearBtn = document.getElementById('places-search-clear');
    if (input) input.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    this.savePlaceFilters();
    this.renderPlaces();
  }

  resetPlaceFilters() {
    this.placeFilter = 'all';
    this.placeSort = 'name_asc';
    this.placeSource = 'all';
    this.placeStatus = 'all';
    this.placeContact = 'all';
    this.placeSearchQuery = '';

    const searchInput = document.getElementById('places-search-input');
    const clearBtn = document.getElementById('places-search-clear');
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';

    this.savePlaceFilters();
    this.renderPlaces();
    this.showToast('Filtri luoghi ripristinati', 'info');
  }

  syncPlaceFiltersUI() {
    // Sincronizza chip categoria
    document.querySelectorAll('.filter-chip[data-place-filter]').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.placeFilter === this.placeFilter);
    });

    // Sincronizza select ordinamento
    const sortSelect = document.getElementById('filter-places-sort');
    if (sortSelect && sortSelect.value !== this.placeSort) {
      sortSelect.value = this.placeSort;
    }

    // Sincronizza select origine
    const sourceSelect = document.getElementById('filter-places-source');
    if (sourceSelect && sourceSelect.value !== this.placeSource) {
      sourceSelect.value = this.placeSource;
    }

    // Sincronizza select stato
    const statusSelect = document.getElementById('filter-places-status');
    if (statusSelect && statusSelect.value !== this.placeStatus) {
      statusSelect.value = this.placeStatus;
    }

    // Sincronizza select recapito telefonico
    const contactSelect = document.getElementById('filter-places-contact');
    if (contactSelect && contactSelect.value !== this.placeContact) {
      contactSelect.value = this.placeContact;
    }

    // Sincronizza input ricerca
    const searchInput = document.getElementById('places-search-input');
    const clearBtn = document.getElementById('places-search-clear');
    if (searchInput && searchInput.value !== this.placeSearchQuery) {
      searchInput.value = this.placeSearchQuery;
    }
    if (clearBtn) {
      clearBtn.style.display = this.placeSearchQuery ? 'block' : 'none';
    }
  }

  // --- NAVIGAZIONE & INDICAZIONI MAPPE MULTI-PIATTAFORMA ---
  getDirectionsUrl(address) {
    if (!address || !address.trim()) return '#';
    const clean = address.trim();
    const encoded = encodeURIComponent(clean);
    const ua = (typeof navigator !== 'undefined' && (navigator.userAgent || navigator.vendor || window.opera)) || '';
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua) || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua) && (typeof screen !== 'undefined' && screen.width <= 1024));

    if (isAndroid) {
      // Android: geo:0,0?q= apre l'app chooser di sistema o l'app preferita (Google Maps, Waze, Petal Maps, ecc.)
      return `geo:0,0?q=${encoded}`;
    } else if (isIOS) {
      // iOS: Apple Maps nativo
      return `https://maps.apple.com/?daddr=${encoded}&dirflg=d`;
    } else {
      // Desktop / PC: Google Maps in una nuova scheda del browser
      return `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
    }
  }

  handleDirectionsClick(event, address) {
    if (event) {
      event.stopPropagation();
    }
    const clean = (address || '').trim();
    if (!clean) {
      if (event) event.preventDefault();
      this.showToast('Nessun indirizzo specificato per questo luogo', 'warning');
      return;
    }

    const ua = (typeof navigator !== 'undefined' && (navigator.userAgent || navigator.vendor || window.opera)) || '';
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua) || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua) && (typeof screen !== 'undefined' && screen.width <= 1024));
    const encoded = encodeURIComponent(clean);

    if (isAndroid) {
      // Su smartphone Android: avvia intent geo: per far scegliere l'app di navigazione desiderata
      if (event) event.preventDefault();
      window.location.href = `geo:0,0?q=${encoded}`;
    } else if (isIOS) {
      // Su iPhone/iPad: apre direttamente Apple Maps per navigazione
      if (event) event.preventDefault();
      window.open(`https://maps.apple.com/?daddr=${encoded}&dirflg=d`, '_blank');
    } else {
      // Su PC / Desktop: apre Google Maps con calcolo percorso in nuova scheda
      if (event) event.preventDefault();
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encoded}`, '_blank', 'noopener,noreferrer');
    }
  }

  // --- RENDER CARD LUOGHI ---
  renderPlaces() {
    const list = document.getElementById('places-cards-list');
    if (!list) return;

    this.syncPlaceFiltersUI();

    const allPlaces = store.getAllPlaces ? store.getAllPlaces() : [];

    // Aggiornamento contatori per ciascuna tipologia/filtro
    const counts = {
      all: allPlaces.length,
      cantiere: allPlaces.filter(p => p.type === 'cantiere').length,
      discarica: allPlaces.filter(p => p.type === 'discarica').length,
      deposito: allPlaces.filter(p => p.type === 'deposito').length,
      fornitore: allPlaces.filter(p => p.type === 'fornitore').length,
      studio: allPlaces.filter(p => p.type === 'studio').length,
      ufficio: allPlaces.filter(p => p.type === 'ufficio').length,
      altro: allPlaces.filter(p => p.type === 'altro').length
    };

    for (const [key, count] of Object.entries(counts)) {
      const el = document.getElementById(`places-count-${key}`);
      if (el) el.textContent = count;
    }

    // 1. Filtraggio per tipologia
    let filtered = allPlaces;
    if (this.placeFilter !== 'all') {
      filtered = filtered.filter(p => p.type === this.placeFilter);
    }

    // 2. Filtraggio per stringa di ricerca
    if (this.placeSearchQuery) {
      const q = this.placeSearchQuery.toLowerCase();
      filtered = filtered.filter(p => {
        return (p.name && p.name.toLowerCase().includes(q)) ||
               (p.address && p.address.toLowerCase().includes(q)) ||
               (p.typeLabel && p.typeLabel.toLowerCase().includes(q)) ||
               (p.phone && p.phone.toLowerCase().includes(q)) ||
               (p.notes && p.notes.toLowerCase().includes(q)) ||
               (p.hours && p.hours.toLowerCase().includes(q));
      });
    }

    // 3. Filtro Origine Luogo
    if (this.placeSource === 'cantieri') {
      filtered = filtered.filter(p => p.source === 'site');
    } else if (this.placeSource === 'custom') {
      filtered = filtered.filter(p => p.source === 'place');
    }

    // 4. Filtro Stato Operativo
    if (this.placeStatus === 'active') {
      filtered = filtered.filter(p => p.active !== false);
    } else if (this.placeStatus === 'inactive') {
      filtered = filtered.filter(p => p.active === false);
    }

    // 5. Filtro Recapito Telefonico
    if (this.placeContact === 'has_phone') {
      filtered = filtered.filter(p => Boolean(p.phone && p.phone.trim()));
    } else if (this.placeContact === 'no_phone') {
      filtered = filtered.filter(p => !p.phone || !p.phone.trim());
    }

    // 6. Ordinamento
    const sort = this.placeSort || 'name_asc';
    filtered.sort((a, b) => {
      if (sort === 'name_desc') {
        return (b.name || '').localeCompare(a.name || '', 'it', { sensitivity: 'base' });
      }
      if (sort === 'type_asc') {
        const typeA = a.typeLabel || a.type || '';
        const typeB = b.typeLabel || b.type || '';
        const typeDiff = typeA.localeCompare(typeB, 'it', { sensitivity: 'base' });
        if (typeDiff !== 0) return typeDiff;
        return (a.name || '').localeCompare(b.name || '', 'it', { sensitivity: 'base' });
      }
      if (sort === 'address_asc') {
        const addrA = (a.address || '').trim();
        const addrB = (b.address || '').trim();
        if (addrA && !addrB) return -1;
        if (!addrA && addrB) return 1;
        const addrDiff = addrA.localeCompare(addrB, 'it', { sensitivity: 'base' });
        if (addrDiff !== 0) return addrDiff;
        return (a.name || '').localeCompare(b.name || '', 'it', { sensitivity: 'base' });
      }
      // Predefinito: name_asc
      return (a.name || '').localeCompare(b.name || '', 'it', { sensitivity: 'base' });
    });

    // Aggiornamento indicatore mostrati
    const displayedCountEl = document.getElementById('places-displayed-count');
    if (displayedCountEl) displayedCountEl.textContent = filtered.length;

    if (filtered.length === 0) {
      list.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; padding: 44px 16px;">
          <svg viewBox="0 0 24 24" style="width:44px; height:44px; stroke:var(--text-dim); fill:none; stroke-width:1.5; margin-bottom:10px;"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
          <h3 style="font-size:0.98rem; font-weight:700;">Nessun luogo trovato</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:14px;">
            ${this.placeSearchQuery ? `Nessun risultato trovato per "${this.placeSearchQuery}"` : 'Nessun luogo corrisponde ai filtri selezionati.'}
          </p>
          <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap;">
            <button class="btn btn-secondary btn-sm" onclick="app.resetPlaceFilters()">Ripristina filtri</button>
            <button class="btn btn-primary btn-sm" onclick="app.openPlaceModal()">+ Nuovo Luogo</button>
          </div>
        </div>
      `;
      return;
    }

    list.innerHTML = filtered.map(place => {
      const gradient = PLACE_GRADIENTS[place.type] || PLACE_GRADIENTS.altro;
      const icon = PLACE_ICONS[place.type] || PLACE_ICONS.altro;
      const directionsUrl = this.getDirectionsUrl(place.address);
      const escapedAddress = (place.address || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');

      return `
        <div class="place-card" onclick="app.openPlaceDetailModal('${place.id}')" title="Clicca per visualizzare dettagli">
          <div class="place-card-identity">
            <div class="place-avatar" style="background:${gradient};">
              ${icon}
            </div>
            <div class="place-info">
              <div class="place-name" title="${place.name}">${place.name}</div>
              <div class="place-address" title="${place.address || 'Indirizzo non inserito'}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>${place.address || 'Indirizzo non specificato'}</span>
              </div>
            </div>
          </div>

          <div class="place-card-actions">
            <a href="${directionsUrl}" target="_blank" rel="noopener" class="place-card-btn-directions" onclick="app.handleDirectionsClick(event, '${escapedAddress}')" title="Apri indicazioni stradali sul navigatore">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              <span>Indicazioni</span>
            </a>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- MODAL LUOGO (NUOVO / MODIFICA) ---
  openPlaceModal(id = null) {
    this.editingPlaceId = id;
    const title = document.getElementById('modal-place-title');
    const form = document.getElementById('form-place');
    if (!form) return;

    if (id) {
      title.textContent = 'Modifica Luogo';
      const allPlaces = store.getAllPlaces ? store.getAllPlaces() : [];
      const p = allPlaces.find(item => item.id === id);
      if (p) {
        document.getElementById('place-type').value = p.type || 'discarica';
        document.getElementById('place-name').value = p.name || '';
        document.getElementById('place-address').value = p.address || '';
        document.getElementById('place-phone').value = p.phone || '';
        document.getElementById('place-hours').value = p.hours || '';
        document.getElementById('place-notes').value = p.notes || '';
        document.getElementById('place-active').checked = p.active !== false;
      }
    } else {
      title.textContent = 'Nuovo Luogo';
      form.reset();
      const defaultType = (this.placeFilter !== 'all' && this.placeFilter !== 'cantiere') ? this.placeFilter : 'discarica';
      document.getElementById('place-type').value = defaultType;
      document.getElementById('place-active').checked = true;
    }

    this.openModal('modal-place');
  }

  handlePlaceSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const type = document.getElementById('place-type').value;
    const name = document.getElementById('place-name').value.trim();
    const address = document.getElementById('place-address').value.trim();
    const phone = document.getElementById('place-phone').value.trim();
    const hours = document.getElementById('place-hours').value.trim();
    const notes = document.getElementById('place-notes').value.trim();
    const active = document.getElementById('place-active').checked;

    if (!name) {
      this.showToast('Inserisci il nome del luogo', 'error');
      return;
    }
    if (!address) {
      this.showToast('Inserisci l\'indirizzo per il navigatore GPS', 'error');
      return;
    }

    const id = this.editingPlaceId;
    if (id) {
      store.updatePlace(id, { name, type, address, phone, hours, notes, active });
      this.showToast('Luogo aggiornato con successo', 'success');
    } else {
      store.addPlace({ name, type, address, phone, hours, notes, active });
      this.showToast('Nuovo luogo aggiunto con successo', 'success');
    }

    this.closeModal('modal-place');
    this.renderPlaces();
  }

  // --- MODAL DETTAGLIO LUOGO ---
  openPlaceDetailModal(id) {
    if (!id) return;
    const allPlaces = store.getAllPlaces ? store.getAllPlaces() : [];
    const place = allPlaces.find(p => p.id === id);
    if (!place) return;

    const titleEl = document.getElementById('place-detail-title');
    const subEl = document.getElementById('place-detail-sub');
    const bodyEl = document.getElementById('place-detail-body');
    const editBtn = document.getElementById('place-detail-edit-btn');
    const deleteBtn = document.getElementById('place-detail-delete-btn');
    const quickActionBtn = document.getElementById('place-detail-quick-action');

    if (titleEl) titleEl.textContent = place.name;
    if (subEl) subEl.textContent = place.typeLabel;

    // Configura bottoni di modifica ed eliminazione
    if (editBtn) {
      editBtn.onclick = () => {
        this.closeModal('modal-place-detail');
        if (place.source === 'site') {
          this.openSiteModal(place.id);
        } else {
          this.openPlaceModal(place.id);
        }
      };
    }

    if (quickActionBtn) {
      quickActionBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        ${place.source === 'site' ? 'Modifica Cantiere' : 'Modifica Luogo'}
      `;
      quickActionBtn.onclick = () => {
        this.closeModal('modal-place-detail');
        if (place.source === 'site') {
          this.openSiteModal(place.id);
        } else {
          this.openPlaceModal(place.id);
        }
      };
    }

    if (deleteBtn) {
      if (place.source === 'site') {
        deleteBtn.style.display = 'none'; // I cantieri si eliminano dalla loro vista
      } else {
        deleteBtn.style.display = 'inline-flex';
        deleteBtn.onclick = () => {
          this.deletePlaceById(place.id);
        };
      }
    }

    const gradient = PLACE_GRADIENTS[place.type] || PLACE_GRADIENTS.altro;
    const icon = PLACE_ICONS[place.type] || PLACE_ICONS.altro;
    const directionsUrl = this.getDirectionsUrl(place.address);
    const escapedAddress = (place.address || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');

    if (bodyEl) {
      bodyEl.innerHTML = `
        <div class="person-detail-hero" style="border-radius:var(--radius-md); margin-bottom:14px;">
          <div class="place-avatar" style="width:52px; height:52px; background:${gradient}; font-size:1.4rem;">
            ${icon}
          </div>
          <div style="flex:1; min-width:0;">
            <div style="font-size:1.1rem; font-weight:800; color:#fff; line-height:1.25; margin-bottom:4px;">
              ${place.name}
            </div>
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <span class="item-badge" style="background:rgba(255,255,255,0.08); color:var(--text-main); font-size:0.72rem; padding:2px 8px; border-radius:var(--radius-full); font-weight:700;">
                ${place.typeLabel}
              </span>
              ${place.source === 'site' ? `
                <span class="item-badge badge-cantiere" style="font-size:0.72rem; padding:2px 8px; border-radius:var(--radius-full); font-weight:700;">
                  Cantiere (${place.status === 'in_corso' ? 'In Corso' : place.status === 'sospeso' ? 'Sospeso' : 'Completato'})
                </span>
              ` : `
                <span class="item-badge ${place.active ? 'badge-success' : 'badge-warning'}" style="font-size:0.72rem; padding:2px 8px; border-radius:var(--radius-full); font-weight:700;">
                  ${place.active ? 'Attivo' : 'Inattivo'}
                </span>
              `}
            </div>
          </div>
        </div>

        <!-- Sezione Navigazione / Indirizzo -->
        <div style="background:linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(26, 34, 52, 0.6) 100%); border:1px solid rgba(56, 189, 248, 0.25); border-radius:var(--radius-md); padding:14px; margin-bottom:14px; max-width:100%; box-sizing:border-box;">
          <div style="display:flex; align-items:flex-start; gap:10px; margin-bottom:12px;">
            <div style="width:36px; height:36px; border-radius:var(--radius-sm); background:rgba(56, 189, 248, 0.16); color:#38bdf8; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div style="flex:1; min-width:0;">
              <div style="font-size:0.72rem; font-weight:700; color:#38bdf8; text-transform:uppercase; letter-spacing:0.04em;">Indirizzo per Navigatore</div>
              <div style="font-size:0.94rem; font-weight:700; color:#fff; line-height:1.35; margin-top:2px; word-break:break-word;">
                ${place.address || 'Indirizzo non specificato'}
              </div>
            </div>
          </div>

          <a href="${directionsUrl}" target="_blank" rel="noopener" class="person-card-btn person-card-btn-call" style="width:100%; padding:10px 14px; font-size:0.86rem; font-weight:700; border-radius:var(--radius-sm); box-shadow:0 4px 14px rgba(56, 189, 248, 0.2);" onclick="app.handleDirectionsClick(event, '${escapedAddress}')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            Avvia Indicazioni Stradali
          </a>
        </div>

        <!-- Altri Recapiti & Orari -->
        <div class="person-detail-section" style="margin-bottom:12px;">
          <div class="person-detail-section-title">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            Informazioni & Logistica
          </div>

          <div class="person-detail-grid">
            ${place.phone ? `
              <div class="person-detail-field">
                <span class="person-detail-label">Telefono / Recapito</span>
                <span class="person-detail-value" style="display:flex; align-items:center; gap:8px;">
                  <a href="tel:${place.phone}" style="color:var(--primary); font-weight:700; text-decoration:none;">${place.phone}</a>
                  <a href="tel:${place.phone}" class="btn btn-secondary btn-sm" style="padding:2px 8px; font-size:0.72rem; min-height:24px;">Chiama</a>
                </span>
              </div>
            ` : ''}

            ${place.hours ? `
              <div class="person-detail-field">
                <span class="person-detail-label">Orari Apertura / Scarico</span>
                <span class="person-detail-value">${place.hours}</span>
              </div>
            ` : ''}

            ${place.source === 'site' ? `
              <div class="person-detail-field">
                <span class="person-detail-label">Codice Cantiere</span>
                <span class="person-detail-value">${place.code || '—'}</span>
              </div>
              ${place.clientName ? `
                <div class="person-detail-field">
                  <span class="person-detail-label">Cliente / Committente</span>
                  <span class="person-detail-value">${place.clientName}</span>
                </div>
              ` : ''}
            ` : ''}
          </div>
        </div>

        ${place.source === 'site' ? `
          <div style="margin-bottom:12px;">
            <button type="button" class="btn btn-secondary" style="width:100%; display:flex; align-items:center; justify-content:center; gap:8px;" onclick="app.closeModal('modal-place-detail'); app.openSiteDetailModal('${place.id}');">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l8-4v18M13 11l6 3v7M9 9h1M9 13h1M9 17h1"/></svg>
              Apri Scheda Cantiere Completa
            </button>
          </div>
        ` : ''}

        ${place.notes ? `
          <div class="person-detail-section">
            <div class="person-detail-section-title">
              ${ICONS.note} Note & Istruzioni
            </div>
            <div style="font-size:0.84rem; color:var(--text-muted); line-height:1.5; white-space:pre-wrap;">
              ${place.notes}
            </div>
          </div>
        ` : ''}
      `;
    }

    this.openModal('modal-place-detail');
  }

  deletePlaceById(id) {
    if (!id) return;
    const allPlaces = store.getAllPlaces ? store.getAllPlaces() : [];
    const place = allPlaces.find(p => p.id === id);
    const name = place ? place.name : 'questo luogo';

    if (confirm(`Sei sicuro di voler eliminare "${name}" dai luoghi salvati?`)) {
      store.deletePlace(id);
      this.closeModal('modal-place-detail');
      this.showToast('Luogo rimosso con successo', 'info');
      this.renderPlaces();
    }
  }

  // ==========================================================================
  // MODULO PREVENTIVI & COMPUTI EDILI (APPLE STYLE)
  // ==========================================================================

  switchQuoteSubView(subView) {
    this.quoteSubView = subView || 'list';
    const listEl = document.getElementById('quote-subview-list');
    const editorEl = document.getElementById('quote-subview-editor');
    const btnList = document.getElementById('quote-tab-btn-list');
    const btnEditor = document.getElementById('quote-tab-btn-editor');

    if (listEl) listEl.style.display = this.quoteSubView === 'list' ? 'block' : 'none';
    if (editorEl) editorEl.style.display = this.quoteSubView === 'editor' ? 'block' : 'none';
    if (btnList) btnList.classList.toggle('active', this.quoteSubView === 'list');
    if (btnEditor) btnEditor.classList.toggle('active', this.quoteSubView === 'editor');

    if (this.quoteSubView === 'list') {
      this.renderQuotes();
    }
  }

  setQuoteStatusFilter(status) {
    this.quoteFilterStatus = status || 'all';
    document.querySelectorAll('[data-quote-status]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.quoteStatus === this.quoteFilterStatus);
    });
    this.renderQuotes();
  }

  setQuoteSearchFilter(query) {
    this.quoteSearchQuery = (query || '').toLowerCase().trim();
    const clearBtn = document.getElementById('quotes-search-clear');
    if (clearBtn) {
      clearBtn.style.display = this.quoteSearchQuery ? 'block' : 'none';
    }
    this.renderQuotes();
  }

  clearQuoteSearch() {
    this.quoteSearchQuery = '';
    const input = document.getElementById('filter-quotes-search');
    const clearBtn = document.getElementById('quotes-search-clear');
    if (input) input.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    this.renderQuotes();
  }

  renderQuotes() {
    const listEl = document.getElementById('quotes-cards-list');
    if (!listEl) return;

    const allQuotes = store.getQuotes ? store.getQuotes() : (store.data.quotes || []);

    // Aggiorna contatori filtri
    const countAll = allQuotes.length;
    const countDraft = allQuotes.filter(q => q.status === 'draft').length;
    const countSent = allQuotes.filter(q => q.status === 'sent').length;
    const countAccepted = allQuotes.filter(q => q.status === 'accepted').length;
    const countRejected = allQuotes.filter(q => q.status === 'rejected').length;

    const badgeTotal = document.getElementById('quotes-badge-total-count');
    const elCountAll = document.getElementById('quotes-count-all');
    const elCountDraft = document.getElementById('quotes-count-draft');
    const elCountSent = document.getElementById('quotes-count-sent');
    const elCountAccepted = document.getElementById('quotes-count-accepted');
    const elCountRejected = document.getElementById('quotes-count-rejected');

    if (badgeTotal) badgeTotal.textContent = countAll;
    if (elCountAll) elCountAll.textContent = countAll;
    if (elCountDraft) elCountDraft.textContent = countDraft;
    if (elCountSent) elCountSent.textContent = countSent;
    if (elCountAccepted) elCountAccepted.textContent = countAccepted;
    if (elCountRejected) elCountRejected.textContent = countRejected;

    // Filtra
    let filtered = allQuotes.filter(q => {
      if (this.quoteFilterStatus !== 'all' && q.status !== this.quoteFilterStatus) {
        return false;
      }
      if (this.quoteSearchQuery) {
        const qNum = (q.number || '').toLowerCase();
        const qTitle = (q.title || '').toLowerCase();
        const qClient = (q.clientName || '').toLowerCase();
        const qAddress = (q.siteAddress || q.clientAddress || '').toLowerCase();
        if (!qNum.includes(this.quoteSearchQuery) &&
            !qTitle.includes(this.quoteSearchQuery) &&
            !qClient.includes(this.quoteSearchQuery) &&
            !qAddress.includes(this.quoteSearchQuery)) {
          return false;
        }
      }
      return true;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; padding: 48px 20px; text-align: center;">
          <div style="font-size: 2.2rem; margin-bottom: 12px;">📑</div>
          <h3 style="font-size: 1.1rem; font-weight: 800; color: #fff; margin-bottom: 6px;">
            ${allQuotes.length === 0 ? 'Nessun preventivo creato' : 'Nessun preventivo corrisponde ai filtri'}
          </h3>
          <p style="font-size: 0.84rem; color: var(--text-muted); max-width: 440px; margin: 0 auto 18px auto;">
            ${allQuotes.length === 0 
              ? 'Crea il tuo primo computo metrico estimativo per cantieri edili. Include calcoli IVA automatici ed esportazione PDF vettoriale.' 
              : 'Prova a modificare i termini di ricerca o a selezionare "Tutti" per visualizzare tutti i preventivi.'}
          </p>
          <button type="button" class="btn btn-primary" onclick="app.openNewQuote()">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            + Crea Nuovo Preventivo
          </button>
        </div>
      `;
      return;
    }

    const statusLabels = {
      draft: 'Bozza',
      sent: 'Inviato',
      accepted: 'Accettato',
      rejected: 'Rifiutato'
    };

    listEl.innerHTML = filtered.map(q => {
      const totals = calcQuoteTotals(q);
      const statusClass = `quote-status-${q.status || 'draft'}`;
      const statusText = statusLabels[q.status] || 'Bozza';
      const sectionsCount = Array.isArray(q.sections) ? q.sections.length : 0;
      const itemsCount = totals.itemsCount;

      const clientInfo = q.clientName ? escapeHTML(q.clientName) : 'Cliente non specificato';
      const addressInfo = q.siteAddress || q.clientAddress;

      return `
        <div class="quote-card">
          <div class="quote-card-header">
            <div>
              <div class="quote-number-tag">${escapeHTML(q.number || 'PREV')}</div>
              <div class="quote-date-tag">Emesso il ${fmtDate(q.date)}</div>
            </div>
            <span class="quote-status-pill ${statusClass}">
              ${statusText}
            </span>
          </div>

          <div class="quote-title">${escapeHTML(q.title || 'Preventivo Lavori Edili')}</div>

          <div class="quote-client-row">
            ${ICONS.user}
            <span><strong>${clientInfo}</strong>${q.clientPhone ? ` &bull; ${escapeHTML(q.clientPhone)}` : ''}</span>
          </div>

          ${addressInfo ? `
            <div class="quote-client-row">
              ${ICONS.site}
              <span style="font-size:0.78rem;">${escapeHTML(addressInfo)}</span>
            </div>
          ` : ''}

          <div style="font-size:0.75rem; color:var(--text-dim); display:flex; gap:12px; margin-top:2px;">
            <span>${sectionsCount} ${sectionsCount === 1 ? 'capitolo' : 'capitoli'}</span>
            <span>&bull;</span>
            <span>${itemsCount} ${itemsCount === 1 ? 'voce di computo' : 'voci di computo'}</span>
          </div>

          <div class="quote-amounts-strip">
            <div class="quote-amount-detail">
              <div>Imponibile: <strong>${fmtMoney(totals.taxableAmount)}</strong></div>
              <div>IVA ${totals.vatRate}%: <strong>${fmtMoney(totals.vatAmount)}</strong></div>
            </div>
            <div class="quote-amount-grand">
              <small>Totale Offerta</small>
              <span>${fmtMoney(totals.grandTotal)}</span>
            </div>
          </div>

          <div class="quote-card-actions">
            <button type="button" class="btn btn-primary btn-sm" onclick="app.printQuote('${q.id}')" title="Stampa o salva in PDF vettoriale" style="background:linear-gradient(135deg, #0284c7, #38bdf8);">
              ${ICONS.print}
              PDF / Stampa
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="app.previewQuote('${q.id}')" title="Anteprima formattata A4">
              ${ICONS.eye}
              Anteprima
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="app.editQuote('${q.id}')" title="Modifica computo e prezzi">
              ${ICONS.edit}
              Modifica
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="app.duplicateQuote('${q.id}')" title="Duplica come nuovo preventivo">
              ${ICONS.copy}
              Duplica
            </button>
            ${q.status === 'accepted' ? `
              <button type="button" class="btn btn-secondary btn-sm" onclick="app.convertQuoteToSite('${q.id}')" title="Converti in cantiere attivo" style="color:#f59e0b; border-color:rgba(245,158,11,0.4);">
                ${ICONS.site}
                Crea Cantiere
              </button>
            ` : ''}
            <button type="button" class="btn-icon" onclick="app.deleteQuote('${q.id}')" title="Elimina preventivo" style="margin-left:auto; color:var(--text-dim);">
              ${ICONS.delete}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  openNewQuote() {
    this.switchTab('quotes');
    this.editingQuoteId = null;
    const nextNum = store.getNextQuoteNumber();
    const today = new Date().toISOString().split('T')[0];
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    this.currentQuoteEditorData = {
      id: null,
      number: nextNum,
      date: today,
      validUntil: expiry,
      status: 'draft',
      title: '',
      clientId: '',
      clientName: '',
      clientAddress: '',
      clientPhone: '',
      clientFiscal: '',
      siteId: '',
      siteAddress: '',
      discountPercent: 0,
      vatRate: 10,
      paymentTerms: '30% acconto firma contratto, 40% a SAL intermedio, 30% a saldo fine lavori',
      estimatedDays: '30 giorni lavorativi',
      notes: 'Prezzi comprensivi di mano d\'opera specializzata, attrezzature e oneri per la sicurezza.',
      sections: [
        {
          id: `sec_${Date.now()}_1`,
          title: '1. Opere Generali & Demolizioni',
          items: [
            { id: `it_${Date.now()}_1`, desc: '', um: 'mq', qty: 1, price: 0, total: 0 }
          ]
        }
      ]
    };

    const labelEl = document.getElementById('quote-tab-editor-label');
    if (labelEl) labelEl.textContent = 'Nuovo Preventivo';

    this.populateQuoteEditorUI();
    this.switchQuoteSubView('editor');
  }

  editQuote(id) {
    const quote = store.getQuote(id);
    if (!quote) return;
    this.switchTab('quotes');
    this.editingQuoteId = id;
    this.currentQuoteEditorData = JSON.parse(JSON.stringify(quote));

    const labelEl = document.getElementById('quote-tab-editor-label');
    if (labelEl) labelEl.textContent = `Modifica ${quote.number}`;

    this.populateQuoteEditorUI();
    this.switchQuoteSubView('editor');
  }

  populateQuoteEditorUI() {
    const q = this.currentQuoteEditorData;
    if (!q) return;

    // Selettore Clienti (da store.getAllPeople e store.data.clients)
    const clientSelect = document.getElementById('qe-client-select');
    if (clientSelect) {
      const clientsList = store.data.clients || [];
      const peopleList = store.getAllPeople ? store.getAllPeople() : (store.data.people || []);
      
      let html = `<option value="">-- Seleziona cliente o scrivi sotto --</option>`;
      clientsList.forEach(c => {
        html += `<option value="client_${c.id}">${escapeHTML(c.name)} (Cliente Committente)</option>`;
      });
      peopleList.filter(p => p.type === 'cliente' || p.role === 'Cliente').forEach(p => {
        if (!clientsList.some(c => c.name.toLowerCase() === p.name.toLowerCase())) {
          html += `<option value="person_${p.id}">${escapeHTML(p.name)} (${p.role || 'Contatto'})</option>`;
        }
      });
      clientSelect.innerHTML = html;
      clientSelect.value = q.clientId ? `client_${q.clientId}` : '';
    }

    // Selettore Cantieri
    const siteSelect = document.getElementById('qe-site-select');
    if (siteSelect) {
      const sites = store.data.sites || [];
      let sHtml = `<option value="">-- Nessun cantiere collegato --</option>`;
      sites.forEach(s => {
        sHtml += `<option value="${s.id}" ${q.siteId === s.id ? 'selected' : ''}>${escapeHTML(s.code)} - ${escapeHTML(s.name)}</option>`;
      });
      siteSelect.innerHTML = sHtml;
    }

    // Campi base form
    const fStatus = document.getElementById('qe-status');
    const fNumber = document.getElementById('qe-number');
    const fDate = document.getElementById('qe-date');
    const fValid = document.getElementById('qe-valid-until');
    const fTitle = document.getElementById('qe-title');
    const fClientName = document.getElementById('qe-client-name');
    const fClientFiscal = document.getElementById('qe-client-fiscal');
    const fClientAddress = document.getElementById('qe-client-address');
    const fClientPhone = document.getElementById('qe-client-phone');
    const fSiteAddress = document.getElementById('qe-site-address');
    const fDiscount = document.getElementById('qe-discount-percent');
    const fVat = document.getElementById('qe-vat-rate');
    const fPayment = document.getElementById('qe-payment-terms');
    const fEstimated = document.getElementById('qe-estimated-days');
    const fNotes = document.getElementById('qe-notes');

    if (fStatus) fStatus.value = q.status || 'draft';
    if (fNumber) fNumber.value = q.number || '';
    if (fDate) fDate.value = q.date || '';
    if (fValid) fValid.value = q.validUntil || '';
    if (fTitle) fTitle.value = q.title || '';
    if (fClientName) fClientName.value = q.clientName || '';
    if (fClientFiscal) fClientFiscal.value = q.clientFiscal || '';
    if (fClientAddress) fClientAddress.value = q.clientAddress || '';
    if (fClientPhone) fClientPhone.value = q.clientPhone || '';
    if (fSiteAddress) fSiteAddress.value = q.siteAddress || '';
    if (fDiscount) fDiscount.value = q.discountPercent || 0;
    if (fVat) fVat.value = q.vatRate !== undefined ? q.vatRate : 10;
    if (fPayment) fPayment.value = q.paymentTerms || '';
    if (fEstimated) fEstimated.value = q.estimatedDays || '';
    if (fNotes) fNotes.value = q.notes || '';

    this.renderQuoteSectionsInEditor();
    this.recalcQuoteTotals();
  }

  onQuoteClientSelectChange(val) {
    if (!val) return;
    let found = null;
    if (val.startsWith('client_')) {
      const id = val.replace('client_', '');
      found = (store.data.clients || []).find(c => c.id === id);
    } else if (val.startsWith('person_')) {
      const id = val.replace('person_', '');
      const allPeople = store.getAllPeople ? store.getAllPeople() : (store.data.people || []);
      found = allPeople.find(p => p.id === id);
    }

    if (found) {
      const fClientName = document.getElementById('qe-client-name');
      const fClientPhone = document.getElementById('qe-client-phone');
      const fClientAddress = document.getElementById('qe-client-address');
      const fClientFiscal = document.getElementById('qe-client-fiscal');

      if (fClientName) fClientName.value = found.name || '';
      if (fClientPhone) fClientPhone.value = found.phone || '';
      if (fClientAddress) fClientAddress.value = found.address || found.notes || '';
      if (fClientFiscal && found.vatNumber) fClientFiscal.value = found.vatNumber;

      if (this.currentQuoteEditorData) {
        this.currentQuoteEditorData.clientName = found.name || '';
        this.currentQuoteEditorData.clientPhone = found.phone || '';
        this.currentQuoteEditorData.clientAddress = found.address || '';
        this.currentQuoteEditorData.clientId = found.id || '';
      }
      this.showToast(`Dati di ${found.name} inseriti`, 'info');
    }
  }

  renderQuoteSectionsInEditor() {
    const wrap = document.getElementById('quote-sections-wrapper');
    if (!wrap) return;

    if (!this.currentQuoteEditorData) return;
    const sections = this.currentQuoteEditorData.sections || [];

    const umOptions = ['mq', 'ml', 'mc', 'a corpo', 'cad', 'punto', 'ore', 'kg', 'pz'];

    wrap.innerHTML = sections.map((sec, sIndex) => {
      let secSubtotal = 0;
      (sec.items || []).forEach(it => {
        const lineTot = Number(it.total) !== undefined && !isNaN(Number(it.total)) 
          ? Number(it.total) 
          : ((Number(it.qty) || 0) * (Number(it.price) || 0));
        secSubtotal += lineTot;
      });

      const itemsHtml = (sec.items || []).map((it, iIndex) => {
        const lineTot = Number(it.total) !== undefined && !isNaN(Number(it.total)) 
          ? Number(it.total) 
          : ((Number(it.qty) || 0) * (Number(it.price) || 0));

        return `
          <div class="quote-item-row" data-sec-index="${sIndex}" data-item-index="${iIndex}">
            <div>
              <input type="text" class="quote-item-desc" placeholder="Descrizione lavorazione, fornitura o materiale..." value="${escapeHTML(it.desc || '')}" oninput="app.updateQuoteItemDesc(${sIndex}, ${iIndex}, this.value)" required>
            </div>
            <div>
              <select class="quote-item-um form-select" onchange="app.updateQuoteItemUM(${sIndex}, ${iIndex}, this.value)">
                ${umOptions.map(opt => `<option value="${opt}" ${it.um === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>
            <div>
              <input type="number" class="quote-item-qty" placeholder="Q.tà" min="0" step="any" value="${it.qty !== undefined ? it.qty : 1}" oninput="app.updateQuoteItemQty(${sIndex}, ${iIndex}, this.value)" required>
            </div>
            <div>
              <input type="number" class="quote-item-price" placeholder="Prezzo €" min="0" step="any" value="${it.price !== undefined ? it.price : 0}" oninput="app.updateQuoteItemPrice(${sIndex}, ${iIndex}, this.value)" required>
            </div>
            <div class="quote-item-total-val" id="qe-item-total-${sIndex}-${iIndex}">
              ${fmtDocMoney(lineTot)}
            </div>
            <div>
              <button type="button" class="quote-item-del-btn" onclick="app.removeQuoteItem(${sIndex}, ${iIndex})" title="Elimina questa riga">
                ${ICONS.delete}
              </button>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="quote-section-box" data-section-index="${sIndex}">
          <div class="quote-section-topbar">
            <input type="text" class="quote-section-input-title" value="${escapeHTML(sec.title || '')}" placeholder="es. 1. Demolizioni e Rimozioni" oninput="app.updateSectionTitle(${sIndex}, this.value)" required>
            <div class="quote-section-subtotal-badge" id="qe-sec-subtotal-${sIndex}">
              Capitolo: ${fmtDocMoney(secSubtotal)}
            </div>
            <button type="button" class="btn-icon" onclick="app.removeQuoteSection(${sIndex})" title="Elimina intero capitolo" style="color:var(--text-dim);">
              ${ICONS.delete}
            </button>
          </div>

          <div class="quote-items-list" id="quote-items-container-${sIndex}">
            ${itemsHtml}
          </div>

          <div style="margin-top:10px; display:flex; justify-content:flex-start;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="app.addQuoteItem(${sIndex})">
              <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              + Aggiungi Voce a questo Capitolo
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  updateSectionTitle(sIndex, val) {
    if (!this.currentQuoteEditorData || !this.currentQuoteEditorData.sections[sIndex]) return;
    this.currentQuoteEditorData.sections[sIndex].title = val;
  }

  addQuoteSection(title = '') {
    if (!this.currentQuoteEditorData) return;
    if (!Array.isArray(this.currentQuoteEditorData.sections)) {
      this.currentQuoteEditorData.sections = [];
    }
    const nextIdx = this.currentQuoteEditorData.sections.length + 1;
    this.currentQuoteEditorData.sections.push({
      id: `sec_${Date.now()}_${nextIdx}`,
      title: title || `${nextIdx}. Nuova Categoria di Lavorazione`,
      items: [
        { id: `it_${Date.now()}_1`, desc: '', um: 'mq', qty: 1, price: 0, total: 0 }
      ]
    });
    this.renderQuoteSectionsInEditor();
    this.recalcQuoteTotals();
  }

  removeQuoteSection(sIndex) {
    if (!this.currentQuoteEditorData || !this.currentQuoteEditorData.sections[sIndex]) return;
    const secTitle = this.currentQuoteEditorData.sections[sIndex].title;
    if (this.currentQuoteEditorData.sections.length > 1) {
      if (confirm(`Eliminare il capitolo "${secTitle}" e tutte le sue voci?`)) {
        this.currentQuoteEditorData.sections.splice(sIndex, 1);
        this.renderQuoteSectionsInEditor();
        this.recalcQuoteTotals();
      }
    } else {
      this.showToast('Un preventivo deve avere almeno un capitolo di lavorazione', 'warning');
    }
  }

  addQuoteItem(sIndex) {
    if (!this.currentQuoteEditorData || !this.currentQuoteEditorData.sections[sIndex]) return;
    const sec = this.currentQuoteEditorData.sections[sIndex];
    if (!Array.isArray(sec.items)) sec.items = [];
    sec.items.push({
      id: `it_${Date.now()}_${sec.items.length + 1}`,
      desc: '',
      um: 'mq',
      qty: 1,
      price: 0,
      total: 0
    });
    this.renderQuoteSectionsInEditor();
    this.recalcQuoteTotals();
  }

  removeQuoteItem(sIndex, iIndex) {
    if (!this.currentQuoteEditorData || !this.currentQuoteEditorData.sections[sIndex]) return;
    const sec = this.currentQuoteEditorData.sections[sIndex];
    if (sec.items && sec.items.length > 1) {
      sec.items.splice(iIndex, 1);
      this.renderQuoteSectionsInEditor();
      this.recalcQuoteTotals();
    } else {
      this.showToast('Ogni capitolo deve contenere almeno una voce', 'warning');
    }
  }

  updateQuoteItemDesc(sIndex, iIndex, val) {
    if (!this.currentQuoteEditorData?.sections[sIndex]?.items[iIndex]) return;
    this.currentQuoteEditorData.sections[sIndex].items[iIndex].desc = val;
  }

  updateQuoteItemUM(sIndex, iIndex, val) {
    if (!this.currentQuoteEditorData?.sections[sIndex]?.items[iIndex]) return;
    this.currentQuoteEditorData.sections[sIndex].items[iIndex].um = val;
  }

  updateQuoteItemQty(sIndex, iIndex, val) {
    if (!this.currentQuoteEditorData?.sections[sIndex]?.items[iIndex]) return;
    const it = this.currentQuoteEditorData.sections[sIndex].items[iIndex];
    it.qty = parseFloat(val) || 0;
    it.total = Math.round(it.qty * (parseFloat(it.price) || 0) * 100) / 100;
    
    const totEl = document.getElementById(`qe-item-total-${sIndex}-${iIndex}`);
    if (totEl) totEl.textContent = fmtDocMoney(it.total);

    this.updateSecSubtotalUI(sIndex);
    this.recalcQuoteTotals();
  }

  updateQuoteItemPrice(sIndex, iIndex, val) {
    if (!this.currentQuoteEditorData?.sections[sIndex]?.items[iIndex]) return;
    const it = this.currentQuoteEditorData.sections[sIndex].items[iIndex];
    it.price = parseFloat(val) || 0;
    it.total = Math.round((parseFloat(it.qty) || 0) * it.price * 100) / 100;
    
    const totEl = document.getElementById(`qe-item-total-${sIndex}-${iIndex}`);
    if (totEl) totEl.textContent = fmtDocMoney(it.total);

    this.updateSecSubtotalUI(sIndex);
    this.recalcQuoteTotals();
  }

  updateSecSubtotalUI(sIndex) {
    const sec = this.currentQuoteEditorData?.sections[sIndex];
    if (!sec) return;
    let secSub = 0;
    (sec.items || []).forEach(it => {
      secSub += (Number(it.total) !== undefined && !isNaN(Number(it.total))) ? Number(it.total) : ((Number(it.qty) || 0) * (Number(it.price) || 0));
    });
    const subBadge = document.getElementById(`qe-sec-subtotal-${sIndex}`);
    if (subBadge) subBadge.textContent = `Capitolo: ${fmtDocMoney(secSub)}`;
  }

  applyQuotePreset(presetKey) {
    const preset = QUOTE_PRESETS[presetKey];
    if (!preset) return;

    if (this.currentQuoteEditorData && this.currentQuoteEditorData.sections && this.currentQuoteEditorData.sections.length > 0) {
      const hasContent = this.currentQuoteEditorData.sections.some(s => s.items && s.items.some(i => i.desc || i.price > 0));
      if (hasContent) {
        if (!confirm(`Attenzione: applicare il template "${preset.title}" sostituirà le voci attuali del preventivo. Continuare?`)) {
          return;
        }
      }
    }

    if (!this.currentQuoteEditorData) {
      this.openNewQuote();
    }

    const titleInput = document.getElementById('qe-title');
    if (titleInput && (!titleInput.value || titleInput.value === 'Nuovo Preventivo Lavori Edili')) {
      titleInput.value = preset.title;
      this.currentQuoteEditorData.title = preset.title;
    }

    const paymentInput = document.getElementById('qe-payment-terms');
    if (paymentInput) paymentInput.value = preset.paymentTerms;

    const estimatedInput = document.getElementById('qe-estimated-days');
    if (estimatedInput) estimatedInput.value = preset.estimatedDays;

    const notesInput = document.getElementById('qe-notes');
    if (notesInput) notesInput.value = preset.notes;

    const vatSelect = document.getElementById('qe-vat-rate');
    if (vatSelect) vatSelect.value = preset.vatRate;

    this.currentQuoteEditorData.sections = JSON.parse(JSON.stringify(preset.sections));
    this.currentQuoteEditorData.vatRate = preset.vatRate;
    this.currentQuoteEditorData.paymentTerms = preset.paymentTerms;
    this.currentQuoteEditorData.estimatedDays = preset.estimatedDays;
    this.currentQuoteEditorData.notes = preset.notes;

    this.renderQuoteSectionsInEditor();
    this.recalcQuoteTotals();
    this.showToast(`Template "${preset.title}" caricato con successo!`, 'success');
  }

  readQuoteEditorDataFromDOM() {
    if (!this.currentQuoteEditorData) return null;

    const fStatus = document.getElementById('qe-status');
    const fNumber = document.getElementById('qe-number');
    const fDate = document.getElementById('qe-date');
    const fValid = document.getElementById('qe-valid-until');
    const fTitle = document.getElementById('qe-title');
    const fClientName = document.getElementById('qe-client-name');
    const fClientFiscal = document.getElementById('qe-client-fiscal');
    const fClientAddress = document.getElementById('qe-client-address');
    const fClientPhone = document.getElementById('qe-client-phone');
    const fSiteAddress = document.getElementById('qe-site-address');
    const fSiteSelect = document.getElementById('qe-site-select');
    const fDiscount = document.getElementById('qe-discount-percent');
    const fVat = document.getElementById('qe-vat-rate');
    const fPayment = document.getElementById('qe-payment-terms');
    const fEstimated = document.getElementById('qe-estimated-days');
    const fNotes = document.getElementById('qe-notes');

    this.currentQuoteEditorData.status = fStatus ? fStatus.value : 'draft';
    this.currentQuoteEditorData.number = fNumber ? fNumber.value.trim() : store.getNextQuoteNumber();
    this.currentQuoteEditorData.date = fDate ? fDate.value : new Date().toISOString().split('T')[0];
    this.currentQuoteEditorData.validUntil = fValid ? fValid.value : '';
    this.currentQuoteEditorData.title = fTitle ? fTitle.value.trim() : 'Preventivo Opere Edili';
    this.currentQuoteEditorData.clientName = fClientName ? fClientName.value.trim() : '';
    this.currentQuoteEditorData.clientFiscal = fClientFiscal ? fClientFiscal.value.trim() : '';
    this.currentQuoteEditorData.clientAddress = fClientAddress ? fClientAddress.value.trim() : '';
    this.currentQuoteEditorData.clientPhone = fClientPhone ? fClientPhone.value.trim() : '';
    this.currentQuoteEditorData.siteAddress = fSiteAddress ? fSiteAddress.value.trim() : '';
    this.currentQuoteEditorData.siteId = fSiteSelect ? fSiteSelect.value : '';
    this.currentQuoteEditorData.discountPercent = fDiscount ? parseFloat(fDiscount.value) || 0 : 0;
    this.currentQuoteEditorData.vatRate = fVat ? parseFloat(fVat.value) || 10 : 10;
    this.currentQuoteEditorData.paymentTerms = fPayment ? fPayment.value.trim() : '';
    this.currentQuoteEditorData.estimatedDays = fEstimated ? fEstimated.value.trim() : '';
    this.currentQuoteEditorData.notes = fNotes ? fNotes.value.trim() : '';

    return this.currentQuoteEditorData;
  }

  recalcQuoteTotals() {
    this.readQuoteEditorDataFromDOM();
    const totals = calcQuoteTotals(this.currentQuoteEditorData);

    const subEl = document.getElementById('qe-live-subtotal');
    const discEl = document.getElementById('qe-live-discount-amount');
    const vatEl = document.getElementById('qe-live-vat-amount');
    const grandEl = document.getElementById('qe-live-grand-total');

    if (subEl) subEl.textContent = fmtDocMoney(totals.subtotal);
    if (discEl) discEl.textContent = `- ${fmtDocMoney(totals.discountAmount)} (${totals.discountPercent}%)`;
    if (vatEl) vatEl.textContent = fmtDocMoney(totals.vatAmount);
    if (grandEl) grandEl.textContent = fmtDocMoney(totals.grandTotal);
  }

  saveCurrentQuote() {
    const q = this.readQuoteEditorDataFromDOM();
    if (!q) return;

    if (!q.number) {
      this.showToast('Inserisci il numero del preventivo', 'warning');
      return;
    }
    if (!q.title) {
      this.showToast('Inserisci un titolo / oggetto dei lavori', 'warning');
      return;
    }
    if (!q.clientName) {
      this.showToast('Inserisci il nome del committente', 'warning');
      return;
    }

    if (this.editingQuoteId) {
      store.updateQuote(this.editingQuoteId, q);
      this.showToast(`Preventivo ${q.number} aggiornato con successo`, 'success');
    } else {
      store.addQuote(q);
      this.showToast(`Preventivo ${q.number} salvato con successo`, 'success');
    }

    this.switchQuoteSubView('list');
    this.renderQuotes();
  }

  duplicateQuote(id) {
    const orig = store.getQuote(id);
    if (!orig) return;

    const copy = JSON.parse(JSON.stringify(orig));
    copy.id = null;
    copy.number = store.getNextQuoteNumber();
    copy.date = new Date().toISOString().split('T')[0];
    copy.status = 'draft';
    copy.title = `${copy.title} (Copia)`;

    store.addQuote(copy);
    this.showToast(`Preventivo duplicato: ${copy.number}`, 'success');
    this.renderQuotes();
  }

  deleteQuote(id) {
    const q = store.getQuote(id);
    if (!q) return;

    if (confirm(`Sei sicuro di voler eliminare definitivamente il preventivo ${q.number} (${q.title})?`)) {
      store.deleteQuote(id);
      this.showToast(`Preventivo ${q.number} eliminato`, 'info');
      this.renderQuotes();
    }
  }

  convertQuoteToSite(id) {
    const q = store.getQuote(id);
    if (!q) return;

    const totals = calcQuoteTotals(q);

    let clientId = q.clientId;
    if (!clientId) {
      const matchClient = (store.data.clients || []).find(c => c.name.toLowerCase() === q.clientName.toLowerCase());
      if (matchClient) clientId = matchClient.id;
    }

    const currentYear = new Date().getFullYear();
    const existingSites = store.data.sites || [];
    const nextSiteNum = existingSites.length + 1;
    const siteCode = `CANT-${currentYear}-${String(nextSiteNum).padStart(2, '0')}`;

    const newSite = {
      code: siteCode,
      name: q.title || 'Nuovo Cantiere da Preventivo',
      clientId: clientId || '',
      address: q.siteAddress || q.clientAddress || '',
      status: 'in_corso',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      quoteAmount: totals.grandTotal,
      payments: [],
      notes: `Generato automaticamente dal Preventivo ${q.number}. Condizioni: ${q.paymentTerms || 'Standard'}`
    };

    if (confirm(`Convertire il preventivo ${q.number} in un Cantiere Edile attivo?\n\nCodice: ${siteCode}\nImporto: ${fmtDocMoney(totals.grandTotal)}\nCommittente: ${q.clientName}`)) {
      store.addSite(newSite);
      // Aggiorna lo stato del preventivo in accettato se non lo è
      if (q.status !== 'accepted') {
        store.updateQuote(id, { status: 'accepted' });
      }
      this.showToast(`Cantiere ${siteCode} creato con successo!`, 'success');
      this.renderQuotes();
      this.switchTab('sites');
    }
  }

  generateQuotePrintHTML(quote) {
    const totals = calcQuoteTotals(quote);
    const sections = quote.sections || [];
    const company = (store && typeof store.getCompany === 'function') ? store.getCompany() : {
      name: 'GEEM Costruzioni & Restauri S.r.l.',
      shortName: 'GEEM Edilizia',
      logoUrl: 'assets/logo.png?v=7',
      vatNumber: '09876543210',
      fiscalCode: '09876543210',
      rea: 'MB-1234567',
      address: 'Via delle Industrie 18, 20900 Monza (MB)',
      phone: '+39 039 123456',
      email: 'info@geemedilizia.it',
      pec: 'geemcostruzioni@pec.it',
      website: 'www.geemedilizia.it',
      iban: '',
      bankName: '',
      insurance: 'Polizza R.C. Cantieri e Oneri per la Sicurezza a norma D.Lgs 81/08',
      quoteFooterNote: 'Documento Informatico Vettoriale generato dal Gestionale Cantieri Edili'
    };

    const vatDescription = quote.vatRate === 10 
      ? 'IVA al 10% (Ristrutturazione Edilizia agevolata ex L. 449/97)'
      : (quote.vatRate === 22 
          ? 'IVA al 22% (Aliquota Ordinaria di Legge)' 
          : (quote.vatRate === 4 
              ? 'IVA al 4% (Agevolata Prima Casa / Eliminazione Barriere)' 
              : 'IVA 0% (Esente / Reverse Charge ex art. 17 c. 6 lett. a DPR 633/72)'));

    let computoRowsHtml = '';

    sections.forEach((sec, sIdx) => {
      let secSub = 0;
      (sec.items || []).forEach(it => {
        const lineTot = Number(it.total) !== undefined && !isNaN(Number(it.total)) 
          ? Number(it.total) 
          : ((Number(it.qty) || 0) * (Number(it.price) || 0));
        secSub += lineTot;
      });

      computoRowsHtml += `
        <tr class="print-chapter-row">
          <td colspan="6">
            <strong>${escapeHTML(sec.title || `Capitolo ${sIdx + 1}`)}</strong>
          </td>
        </tr>
      `;

      (sec.items || []).forEach((it, iIdx) => {
        const qty = Number(it.qty) || 0;
        const price = Number(it.price) || 0;
        const lineTot = Number(it.total) !== undefined && !isNaN(Number(it.total)) 
          ? Number(it.total) 
          : (qty * price);

        computoRowsHtml += `
          <tr class="print-item-row">
            <td style="text-align:center; font-weight:700; color:#64748b; width:45px;">${sIdx + 1}.${iIdx + 1}</td>
            <td style="font-size:0.82rem; line-height:1.4;">${escapeHTML(it.desc || 'Lavorazione edile')}</td>
            <td style="text-align:center; width:55px;">${escapeHTML(it.um || 'mq')}</td>
            <td style="text-align:right; width:65px; font-weight:700;">${qty}</td>
            <td style="text-align:right; width:85px;">${fmtDocMoney(price)}</td>
            <td style="text-align:right; width:95px; font-weight:800;">${fmtDocMoney(lineTot)}</td>
          </tr>
        `;
      });

      computoRowsHtml += `
        <tr class="print-chapter-subtotal-row">
          <td colspan="5" style="text-align:right; font-weight:700; color:#475569;">
            Subtotale ${escapeHTML(sec.title || `Capitolo ${sIdx + 1}`)}:
          </td>
          <td style="text-align:right; font-weight:800; color:#0f172a;">
            ${fmtDocMoney(secSub)}
          </td>
        </tr>
      `;
    });

    const logoSrc = company.logoUrl || 'assets/logo.png?v=7';
    const compName = escapeHTML(company.name || 'Impresa Edile');
    const compAddr = escapeHTML(company.address || '');
    const compVat = company.vatNumber ? `P.IVA: ${escapeHTML(company.vatNumber)}` : '';
    const compCf = (company.fiscalCode && company.fiscalCode !== company.vatNumber) ? ` &bull; C.F.: ${escapeHTML(company.fiscalCode)}` : '';
    const compPhone = company.phone ? ` &bull; Tel: ${escapeHTML(company.phone)}` : '';
    const compEmail = company.email ? `Email: ${escapeHTML(company.email)}` : '';
    const compPec = company.pec ? ` &bull; PEC: ${escapeHTML(company.pec)}` : '';
    const compWeb = company.website ? ` &bull; ${escapeHTML(company.website)}` : '';
    const compRea = company.rea ? ` &bull; REA: ${escapeHTML(company.rea)}` : '';
    const compIban = company.iban ? `<div>&bull; <strong>Coordinate Bancarie (IBAN):</strong> ${escapeHTML(company.iban)}${company.bankName ? ` (${escapeHTML(company.bankName)})` : ''} - <em>Idoneo per bonifico parlante detrazioni fiscali</em></div>` : '';

    return `
      <div class="print-doc-header">
        <div class="print-brand-left">
          <img src="${escapeHTML(logoSrc)}" alt="${compName}" class="print-brand-logo" onerror="this.style.display='none'">
          <div>
            <div class="print-company-name">${compName}</div>
            <div class="print-company-sub">
              ${compAddr ? `${compAddr}<br>` : ''}
              ${compVat}${compCf}${compPhone}<br>
              ${compEmail}${compPec}${compWeb}
            </div>
          </div>
        </div>

        <div class="print-doc-meta-box">
          <div class="print-doc-type-title">Preventivo di Spesa</div>
          <div class="print-doc-number">${escapeHTML(quote.number || 'PREV-2026')}</div>
          <div class="print-doc-date">Data Emissione: <strong>${fmtDate(quote.date)}</strong></div>
          ${quote.validUntil ? `<div class="print-doc-date">Validità Offerta: <strong>${fmtDate(quote.validUntil)}</strong></div>` : ''}
        </div>
      </div>

      <div class="print-grid-parties">
        <div class="print-party-card">
          <div class="print-party-label">Impresa Esecutrice</div>
          <div class="print-party-name">${compName}</div>
          <div class="print-party-detail">${compAddr || 'Sede operativa ditta'}${compRea}</div>
          ${company.insurance ? `<div class="print-party-detail">${escapeHTML(company.insurance)}</div>` : ''}
        </div>

        <div class="print-party-card">
          <div class="print-party-label">Spettabile Committente</div>
          <div class="print-party-name">${escapeHTML(quote.clientName || 'Gentile Committente')}</div>
          ${quote.clientFiscal ? `<div class="print-party-detail">C.F. / P.IVA: <strong>${escapeHTML(quote.clientFiscal)}</strong></div>` : ''}
          ${quote.clientAddress ? `<div class="print-party-detail">Indirizzo: ${escapeHTML(quote.clientAddress)}</div>` : ''}
          ${quote.clientPhone ? `<div class="print-party-detail">Recapito: ${escapeHTML(quote.clientPhone)}</div>` : ''}
        </div>
      </div>

      <div class="print-quote-subject">
        <div class="print-quote-subject-label">Oggetto dell'Intervento / Cantiere</div>
        <div class="print-quote-subject-title">${escapeHTML(quote.title || 'Lavori di Ristrutturazione')}</div>
        ${quote.siteAddress ? `<div style="font-size:0.78rem; color:#475569; margin-top:2px;">Ubicazione Cantiere: <strong>${escapeHTML(quote.siteAddress)}</strong></div>` : ''}
      </div>

      <table class="print-computo-table">
        <thead>
          <tr>
            <th style="width:45px;">N.</th>
            <th>Descrizione Lavorazioni, Opere & Materiali</th>
            <th style="width:55px;">U.M.</th>
            <th style="width:65px;">Q.tà</th>
            <th style="width:85px;">Prezzo Unit.</th>
            <th style="width:95px;">Importo</th>
          </tr>
        </thead>
        <tbody>
          ${computoRowsHtml}
        </tbody>
      </table>

      <div class="print-summary-container">
        <div class="print-summary-card">
          <div class="print-summary-row">
            <span>Subtotale Lavorazioni Imponibile</span>
            <strong>${fmtDocMoney(totals.subtotal)}</strong>
          </div>
          ${totals.discountAmount > 0 ? `
            <div class="print-summary-row" style="color:#0f172a;">
              <span>Sconto Commerciale (${totals.discountPercent}%)</span>
              <strong>- ${fmtDocMoney(totals.discountAmount)}</strong>
            </div>
            <div class="print-summary-row">
              <span>Imponibile Netto Lavori</span>
              <strong>${fmtDocMoney(totals.taxableAmount)}</strong>
            </div>
          ` : ''}
          <div class="print-summary-row">
            <span>${vatDescription}</span>
            <strong>${fmtDocMoney(totals.vatAmount)}</strong>
          </div>
          <div class="print-summary-grand-total">
            <span class="print-summary-grand-label">Totale Preventivo</span>
            <span class="print-summary-grand-val">${fmtDocMoney(totals.grandTotal)}</span>
          </div>
        </div>
      </div>

      <div class="print-terms-box">
        <div style="font-weight:800; margin-bottom:4px; text-transform:uppercase; font-size:0.72rem; letter-spacing:0.04em; color:#0f172a;">
          Condizioni Economiche & Note Tecnico-Contrattuali
        </div>
        ${quote.paymentTerms ? `<div>&bull; <strong>Condizioni di Pagamento:</strong> ${escapeHTML(quote.paymentTerms)}</div>` : ''}
        ${compIban}
        ${quote.estimatedDays ? `<div>&bull; <strong>Tempi di Esecuzione Previsti:</strong> ${escapeHTML(quote.estimatedDays)} dall'inizio effettivo lavori</div>` : ''}
        ${quote.notes ? `<div>&bull; <strong>Note & Esclusioni:</strong> ${escapeHTML(quote.notes)}</div>` : ''}
        <div style="margin-top:4px; font-size:0.7rem; color:#64748b;">
          ${company.quoteFooterNote ? escapeHTML(company.quoteFooterNote) : "I prezzi sopra indicati restano validi per 30 giorni dalla data di emissione. Le opere saranno realizzate secondo le regole dell'arte e le vigenti normative di sicurezza."}
        </div>
      </div>

      <div class="print-signatures-grid">
        <div class="print-sig-col">
          <div class="print-sig-label">Per ${compName}</div>
          <div class="print-sig-sub">Firma e Timbro Impresa Esecutrice</div>
          <div style="height:35px;"></div>
        </div>
        <div class="print-sig-col">
          <div class="print-sig-label">Per Accettazione e Conferma d'Ordine</div>
          <div class="print-sig-sub">Data, Luogo e Firma del Committente</div>
          <div style="height:35px;"></div>
        </div>
      </div>

      <div class="print-footer-legal">
        <span>${escapeHTML(company.shortName || compName)} &bull; Documento Informatico Vettoriale</span>
        <span>${escapeHTML(quote.number || 'PREV')} - Pagina 1 di 1</span>
      </div>
    `;
  }

  previewQuote(id) {
    const q = store.getQuote(id);
    if (!q) return;

    const paper = document.getElementById('quote-preview-paper');
    const title = document.getElementById('modal-quote-preview-title');
    const printBtn = document.getElementById('btn-quote-preview-print');

    if (paper) paper.innerHTML = this.generateQuotePrintHTML(q);
    if (title) title.textContent = `Anteprima: ${q.number} - ${q.title}`;
    if (printBtn) printBtn.onclick = () => {
      this.closeModal('modal-quote-preview');
      this.printQuote(id);
    };

    this.openModal('modal-quote-preview');
  }

  previewCurrentEditorQuote() {
    this.readQuoteEditorDataFromDOM();
    if (!this.currentQuoteEditorData) return;

    const paper = document.getElementById('quote-preview-paper');
    const title = document.getElementById('modal-quote-preview-title');
    const printBtn = document.getElementById('btn-quote-preview-print');

    if (paper) paper.innerHTML = this.generateQuotePrintHTML(this.currentQuoteEditorData);
    if (title) title.textContent = `Anteprima: ${this.currentQuoteEditorData.number} - ${this.currentQuoteEditorData.title || 'Nuovo'}`;
    if (printBtn) printBtn.onclick = () => {
      this.closeModal('modal-quote-preview');
      this.printCurrentEditorQuote();
    };

    this.openModal('modal-quote-preview');
  }

  printQuote(id) {
    const q = store.getQuote(id);
    if (!q) return;

    const printDoc = document.getElementById('quote-print-document');
    if (!printDoc) return;

    printDoc.innerHTML = this.generateQuotePrintHTML(q);
    
    setTimeout(() => {
      window.print();
    }, 120);
  }

  printCurrentEditorQuote() {
    this.readQuoteEditorDataFromDOM();
    if (!this.currentQuoteEditorData) return;

    const printDoc = document.getElementById('quote-print-document');
    if (!printDoc) return;

    printDoc.innerHTML = this.generateQuotePrintHTML(this.currentQuoteEditorData);

    setTimeout(() => {
      window.print();
    }, 120);
  }

  // --- MODAL CANTIERI ---
  openSiteModal(id = null) {
    this.editingSiteId = id;
    this.currentSitePayments = [];
    this.currentSiteAttachments = [];
    const title = document.getElementById('modal-site-title');
    const form = document.getElementById('form-site');
    if (!form) return;

    if (id) {
      title.textContent = 'Modifica Cantiere';
      const s = store.data.sites.find(item => item.id === id);
      if (s) {
        document.getElementById('site-code').value = s.code;
        document.getElementById('site-name').value = s.name;
        document.getElementById('site-client').value = s.clientId;
        document.getElementById('site-address').value = s.address || '';
        document.getElementById('site-status').value = s.status || 'in_corso';
        document.getElementById('site-start-date').value = s.startDate || '';
        document.getElementById('site-end-date').value = s.endDate || '';
        document.getElementById('site-quote-amount').value = s.quoteAmount || '';
        document.getElementById('site-notes').value = s.notes || '';
        this.currentSitePayments = Array.isArray(s.payments) ? JSON.parse(JSON.stringify(s.payments)) : [];
        this.currentSiteAttachments = Array.isArray(s.attachments) ? JSON.parse(JSON.stringify(s.attachments)) : [];
      }
    } else {
      title.textContent = 'Nuovo Cantiere';
      form.reset();
      document.getElementById('site-code').value = `CANT-${new Date().getFullYear()}-${String(store.data.sites.length + 1).padStart(2, '0')}`;
      document.getElementById('site-start-date').value = new Date().toISOString().split('T')[0];
      document.getElementById('site-end-date').value = '';
      document.getElementById('site-quote-amount').value = '';
      this.currentSitePayments = [];
      this.currentSiteAttachments = [];
    }

    this.renderModalPayments();
    this.renderModalAttachments();
    this.openModal('modal-site');
  }

  // --- GESTIONE ALLEGATI DOCUMENTI ---
  async handleSiteFileUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      // Limite di prudenza per file in-line JSON (5MB per file)
      if (file.size > 5 * 1024 * 1024) {
        this.showToast(`Il file ${file.name} supera 5MB. Preferisci file compressi o PDF standard`, 'error');
        continue;
      }

      try {
        const dataUrl = await this.readFileAsDataURL(file);
        const sizeFormatted = file.size > 1024 * 1024 
          ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
          : Math.round(file.size / 1024) + ' KB';

        this.currentSiteAttachments.push({
          id: 'att_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          name: file.name,
          type: file.type || 'application/octet-stream',
          sizeStr: sizeFormatted,
          dataUrl: dataUrl,
          uploadedAt: new Date().toISOString()
        });
      } catch (err) {
        console.error('Errore lettura file:', err);
        this.showToast(`Errore caricamento ${file.name}`, 'error');
      }
    }

    // Reset input per permettere di ricaricare lo stesso file se necessario
    e.target.value = '';
    this.renderModalAttachments();
    this.showToast('Allegato pronto per il salvataggio', 'info');
  }

  readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  removeSiteAttachment(index) {
    this.currentSiteAttachments.splice(index, 1);
    this.renderModalAttachments();
  }

  // Scarica o apre in modo compatibile su iOS Safari e Desktop
  downloadDataUrl(dataUrl, filename) {
    try {
      // Converti DataURL in Blob per aggirare i blocchi di Safari/Chrome sui data-URI lunghi
      const arr = dataUrl.split(',');
      const mime = (arr[0].match(/:(.*?);/) || ['', 'application/octet-stream'])[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const blobUrl = URL.createObjectURL(blob);

      // Crea link temporaneo
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'documento';
      link.target = '_blank';
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
    } catch (err) {
      console.warn('Fallback a window.open:', err);
      const win = window.open(dataUrl, '_blank');
      if (!win) {
        this.showToast('Consenti i popup per aprire il documento', 'error');
      }
    }
  }

  downloadCurrentAttachment(index) {
    const att = this.currentSiteAttachments[index];
    if (!att || !att.dataUrl) return;
    this.downloadDataUrl(att.dataUrl, att.name);
  }

  openOrDownloadAttachment(siteId, attachmentId) {
    const site = store.data.sites.find(s => s.id === siteId);
    if (!site || !site.attachments) return;

    const att = site.attachments.find(a => (a.id === attachmentId || String(site.attachments.indexOf(a)) === String(attachmentId)));
    if (!att || !att.dataUrl) {
      this.showToast('Documento non disponibile', 'error');
      return;
    }

    this.downloadDataUrl(att.dataUrl, att.name);
  }

  renderModalAttachments() {
    const container = document.getElementById('site-attachments-list');
    if (!container) return;

    if (!this.currentSiteAttachments || this.currentSiteAttachments.length === 0) {
      container.innerHTML = `
        <div style="font-size:0.78rem; color:var(--text-dim); padding:4px 0;">
          Nessun documento o file allegato a questo cantiere.
        </div>
      `;
      return;
    }

    container.innerHTML = this.currentSiteAttachments.map((att, idx) => `
      <div class="attachment-edit-row">
        <div class="attachment-edit-info">
          ${ICONS.doc}
          <span style="font-weight:700; color:#fff;">${att.name}</span>
          <span style="font-size:0.7rem; color:var(--text-dim);">(${att.sizeStr || ''})</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <button type="button" class="btn-icon" onclick="app.downloadCurrentAttachment(${idx})" title="Scarica o visualizza" style="width:30px; height:30px;">
            ${ICONS.download}
          </button>
          <button type="button" class="btn-icon" onclick="app.removeSiteAttachment(${idx})" title="Rimuovi allegato" style="width:30px; height:30px; color:var(--danger);">
            ${ICONS.delete}
          </button>
        </div>
      </div>
    `).join('');
  }

  addPaymentRow(amount = '', note = '', date = '') {
    const today = new Date().toISOString().split('T')[0];
    this.currentSitePayments.push({
      id: 'p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      date: date || today,
      amount: amount !== '' ? parseFloat(amount) : '',
      note: note || `Rata/Acconto #${this.currentSitePayments.length + 1}`
    });
    this.renderModalPayments();
  }

  removePaymentRow(index) {
    this.currentSitePayments.splice(index, 1);
    this.renderModalPayments();
  }

  renderModalPayments() {
    const container = document.getElementById('site-payments-list');
    if (!container) return;

    if (this.currentSitePayments.length === 0) {
      container.innerHTML = `
        <div style="font-size:0.78rem; color:var(--text-dim); padding:6px 0;">
          Nessun pagamento registrato finora. Clicca su "+ Aggiungi Pagamento" per inserire acconti o rate.
        </div>
      `;
      this.recalcModalPaymentSummary();
      return;
    }

    container.innerHTML = this.currentSitePayments.map((p, idx) => `
      <div class="payment-row">
        <div>
          <input type="date" class="form-input form-input-sm" value="${p.date}" 
                 onchange="app.updatePaymentField(${idx}, 'date', this.value)" style="min-height:36px; padding:4px 6px; font-size:0.78rem;">
        </div>
        <div>
          <input type="number" class="form-input form-input-sm" step="0.01" min="0" placeholder="€ Importo" 
                 value="${p.amount !== '' ? p.amount : ''}" 
                 oninput="app.updatePaymentField(${idx}, 'amount', this.value)" 
                 style="min-height:36px; padding:4px 8px; font-weight:700; color:var(--success); font-size:0.84rem;">
        </div>
        <div class="payment-note-col">
          <input type="text" class="form-input form-input-sm" placeholder="Descrizione rata (es. Acconto, 2° SAL...)" 
                 value="${p.note || ''}" 
                 oninput="app.updatePaymentField(${idx}, 'note', this.value)" 
                 style="min-height:36px; padding:4px 8px; font-size:0.78rem;">
        </div>
        <div>
          <button type="button" class="payment-row-delete" onclick="app.removePaymentRow(${idx})" title="Elimina pagamento">
            <svg viewBox="0 0 24 24" style="width:14px; height:14px; stroke:currentColor; stroke-width:2.2; fill:none;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    `).join('');

    this.recalcModalPaymentSummary();
  }

  updatePaymentField(index, field, value) {
    if (!this.currentSitePayments[index]) return;
    if (field === 'amount') {
      this.currentSitePayments[index].amount = value !== '' ? parseFloat(value) : '';
    } else {
      this.currentSitePayments[index][field] = value;
    }
    this.recalcModalPaymentSummary();
  }

  recalcModalPaymentSummary() {
    const quoteInput = document.getElementById('site-quote-amount');
    const totalPaidEl = document.getElementById('site-modal-total-paid');
    const balanceDueEl = document.getElementById('site-modal-balance-due');
    if (!totalPaidEl || !balanceDueEl) return;

    const quote = parseFloat(quoteInput ? quoteInput.value : 0) || 0;
    const totalPaid = (this.currentSitePayments || []).reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
    const balanceDue = Math.max(0, quote - totalPaid);

    totalPaidEl.textContent = fmtMoney(totalPaid);
    balanceDueEl.textContent = fmtMoney(balanceDue);
  }

  saveSite(e) {
    e.preventDefault();
    const code = document.getElementById('site-code').value;
    const name = document.getElementById('site-name').value;
    const clientId = document.getElementById('site-client').value;
    const address = document.getElementById('site-address').value;
    const status = document.getElementById('site-status').value;
    const startDate = document.getElementById('site-start-date').value;
    const endDate = document.getElementById('site-end-date').value;
    const quoteAmount = parseFloat(document.getElementById('site-quote-amount').value) || 0;
    const notes = document.getElementById('site-notes').value;

    if (!code.trim() || !name.trim()) {
      this.showToast('Inserisci codice e nome del cantiere', 'error');
      return;
    }

    if (startDate && endDate && endDate < startDate) {
      this.showToast('La data di fine non può essere precedente alla data di inizio', 'error');
      return;
    }

    // Filtra eventuali pagamenti lasciati vuoti
    const validPayments = (this.currentSitePayments || [])
      .filter(p => !isNaN(parseFloat(p.amount)) && parseFloat(p.amount) > 0)
      .map(p => ({
        id: p.id,
        date: p.date || new Date().toISOString().split('T')[0],
        amount: parseFloat(p.amount) || 0,
        note: (p.note || '').trim()
      }));

    if (this.editingSiteId) {
      store.updateSite(this.editingSiteId, { 
        code, 
        name, 
        clientId, 
        address, 
        status, 
        startDate, 
        endDate, 
        quoteAmount, 
        payments: validPayments, 
        attachments: this.currentSiteAttachments || [],
        notes 
      });
      this.showToast('Cantiere aggiornato con successo', 'success');
    } else {
      store.addSite({ 
        code, 
        name, 
        clientId, 
        address, 
        status, 
        startDate, 
        endDate, 
        quoteAmount, 
        payments: validPayments, 
        attachments: this.currentSiteAttachments || [],
        notes 
      });
      this.showToast('Cantiere aggiunto con successo', 'success');
    }

    this.closeModal('modal-site');
  }

  deleteSite(id) {
    if (confirm('Sei sicuro di voler eliminare questo cantiere?')) {
      store.deleteSite(id);
      this.showToast('Cantiere eliminato', 'info');
    }
  }

  // --- TIPOLOGIE DINAMICHE ---
  addWorkerRole() {
    const input = document.getElementById('new-role-input');
    if (!input || !input.value.trim()) return;
    const ok = store.addWorkerRole(input.value);
    if (ok) {
      input.value = '';
      this.showToast('Ruolo lavoratore aggiunto', 'success');
    } else {
      this.showToast('Ruolo già presente o non valido', 'error');
    }
  }

  deleteWorkerRole(role) {
    if (confirm(`Rimuovere la tipologia "${role}"?`)) {
      store.deleteWorkerRole(role);
      this.showToast('Tipologia rimossa', 'info');
    }
  }

  addExpenseCategory() {
    const input = document.getElementById('new-cat-input');
    if (!input || !input.value.trim()) return;
    const ok = store.addExpenseCategory(input.value);
    if (ok) {
      input.value = '';
      this.showToast('Categoria spesa aggiunta', 'success');
    } else {
      this.showToast('Categoria già presente o non valida', 'error');
    }
  }

  deleteExpenseCategory(cat) {
    if (confirm(`Rimuovere la categoria "${cat}"?`)) {
      store.deleteExpenseCategory(cat);
      this.showToast('Categoria rimossa', 'info');
    }
  }

  // ==========================================================================
  // Autenticazione & Database GitHub
  // ==========================================================================
  openAuthModal() {
    const saved = (typeof localStorage !== 'undefined' && localStorage.getItem('geem_auth')) ||
                  (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('geem_auth'));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        document.getElementById('gh-owner').value = parsed.owner || '';
        document.getElementById('gh-repo').value = parsed.repo || '';
        document.getElementById('gh-token').value = parsed.token || '';
      } catch (e) {}
    } else {
      document.getElementById('gh-owner').value = 'eraldxhakoj';
      document.getElementById('gh-repo').value = 'geem-data';
    }

    this.openModal('modal-auth');
  }

  async handleLogin(e) {
    e.preventDefault();
    const owner = document.getElementById('gh-owner').value.trim();
    const repo = document.getElementById('gh-repo').value.trim();
    const token = document.getElementById('gh-token').value.trim();
    const rememberMe = document.getElementById('gh-remember').checked;
    const btn = document.getElementById('btn-login-submit');

    if (!owner || !repo || !token) {
      this.showToast('Compila tutti i campi di accesso GitHub', 'error');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Connessione...';

    try {
      await store.loginGitHub(owner, repo, token, rememberMe);
      this.showToast('Connesso al Database GitHub!', 'success');
      this.closeModal('modal-auth');
    } catch (err) {
      this.showToast(`Errore: ${err.message}`, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Connetti a GitHub';
    }
  }

  handleLogout() {
    if (confirm('Vuoi disconnetterti dal repository GitHub e tornare alla modalità Demo?')) {
      store.logout();
      this.showToast('Disconnesso. Modalità Demo attiva.', 'info');
      this.closeModal('modal-auth');
    }
  }

  // ==========================================================================
  // Backup & Restore
  // ==========================================================================
  exportBackup() {
    const jsonStr = store.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_geem_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Backup JSON scaricato', 'success');
  }

  importBackup(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        await store.importFullBackup(evt.target.result);
        this.showToast('Dati ripristinati con successo!', 'success');
      } catch (err) {
        this.showToast(`Errore nel ripristino: ${err.message}`, 'error');
      }
    };
    reader.readAsText(file);
  }

  // ==========================================================================
  // Binding Eventi
  // ==========================================================================
  bindEvents() {
    document.querySelectorAll('[data-tab]').forEach(el => {
      el.addEventListener('click', () => this.switchTab(el.dataset.tab));
    });

    document.querySelectorAll('[data-subtab]').forEach(el => {
      el.addEventListener('click', () => this.switchAdminSubTab(el.dataset.subtab));
    });

    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal(modal.id);
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeSidebar();
        document.querySelectorAll('.modal-backdrop.open').forEach(m => this.closeModal(m.id));
      }
    });

    const tsWorkerSelect = document.getElementById('ts-worker');
    if (tsWorkerSelect) {
      tsWorkerSelect.addEventListener('change', () => {
        const selected = tsWorkerSelect.options[tsWorkerSelect.selectedIndex];
        const rate = selected ? selected.dataset.rate : null;
        if (rate) {
          document.getElementById('ts-rate').value = rate;
          this.updateTimesheetTotal();
        }
      });
    }

    const tsHours = document.getElementById('ts-hours');
    const tsRate = document.getElementById('ts-rate');
    if (tsHours) tsHours.addEventListener('input', () => this.updateTimesheetTotal());
    if (tsRate) tsRate.addEventListener('input', () => this.updateTimesheetTotal());

    document.querySelectorAll('[data-stepper]').forEach(btn => {
      btn.addEventListener('click', () => {
        const delta = parseFloat(btn.dataset.stepper);
        const input = document.getElementById('ts-hours');
        if (input) {
          let val = (parseFloat(input.value) || 0) + delta;
          if (val < 0.5) val = 0.5;
          input.value = val;
          this.updateTimesheetTotal();
        }
      });
    });

    document.querySelectorAll('[data-ts-period]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-ts-period]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filters.timesheetPeriod = btn.dataset.tsPeriod;
        this.renderTimesheets();
      });
    });

    const filterTsSite = document.getElementById('filter-ts-site');
    if (filterTsSite) {
      filterTsSite.addEventListener('change', () => {
        this.setTimesheetSiteFilter(filterTsSite.value);
      });
    }

    const filterTsWorker = document.getElementById('filter-ts-worker');
    if (filterTsWorker) {
      filterTsWorker.addEventListener('change', () => {
        this.setTimesheetWorkerFilter(filterTsWorker.value);
      });
    }

    const filterExpSite = document.getElementById('filter-exp-site');
    if (filterExpSite) {
      filterExpSite.addEventListener('change', () => {
        this.setExpenseSiteFilter(filterExpSite.value);
      });
    }

    const formTs = document.getElementById('form-timesheet');
    if (formTs) formTs.addEventListener('submit', (e) => this.saveTimesheet(e));

    const formExp = document.getElementById('form-expense');
    if (formExp) formExp.addEventListener('submit', (e) => this.saveExpense(e));

    const formWorker = document.getElementById('form-worker');
    if (formWorker) formWorker.addEventListener('submit', (e) => this.saveWorker(e));

    const formClient = document.getElementById('form-client');
    if (formClient) formClient.addEventListener('submit', (e) => this.saveClient(e));

    const formSite = document.getElementById('form-site');
    if (formSite) formSite.addEventListener('submit', (e) => this.saveSite(e));

    const formAuth = document.getElementById('form-auth');
    if (formAuth) formAuth.addEventListener('submit', (e) => this.handleLogin(e));

    const formCompany = document.getElementById('form-company-profile');
    if (formCompany) formCompany.addEventListener('submit', (e) => this.saveCompanyProfile(e));

    const inputCompanyLogo = document.getElementById('company-logo-file');
    if (inputCompanyLogo) inputCompanyLogo.addEventListener('change', (e) => this.handleCompanyLogoUpload(e));

    const btnCompanyLogoReset = document.getElementById('btn-reset-company-logo');
    if (btnCompanyLogoReset) btnCompanyLogoReset.addEventListener('click', () => this.resetCompanyLogo());

    const inputCompanyLogoUrl = document.getElementById('company-logo-url');
    if (inputCompanyLogoUrl) inputCompanyLogoUrl.addEventListener('input', (e) => this.onCompanyLogoUrlInput(e.target.value));

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) btnLogout.addEventListener('click', () => this.handleLogout());

    const btnExport = document.getElementById('btn-export-backup');
    if (btnExport) btnExport.addEventListener('click', () => this.exportBackup());

    const inputImport = document.getElementById('input-import-backup');
    if (inputImport) inputImport.addEventListener('change', (e) => this.importBackup(e));

    const syncBadge = document.getElementById('sync-badge');
    if (syncBadge) syncBadge.addEventListener('click', () => this.openAuthModal());

    // Disattiva il doppio tap rapido per zoomare su iOS Safari e Android Chrome
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        // Se il tap non è dentro un campo testo editable, previeni lo zoom
        const tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
        }
      }
      lastTouchEnd = now;
    }, { passive: false });
  }
}

if (typeof window !== 'undefined') {
  window.app = new GeemApp();
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.app.init();
      });
    } else {
      window.app.init();
    }
  }
}

export { GeemApp };

