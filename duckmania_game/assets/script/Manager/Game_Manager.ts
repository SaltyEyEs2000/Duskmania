import { _decorator, Component, Node, Prefab, TiledMap } from 'cc';
import { Infinity_Render } from '../Pub/Infinity_Render';
import { Block_Render } from '../Render/Block_Render';
const { ccclass, property } = _decorator;

@ccclass()
export class GameManager extends Component {
    @property(Node)
    nd_arr_block:Node = undefined;
    @property(Prefab)
    pf_block:Prefab = undefined;
    i_render:Infinity_Render<Block_Render> = undefined;

    @property(TiledMap)
    tm_map:TiledMap = undefined;

    start() {
        this.i_render = new Infinity_Render(this.nd_arr_block,this.pf_block,Block_Render);

    }

    update(deltaTime: number) {
        
    }
}
