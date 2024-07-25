import { Battle_Unit_Data, Block_Data } from "../Data/Block_Data";
import { CONTEXT_BLOCK } from "./Const_UI";
export class Data_Manager{
    public static init_scale = 0.99;
    public static tile_width = 88;
    public static tile_height = 102;
    public static arr_block:Block_Data[] = [];
    public static arr_unit:Battle_Unit_Data[] = [];
    private static _arr_block_unit_bg:Block_Data[] = [];
    public static get_arr_block_unit_bg():Block_Data[]{
        for (let i = 0; i < this.arr_unit.length; i++) {
            const unit = this.arr_unit[i];
            this._arr_block_unit_bg[i] = {
                    x: unit.x,
                    y: unit.y,
                    width: 88,
                    height: 102,
                    type: 0,
            }
        }
        this._arr_block_unit_bg.splice(this.arr_unit.length)
        return this._arr_block_unit_bg;
    }
    public static ui_block_click:string[] = [CONTEXT_BLOCK.CREATE_UNIT];
}