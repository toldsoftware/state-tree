export let DELETE: any = '_DELETE_';
export interface StateData {
    [name: string]: StateData[] | StateData | string | boolean | number;
}
