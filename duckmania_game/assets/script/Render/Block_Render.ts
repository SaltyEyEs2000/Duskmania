import { _decorator, Component, Node, v3 } from 'cc';
import { Infinity_Renderer } from '../Pub/Infinity_Render';
import { Block_Data } from '../Data/Block_Data';
const { ccclass, property } = _decorator;

@ccclass('BlockRender')
export class Block_Render extends Component implements Infinity_Renderer {
    public fresh(data: Block_Data) {
        this.node.setPosition(v3(data.x,data.y,0))
    }
    start() {
    }
    update(deltaTime: number) {
    }
}


