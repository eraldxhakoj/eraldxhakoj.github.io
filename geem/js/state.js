/**
 * GEEM - State Management & Storage
 */

import { GitHubStorage } from './github.js';

// Dati iniziali di fabbrica / Demo
export const INITIAL_CONFIG = {
  workerRoles: [
    'Capocantiere',
    'Muratore Specializzato',
    'Muratore Comune',
    'Manovale Edile',
    'Carpentiere',
    'Cartongessista',
    'Elettricista',
    'Idraulico',
    'Operatore Mezzi Pesanti',
    'Imbianchino / Pittore'
  ],
  expenseCategories: [
    'Carburante / Benza',
    'Camion e Furgoni',
    'Materiali Edili (Cantiere)',
    'Noleggio Macchinari & Ponteggi',
    'Discarica e Smaltimento Inerti',
    'Attrezzatura da Lavoro',
    'DPI e Sicurezza',
    'Pasti e Rinfreschi Cantiere',
    'Spese Generali / Ufficio'
  ]
};

export const INITIAL_WORKERS = [
  {
    id: 'w_1',
    name: 'Marco Rossi',
    role: 'Capocantiere',
    phone: '+39 347 1234567',
    hourlyRate: 28.00,
    active: true
  },
  {
    id: 'w_2',
    name: 'Andrea Ferrari',
    role: 'Muratore Specializzato',
    phone: '+39 349 7654321',
    hourlyRate: 23.50,
    active: true
  },
  {
    id: 'w_3',
    name: 'Luca Bianchi',
    role: 'Manovale Edile',
    phone: '+39 333 9988776',
    hourlyRate: 18.00,
    active: true
  }
];

export const INITIAL_CLIENTS = [
  {
    id: 'c_1',
    name: 'Immobiliare Navigli S.r.l.',
    phone: '+39 02 8765432',
    notes: 'Referente Arch. Galli'
  },
  {
    id: 'c_2',
    name: 'Giuseppe De Luca',
    phone: '+39 340 5544332',
    notes: 'Privato - Ristrutturazione appartamento'
  }
];

export const INITIAL_PEOPLE = [
  {
    id: 'p_1',
    name: 'Dott. Roberto Marchesi',
    type: 'commercialista',
    role: 'Commercialista & Fiscale',
    company: 'Studio Marchesi & Associati',
    phone: '+39 02 4567890',
    email: 'marchesi.studio@legalmail.it',
    notes: 'Bilanci ditta, F24 e consulenza tributaria',
    active: true
  },
  {
    id: 'p_2',
    name: 'Ing. Elena Sala',
    type: 'tecnico',
    role: 'Ingegnere Strutturista',
    company: 'Studio Tecnico Sala',
    phone: '+39 338 1122334',
    email: 'elena.sala@ingegneri.it',
    notes: 'Calcoli strutturali e deposito sismico genio civile',
    active: true
  },
  {
    id: 'p_3',
    name: 'Arch. Marco Villa',
    type: 'tecnico',
    role: 'Architetto & Direttore Lavori',
    company: 'Villa Architettura',
    phone: '+39 347 5566778',
    email: 'marco.villa@architetti.it',
    notes: 'Progettazione e pratiche edilizie (CILA, SCIA, Permesso Costruire)',
    active: true
  },
  {
    id: 'p_4',
    name: 'Edil Forniture Brianza S.r.l.',
    type: 'fornitore',
    role: 'Magazzino Edile & Noleggi',
    company: 'Edil Forniture Brianza',
    phone: '+39 039 987654',
    email: 'ordini@edilforniturebrianza.it',
    notes: 'Fornitura inerti, legname, ponteggi e noleggio gru',
    active: true
  },
  {
    id: 'p_5',
    name: 'Termoidraulica Ghezzi',
    type: 'subappaltatore',
    role: 'Impianti Idraulici & Clima',
    company: 'Ghezzi Impianti Snc',
    phone: '+39 345 8899001',
    email: 'info@ghezzi-termoidraulica.it',
    hourlyRate: 35.00,
    notes: 'Certificazioni conformità impianti e linee gas',
    active: true
  },
  {
    id: 'p_6',
    name: 'Geom. Fabio Colombo',
    type: 'sicurezza',
    role: 'RSPP & Coordinatore Sicurezza',
    company: 'Safety Edilizia S.a.s.',
    phone: '+39 339 6677889',
    email: 'sicurezza@colombogeom.it',
    notes: 'Redazione PSC/POS e verifiche periodiche sicurezza in cantiere',
    active: true
  }
];

