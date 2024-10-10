import { Data_Battle_Unit, Data_Block } from "../Data/Data_Block";
import { Math_Utils } from "../Pub/Math_Utils";
import { CONTEXT_BLOCK } from "./Const_UI";
export class Manager_Data {
    public static curTm = 0;
    public static init_scale = 0.99;
    public static tile_width = 88;
    public static tile_height = 102;
    public static arr_block: Data_Block[] = [];
    public static arr_unit: Data_Battle_Unit[] = [];
    public static is_show_manipulation = false;
    public static last_hide_manipulation_tm = 0;
    private static _arr_block_unit_bg: Data_Block[] = [];
    public static get_arr_block_unit_bg(): Data_Block[] {
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
    public static get_arr_block_in_range(tgt_block: Data_Block, range: number): Data_Block[] {
        let ret: Data_Block[] = [];
        for (let i = 0; i < this.arr_block.length; i++) {
            const block = this.arr_block[i];
            if (tgt_block == block) continue;
            if (Math_Utils.get_distance(tgt_block, block) < 52 * 2 * range + 10) {
                ret.push(block);
            }
        }
        return ret;
    }
    public static UI_BLOCK_CLICK: CONTEXT_BLOCK[] = [CONTEXT_BLOCK.CREATE_UNIT];
    public static UI_UNIT_CLICK: CONTEXT_BLOCK[] = [CONTEXT_BLOCK.REMOVE_UNIT, CONTEXT_BLOCK.MOVE_UNIT]
    public static UI_BLOCK_MOVE: CONTEXT_BLOCK[] = [CONTEXT_BLOCK.LMOVE_UNIT_TO_BLOCK];
}