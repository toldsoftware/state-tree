import { SimpleObservable, SimpleSubject } from './simpleObservable';
import { delay } from './async';

export interface StateStorage {
    getStateChanges(): Promise<string[]>;
    appendStateChange(...stateChanges: string[]): Promise<void>;
}

export class MemoryStateStorage implements StateStorage {
    changes: string[] = [];

    async getStateChanges() {
        return this.changes.map(x => x);
    }

    async appendStateChange(...stateChanges: string[]) {
        this.changes.push(...stateChanges);
    }
}

export class DelayedMemoryStateStorage implements StateStorage {
    changes: string[] = [];

    constructor(public delayTime = 3000) { }

    async getStateChanges() {
        await delay(this.delayTime);
        return this.changes.map(x => x);
    }

    async appendStateChange(...stateChanges: string[]) {
        await delay(this.delayTime);
        this.changes.push(...stateChanges);
    }
}

// AutoSync State Changes to provider
// - Retry failed appends
// - Delay appends to give a chance to merge requests
export class SyncStateStorage implements StateStorage {
    pending: string[] = [];
    pending_resolves: (() => void)[] = [];
    syncBusy = false;

    constructor(private provider: StateStorage, private delayTime = 250) {

    }

    getStateChanges() {
        return this.provider.getStateChanges();
    }

    appendStateChange(...stateChanges: string[]) {
        return new Promise<void>((resolve, reject) => {
            this.pending.push(...stateChanges);
            this.pending_resolves.push(resolve);
            this.sync().then();
        });
    }

    async sync() {
        if (this.syncBusy) { return; }
        if (!this.pending.length) { return; }
        this.syncBusy = true;

        try {
            await delay(this.delayTime);

            // Merge pending changes
            let pendingSnapshot = this.pending.map(x => x);
            let resolvesSnapshot = this.pending_resolves.map(x => x);

            // Append the State Changes in Proper Order
            await this.provider.appendStateChange(...pendingSnapshot);

            resolvesSnapshot.forEach(x => x());
            this.pending = this.pending.splice(0, pendingSnapshot.length);
            this.pending_resolves = this.pending_resolves.splice(0, pendingSnapshot.length);
        } catch (err) { }

        this.syncBusy = false;
        this.sync();
    }
}


export class CachedSyncStateStorage extends SyncStateStorage {
    cache_initial: string[];
    cache_appended: string[] = [];

    constructor(provider: StateStorage, delayTime = 250) {
        super(provider, delayTime);
    }

    async setup() {
        if (this.cache_initial == null) {
            this.cache_initial = [];
            this.cache_initial = await super.getStateChanges();
        }
    }

    async getStateChanges() {
        await this.setup();
        return [...this.cache_initial, ...this.cache_appended];
    }

    appendStateChange(...stateChanges: string[]) {
        this.setup().then();
        this.cache_appended.push(...stateChanges);
        return super.appendStateChange(...stateChanges);
    }
}
