import { Data_Battle_Unit, Data_Block } from "../Data/Data_Block";
import { CONTEXT_BLOCK } from "./Const_UI";
export class Manager_Data{
    public static init_scale = 0.99;
    public static tile_width = 88;
    public static tile_height = 102;
    public static arr_block:Data_Block[] = [];
    public static arr_unit:Data_Battle_Unit[] = [];
    private static _arr_block_unit_bg:Data_Block[] = [];
    public static get_arr_block_unit_bg():Data_Block[]{
        for (let i = 0; i < this.arr_unit.length; i++) {
            const unit = this.arr_unit[i];
            this._arr_block_unit_bg[i] = {
                    x: unit.x,
                    y: unit.y,
                    width: 102, 
                    height: 102,
                    type: 0,
            }
        }
        this._arr_block_unit_bg.splice(this.arr_unit.length)
        return this._arr_block_unit_bg;
    }
    public static ui_block_click:string[] = [CONTEXT_BLOCK.CREATE_UNIT];
}