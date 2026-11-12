/**
 * GEEM - GitHub API Client
 * Gestione sicura del "Database" su repository privato GitHub
 */

export class GitHubStorage {
  constructor(owner, repo, token) {
    this.owner = owner;
    this.repo = repo;
    this.token = token;
    this.baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
    this.fileShas = {}; // Memorizza gli SHA per i commit
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    };
  }

  // Codifica UTF-8 in Base64 (compatibile con caratteri speciali ed emoji)
  static utf8ToBase64(str) {
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('');
    return btoa(binString);
  }

  // Decodifica Base64 in UTF-8
  static base64ToUtf8(base64) {
    const cleanBase64 = base64.replace(/\s/g, '');
    const binString = atob(cleanBase64);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
    return new TextDecoder().decode(bytes);
  }

  // Verifica connessione e permessi al repository
  async testConnection() {
    try {
      const response = await fetch(this.baseUrl, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Repository non trovato. Controlla il nome utente e repository, oppure verifica che il token abbia i permessi corretti.');
        } else if (response.status === 401) {
          throw new Error('Token non valido o scaduto.');
        } else {
          throw new Error(`Errore GitHub API: ${response.status} ${response.statusText}`);
        }
      }

      const repoData = await response.json();
      return {
        success: true,
        private: repoData.private,
        name: repoData.full_name,
        permissions: repoData.permissions
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Leggi un singolo file JSON
  async readFile(path) {
    const url = `${this.baseUrl}/contents/${path}`;
    const response = await fetch(url, { headers: this.getHeaders() });

    if (response.status === 404) {
      return { found: false, data: null, sha: null };
    }

    if (!response.ok) {
      throw new Error(`Impossibile leggere ${path}: ${response.statusText}`);
    }

    const fileMeta = await response.json();
    this.fileShas[path] = fileMeta.sha;

    // Se è un file generico o non-JSON (es. allegato base64) o un path in attachments/
    if (path.startsWith('attachments/')) {
      return { found: true, contentBase64: fileMeta.content, sha: fileMeta.sha };
    }

    const contentText = GitHubStorage.base64ToUtf8(fileMeta.content);
    
    try {
      const parsed = JSON.parse(contentText);
      return { found: true, data: parsed, sha: fileMeta.sha };
    } catch (e) {
      throw new Error(`Formato JSON non valido in ${path}`);
    }
  }

  // Scrivi un file binario/base64 su GitHub (ad es. allegati PDF, immagini o documenti)
  async writeBinaryFile(path, base64Content, commitMessage = 'Upload allegato GEEM') {
    const url = `${this.baseUrl}/contents/${path}`;
    // Rimuovi eventuali prefissi data:...;base64, e spazi
    const cleanBase64 = base64Content.replace(/^data:[^;]+;base64,/, '').replace(/\s/g, '');

    const body = {
      message: commitMessage,
      content: cleanBase64
    };

    if (this.fileShas[path]) {
      body.sha = this.fileShas[path];
    } else {
      const existing = await this.readFile(path).catch(() => ({ found: false }));
      if (existing.found && existing.sha) {
        body.sha = existing.sha;
      }
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Errore upload allegato ${path}: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    this.fileShas[path] = result.content.sha;
    return result;
  }

  // Elimina un file su GitHub
  async deleteFile(path, commitMessage = 'Eliminazione file GEEM') {
    const url = `${this.baseUrl}/contents/${path}`;
    let sha = this.fileShas[path];
    if (!sha) {
      const existing = await this.readFile(path).catch(() => ({ found: false }));
      if (existing.found) sha = existing.sha;
    }

    if (!sha) return false;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
      body: JSON.stringify({ message: commitMessage, sha })
    });

    if (response.ok) {
      delete this.fileShas[path];
      return true;
    }
    return false;
  }

  // Scrivi/Aggiorna un file JSON su GitHub
  async writeFile(path, data, commitMessage = 'Aggiornamento dati GEEM') {
    const url = `${this.baseUrl}/contents/${path}`;
    const contentString = JSON.stringify(data, null, 2);
    const base64Content = GitHubStorage.utf8ToBase64(contentString);

    const body = {
      message: commitMessage,
      content: base64Content
    };

    // Se abbiamo uno SHA precedente, lo includiamo per l'update
    if (this.fileShas[path]) {
      body.sha = this.fileShas[path];
    } else {
      // Prova a recuperare lo SHA se esiste già
      const existing = await this.readFile(path).catch(() => ({ found: false }));
      if (existing.found && existing.sha) {
        body.sha = existing.sha;
      }
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Errore salvataggio ${path}: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    this.fileShas[path] = result.content.sha;
    return result;
  }

  // Inizializza il repository con i file di base se non presenti
  async initDatabase(initialData) {
    const paths = {
      config: 'data/config.json',
      workers: 'data/workers.json',
      clients: 'data/clients.json',
      sites: 'data/sites.json',
      timesheets: 'data/timesheets.json',
      expenses: 'data/expenses.json',
      people: 'data/people.json'
    };

    const results = {};
    for (const [key, path] of Object.entries(paths)) {
      const check = await this.readFile(path);
      if (!check.found) {
        await this.writeFile(path, initialData[key] || [], `Inizializzazione file database GEEM: ${path}`);
        results[key] = 'creato';
      } else {
        results[key] = 'esistente';
      }
    }
    return results;
  }

  // Carica tutti i file del database
  async fetchAll() {
    const paths = {
      config: 'data/config.json',
      workers: 'data/workers.json',
      clients: 'data/clients.json',
      sites: 'data/sites.json',
      timesheets: 'data/timesheets.json',
      expenses: 'data/expenses.json',
      people: 'data/people.json'
    };

    const data = {};
    let anyMissing = false;

    for (const [key, path] of Object.entries(paths)) {
      const fileRes = await this.readFile(path);
      if (fileRes.found) {
        data[key] = fileRes.data;
      } else {
        anyMissing = true;
        data[key] = null;
      }
    }

    return { data, anyMissing };
  }
}

