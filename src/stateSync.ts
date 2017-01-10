import { StateTree, StateNotificationKind } from './stateTree';
import { StateStorage } from './stateStorage';
import { StateChange } from './stateChange';
import { StateData } from './stateData';

export class StateSync<T extends StateData> {
    _metadata: any;

    constructor(private tree: StateTree<T>, private storage: StateStorage) {
        this.setup();
    }

    setup() {
        this.tree.subscribe(x => {
            if (x.kind === StateNotificationKind[StateNotificationKind.getValue]) { return; }

            let change: StateChange<T> = {
                uuid: newUuid(),
                newStateDelta: this.toStateData(x.stateNodeFullPath, x.valueJson),
                oldStateDelta: this.toStateData(x.stateNodeFullPath, x.valueJson_old),
                metadata: this._metadata
            };

            this.storage.appendStateChange(JSON.stringify(change));
        });
    }

    beginContext(metadata: any) {
        if (this._metadata != null) { throw 'endContext was not called'; }
        this._metadata = metadata;
    }

    endContext() {
        if (this._metadata != null) { throw 'beginContext was not called'; }
        this._metadata = null;
    }

    toStateData(fullPath: string, jsonValue: string): T {
        let parts = fullPath.split(/\.|\[/g);
        if (parts[0] === '') { parts.splice(0, 1); };

        let state = {} as any;
        let node = state;
        for (let i = 0; i < parts.length; i++) {
            let x = parts[i];
            if (x[x.length - 1] === ']') { x = x.substr(0, x.length - 2); }

            if (i === parts.length - 1) {
                node[x] = JSON.parse(jsonValue);
                break;
            }

            node[x] = {};
            node = node[x];
        }

        return state;
    }
}

function newUuid(): string {
    // TODO: Use a real Uuid provider
    return '' + Math.random() + '' + Math.random();
}