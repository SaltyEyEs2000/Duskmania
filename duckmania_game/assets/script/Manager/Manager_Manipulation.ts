import { _decorator, Component, Node, Button, NodeEventType, Camera, v3, game, UITransform, misc, input, Input, EventMouse, EventTouch, Prefab } from 'cc';
import { Event_Dispatcher } from '../Pub/Event_Dispatcher';
import { Data_Battle_Unit, Data_Block, Data_UI_Manipulation } from '../Data/Data_Block';
import { Infinity_Render } from '../Pub/Infinity_Render';
import { UI_Manuplation } from '../UI/UI_Manipulation';
import { Manager_Data } from './Manager_Data';
import { Const_Event } from './Const_Event';
import { CONTEXT_BLOCK as MANIPULATION } from './Const_UI';
const { ccclass, property } = _decorator;
@ccclass('Manager_Manipulation')
export class Manager_Manipulation extends Component {
    @property(Node)
    nd_ui: Node = undefined;
    @property(Prefab)
    pf_block: Prefab = undefined;
    i_render: Infinity_Render<UI_Manuplation> = undefined;
    start() {
        this.i_render = new Infinity_Render(this.nd_ui, this.pf_block, UI_Manuplation);
        Event_Dispatcher.on(Const_Event.map_block_click, this, this.on_click_map_block)
        Event_Dispatcher.on(Const_Event.manipulation, this, this.manipulation)
    }
    on_click_map_block(block: Data_Block) {
        if (this.find_unit_id(block) < 0) {
            this.show_manipulation([block], Manager_Data.UI_BLOCK_CLICK);
        } else {
            this.show_manipulation([block], Manager_Data.UI_UNIT_CLICK);
        }
    }
    hide_manipulation() {
        Manager_Data.last_hide_manipulation_tm = Manager_Data.curTm;
        Manager_Data.is_show_manipulation = false;
        this.i_render.fresh(v => true, []);
    }
    show_manipulation(arr_block: Data_Block[], all_manipulations: MANIPULATION[]) {
        Manager_Data.is_show_manipulation = true;
        let arr_data: Data_UI_Manipulation[] = [];
        for (let i = 0; i < arr_block.length; i++) {
            const block = arr_block[i];
            for (let j = 0; j < all_manipulations.length; j++) {
                const manipulation = all_manipulations[j];
                arr_data.push({
                    index: j,
                    block: block,
                    value: manipulation,
                })
            }
        }
        this.i_render.fresh(v => true, arr_data)
    }
    clear_manipulation_queue() {
        this.manipulation_in_queue = [];
    }
    manipulation_in_queue: Data_UI_Manipulation[] = [];
    manipulation(data: Data_UI_Manipulation) {
        if (data.value == MANIPULATION.CREATE_UNIT) {
            this.create_unit(data);
            this.hide_manipulation();
        }
        if (data.value == MANIPULATION.REMOVE_UNIT) {
            this.remove_unit(data);
            this.hide_manipulation();
        }
        if (data.value == MANIPULATION.CLOSE_MANIPULATION) {
            this.hide_manipulation();
        }
        if (data.value == MANIPULATION.MOVE_UNIT) {
            this.clear_manipulation_queue();
            this.manipulation_in_queue.push(data);
            let arr_block = Manager_Data.get_arr_block_in_range(data.block, 1);
            this.hide_manipulation();
            this.show_manipulation(arr_block, Manager_Data.UI_BLOCK_MOVE)
        }
        if (data.value == MANIPULATION.LMOVE_UNIT_TO_BLOCK) {
            if (!this.manipulation_in_queue[0]) return;
            let find_id = this.find_unit_id(this.manipulation_in_queue[0].block);
            if (find_id < 0) return;
            let unit = Manager_Data.arr_unit[find_id];
            this.move_unit(unit, data.block)
            this.hide_manipulation();
        }
    }

    find_unit_id(block: Data_Block) {
        return Manager_Data.arr_unit.findIndex(v => v.x == block.x && v.y == block.y)
    }

    create_unit(data: Data_UI_Manipulation) {
        if (this.find_unit_id(data.block) >= 0) return;
        Manager_Data.arr_unit.push({
            unit_type: 0,
            belong: 0,
            hp: 0,
            morale: 0,
            form: 0,
            x: data.block.x,
            y: data.block.y,
        })
    }

    remove_unit(data: Data_UI_Manipulation) {
        let find = this.find_unit_id(data.block);
        if (find < 0) return;
        Manager_Data.arr_unit.splice(find, 1);
    }

    move_unit(unit: Data_Battle_Unit, block: Data_Block) {
        unit.x = block.x;
        unit.y = block.y;
    }
}