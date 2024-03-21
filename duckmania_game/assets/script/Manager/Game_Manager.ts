import { _decorator, Component, Node, Prefab, TiledMap } from 'cc';
import { Infinity_Render } from '../Pub/Infinity_Render';
import { TileMap_Utils } from '../Pub/TileMap_Utils';
import { Block_Render } from '../Render/Block_Render';
import { Data_Manager } from './Data_Manager';
import { Infinity_Sprite_Render } from '../Render/Infinity_Sprite_Render';
const { ccclass, property } = _decorator;

@ccclass()
export class GameManager extends Component {
    @property(Node)
    nd_arr_block:Node = undefined;
    @property(Prefab)
    pf_block:Prefab = undefined;
    i_render:Infinity_Render<Block_Render> = undefined;

    @property(Infinity_Sprite_Render)
    i_sp_render:Infinity_Sprite_Render = undefined;

    @property(TiledMap)
    tm_map:TiledMap = undefined;
    
    readonly map_name_type:{[key:string]:number} = {
        "0-.png":0,
        "sea.png":1,
        "coast.png":2,
        "land.png":3,
    }

    init_tile_map(){
        //初始化障碍块
        let layer = this.tm_map.getLayer('Tile Layer 1');
        for (let i = 0; i < layer.tiles.length; i++) {
            let tile =  layer.tiles[i];
            let image_type = this.map_name_type[layer.getTileSets().find(v=>v.firstGid==tile)?.imageName];
            if(image_type){
                let tile_pos = TileMap_Utils.get_tile_x_y(i, layer);
                let world_pos = TileMap_Utils.get_tile_position_by_x_y(tile_pos.x,tile_pos.y,layer);
                Data_Manager.arr_block.push({
                    x:world_pos.x,
                    y:world_pos.y,
                    type:image_type,
                })
            }
        }
    }

    start() {
        // this.i_render = new Infinity_Render(this.nd_arr_block,this.pf_block,Block_Render);
        this.init_tile_map();
        this.i_sp_render.set_data(Data_Manager.arr_block);
        this.tm_map.node.active = false;
    }

    update(deltaTime: number) {
        // this.i_render.fresh(v=>true,Data_Manager.arr_block);
    }
}
