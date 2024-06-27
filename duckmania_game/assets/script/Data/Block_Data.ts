export interface Block_Data{
    x:number;
    y:number;
    width:number;
    height:number;
    type:number;
}
export interface Battle_Unit_Data{
    unit_type:number;
    belong:number;
    hp:number;
    morale:number;
    form:number;
    x:number;
    y:number;
}
export interface UI_Manipulation_Data{
    block:Block_Data;
    value:string;
}