import { StateData } from './stateData';
export interface StateChange<T extends StateData> {
    uuid: string;
    newStateDelta: T;
    oldStateDelta: T;
    metadata: StateData;
}
export declare function mergeChanges<T extends StateData>(initialStateData: T, stateChanges: StateChange<T>[]): T;
export declare function reverseChanges<T extends StateData>(stateData: T, stateChanges_toReverse: StateChange<T>[]): T;
export declare function mergeStateData<T extends StateData>(stateData: T[]): T;
