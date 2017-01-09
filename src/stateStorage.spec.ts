import { MemoryStateStorage, SyncStateStorage, CachedSyncStateStorage } from './';
import { delay } from './';

describe('MemoryStateStorage', () => {
    it('should store and retrieve state', async (done) => {
        let storage = new MemoryStateStorage();
        await storage.appendStateChange('A');
        expect(await storage.getStateChanges()).toEqual(['A']);
        done();
    }, 1000);

    it('should store and retrieve state array', async (done) => {
        let storage = new MemoryStateStorage();
        await storage.appendStateChange('A', 'B');
        expect(await storage.getStateChanges()).toEqual(['A', 'B']);
        done();
    }, 1000);
});

describe('SyncStateStorage', () => {
    it('should store and retrieve state', async (done) => {
        let storage = new SyncStateStorage(new MemoryStateStorage(), 0);
        await storage.appendStateChange('A');
        expect(await storage.getStateChanges()).toEqual(['A']);
        done();
    }, 1000);

    it('should store and retrieve state array', async (done) => {
        let storage = new SyncStateStorage(new MemoryStateStorage(), 0);
        await storage.appendStateChange('A', 'B');
        expect(await storage.getStateChanges()).toEqual(['A', 'B']);
        done();
    }, 1000);

    it('should store and retrieve state array with delay', async (done) => {
        let storage = new SyncStateStorage(new MemoryStateStorage(), 250);
        expect(await storage.getStateChanges()).toEqual([]);

        let result = storage.appendStateChange('A', 'B');
        expect(await storage.getStateChanges()).toEqual([]);
        result.then();

        await delay(200);
        expect(await storage.getStateChanges()).toEqual([]);

        await delay(200);
        expect(await storage.getStateChanges()).toEqual(['A', 'B']);

        done();
    }, 1000);

    it('should store and retrieve multiple state changes', async (done) => {
        let storage = new SyncStateStorage(new MemoryStateStorage(), 250);

        expect(await storage.getStateChanges()).toEqual([]);
        storage.appendStateChange('A');
        await delay(50);

        expect(await storage.getStateChanges()).toEqual([]);
        storage.appendStateChange('B');
        await delay(50);

        expect(await storage.getStateChanges()).toEqual([]);
        storage.appendStateChange('C');
        await delay(50);

        expect(await storage.getStateChanges()).toEqual([]);
        storage.appendStateChange('D');
        await delay(50);

        expect(await storage.getStateChanges()).toEqual([]);
        storage.appendStateChange('E');
        await delay(100);

        expect(await storage.getStateChanges()).toEqual(['A', 'B', 'C', 'D', 'E']);

        done();
    }, 1000);
});


describe('CachedSyncStateStorage', () => {
    it('should store and retrieve state', async (done) => {
        let storage = new CachedSyncStateStorage(new MemoryStateStorage(), 0);
        await storage.appendStateChange('A');
        expect(await storage.getStateChanges()).toEqual(['A']);
        done();
    }, 1000);

    it('should store and retrieve state array', async (done) => {
        let storage = new CachedSyncStateStorage(new MemoryStateStorage(), 0);
        await storage.appendStateChange('A', 'B');
        expect(await storage.getStateChanges()).toEqual(['A', 'B']);
        done();
    }, 1000);

    it('should store and retrieve state array with delay', async (done) => {
        let storage = new CachedSyncStateStorage(new MemoryStateStorage(), 50);
        expect(await storage.getStateChanges()).toEqual([]);

        storage.appendStateChange('A', 'B');
        expect(await storage.getStateChanges()).toEqual(['A', 'B']);

        await delay(100);
        expect(await storage.getStateChanges()).toEqual(['A', 'B']);

        done();
    }, 1000);

    it('should store and retrieve multiple state changes', async (done) => {
        let storage = new CachedSyncStateStorage(new MemoryStateStorage(), 250);

        expect(await storage.getStateChanges()).toEqual([]);
        storage.appendStateChange('A');
        await delay(50);

        expect(await storage.getStateChanges()).toEqual(['A']);
        storage.appendStateChange('B');
        await delay(50);

        expect(await storage.getStateChanges()).toEqual(['A', 'B']);
        storage.appendStateChange('C');
        await delay(50);

        expect(await storage.getStateChanges()).toEqual(['A', 'B', 'C']);
        storage.appendStateChange('D');
        await delay(50);

        expect(await storage.getStateChanges()).toEqual(['A', 'B', 'C', 'D']);
        storage.appendStateChange('E');
        await delay(100);

        expect(await storage.getStateChanges()).toEqual(['A', 'B', 'C', 'D', 'E']);

        done();
    }, 1000);
});