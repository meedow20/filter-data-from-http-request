export interface AppState {
    data: string[],
    resetFilters: string[],
    initialized: boolean,
    inputValue: string,
    isCheckBoxChecked: boolean
}

export type DataType = string[];