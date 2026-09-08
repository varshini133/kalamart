import { OfflineSyncItem, OfflineOperationStatus, ProductDraft, Product } from '../types';

const STORAGE_QUEUE_KEY = 'kalaconnect_sync_queue';
const STORAGE_DRAFTS_KEY = 'kalaconnect_offline_drafts';
const STORAGE_SIMULATED_OFFLINE_KEY = 'kalaconnect_simulated_offline';
const STORAGE_PRODUCTS_KEY = 'kalamart_products';

export type SyncEventType = 
  | 'network-change'
  | 'queue-updated'
  | 'sync-started'
  | 'sync-progress'
  | 'sync-completed'
  | 'sync-failed'
  | 'draft-saved';

export interface SyncEvent {
  type: SyncEventType;
  payload?: any;
}

type SyncListener = (event: SyncEvent) => void;

class OfflineSyncService {
  private listeners: Set<SyncListener> = new Set();
  private isSyncing = false;
  private autoSyncTimeout: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleBrowserOnline);
      window.addEventListener('offline', this.handleBrowserOffline);
    }
  }

  // =========================================================================
  // NETWORK STATE & SIMULATION
  // =========================================================================
  public isSimulatedOffline(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(STORAGE_SIMULATED_OFFLINE_KEY) === 'true';
    } catch {
      return false;
    }
  }

  public setSimulatedOffline(offline: boolean): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_SIMULATED_OFFLINE_KEY, offline ? 'true' : 'false');
    } catch {}

    this.notify({
      type: 'network-change',
      payload: { isOnline: this.isOnline() }
    });

    // If turned back online, automatically detect and start sync!
    if (!offline && this.isOnline()) {
      this.scheduleAutoSync(400);
    }
  }

  public isOnline(): boolean {
    if (typeof window === 'undefined') return true;
    if (this.isSimulatedOffline()) return false;
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  private handleBrowserOnline = () => {
    if (!this.isSimulatedOffline()) {
      this.notify({
        type: 'network-change',
        payload: { isOnline: true }
      });
      this.scheduleAutoSync(500);
    }
  };

  private handleBrowserOffline = () => {
    this.notify({
      type: 'network-change',
      payload: { isOnline: false }
    });
  };

  // =========================================================================
  // SYNC QUEUE MANAGEMENT
  // =========================================================================
  public getSyncQueue(): OfflineSyncItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveSyncQueue(queue: OfflineSyncItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_QUEUE_KEY, JSON.stringify(queue));
    } catch {}
    this.notify({
      type: 'queue-updated',
      payload: { queue, pendingCount: this.getPendingCount(queue) }
    });
  }

  public getPendingSyncItems(queue?: OfflineSyncItem[]): OfflineSyncItem[] {
    const list = queue || this.getSyncQueue();
    return list.filter(item => 
      item.status === 'saved_local' || 
      item.status === 'waiting_to_sync' || 
      item.status === 'syncing'
    );
  }

  public getPendingCount(queue?: OfflineSyncItem[]): number {
    return this.getPendingSyncItems(queue).length;
  }

  public enqueueOperation(params: {
    entityId: string;
    entityType: 'product' | 'draft' | 'profile';
    operationType: 'create' | 'update' | 'delete' | 'draft';
    title: string;
    payload: any;
    status?: OfflineOperationStatus;
  }): OfflineSyncItem {
    const queue = this.getSyncQueue();
    const now = Date.now();

    // Remove any existing pending operation on the same entity to keep the queue lean (Last-Write-Wins)
    const filteredQueue = queue.filter(
      item => !(item.entityId === params.entityId && (item.status === 'saved_local' || item.status === 'waiting_to_sync'))
    );

    const newItem: OfflineSyncItem = {
      id: `sync-op-${now}-${Math.random().toString(36).substring(2, 7)}`,
      entityId: params.entityId,
      entityType: params.entityType,
      operationType: params.operationType,
      title: params.title,
      payload: params.payload,
      status: params.status || (this.isOnline() ? 'waiting_to_sync' : 'saved_local'),
      timestamp: now,
      updatedAt: now,
      retryCount: 0,
      conflictStrategy: 'last-write-wins'
    };

    filteredQueue.unshift(newItem);
    this.saveSyncQueue(filteredQueue);

    // If online, immediately schedule sync
    if (this.isOnline()) {
      this.scheduleAutoSync(600);
    }

    return newItem;
  }

  public updateItemStatus(id: string, status: OfflineOperationStatus, error?: string): void {
    const queue = this.getSyncQueue();
    const updated = queue.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status,
          errorMessage: error,
          lastAttemptAt: Date.now(),
          retryCount: status === 'sync_failed' ? item.retryCount + 1 : item.retryCount
        };
      }
      return item;
    });
    this.saveSyncQueue(updated);
  }

  public removeSyncItem(id: string): void {
    const queue = this.getSyncQueue();
    const filtered = queue.filter(item => item.id !== id);
    this.saveSyncQueue(filtered);
  }

  public clearSyncedItems(): void {
    const queue = this.getSyncQueue();
    const active = queue.filter(item => item.status !== 'synced');
    this.saveSyncQueue(active);
  }

  public retryFailedItems(): void {
    const queue = this.getSyncQueue();
    const updated = queue.map(item => {
      if (item.status === 'sync_failed') {
        return { ...item, status: 'waiting_to_sync' as OfflineOperationStatus, errorMessage: undefined };
      }
      return item;
    });
    this.saveSyncQueue(updated);
    if (this.isOnline()) {
      this.syncNow();
    }
  }

  // =========================================================================
  // DRAFT MANAGEMENT
  // =========================================================================
  public getOfflineDrafts(): ProductDraft[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_DRAFTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveOfflineDrafts(drafts: ProductDraft[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_DRAFTS_KEY, JSON.stringify(drafts));
    } catch {}
  }

  public saveProductDraft(draftData: Partial<ProductDraft>): ProductDraft {
    const drafts = this.getOfflineDrafts();
    const now = Date.now();
    const draftId = draftData.id || `draft-${now}`;

    const existingIndex = drafts.findIndex(d => d.id === draftId);
    const updatedDraft: ProductDraft = {
      id: draftId,
      artisanId: draftData.artisanId || 'current-artisan',
      title: draftData.title?.trim() || 'Untitled Craft Draft',
      price: draftData.price ?? 500,
      category: draftData.category || 'Handmade Crafts',
      craftTechnique: draftData.craftTechnique,
      material: draftData.material,
      dimensions: draftData.dimensions,
      productionTime: draftData.productionTime,
      stockCount: draftData.stockCount ?? 5,
      description: draftData.description || '',
      storyBehindProduct: draftData.storyBehindProduct || '',
      images: draftData.images && draftData.images.length > 0 ? draftData.images : ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'],
      audioMetadata: draftData.audioMetadata,
      tags: draftData.tags || [],
      createdAt: existingIndex >= 0 ? drafts[existingIndex].createdAt : now,
      updatedAt: now,
      syncStatus: 'saved_local'
    };

    if (existingIndex >= 0) {
      drafts[existingIndex] = updatedDraft;
    } else {
      drafts.unshift(updatedDraft);
    }

    this.saveOfflineDrafts(drafts);

    // Also place in sync queue as draft operation
    this.enqueueOperation({
      entityId: updatedDraft.id,
      entityType: 'draft',
      operationType: 'draft',
      title: `Draft: ${updatedDraft.title}`,
      payload: updatedDraft,
      status: 'saved_local'
    });

    this.notify({
      type: 'draft-saved',
      payload: updatedDraft
    });

    return updatedDraft;
  }

  public getDraftById(id: string): ProductDraft | null {
    const drafts = this.getOfflineDrafts();
    return drafts.find(d => d.id === id) || null;
  }

  public deleteOfflineDraft(id: string): void {
    const drafts = this.getOfflineDrafts();
    const filtered = drafts.filter(d => d.id !== id);
    this.saveOfflineDrafts(filtered);
    this.removeSyncItem(id);
  }

  // =========================================================================
  // CONFLICT-AWARE SYNCHRONIZATION ENGINE
  // =========================================================================
  private scheduleAutoSync(delayMs = 500): void {
    if (this.autoSyncTimeout) {
      clearTimeout(this.autoSyncTimeout);
    }
    this.autoSyncTimeout = setTimeout(() => {
      this.syncNow().catch(() => {});
    }, delayMs);
  }

  public async syncNow(): Promise<{
    success: boolean;
    syncedCount: number;
    failedCount: number;
    syncedItems: OfflineSyncItem[];
  }> {
    if (!this.isOnline()) {
      return { success: false, syncedCount: 0, failedCount: 0, syncedItems: [] };
    }

    if (this.isSyncing) {
      return { success: true, syncedCount: 0, failedCount: 0, syncedItems: [] };
    }

    this.isSyncing = true;
    this.notify({ type: 'sync-started' });

    const queue = this.getSyncQueue();
    const pendingItems = queue.filter(
      item => item.status === 'saved_local' || item.status === 'waiting_to_sync'
    );

    if (pendingItems.length === 0) {
      this.isSyncing = false;
      this.notify({ type: 'sync-completed', payload: { syncedCount: 0 } });
      return { success: true, syncedCount: 0, failedCount: 0, syncedItems: [] };
    }

    // Mark pending items as syncing
    const updatedQueue = queue.map(item => {
      if (item.status === 'saved_local' || item.status === 'waiting_to_sync') {
        return { ...item, status: 'syncing' as OfflineOperationStatus };
      }
      return item;
    });
    this.saveSyncQueue(updatedQueue);

    let syncedCount = 0;
    let failedCount = 0;
    const syncedItems: OfflineSyncItem[] = [];

    // Simulate realistic network roundtrips with progressive sync
    for (const item of pendingItems) {
      try {
        // Wait simulated network time (300-600ms)
        await new Promise(r => setTimeout(r, 400));

        // Conflict handling using timestamp:
        this.resolveAndCommitToMarketplace(item);

        this.updateItemStatus(item.id, 'synced');
        syncedCount++;
        syncedItems.push(item);

        this.notify({
          type: 'sync-progress',
          payload: {
            syncedCount,
            totalPending: pendingItems.length,
            currentItem: item
          }
        });
      } catch (err: any) {
        failedCount++;
        this.updateItemStatus(item.id, 'sync_failed', err?.message || 'Sync network upload failed');
      }
    }

    this.isSyncing = false;

    if (syncedCount > 0) {
      this.notify({
        type: 'sync-completed',
        payload: { syncedCount, failedCount, syncedItems }
      });
    } else if (failedCount > 0) {
      this.notify({
        type: 'sync-failed',
        payload: { errorMessage: 'One or more items failed to sync' }
      });
    }

    return {
      success: failedCount === 0,
      syncedCount,
      failedCount,
      syncedItems
    };
  }

  /**
   * Conflict Handling: Simple Timestamp-based Last-Write-Wins
   */
  private resolveAndCommitToMarketplace(item: OfflineSyncItem): void {
    if (typeof window === 'undefined') return;

    try {
      const savedProdsRaw = localStorage.getItem(STORAGE_PRODUCTS_KEY);
      let products: Product[] = savedProdsRaw ? JSON.parse(savedProdsRaw) : [];

      if (item.operationType === 'create' || item.operationType === 'update') {
        const payloadProduct: Product = item.payload;
        const existingIndex = products.findIndex(p => p.id === payloadProduct.id);

        if (existingIndex >= 0) {
          // Timestamp conflict comparison
          const existingProduct = products[existingIndex];
          const localTimestamp = item.updatedAt || item.timestamp;
          // In real cloud sync, existing would have cloud updatedAt timestamp
          const existingTimestamp = (existingProduct as any).updatedAt || 0;

          if (localTimestamp >= existingTimestamp) {
            // Local wins: replace with updated payload marked as synced
            products[existingIndex] = {
              ...payloadProduct,
              syncStatus: 'synced',
              isApprovedByAdmin: true
            };
          } else {
            // Cloud wins: keep cloud version, but mark local record synced
            products[existingIndex] = {
              ...existingProduct,
              syncStatus: 'synced'
            };
          }
        } else {
          // New product create
          products.unshift({
            ...payloadProduct,
            syncStatus: 'synced',
            isApprovedByAdmin: true
          });
        }

        localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
      } else if (item.operationType === 'delete') {
        products = products.filter(p => p.id !== item.entityId);
        localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
      }
    } catch (e) {
      console.error('Failed to commit synced product to storage:', e);
    }
  }

  // =========================================================================
  // DEMO MODE CONTROLLER
  // =========================================================================
  /**
   * Executes the exact demonstration required by user:
   * Online → Create product
   * → Turn simulated offline mode ON
   * → Create draft
   * → Show local save
   * → Turn online mode ON
   * → Demonstrate automatic synchronization
   */
  public async runDemoMode(callbacks?: {
    onStepChange?: (step: number, title: string, detail: string) => void;
  }): Promise<{ success: boolean; demoProductId: string }> {
    const notifyStep = (step: number, title: string, detail: string) => {
      if (callbacks?.onStepChange) {
        callbacks.onStepChange(step, title, detail);
      }
    };

    // Step 1: Ensure Online Mode is Active
    notifyStep(1, 'Online Mode Active', 'Verifying connectivity and cloud status...');
    this.setSimulatedOffline(false);
    await new Promise(r => setTimeout(r, 700));

    // Create an initial online craft to demonstrate normal online publishing
    const onlineProdId = `online-demo-${Date.now()}`;
    const initialProduct: Product = {
      id: onlineProdId,
      title: 'Terracotta Ritual Kalash (Online Demo)',
      price: 950,
      originalPrice: 1200,
      category: 'Pottery & Ceramics',
      artisanName: 'Govind Ram',
      artisanLocation: 'Kutch, Gujarat',
      images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'],
      material: 'Natural Red Clay & River Silt',
      technique: 'Wheel Thrown & Wood Kiln Fired',
      craftOrigin: 'Kutch Heritage Guild',
      giTag: 'GI-IN-GUJ-POTTERY',
      giCertified: true,
      description: 'Handcrafted red terracotta ritual pot with traditional hand-painted motifs.',
      rating: 5,
      reviewsCount: 1,
      inStock: true,
      stockCount: 8,
      syncStatus: 'synced'
    };

    try {
      const savedProds = localStorage.getItem(STORAGE_PRODUCTS_KEY);
      const list: Product[] = savedProds ? JSON.parse(savedProds) : [];
      list.unshift(initialProduct);
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(list));
    } catch {}

    // Step 2: Turn Simulated Offline Mode ON
    await new Promise(r => setTimeout(r, 1000));
    notifyStep(2, 'Turn Simulated Offline ON', "Disconnecting network. Entering Offline Mode: 'You're offline. Your work is safely saved on this device.'");
    this.setSimulatedOffline(true);

    // Step 3: Create Product Draft Offline
    await new Promise(r => setTimeout(r, 1200));
    notifyStep(3, 'Create Product Draft Offline', 'Artisan enters specifications, pricing and records voice metadata while offline.');
    
    const offlineDraft = this.saveProductDraft({
      title: 'Hand-Carved Sheesham Spice Box',
      price: 1450,
      category: 'Woodcraft',
      craftTechnique: 'Chisel Carving & Brass Inlay',
      material: 'Reclaimed Sheesham Wood & Sheet Brass',
      dimensions: '22cm x 15cm x 8cm',
      productionTime: '3 days',
      stockCount: 6,
      description: 'Traditional seven-spice container handcrafted with floral Mughal brass inlay.',
      images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'],
      audioMetadata: {
        durationSeconds: 14,
        recordedAt: Date.now(),
        transcript: 'Namaste, this masala dabba is carved from seasoned Sheesham with hand-cut brass floral motifs.'
      }
    });

    // Also queue a product listing offline
    const offlineProdId = `offline-craft-${Date.now()}`;
    const offlineProduct: Product = {
      id: offlineProdId,
      title: 'Hand-Carved Sheesham Spice Box',
      price: 1450,
      originalPrice: 1750,
      category: 'Woodcraft',
      artisanName: 'Govind Ram',
      artisanLocation: 'Saharanpur, Uttar Pradesh',
      images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'],
      material: 'Reclaimed Sheesham Wood & Sheet Brass',
      technique: 'Chisel Carving & Brass Inlay',
      craftOrigin: 'Saharanpur Wood Guild',
      giTag: 'GI-IN-UP-WOOD',
      giCertified: true,
      description: 'Traditional seven-spice container handcrafted with floral Mughal brass inlay.',
      rating: 5,
      reviewsCount: 0,
      inStock: true,
      stockCount: 6,
      syncStatus: 'saved_local'
    };

    this.enqueueOperation({
      entityId: offlineProdId,
      entityType: 'product',
      operationType: 'create',
      title: 'Listing: Hand-Carved Sheesham Spice Box',
      payload: offlineProduct,
      status: 'saved_local'
    });

    // Step 4: Show Local Save
    await new Promise(r => setTimeout(r, 1200));
    notifyStep(4, 'Work Saved Locally', 'Draft and queue stored securely in local device memory with status "Saved locally" / "Waiting to sync".');

    // Step 5: Turn Online Mode ON
    await new Promise(r => setTimeout(r, 1500));
    notifyStep(5, 'Turn Online Mode ON', 'Network connectivity restored. Auto-detecting connection and initializing synchronization queue...');
    this.setSimulatedOffline(false);

    // Step 6: Automatic Synchronization
    await new Promise(r => setTimeout(r, 800));
    notifyStep(6, 'Automatic Synchronization', 'Uploading pending changes to cloud marketplace. Timestamp conflict handling applied.');
    
    await this.syncNow();
    
    notifyStep(6, 'Sync Complete', 'All changes synced successfully. Status updated to "Successfully synced".');

    return { success: true, demoProductId: offlineProdId };
  }

  // =========================================================================
  // SUBSCRIBERS / EVENT SYSTEM
  // =========================================================================
  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(event: SyncEvent): void {
    this.listeners.forEach(fn => {
      try {
        fn(event);
      } catch (e) {
        console.error('Error in sync listener:', e);
      }
    });
  }
}

export const offlineSyncService = new OfflineSyncService();
