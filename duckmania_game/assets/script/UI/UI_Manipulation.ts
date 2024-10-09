import { _decorator, Component, EventMouse, EventTouch, Label, Node, UITransform, v3 } from 'cc';
import { Event_Dispatcher } from '../Pub/Event_Dispatcher';
import { Infinity_Renderer } from '../Pub/Infinity_Render';
import { Data_UI_Manipulation } from '../Data/Data_Block';
import { Const_Event } from '../Manager/Const_Event';
const { ccclass, property } = _decorator;

@ccclass('UI_Manuplation')
export class UI_Manuplation extends Component implements Infinity_Renderer {
    @property(Label)
    lb_name: Label = undefined;
    data: Data_UI_Manipulation;
    fresh(data: Data_UI_Manipulation) {
        this.data = data;
        let gap = 5;
        this.node.setPosition(v3(data.block.x, data.block.y - data.index * (this.getComponent(UITransform).height + gap), 0))
        this.lb_name.string = data.value;
    }
    clk_btn(e: EventTouch | EventMouse) {
        Event_Dispatcher.post(Const_Event.manipulation, this.data);
    }
}


