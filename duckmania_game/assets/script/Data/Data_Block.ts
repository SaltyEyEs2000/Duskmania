export interface Data_Block {
    x: number;
    y: number;
    width: number;
    height: number;
    type: number;
}
export interface Data_Battle_Unit {
    unit_type: number;
    belong: number;
    hp: number;
    morale: number;
    form: number;
    x: number;
    y: number;
}
export interface Data_UI_Manipulation {
    index: number;
    block: Data_Block;
    value: string;
}