export interface StateStorage {
    getStateChanges(): Promise<string[]>;
    appendStateChange(...stateChanges: string[]): Promise<void>;
}
export declare class MemoryStateStorage implements StateStorage {
    changes: string[];
    getStateChanges(): Promise<string[]>;
    appendStateChange(...stateChanges: string[]): Promise<void>;
}
export declare class DelayedMemoryStateStorage implements StateStorage {
    delayTime: number;
    changes: string[];
    constructor(delayTime?: number);
    getStateChanges(): Promise<string[]>;
    appendStateChange(...stateChanges: string[]): Promise<void>;
}
export declare class SyncStateStorage implements StateStorage {
    private provider;
    private delayTime;
    pending: string[];
    pending_resolves: (() => void)[];
    syncBusy: boolean;
    constructor(provider: StateStorage, delayTime?: number);
    getStateChanges(): Promise<string[]>;
    appendStateChange(...stateChanges: string[]): Promise<void>;
    sync(): Promise<void>;
}
export declare class CachedSyncStateStorage extends SyncStateStorage {
    cache_initial: string[];
    cache_appended: string[];
    constructor(provider: StateStorage, delayTime?: number);
    setup(): Promise<void>;
    getStateChanges(): Promise<string[]>;
    appendStateChange(...stateChanges: string[]): Promise<void>;
}