export const INITIAL_SITES = [
  {
    id: 's_1',
    code: 'CANT-2026-01',
    name: 'Ristrutturazione Villa Monza',
    clientId: 'c_1',
    address: 'Via Cavallotti 42, Monza',
    status: 'in_corso',
    startDate: '2026-02-01',
    endDate: '2026-06-30',
    quoteAmount: 45000.00,
    payments: [
      { id: 'p_1', date: '2026-02-05', amount: 15000.00, note: 'Acconto iniziale inizio lavori' },
      { id: 'p_2', date: '2026-03-20', amount: 15000.00, note: '2° SAL fine tramezze e impianti' }
    ],
    notes: 'Demolizione tramezzi e rifacimento massetto'
  },
  {
    id: 's_2',
    code: 'CANT-2026-02',
    name: 'Appartamento Milano Isola',
    clientId: 'c_2',
    address: 'Via Volturno 15, Milano',
    status: 'in_corso',
    startDate: '2026-03-15',
    endDate: '',
    quoteAmount: 18500.00,
    payments: [
      { id: 'p_3', date: '2026-03-18', amount: 6000.00, note: 'Acconto avvio cantiere' }
    ],
    notes: 'Rifacimento bagno e impianti idraulici'
  }
];

export const INITIAL_TIMESHEETS = [
  {
    id: 't_1',
    date: new Date().toISOString().split('T')[0],
    workerId: 'w_1',
    siteId: 's_1',
    hours: 8,
    hourlyRate: 28.00,
    total: 224.00,
    notes: 'Coordinamento getto e tracciamento impianti'
  },
  {
    id: 't_2',
    date: new Date().toISOString().split('T')[0],
    workerId: 'w_2',
    siteId: 's_1',
    hours: 8,
    hourlyRate: 23.50,
    total: 188.00,
    notes: 'Posa rete elettrosaldata e massetto'
  },
  {
    id: 't_3',
    date: new Date().toISOString().split('T')[0],
    workerId: 'w_3',
    siteId: 's_2',
    hours: 6.5,
    hourlyRate: 18.00,
    total: 117.00,
    notes: 'Sgombero macerie e carico furgone'
  }
];

export const INITIAL_EXPENSES = [
  {
    id: 'e_1',
    date: new Date().toISOString().split('T')[0],
    category: 'Carburante / Benza',
    siteId: 's_1',
    amount: 95.00,
    description: 'Gasolio Furgone Daily per trasporto macerie',
    docNumber: 'Scontrino Eni #341',
    notes: 'Carta aziendale'
  },
  {
    id: 'e_2',
    date: new Date().toISOString().split('T')[0],
    category: 'Materiali Edili (Cantiere)',
    siteId: 's_1',
    amount: 340.50,
    description: '15 sacchi cemento 32.5 + sabbia fine',
    docNumber: 'Fattura 88/2026 Bricoman',
    notes: 'Fornitore EdilMarket'
  },
  {
    id: 'e_3',
    date: new Date().toISOString().split('T')[0],
    category: 'Discarica e Smaltimento Inerti',
    siteId: 's_2',
    amount: 120.00,
    description: 'Scarico cassone calcinacci e piastrelle',
    docNumber: 'Formulario Rifiuti n. 1024',
    notes: ''
  }
];

class StateStore {
  constructor() {
    this.mode = 'demo'; // 'demo' o 'github'
    this.githubClient = null;
    this.listeners = new Set();
    this.syncStatus = 'synced'; // 'synced', 'saving', 'error'
    this.syncError = null;
    this.lastSaved = null;

    // Struttura dati in memoria
    this.data = {
      config: JSON.parse(JSON.stringify(INITIAL_CONFIG)),
      workers: JSON.parse(JSON.stringify(INITIAL_WORKERS)),
      clients: JSON.parse(JSON.stringify(INITIAL_CLIENTS)),
      sites: JSON.parse(JSON.stringify(INITIAL_SITES)),
      timesheets: JSON.parse(JSON.stringify(INITIAL_TIMESHEETS)),
      expenses: JSON.parse(JSON.stringify(INITIAL_EXPENSES)),
      people: JSON.parse(JSON.stringify(INITIAL_PEOPLE))
    };

    this.initFromLocal();
  }

