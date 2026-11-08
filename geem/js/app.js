/**
 * GEEM - Application Controller
 * UI logic, rendering, event listeners, and interactive mobile-first UX
 */

import { store } from './state.js';

// Utilità di formattazione
const fmtMoney = (val) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val || 0);
const fmtDate = (dStr) => {
  if (!dStr) return '';
  const [y, m, d] = dStr.split('-');
  return `${d}/${m}/${y}`;
};

class GeemApp {
  constructor() {
    this.currentTab = 'hours';
    this.currentAdminSubTab = 'workers';
    this.editingTimesheetId = null;
    this.editingExpenseId = null;
    this.editingWorkerId = null;
    this.editingClientId = null;
    this.editingSiteId = null;

    this.filters = {
      timesheetPeriod: 'today',
      timesheetSite: 'all',
      expenseSite: 'all',
      expenseCategory: 'all'
    };
  }

  init() {
    this.bindEvents();
    this.subscribeState();
    this.renderAll();
    this.initDates();

    // Mostra toast di avvio
    if (store.mode === 'github') {
      this.showToast('Connesso al database GitHub', 'success');
    } else {
      this.showToast('Modalità Demo Locale attiva', 'info');
    }
  }

  // Imposta le date odierne nei campi di default
  initDates() {
    const today = new Date().toISOString().split('T')[0];
    const tsDate = document.getElementById('ts-date');
    const expDate = document.getElementById('exp-date');
    if (tsDate) tsDate.value = today;
    if (expDate) expDate.value = today;
  }

  // Iscrizione ai cambiamenti di stato
  subscribeState() {
    store.subscribe((state, changedType) => {
      this.renderSyncStatus();
      if (changedType === 'sync') return;
      this.renderAll();
    });
  }

