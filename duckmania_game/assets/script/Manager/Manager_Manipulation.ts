import { _decorator, Component, Node, Button, NodeEventType, Camera, v3, game, UITransform, misc, input, Input, EventMouse, EventTouch, Prefab } from 'cc';
import { Event_Dispatcher } from '../Pub/Event_Dispatcher';
import { Data_Block, Data_UI_Manipulation } from '../Data/Data_Block';
import { Infinity_Render } from '../Pub/Infinity_Render';
import { UI_Manuplation } from '../UI/UI_Manipulation';
import { Manager_Data } from './Manager_Data';
import { Const_Event } from './Const_Event';
import { CONTEXT_BLOCK } from './Const_UI';
const { ccclass, property } = _decorator;
@ccclass('Manager_Manipulation')
export class Manager_Manipulation extends Component {
    @property(Node)
    nd_ui: Node = undefined;
    @property(Prefab)
    pf_block: Prefab = undefined;
    i_render: Infinity_Render<UI_Manuplation> = undefined;
    start(){
        this.i_render = new Infinity_Render(this.nd_ui,this.pf_block,UI_Manuplation);
        Event_Dispatcher.on(Const_Event.map_block_click, this, this.show_manipulation)
        Event_Dispatcher.on(Const_Event.manipulation, this, this.create_unit)

    }
    show_manipulation(block:Data_Block){
        let arr_data:Data_UI_Manipulation[] = [];
        for (let i = 0; i < Manager_Data.ui_block_click.length; i++) {
            const manipulation = Manager_Data.ui_block_click[i];
            arr_data.push({
                block:block,
                value:manipulation,
            })
        }
        this.i_render.fresh(v=>true,arr_data)
    }

    manipulation(data:Data_UI_Manipulation){
        if(data.value == CONTEXT_BLOCK.CREATE_UNIT){
            this.create_unit(data);
        }
    }
    create_unit(data:Data_UI_Manipulation){
        Manager_Data.arr_unit.push({
            unit_type:0,
            belong:0,
            hp:0,
            morale:0,
            form:0,
            x:data.block.x,
            y:data.block.y,
        })
    }
}