  // Carica credenziali salvate se presenti e ripristina la cache
  initFromLocal() {
    try {
      if (typeof localStorage !== 'undefined') {
        const savedAuth = localStorage.getItem('geem_auth');
        if (savedAuth) {
          const auth = JSON.parse(savedAuth);
          if (auth.owner && auth.repo && auth.token) {
            this.mode = 'github';
            this.githubClient = new GitHubStorage(auth.owner, auth.repo, auth.token);

            // Carica l'ultima copia dei dati salvata localmente per GitHub
            const cachedGitHubData = localStorage.getItem('geem_github_cache');
            if (cachedGitHubData) {
              try {
                const parsed = JSON.parse(cachedGitHubData);
                this.data = { ...this.data, ...parsed };
              } catch (e) {}
            }
          }
        }

        // Se eravamo in demo, recuperiamo l'eventuale cache demo locale
        const savedDemo = localStorage.getItem('geem_demo_db');
        if (savedDemo && this.mode === 'demo') {
          const parsed = JSON.parse(savedDemo);
          this.data = { ...this.data, ...parsed };
        }
      }
    } catch (e) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('Errore lettura localStorage:', e);
      }
    }

    if (!Array.isArray(this.data.people)) {
      this.data.people = JSON.parse(JSON.stringify(INITIAL_PEOPLE));
    }
  }

  // Sottoscrizione ai cambiamenti
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify(changedType = null) {
    this.listeners.forEach(fn => fn(this, changedType));
    // Se siamo in modalità demo, salviamo in localStorage
    if (this.mode === 'demo' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('geem_demo_db', JSON.stringify(this.data));
      } catch (e) {
        if (typeof console !== 'undefined' && console.warn) {
          console.warn('Errore scrittura local storage demo:', e);
        }
      }
    } else if (this.mode === 'github' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('geem_github_cache', JSON.stringify(this.data));
      } catch (e) {}
    }
  }

  setSyncStatus(status, error = null) {
    this.syncStatus = status;
    this.syncError = error;
    if (status === 'synced') {
      this.lastSaved = new Date();
    }
    this.notify('sync');
  }

  // Autenticazione con GitHub
  async loginGitHub(owner, repo, token, rememberMe = true) {
    this.setSyncStatus('saving');
    const client = new GitHubStorage(owner, repo, token);
    const test = await client.testConnection();

    if (!test.success) {
      this.setSyncStatus('error', test.error);
      throw new Error(test.error);
    }

    this.githubClient = client;
    this.mode = 'github';

    if (rememberMe) {
      localStorage.setItem('geem_auth', JSON.stringify({ owner, repo, token }));
    } else {
      sessionStorage.setItem('geem_auth', JSON.stringify({ owner, repo, token }));
    }

    // Carica i dati dal repository
    await this.refreshDataFromGitHub();
    this.setSyncStatus('synced');
    this.notify('all');
    return test;
  }

  // Passa a modalità Demo / Locale
  switchToDemo() {
    this.mode = 'demo';
    this.githubClient = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('geem_auth');
      localStorage.removeItem('geem_github_cache');
    }
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('geem_auth');

    const savedDemo = typeof localStorage !== 'undefined' ? localStorage.getItem('geem_demo_db') : null;
    if (savedDemo) {
      try {
        this.data = JSON.parse(savedDemo);
      } catch (e) {
        this.resetToDefaults();
      }
    } else {
      this.resetToDefaults();
    }

    this.setSyncStatus('synced');
    this.notify('all');
  }

  // Logout
  logout() {
    this.switchToDemo();
  }

  // Reset ai dati demo standard
  resetToDefaults() {
    this.data = {
      config: JSON.parse(JSON.stringify(INITIAL_CONFIG)),
      workers: JSON.parse(JSON.stringify(INITIAL_WORKERS)),
      clients: JSON.parse(JSON.stringify(INITIAL_CLIENTS)),
      sites: JSON.parse(JSON.stringify(INITIAL_SITES)),
      timesheets: JSON.parse(JSON.stringify(INITIAL_TIMESHEETS)),
      expenses: JSON.parse(JSON.stringify(INITIAL_EXPENSES)),
      people: JSON.parse(JSON.stringify(INITIAL_PEOPLE))
    };
    if (this.mode === 'demo' && typeof localStorage !== 'undefined') {
      localStorage.setItem('geem_demo_db', JSON.stringify(this.data));
    }
    this.notify('all');
  }

  // Carica i dati completi da GitHub
  async refreshDataFromGitHub() {
    if (!this.githubClient) return;

    this.setSyncStatus('saving');
    try {
      const { data, anyMissing } = await this.githubClient.fetchAll();

      // Se alcuni file non esistono, inizializziamo il DB
      if (anyMissing) {
        const initialToPush = {
          config: data.config || this.data.config,
          workers: data.workers || this.data.workers,
          clients: data.clients || this.data.clients,
          sites: data.sites || this.data.sites,
          timesheets: data.timesheets || this.data.timesheets,
          expenses: data.expenses || this.data.expenses,
          people: data.people || this.data.people || []
        };
        await this.githubClient.initDatabase(initialToPush);
        // Rileggi
        const reload = await this.githubClient.fetchAll();
        this.data = { ...reload.data, people: reload.data.people || [] };
      } else {
        this.data = { ...data, people: data.people || [] };
      }

      // Salva copia cache in locale per ricaricamenti istantanei
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem('geem_github_cache', JSON.stringify(this.data));
        } catch (e) {}
      }

      this.setSyncStatus('synced');
      this.notify('all');
    } catch (err) {
      this.setSyncStatus('error', err.message);
      throw err;
    }
  }

  // Salvataggio asincrono su GitHub per una sezione specifica
  async syncKeyToGitHub(key, commitMessage) {
    if (this.mode !== 'github' || !this.githubClient) return;

    this.setSyncStatus('saving');
    try {
      const filePath = `data/${key}.json`;
      await this.githubClient.writeFile(filePath, this.data[key], commitMessage || `Update ${key}`);
      this.setSyncStatus('synced');
    } catch (err) {
      console.error(`Errore nel salvataggio di ${key}:`, err);
      this.setSyncStatus('error', err.message);
    }
  }

  // ===== GESTIONE ORE (TIMESHEETS) =====
  addTimesheet(entry) {
    const newEntry = {
      id: 't_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      date: entry.date || new Date().toISOString().split('T')[0],
      workerId: entry.workerId,
      siteId: entry.siteId,
      hours: parseFloat(entry.hours) || 0,
      hourlyRate: parseFloat(entry.hourlyRate) || 0,
      total: (parseFloat(entry.hours) || 0) * (parseFloat(entry.hourlyRate) || 0),
      notes: (entry.notes || '').trim()
    };

    this.data.timesheets.unshift(newEntry);
    this.notify('timesheets');
    this.syncKeyToGitHub('timesheets', `Aggiunte ore lavoratore: ${newEntry.hours}h`);
    return newEntry;
  }

  updateTimesheet(id, updated) {
    const index = this.data.timesheets.findIndex(t => t.id === id);
    if (index === -1) return false;

    const current = this.data.timesheets[index];
    const hours = parseFloat(updated.hours !== undefined ? updated.hours : current.hours) || 0;
    const hourlyRate = parseFloat(updated.hourlyRate !== undefined ? updated.hourlyRate : current.hourlyRate) || 0;

    this.data.timesheets[index] = {
      ...current,
      ...updated,
      hours,
      hourlyRate,
      total: hours * hourlyRate
    };

    this.notify('timesheets');
    this.syncKeyToGitHub('timesheets', `Modifica ore registrazione ${id}`);
    return true;
  }

  deleteTimesheet(id) {
    this.data.timesheets = this.data.timesheets.filter(t => t.id !== id);
    this.notify('timesheets');
    this.syncKeyToGitHub('timesheets', `Eliminazione registrazione ore ${id}`);
    return true;
  }

  // ===== GESTIONE SPESE (EXPENSES) =====
  addExpense(expense) {
    const newExpense = {
      id: 'e_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      date: expense.date || new Date().toISOString().split('T')[0],
      category: expense.category,
      siteId: expense.siteId || 'generale',
      amount: parseFloat(expense.amount) || 0,
      description: (expense.description || '').trim(),
      docNumber: (expense.docNumber || '').trim(),
      notes: (expense.notes || '').trim()
    };

    this.data.expenses.unshift(newExpense);
    this.notify('expenses');
    this.syncKeyToGitHub('expenses', `Nuova spesa: €${newExpense.amount} (${newExpense.category})`);
    return newExpense;
  }

  updateExpense(id, updated) {
    const index = this.data.expenses.findIndex(e => e.id === id);
    if (index === -1) return false;

    this.data.expenses[index] = {
      ...this.data.expenses[index],
      ...updated,
      amount: parseFloat(updated.amount !== undefined ? updated.amount : this.data.expenses[index].amount) || 0
    };

    this.notify('expenses');
    this.syncKeyToGitHub('expenses', `Modifica spesa ${id}`);
    return true;
  }

  deleteExpense(id) {
    this.data.expenses = this.data.expenses.filter(e => e.id !== id);
    this.notify('expenses');
    this.syncKeyToGitHub('expenses', `Eliminazione spesa ${id}`);
    return true;
  }

  // ===== GESTIONE LAVORATORI =====
  addWorker(worker) {
    const newWorker = {
      id: 'w_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: (worker.name || '').trim(),
      role: worker.role || 'Manovale Edile',
      phone: (worker.phone || '').trim(),
      hourlyRate: parseFloat(worker.hourlyRate) || 20.00,
      active: worker.active !== undefined ? worker.active : true
    };

    this.data.workers.push(newWorker);
    this.notify('workers');
    this.syncKeyToGitHub('workers', `Aggiunto lavoratore: ${newWorker.name}`);
    return newWorker;
  }

  updateWorker(id, updated) {
    const index = this.data.workers.findIndex(w => w.id === id);
    if (index === -1) return false;

    this.data.workers[index] = {
      ...this.data.workers[index],
      ...updated,
      hourlyRate: parseFloat(updated.hourlyRate !== undefined ? updated.hourlyRate : this.data.workers[index].hourlyRate) || 0
    };

    this.notify('workers');
    this.syncKeyToGitHub('workers', `Modifica anagrafica lavoratore ${id}`);
    return true;
  }

  deleteWorker(id) {
    this.data.workers = this.data.workers.filter(w => w.id !== id);
    this.notify('workers');
    this.syncKeyToGitHub('workers', `Eliminazione lavoratore ${id}`);
    return true;
  }

  // ===== GESTIONE CLIENTI =====
  addClient(client) {
    const newClient = {
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: (client.name || '').trim(),
      phone: (client.phone || '').trim(),
      notes: (client.notes || '').trim()
    };

    this.data.clients.push(newClient);
    this.notify('clients');
    this.syncKeyToGitHub('clients', `Aggiunto cliente: ${newClient.name}`);
    return newClient;
  }

  updateClient(id, updated) {
    const index = this.data.clients.findIndex(c => c.id === id);
    if (index === -1) return false;

    this.data.clients[index] = {
      ...this.data.clients[index],
      ...updated
    };

    this.notify('clients');
    this.syncKeyToGitHub('clients', `Modifica cliente ${id}`);
    return true;
  }

  deleteClient(id) {
    this.data.clients = this.data.clients.filter(c => c.id !== id);
    this.notify('clients');
    this.syncKeyToGitHub('clients', `Eliminazione cliente ${id}`);
    return true;
  }

  // ===== GESTIONE PERSONE & ANAGRAFICHE COMPLETE =====
  addPerson(person) {
    const newPerson = {
      id: 'p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: (person.name || '').trim(),
      type: person.type || 'altro', // 'commercialista', 'tecnico', 'fornitore', 'subappaltatore', 'sicurezza', 'collaboratore', 'altro'
      role: (person.role || '').trim(),
      company: (person.company || '').trim(),
      phone: (person.phone || '').trim(),
      email: (person.email || '').trim(),
      hourlyRate: person.hourlyRate ? (parseFloat(person.hourlyRate) || null) : null,
      notes: (person.notes || '').trim(),
      active: person.active !== undefined ? person.active : true,
      createdAt: new Date().toISOString()
    };

    if (!Array.isArray(this.data.people)) {
      this.data.people = [];
    }
    this.data.people.push(newPerson);
    this.notify('people');
    this.syncKeyToGitHub('people', `Aggiunta persona: ${newPerson.name} (${newPerson.type})`);
    return newPerson;
  }

  updatePerson(id, updated) {
    if (!Array.isArray(this.data.people)) this.data.people = [];
    const index = this.data.people.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.data.people[index] = {
      ...this.data.people[index],
      ...updated,
      hourlyRate: updated.hourlyRate !== undefined 
        ? (updated.hourlyRate ? parseFloat(updated.hourlyRate) : null) 
        : this.data.people[index].hourlyRate
    };

    this.notify('people');
    this.syncKeyToGitHub('people', `Modifica anagrafica persona ${id}`);
    return true;
  }

  deletePerson(id) {
    if (!Array.isArray(this.data.people)) this.data.people = [];
    this.data.people = this.data.people.filter(p => p.id !== id);
    this.notify('people');
    this.syncKeyToGitHub('people', `Eliminazione persona ${id}`);
    return true;
  }

  // Restituisce l'elenco unificato di TUTTE le persone (lavoratori + clienti + professionisti)
  getAllPeople() {
    const list = [];

    // 1. Lavoratori e Operai
    (this.data.workers || []).forEach(w => {
      list.push({
        id: w.id,
        name: w.name,
        type: w.type || 'dipendente',
        typeLabel: w.type === 'subappaltatore' ? 'Subappaltatore / Artigiano' : 'Dipendente / Operaio',
        role: w.role || 'Operaio Edile',
        company: w.company || '',
        phone: w.phone || '',
        email: w.email || '',
        hourlyRate: w.hourlyRate || null,
        notes: w.notes || '',
        active: w.active !== undefined ? w.active : true,
        source: 'worker'
      });
    });

    // 2. Clienti (Committenti)
    (this.data.clients || []).forEach(c => {
      const sitesCount = (this.data.sites || []).filter(s => s.clientId === c.id).length;
      list.push({
        id: c.id,
        name: c.name,
        type: 'cliente',
        typeLabel: 'Cliente Committente',
        role: 'Cliente',
        company: c.company || '',
        phone: c.phone || '',
        email: c.email || '',
        hourlyRate: null,
        notes: c.notes || '',
        active: true,
        sitesCount: sitesCount,
        source: 'client'
      });
    });

    // 3. Altri contatti e professionisti della filiera edile
    const typeLabels = {
      commercialista: 'Commercialista & Fisco',
      tecnico: 'Geometra / Architetto / DL',
      fornitore: 'Fornitore Materiali',
      subappaltatore: 'Subappaltatore / Artigiano',
      sicurezza: 'Sicurezza Cantiere / RSPP',
      collaboratore: 'Collaboratore Esterno',
      altro: 'Altro Professionista'
    };

    (this.data.people || []).forEach(p => {
      list.push({
        id: p.id,
        name: p.name,
        type: p.type || 'altro',
        typeLabel: typeLabels[p.type] || 'Professionista',
        role: p.role || '',
        company: p.company || '',
        phone: p.phone || '',
        email: p.email || '',
        hourlyRate: p.hourlyRate || null,
        notes: p.notes || '',
        active: p.active !== undefined ? p.active : true,
        source: 'person'
      });
    });

    return list;
  }

  // ===== GESTIONE CANTIERI =====
  addSite(site) {
    const quoteAmount = parseFloat(site.quoteAmount) || 0;
    const payments = Array.isArray(site.payments) ? site.payments.map(p => ({
      id: p.id || ('p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)),
      date: p.date || new Date().toISOString().split('T')[0],
      amount: parseFloat(p.amount) || 0,
      note: (p.note || '').trim()
    })) : [];

    const newSite = {
      id: 's_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      code: (site.code || `CANT-${Date.now().toString().slice(-4)}`).trim(),
      name: (site.name || '').trim(),
      clientId: site.clientId || '',
      address: (site.address || '').trim(),
      status: site.status || 'in_corso',
      startDate: site.startDate || '',
      endDate: site.endDate || '',
      quoteAmount: quoteAmount,
      payments: payments,
      attachments: Array.isArray(site.attachments) ? site.attachments : [],
      notes: (site.notes || '').trim()
    };

    this.data.sites.push(newSite);
    this.notify('sites');
    this.syncKeyToGitHub('sites', `Nuovo cantiere: ${newSite.code} ${newSite.name}`);
    return newSite;
  }

  updateSite(id, updated) {
    const index = this.data.sites.findIndex(s => s.id === id);
    if (index === -1) return false;

    const current = this.data.sites[index];
    const quoteAmount = updated.quoteAmount !== undefined ? (parseFloat(updated.quoteAmount) || 0) : (current.quoteAmount || 0);
    const payments = updated.payments !== undefined ? (Array.isArray(updated.payments) ? updated.payments.map(p => ({
      id: p.id || ('p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)),
      date: p.date || new Date().toISOString().split('T')[0],
      amount: parseFloat(p.amount) || 0,
      note: (p.note || '').trim()
    })) : []) : (current.payments || []);

    const attachments = updated.attachments !== undefined ? updated.attachments : (current.attachments || []);

    this.data.sites[index] = {
      ...current,
      ...updated,
      quoteAmount,
      payments,
      attachments
    };

    this.notify('sites');
    this.syncKeyToGitHub('sites', `Modifica cantiere ${id}`);
    return true;
  }

  deleteSite(id) {
    this.data.sites = this.data.sites.filter(s => s.id !== id);
    this.notify('sites');
    this.syncKeyToGitHub('sites', `Eliminazione cantiere ${id}`);
    return true;
  }

  // ===== GESTIONE TIPOLOGIE / CONFIG =====
  addWorkerRole(role) {
    const r = role.trim();
    if (!r || this.data.config.workerRoles.includes(r)) return false;
    this.data.config.workerRoles.push(r);
    this.notify('config');
    this.syncKeyToGitHub('config', `Aggiunta tipologia lavoratore: ${r}`);
    return true;
  }

  deleteWorkerRole(role) {
    this.data.config.workerRoles = this.data.config.workerRoles.filter(r => r !== role);
    this.notify('config');
    this.syncKeyToGitHub('config', `Rimozione tipologia lavoratore: ${role}`);
    return true;
  }

  addExpenseCategory(cat) {
    const c = cat.trim();
    if (!c || this.data.config.expenseCategories.includes(c)) return false;
    this.data.config.expenseCategories.push(c);
    this.notify('config');
    this.syncKeyToGitHub('config', `Aggiunta categoria spesa: ${c}`);
    return true;
  }

  deleteExpenseCategory(cat) {
    this.data.config.expenseCategories = this.data.config.expenseCategories.filter(c => c !== cat);
    this.notify('config');
    this.syncKeyToGitHub('config', `Rimozione categoria spesa: ${cat}`);
    return true;
  }

  // ===== ESPORTAZIONE / IMPORTAZIONE BACKUP =====
  exportFullBackup() {
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      data: this.data
    }, null, 2);
  }

  async importFullBackup(jsonString) {
    const parsed = JSON.parse(jsonString);
    if (!parsed.data) throw new Error('File di backup non valido');

    this.data = parsed.data;
    this.notify('all');

    if (this.mode === 'github' && this.githubClient) {
      await this.githubClient.initDatabase(this.data);
    }
  }

  // Calcoli e aggregazioni statistiche
  getStats() {
    const today = new Date().toISOString().split('T')[0];

    const todayTimesheets = this.data.timesheets.filter(t => t.date === today);
    const todayHours = todayTimesheets.reduce((acc, t) => acc + (t.hours || 0), 0);
    const todayHoursCost = todayTimesheets.reduce((acc, t) => acc + (t.total || 0), 0);

    const todayExpenses = this.data.expenses.filter(e => e.date === today);
    const todayExpensesTotal = todayExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);

    const activeSites = this.data.sites.filter(s => s.status === 'in_corso').length;
    const activeWorkers = this.data.workers.filter(w => w.active).length;

    return {
      today,
      todayHours,
      todayHoursCost,
      todayExpensesTotal,
      activeSites,
      activeWorkers
    };
  }

  // Calcola il costo totale e i pagamenti di un cantiere
  getSiteCost(siteId) {
    const site = this.data.sites.find(s => s.id === siteId);
    const siteTimesheets = this.data.timesheets.filter(t => t.siteId === siteId);
    const hoursTotal = siteTimesheets.reduce((acc, t) => acc + (t.hours || 0), 0);
    const laborCost = siteTimesheets.reduce((acc, t) => acc + (t.total || 0), 0);

    const siteExpenses = this.data.expenses.filter(e => e.siteId === siteId);
    const expensesTotal = siteExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);

    const quoteAmount = (site && parseFloat(site.quoteAmount)) || 0;
    const payments = (site && Array.isArray(site.payments)) ? site.payments : [];
    const attachments = (site && Array.isArray(site.attachments)) ? site.attachments : [];
    const paymentsTotal = payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
    const balanceRemaining = Math.max(0, quoteAmount - paymentsTotal);

    const totalCost = laborCost + expensesTotal;
    // Calcolo Utile & Margine Operativo
    const profit = quoteAmount > 0 ? (quoteAmount - totalCost) : 0;
    const profitMargin = quoteAmount > 0 ? Math.round((profit / quoteAmount) * 100) : null;
    const costBudgetUsage = quoteAmount > 0 ? Math.round((totalCost / quoteAmount) * 100) : null;

    return {
      hoursTotal,
      laborCost,
      expensesTotal,
      totalCost,
      quoteAmount,
      paymentsTotal,
      balanceRemaining,
      profit,
      profitMargin,
      costBudgetUsage,
      paymentsCount: payments.length,
      attachmentsCount: attachments.length
    };
  }

  // Riepilogo Finanziario Aziendale, Cash Flow & Scadenzario Incassi con filtri periodo
  getFinancialSummary(periodKey = 'year') {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0 to 11

    let periodType = 'date'; // 'date' | 'active_sites' | 'all'
    let startDate = '';
    let endDate = '';
    let periodLabel = '';

    const pad = (n) => String(n).padStart(2, '0');
    const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

    if (periodKey === 'month') {
      startDate = `${currentYear}-${pad(currentMonth + 1)}-01`;
      const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
      endDate = `${currentYear}-${pad(currentMonth + 1)}-${pad(lastDay)}`;
      periodLabel = `${monthNames[currentMonth]} ${currentYear}`;
    } else if (periodKey === 'last_month') {
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      startDate = `${prevYear}-${pad(prevMonth + 1)}-01`;
      const lastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
      endDate = `${prevYear}-${pad(prevMonth + 1)}-${pad(lastDay)}`;
      periodLabel = `${monthNames[prevMonth]} ${prevYear}`;
    } else if (periodKey === 'year') {
      startDate = `${currentYear}-01-01`;
      endDate = `${currentYear}-12-31`;
      periodLabel = `Anno ${currentYear}`;
    } else if (periodKey === 'active') {
      periodType = 'active_sites';
      periodLabel = 'Cantieri In Corso';
    } else {
      // 'all'
      periodType = 'all';
      periodLabel = 'Tutto lo Storico';
    }

    let totalQuotes = 0;
    let totalPaid = 0;
    let totalBalanceDue = 0;
    let totalLaborCost = 0;
    let totalExpenses = 0;
    let totalCosts = 0;
    let totalHours = 0;

    const sitesWithPendingBalance = [];
    const sitesAtRisk = [];

    if (periodType === 'date') {
      // 1. Manodopera nel periodo
      const periodTimesheets = this.data.timesheets.filter(t => t.date && t.date >= startDate && t.date <= endDate);
      totalHours = periodTimesheets.reduce((acc, t) => acc + (t.hours || 0), 0);
      totalLaborCost = periodTimesheets.reduce((acc, t) => acc + (t.total || 0), 0);

      // 2. Spese nel periodo
      const periodExpenses = this.data.expenses.filter(e => e.date && e.date >= startDate && e.date <= endDate);
      totalExpenses = periodExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);
      totalCosts = totalLaborCost + totalExpenses;

      // 3. Incassi e commesse
      this.data.sites.forEach(site => {
        const cost = this.getSiteCost(site.id);
        const payments = Array.isArray(site.payments) ? site.payments : [];

        // Pagamenti ricevuti nel periodo selezionato
        const periodPayments = payments.filter(p => p.date && p.date >= startDate && p.date <= endDate);
        const periodPaid = periodPayments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
        totalPaid += periodPaid;

        // Attività cantiere nel periodo
        const hasActivity = (
          (site.startDate && site.startDate >= startDate && site.startDate <= endDate) ||
          periodPayments.length > 0 ||
          periodTimesheets.some(t => t.siteId === site.id) ||
          periodExpenses.some(e => e.siteId === site.id)
        );

        if (hasActivity) {
          totalQuotes += (parseFloat(site.quoteAmount) || 0);
        }

        // Crediti vivi (saldo da incassare)
        if (cost.quoteAmount > 0 && cost.balanceRemaining > 0) {
          totalBalanceDue += cost.balanceRemaining;
          sitesWithPendingBalance.push({
            site,
            cost,
            percentPaid: cost.quoteAmount > 0 ? Math.round((cost.paymentsTotal / cost.quoteAmount) * 100) : 0,
            isCompleted: site.status === 'completato'
          });
        }

        // Alert redditività
        if (cost.quoteAmount > 0 && (cost.profit < 0 || (cost.costBudgetUsage !== null && cost.costBudgetUsage >= 85))) {
          sitesAtRisk.push({ site, cost });
        }
      });
    } else if (periodType === 'active_sites') {
      // Solo commesse aperte
      const activeSitesList = this.data.sites.filter(s => s.status !== 'completato');

      activeSitesList.forEach(site => {
        const cost = this.getSiteCost(site.id);
        totalQuotes += cost.quoteAmount;
        totalPaid += cost.paymentsTotal;
        totalBalanceDue += cost.balanceRemaining;
        totalLaborCost += cost.laborCost;
        totalExpenses += cost.expensesTotal;
        totalCosts += cost.totalCost;
        totalHours += cost.hoursTotal;

        if (cost.quoteAmount > 0 && cost.balanceRemaining > 0) {
          sitesWithPendingBalance.push({
            site,
            cost,
            percentPaid: cost.quoteAmount > 0 ? Math.round((cost.paymentsTotal / cost.quoteAmount) * 100) : 0,
            isCompleted: false
          });
        }

        if (cost.quoteAmount > 0 && (cost.profit < 0 || (cost.costBudgetUsage !== null && cost.costBudgetUsage >= 85))) {
          sitesAtRisk.push({ site, cost });
        }
      });
    } else {
      // 'all' - Tutto lo storico cumulativo
      this.data.sites.forEach(site => {
        const cost = this.getSiteCost(site.id);
        totalQuotes += cost.quoteAmount;
        totalPaid += cost.paymentsTotal;
        totalBalanceDue += cost.balanceRemaining;
        totalLaborCost += cost.laborCost;
        totalExpenses += cost.expensesTotal;
        totalCosts += cost.totalCost;
        totalHours += cost.hoursTotal;

        if (cost.quoteAmount > 0 && cost.balanceRemaining > 0) {
          sitesWithPendingBalance.push({
            site,
            cost,
            percentPaid: cost.quoteAmount > 0 ? Math.round((cost.paymentsTotal / cost.quoteAmount) * 100) : 0,
            isCompleted: site.status === 'completato'
          });
        }

        if (cost.quoteAmount > 0 && (cost.profit < 0 || (cost.costBudgetUsage !== null && cost.costBudgetUsage >= 85))) {
          sitesAtRisk.push({ site, cost });
        }
      });
    }

    // Ordina cantieri con saldo pendente: prima i completati (emergenza sollecito!), poi per saldo decrescente
    sitesWithPendingBalance.sort((a, b) => {
      if (a.isCompleted && !b.isCompleted) return -1;
      if (!a.isCompleted && b.isCompleted) return 1;
      return b.cost.balanceRemaining - a.cost.balanceRemaining;
    });

    const totalProfit = periodType === 'date'
      ? (totalPaid - totalCosts)
      : (totalQuotes > 0 ? (totalQuotes - totalCosts) : 0);

    const avgProfitMargin = periodType === 'date'
      ? (totalPaid > 0 ? Math.round(((totalPaid - totalCosts) / totalPaid) * 100) : null)
      : (totalQuotes > 0 ? Math.round(((totalQuotes - totalCosts) / totalQuotes) * 100) : null);

    const overallPaidPercent = totalQuotes > 0 ? Math.round((totalPaid / totalQuotes) * 100) : 0;

    return {
      periodKey,
      periodType,
      periodLabel,
      startDate,
      endDate,
      totalQuotes,
      totalPaid,
      totalBalanceDue,
      totalLaborCost,
      totalExpenses,
      totalCosts,
      totalHours,
      totalProfit,
      avgProfitMargin,
      overallPaidPercent,
      sitesWithPendingBalance,
      sitesAtRisk,
      pendingCount: sitesWithPendingBalance.length,
      completedWithBalanceCount: sitesWithPendingBalance.filter(s => s.isCompleted).length
    };
  }
}

export const store = new StateStore();
