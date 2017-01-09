export let DELETE: any = 'DELETE';
export interface StateData {
    [name: string]: StateData[] | StateData | string | boolean | number;
}
