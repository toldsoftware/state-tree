import { StateTree } from './stateTree';
import { StateStorage } from './stateStorage';
import { StateData } from './stateData';
export declare class StateSync<T extends StateData> {
    private tree;
    private storage;
    _metadata: any;
    constructor(tree: StateTree<T>, storage: StateStorage);
    setup(): void;
    beginContext(metadata: any): void;
    endContext(): void;
    toStateData(fullPath: string, jsonValue: string): T;
}
