/**
 * GEEM - Application Controller
 * UI logic, rendering, event listeners, and interactive mobile-first UX
 */

import { store } from './state.js';

// SVG Icons Helpers per render rapido senza emoji
const ICONS = {
  edit: `<svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  delete: `<svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
  phone: `<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  map: `<svg viewBox="0 0 24 24"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
  site: `<svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l8-4v18M13 11l6 3v7M9 9h1M9 13h1M9 17h1"/></svg>`,
  user: `<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  company: `<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  doc: `<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  note: `<svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  clip: `<svg viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,
  download: `<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`
};

// Utilità di formattazione
const fmtMoney = (val) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val || 0);
const fmtDate = (dStr) => {
  if (!dStr) return '';
  const [y, m, d] = dStr.split('-');
  return `${d}/${m}/${y}`;
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

    // Calendario per il registro ore
    this.selectedCalendarDate = new Date().toISOString().split('T')[0];
    this.calendarMode = 'day'; // 'day' | 'week' | 'month'
    this.calendarWeekOffset = 0; // 0 = settimana corrente, -1 = precedente, +1 = successiva
    this.calendarMonthOffset = 0; // 0 = mese corrente, -1 = precedente, +1 = successivo

    this.filters = {
      timesheetSite: 'all',
      expenseSite: 'all',
      expenseCategory: 'all',
      siteStatus: 'all'
    };
  }

  init() {
    this.bindEvents();
    this.subscribeState();
    this.renderAll();
    this.initDates();

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

  switchTab(tabId) {
    this.currentTab = tabId;

    document.querySelectorAll('.bottom-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.toggle('active', sec.id === `view-${tabId}`);
    });

    window.scrollTo(0, 0);
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
    this.filters.siteStatus = status;
    this.renderSites();
  }

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
      const current = filterTsSite.value;
      filterTsSite.innerHTML = '<option value="all">Tutti i Cantieri</option>' +
        sites.map(s => `<option value="${s.id}">${s.code} - ${s.name}</option>`).join('');
      if (current) filterTsSite.value = current;
    }

    const filterExpSite = document.getElementById('filter-exp-site');
    if (filterExpSite) {
      const current = filterExpSite.value;
      filterExpSite.innerHTML = '<option value="all">Tutti i Cantieri e Spese Generali</option><option value="generale">Solo Spese Generali</option>' +
        sites.map(s => `<option value="${s.id}">${s.code} - ${s.name}</option>`).join('');
      if (current) filterExpSite.value = current;
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
    this.renderTimesheets();
  }

  selectCalendarDate(isoStr, switchModeToDay = false) {
    this.selectedCalendarDate = isoStr;
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

  // --- RENDERING ORE (TIMESHEETS CON CALENDARIO) ---
  renderTimesheets() {
    const list = document.getElementById('timesheets-list');
    const strip = document.getElementById('calendar-week-strip');
    const monthLabel = document.getElementById('cal-month-label');
    const summary = document.getElementById('selected-day-summary');
    const weekSection = document.getElementById('week-view-section');
    const monthSection = document.getElementById('month-view-section');
    if (!list) return;

    const todayIso = new Date().toISOString().split('T')[0];
    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

    // Filtra i timesheets complessivi in base all'eventuale cantiere selezionato
    let filteredTimesheets = store.data.timesheets;
    if (this.filters.timesheetSite !== 'all') {
      filteredTimesheets = filteredTimesheets.filter(e => e.siteId === this.filters.timesheetSite);
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

    // Filtra le registrazioni per il giorno selezionato
    let entries = filteredTimesheets.filter(e => e.date === this.selectedCalendarDate);

    // Aggiorna riepilogo del giorno selezionato
    if (summary) {
      const dayTotalHours = entries.reduce((acc, t) => acc + (t.hours || 0), 0);
      const dayTotalCost = entries.reduce((acc, t) => acc + (t.total || 0), 0);
      const isSelToday = this.selectedCalendarDate === todayIso;

      summary.innerHTML = `
        <span><strong>${fmtDate(this.selectedCalendarDate)}</strong> ${isSelToday ? '<span class="day-badge">(Oggi)</span>' : ''}</span>
        <span>Totale: <strong style="color:var(--primary);">${dayTotalHours}h</strong> (${fmtMoney(dayTotalCost)})</span>
      `;
    }

    if (entries.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>
          <h3>Nessuna ora registrata</h3>
          <p>Nessun lavoratore registrato per il giorno <strong>${fmtDate(this.selectedCalendarDate)}</strong>.</p>
          <button class="btn btn-primary" onclick="app.openTimesheetModalForDate('${this.selectedCalendarDate}')">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Registra Ore su questo giorno
          </button>
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

    let sites = [...store.data.sites];
    if (this.filters.siteStatus && this.filters.siteStatus !== 'all') {
      sites = sites.filter(s => s.status === this.filters.siteStatus);
    }

    if (sites.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l8-4v18M13 11l6 3v7M9 9h1M9 13h1M9 17h1"/></svg>
          <h3>Nessun cantiere presente</h3>
          <p>Aggiungi il tuo primo cantiere nella sezione Admin.</p>
          <button class="btn btn-primary" onclick="app.openSiteModal()">
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Aggiungi Cantiere
          </button>
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

      const attachmentsBadge = (site.attachments && site.attachments.length > 0)
        ? `<span class="item-badge badge-gray" style="font-size:0.68rem;">${ICONS.clip} ${site.attachments.length}</span>`
        : '';

      const profitBadge = (cost.quoteAmount > 0 && cost.profitMargin !== null)
        ? (cost.profit >= 0
            ? `<span class="item-badge badge-green" style="font-size:0.68rem;">+${cost.profitMargin}% utile</span>`
            : `<span class="item-badge badge-red" style="font-size:0.68rem;">${cost.profitMargin}% perdita</span>`)
        : '';

      return `
        <div class="site-card-compact" onclick="app.openSiteDetailModal('${site.id}')">
          <div class="site-card-compact-head">
            <div class="site-card-compact-title">${site.code} - ${site.name}</div>
            <div style="display:flex; align-items:center; gap:6px;">
              ${profitBadge}
              ${attachmentsBadge}
              ${statusBadges[site.status] || ''}
              <span class="site-card-compact-arrow">
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </span>
            </div>
          </div>

          <div class="site-card-compact-sub">
            <span class="sub-icon">${ICONS.user} ${client.name}</span>
            ${site.address ? `<span class="sub-icon">${ICONS.map} ${site.address}</span>` : ''}
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

    if (titleEl) titleEl.textContent = `${site.code} - ${site.name}`;
    if (subEl) subEl.textContent = `Cliente: ${client.name}`;
    if (editBtn) {
      editBtn.onclick = () => {
        this.closeModal('modal-site-detail');
        this.openSiteModal(site.id);
      };
    }

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
        <div style="display:flex; gap:6px;">
          ${client.phone ? `<a href="tel:${client.phone}" class="action-link">${ICONS.phone} Chiama</a>` : ''}
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
          ${w.phone ? `<a href="tel:${w.phone}" class="action-link">${ICONS.phone} Chiama</a>` : ''}
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
          <div class="item-card-body">
            <a href="tel:${c.phone}" class="action-link">${ICONS.phone} Chiama Cliente</a>
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
        this.filters.timesheetSite = filterTsSite.value;
        this.renderTimesheets();
      });
    }

    const filterExpSite = document.getElementById('filter-exp-site');
    if (filterExpSite) {
      filterExpSite.addEventListener('change', () => {
        this.filters.expenseSite = filterExpSite.value;
        this.renderExpenses();
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

window.app = new GeemApp();
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
