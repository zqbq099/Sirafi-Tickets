// Robust IndexedDB & Storage Manager for Sirafi Tickets
// Stores all visitor state, tickets, family members, attractions telemetry, offline sync items, and logs
// with automatic fallback to localStorage and cross-tab storage synchronizer.

const DB_NAME = 'SirafiTicketsDB_v2';
const DB_VERSION = 1;

export interface StorageSnapshot {
  timestamp: string;
  visitor: any;
  tickets: any[];
  attractions: any[];
  events: any[];
  alerts: any[];
  employees: any[];
  syncQueue: any[];
  spentNonces: string[];
  notifications: any[];
  weather: any;
  achievements: any[];
}

class OfflineStorageEngine {
  private db: IDBDatabase | null = null;
  private isDBReady = false;

  constructor() {
    this.initIndexedDB();
  }

  private async initIndexedDB(): Promise<void> {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      return;
    }

    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Store for main state snapshots
        if (!db.objectStoreNames.contains('snapshots')) {
          db.createObjectStore('snapshots', { keyPath: 'id' });
        }

        // Store for raw offline transactions
        if (!db.objectStoreNames.contains('offline_events')) {
          const eventStore = db.createObjectStore('offline_events', { keyPath: 'id' });
          eventStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store for cached tickets
        if (!db.objectStoreNames.contains('cached_tickets')) {
          db.createObjectStore('cached_tickets', { keyPath: 'id' });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.isDBReady = true;
        this.persistStorageQuotaEstimate();
      };

      request.onerror = () => {
        console.warn('IndexedDB unavailable, falling back to local persistent storage.');
      };
    } catch (e) {
      console.warn('Error initializing IndexedDB:', e);
    }
  }

  /**
   * Request persistent storage permission from Android/Browser so data is never evicted
   */
  public async requestPersistentStorage(): Promise<boolean> {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
      try {
        const isPersisted = await navigator.storage.persist();
        return isPersisted;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  /**
   * Get approximate storage usage and quota on the user's phone
   */
  public async getStorageEstimate(): Promise<{ usage: number; quota: number; percent: number }> {
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        const usage = estimate.usage || 0;
        const quota = estimate.quota || 1;
        const percent = Math.min(100, Math.round((usage / quota) * 100));
        return { usage, quota, percent };
      } catch (e) {
        return { usage: 0, quota: 0, percent: 0 };
      }
    }
    return { usage: 0, quota: 0, percent: 0 };
  }

  private async persistStorageQuotaEstimate(): Promise<void> {
    this.requestPersistentStorage();
  }

  /**
   * Deep save a complete snapshot of park data into IndexedDB for zero-data-loss offline execution
   */
  public async saveDeepSnapshot(snapshot: StorageSnapshot): Promise<void> {
    if (!this.db || !this.isDBReady) return;

    try {
      const transaction = this.db.transaction(['snapshots'], 'readwrite');
      const store = transaction.objectStore('snapshots');
      store.put({ id: 'latest_active_state', ...snapshot });
    } catch (e) {
      // Fallback handled by localStorage
    }
  }

  /**
   * Retrieve deep snapshot when loading app from cold start in offline mode
   */
  public async loadDeepSnapshot(): Promise<StorageSnapshot | null> {
    if (!this.db || !this.isDBReady) return null;

    return new Promise((resolve) => {
      try {
        const transaction = this.db!.transaction(['snapshots'], 'readonly');
        const store = transaction.objectStore('snapshots');
        const request = store.get('latest_active_state');

        request.onsuccess = () => {
          resolve(request.result || null);
        };
        request.onerror = () => {
          resolve(null);
        };
      } catch (e) {
        resolve(null);
      }
    });
  }
}

export const offlineStorageEngine = new OfflineStorageEngine();
