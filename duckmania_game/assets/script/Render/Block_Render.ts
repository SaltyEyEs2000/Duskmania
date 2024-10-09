import { _decorator, Component, Node, v3, SpriteFrame, Sprite } from 'cc';
import { Infinity_Renderer } from '../Pub/Infinity_Render';
import { Data_Block } from '../Data/Data_Block';
const { ccclass, property } = _decorator;

@ccclass('BlockRender')
export class Block_Render extends Component implements Infinity_Renderer {
    @property(SpriteFrame)
    arr_sf:SpriteFrame[] = [];
    public fresh(data: Data_Block) {
        this.node.setPosition(v3(data.x,data.y,0))
        this.getComponent(Sprite).spriteFrame = this.arr_sf[data.type];
    }
    start() {
    }
    update(deltaTime: number) {
    }
}