  // Notifiche Toast
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
    }, 3800);
  }

  // Gestione Modali
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

  // Switch schermate principali
  switchTab(tabId) {
    this.currentTab = tabId;

    // Aggiorna navigazione mobile
    document.querySelectorAll('.bottom-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Aggiorna navigazione desktop
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Aggiorna sezioni visibili
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.toggle('active', sec.id === `view-${tabId}`);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Switch sotto-tab Admin
  switchAdminSubTab(subTabId) {
    this.currentAdminSubTab = subTabId;
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
    this.populateSelectDropdowns();
  }

  renderSyncStatus() {
    const badge = document.getElementById('sync-badge');
    const text = document.getElementById('sync-text');
    if (!badge || !text) return;

    badge.className = `sync-badge ${store.syncStatus}`;

    if (store.mode === 'demo') {
      text.textContent = 'Modalità Demo (Locale)';
    } else if (store.syncStatus === 'saving') {
      text.textContent = 'Salvataggio su GitHub...';
    } else if (store.syncStatus === 'error') {
      text.textContent = 'Errore sincronizzazione';
    } else {
      const timeStr = store.lastSaved ? store.lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ora';
      text.textContent = `GitHub: OK (${timeStr})`;
    }
  }

  renderKPIs() {
    const stats = store.getStats();
    
    const kpiHours = document.getElementById('kpi-hours');
    const kpiHoursCost = document.getElementById('kpi-hours-cost');
    const kpiExpenses = document.getElementById('kpi-expenses');
    const kpiSites = document.getElementById('kpi-sites');

    if (kpiHours) kpiHours.textContent = `${stats.todayHours}h`;
    if (kpiHoursCost) kpiHoursCost.textContent = fmtMoney(stats.todayHoursCost);
    if (kpiExpenses) kpiExpenses.textContent = fmtMoney(stats.todayExpensesTotal);
    if (kpiSites) kpiSites.textContent = `${stats.activeSites}`;
  }

  // Popola tutti i menu a discesa dell'app
  populateSelectDropdowns() {
    const workers = store.data.workers.filter(w => w.active);
    const sites = store.data.sites;
    const clients = store.data.clients;
    const roles = store.data.config.workerRoles;
    const expenseCats = store.data.config.expenseCategories;

    // Dropdown Lavoratori per Ore
    const tsWorker = document.getElementById('ts-worker');
    if (tsWorker) {
      const current = tsWorker.value;
      tsWorker.innerHTML = '<option value="">-- Seleziona Lavoratore --</option>' +
        workers.map(w => `<option value="${w.id}" data-rate="${w.hourlyRate}">${w.name} (${w.role})</option>`).join('');
      if (current) tsWorker.value = current;
    }

    // Dropdown Cantieri per Ore
    const tsSite = document.getElementById('ts-site');
    if (tsSite) {
      const current = tsSite.value;
      tsSite.innerHTML = '<option value="">-- Seleziona Cantiere --</option>' +
        sites.map(s => `<option value="${s.id}">${s.code} - ${s.name}</option>`).join('');
      if (current) tsSite.value = current;
    }

    // Dropdown Cantieri per Spese
    const expSite = document.getElementById('exp-site');
    if (expSite) {
      const current = expSite.value;
      expSite.innerHTML = '<option value="generale">🏢 Spesa Generale Aziendale</option>' +
        sites.map(s => `<option value="${s.id}">🏗️ ${s.code} - ${s.name}</option>`).join('');
      if (current) expSite.value = current;
    }

    // Dropdown Categorie Spese
    const expCat = document.getElementById('exp-category');
    if (expCat) {
      const current = expCat.value;
      expCat.innerHTML = expenseCats.map(c => `<option value="${c}">${c}</option>`).join('');
      if (current) expCat.value = current;
    }

    // Dropdown Ruoli Lavoratore (Form Admin Lavoratore)
    const workerRoleSelect = document.getElementById('worker-role');
    if (workerRoleSelect) {
      const current = workerRoleSelect.value;
      workerRoleSelect.innerHTML = roles.map(r => `<option value="${r}">${r}</option>`).join('');
      if (current) workerRoleSelect.value = current;
    }

    // Dropdown Clienti (Form Admin Cantiere)
    const siteClientSelect = document.getElementById('site-client');
    if (siteClientSelect) {
      const current = siteClientSelect.value;
      siteClientSelect.innerHTML = '<option value="">-- Seleziona Cliente --</option>' +
        clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
      if (current) siteClientSelect.value = current;
    }

    // Dropdown Filtro Cantieri per lista Ore
    const filterTsSite = document.getElementById('filter-ts-site');
    if (filterTsSite) {
      const current = filterTsSite.value;
      filterTsSite.innerHTML = '<option value="all">Tutti i Cantieri</option>' +
        sites.map(s => `<option value="${s.id}">${s.code} - ${s.name}</option>`).join('');
      if (current) filterTsSite.value = current;
    }

    // Dropdown Filtro Cantieri per lista Spese
    const filterExpSite = document.getElementById('filter-exp-site');
    if (filterExpSite) {
      const current = filterExpSite.value;
      filterExpSite.innerHTML = '<option value="all">Tutti i Cantieri</option><option value="generale">Spese Generali</option>' +
        sites.map(s => `<option value="${s.id}">${s.code} - ${s.name}</option>`).join('');
      if (current) filterExpSite.value = current;
    }
  }

  // --- RENDERING ORE (TIMESHEETS) ---
  renderTimesheets() {
    const list = document.getElementById('timesheets-list');
    if (!list) return;

    let entries = [...store.data.timesheets];
    const today = new Date().toISOString().split('T')[0];

    // Filtro per periodo
    if (this.filters.timesheetPeriod === 'today') {
      entries = entries.filter(e => e.date === today);
    } else if (this.filters.timesheetPeriod === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      entries = entries.filter(e => e.date >= weekAgo);
    }

    // Filtro per cantiere
    if (this.filters.timesheetSite !== 'all') {
      entries = entries.filter(e => e.siteId === this.filters.timesheetSite);
    }

    if (entries.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3>Nessuna ora registrata</h3>
          <p>Non ci sono ore per il filtro selezionato. Tocca "Registra Ore" per iniziare.</p>
          <button class="btn btn-primary" onclick="app.openTimesheetModal()">+ Registra Ore Lavoratori</button>
        </div>
      `;
      return;
    }

    list.innerHTML = entries.map(item => {
      const worker = store.data.workers.find(w => w.id === item.workerId) || { name: 'Lavoratore non trovato', role: '-' };
      const site = store.data.sites.find(s => s.id === item.siteId) || { code: 'N/D', name: 'Cantiere non trovato' };

      return `
        <div class="item-card">
          <div class="item-card-top">
            <div>
              <div class="item-card-title">${worker.name}</div>
              <div class="item-card-sub">
                <span class="item-badge badge-amber">${worker.role}</span>
                <span>• 🏗️ ${site.code} - ${site.name}</span>
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
                <span class="metric-val" style="color:#10b981;">${fmtMoney(item.total)}</span>
              </div>
            </div>
            ${item.notes ? `<div style="font-size:0.8rem; color:var(--text-muted); width:100%; margin-top:4px;">📝 ${item.notes}</div>` : ''}
            <div class="item-card-actions">
              <button class="btn-icon" title="Modifica" onclick="app.openTimesheetModal('${item.id}')">✏️</button>
              <button class="btn-icon" title="Elimina" onclick="app.deleteTimesheet('${item.id}')">🗑️</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- RENDERING SPESE (EXPENSES) ---
  renderExpenses() {
    const list = document.getElementById('expenses-list');
    if (!list) return;

    let entries = [...store.data.expenses];

    if (this.filters.expenseSite !== 'all') {
      entries = entries.filter(e => e.siteId === this.filters.expenseSite);
    }
    if (this.filters.expenseCategory !== 'all') {
      entries = entries.filter(e => e.category === this.filters.expenseCategory);
    }

    if (entries.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3>Nessuna spesa registrata</h3>
          <p>Tieni traccia delle spese per camion, benzina, materiali e scontrini.</p>
          <button class="btn btn-primary" onclick="app.openExpenseModal()">+ Nuova Spesa</button>
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
                <span>• 🏗️ ${site.code} - ${site.name}</span>
              </div>
            </div>
            <div style="text-align: right;">
              <span class="metric-val" style="color:var(--primary); font-size:1.15rem;">${fmtMoney(item.amount)}</span>
              <div style="font-size:0.75rem; color:var(--text-dim);">${fmtDate(item.date)}</div>
            </div>
          </div>
          <div class="item-card-body">
            <div style="font-size:0.82rem; color:var(--text-muted);">
              ${item.docNumber ? `<span>📄 Doc: <strong>${item.docNumber}</strong></span> ` : ''}
              ${item.notes ? `<span>• 📝 ${item.notes}</span>` : ''}
            </div>
            <div class="item-card-actions">
              <button class="btn-icon" title="Modifica" onclick="app.openExpenseModal('${item.id}')">✏️</button>
              <button class="btn-icon" title="Elimina" onclick="app.deleteExpense('${item.id}')">🗑️</button>
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

    const sites = store.data.sites;

    if (sites.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <h3>Nessun cantiere presente</h3>
          <p>Aggiungi il tuo primo cantiere nella sezione Admin.</p>
          <button class="btn btn-primary" onclick="app.openSiteModal()">+ Aggiungi Cantiere</button>
        </div>
      `;
      return;
    }

    list.innerHTML = sites.map(site => {
      const client = store.data.clients.find(c => c.id === site.clientId) || { name: 'Cliente N/D', phone: '' };
      const cost = store.getSiteCost(site.id);

      const statusBadges = {
        'in_corso': '<span class="item-badge badge-green">In Corso</span>',
        'sospeso': '<span class="item-badge badge-amber">Sospeso</span>',
        'completato': '<span class="item-badge badge-gray">Completato</span>'
      };

      return `
        <div class="item-card">
          <div class="item-card-top">
            <div>
              <div class="item-card-title">${site.code} - ${site.name}</div>
              <div class="item-card-sub">
                <span>👤 ${client.name}</span>
                ${statusBadges[site.status] || ''}
              </div>
            </div>
            <div>
              <button class="btn-icon" onclick="app.openSiteModal('${site.id}')">✏️</button>
            </div>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:8px; margin: 8px 0 12px 0;">
            ${client.phone ? `
              <a href="tel:${client.phone}" class="action-link">
                📞 Chiama: ${client.phone}
              </a>
            ` : ''}
            ${site.address ? `
              <a href="https://maps.google.com/?q=${encodeURIComponent(site.address)}" target="_blank" rel="noopener" class="action-link">
                📍 Mappa: ${site.address}
              </a>
            ` : ''}
          </div>

          <div class="item-card-body">
            <div class="item-card-metrics">
              <div class="metric-item">
                <span class="metric-label">Ore Cantiere</span>
                <span class="metric-val">${cost.hoursTotal}h</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Costo Manodopera</span>
                <span class="metric-val">${fmtMoney(cost.laborCost)}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Spese & Materiali</span>
                <span class="metric-val">${fmtMoney(cost.expensesTotal)}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Costo Totale</span>
                <span class="metric-val highlight" style="font-size:1.1rem;">${fmtMoney(cost.totalCost)}</span>
              </div>
            </div>
            ${site.notes ? `<div style="font-size:0.8rem; color:var(--text-muted); width:100%; margin-top:6px;">ℹ️ ${site.notes}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
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
              ${w.phone ? `<span>• 📞 ${w.phone}</span>` : ''}
            </div>
          </div>
          <div class="item-card-actions">
            <button class="btn-icon" onclick="app.openWorkerModal('${w.id}')">✏️</button>
            <button class="btn-icon" onclick="app.deleteWorker('${w.id}')">🗑️</button>
          </div>
        </div>
        <div class="item-card-body">
          <div class="metric-item">
            <span class="metric-label">Costo Orario Base</span>
            <span class="metric-val highlight">${fmtMoney(w.hourlyRate)}/h</span>
          </div>
          ${w.phone ? `<a href="tel:${w.phone}" class="action-link">Chiama</a>` : ''}
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
              ${c.phone ? `<span>📞 ${c.phone}</span>` : ''}
              ${c.notes ? `<span>• ${c.notes}</span>` : ''}
            </div>
          </div>
          <div class="item-card-actions">
            <button class="btn-icon" onclick="app.openClientModal('${c.id}')">✏️</button>
            <button class="btn-icon" onclick="app.deleteClient('${c.id}')">🗑️</button>
          </div>
        </div>
        ${c.phone ? `
          <div class="item-card-body">
            <a href="tel:${c.phone}" class="action-link">Chiama Cliente</a>
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
      return `
        <div class="item-card">
          <div class="item-card-top">
            <div>
              <div class="item-card-title">${s.code} - ${s.name}</div>
              <div class="item-card-sub">
                <span>Cliente: <strong>${client.name}</strong></span>
                <span>• Stato: ${s.status}</span>
              </div>
            </div>
            <div class="item-card-actions">
              <button class="btn-icon" onclick="app.openSiteModal('${s.id}')">✏️</button>
              <button class="btn-icon" onclick="app.deleteSite('${s.id}')">🗑️</button>
            </div>
          </div>
          <div class="item-card-body">
            <div style="font-size:0.82rem; color:var(--text-muted);">
              📍 ${s.address || 'Nessun indirizzo'}
            </div>
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

  // ==========================================================================
  // Modals & Action Triggers
  // ==========================================================================

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
      // Seleziona 8 ore di default
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

  // --- MODAL CANTIERI ---
  openSiteModal(id = null) {
    this.editingSiteId = id;
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
        document.getElementById('site-notes').value = s.notes || '';
      }
    } else {
      title.textContent = 'Nuovo Cantiere';
      form.reset();
      document.getElementById('site-code').value = `CANT-${new Date().getFullYear()}-${String(store.data.sites.length + 1).padStart(2, '0')}`;
    }

    this.openModal('modal-site');
  }

  saveSite(e) {
    e.preventDefault();
    const code = document.getElementById('site-code').value;
    const name = document.getElementById('site-name').value;
    const clientId = document.getElementById('site-client').value;
    const address = document.getElementById('site-address').value;
    const status = document.getElementById('site-status').value;
    const notes = document.getElementById('site-notes').value;

    if (!code.trim() || !name.trim()) {
      this.showToast('Inserisci codice e nome del cantiere', 'error');
      return;
    }

    if (this.editingSiteId) {
      store.updateSite(this.editingSiteId, { code, name, clientId, address, status, notes });
      this.showToast('Cantiere aggiornato', 'success');
    } else {
      store.addSite({ code, name, clientId, address, status, notes });
      this.showToast('Cantiere aggiunto', 'success');
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
    const saved = localStorage.getItem('geem_auth') || sessionStorage.getItem('geem_auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        document.getElementById('gh-owner').value = parsed.owner || '';
        document.getElementById('gh-repo').value = parsed.repo || '';
        document.getElementById('gh-token').value = parsed.token || '';
      } catch (e) {}
    } else {
      // Precompila username noto
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
    btn.textContent = 'Connessione in corso...';

    try {
      await store.loginGitHub(owner, repo, token, rememberMe);
      this.showToast('Connesso al Database GitHub!', 'success');
      this.closeModal('modal-auth');
    } catch (err) {
      this.showToast(`Errore: ${err.message}`, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Connetti a GitHub Privato';
    }
  }

  handleLogout() {
    if (confirm('Vuoi disconnetterti dal repository GitHub e tornare alla modalità Demo?')) {
      store.logout();
      this.showToast('Disconnesso. Sei in modalità Demo locale.', 'info');
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
    // Navigazione principale
    document.querySelectorAll('[data-tab]').forEach(el => {
      el.addEventListener('click', () => this.switchTab(el.dataset.tab));
    });

    // Navigazione sotto-tab Admin
    document.querySelectorAll('[data-subtab]').forEach(el => {
      el.addEventListener('click', () => this.switchAdminSubTab(el.dataset.subtab));
    });

    // Backdrop click per chiusura modali
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal(modal.id);
      });
    });

    // Tasto ESC per chiusura modali
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.open').forEach(m => this.closeModal(m.id));
      }
    });

    // Auto-compilazione tariffa lavoratore quando viene selezionato nel form ore
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

    // Ricalcolo totale ore in tempo reale
    const tsHours = document.getElementById('ts-hours');
    const tsRate = document.getElementById('ts-rate');
    if (tsHours) tsHours.addEventListener('input', () => this.updateTimesheetTotal());
    if (tsRate) tsRate.addEventListener('input', () => this.updateTimesheetTotal());

    // Steppers per le ore (+0.5h, -0.5h)
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

    // Filtri Ore
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
        this.filters.timesheetSite = filterTsSite.value;
        this.renderTimesheets();
      });
    }

    // Filtri Spese
    const filterExpSite = document.getElementById('filter-exp-site');
    if (filterExpSite) {
      filterExpSite.addEventListener('change', () => {
        this.filters.expenseSite = filterExpSite.value;
        this.renderExpenses();
      });
    }

    // Forms
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

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) btnLogout.addEventListener('click', () => this.handleLogout());

    // Backup
    const btnExport = document.getElementById('btn-export-backup');
    if (btnExport) btnExport.addEventListener('click', () => this.exportBackup());

    const inputImport = document.getElementById('input-import-backup');
    if (inputImport) inputImport.addEventListener('change', (e) => this.importBackup(e));

    // Badge click per aprire configurazione GitHub
    const syncBadge = document.getElementById('sync-badge');
    if (syncBadge) syncBadge.addEventListener('click', () => this.openAuthModal());
  }
}

// Inizializza l'applicazione al caricamento
window.app = new GeemApp();
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});

