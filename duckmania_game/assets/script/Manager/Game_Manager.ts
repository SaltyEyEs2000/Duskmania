import { _decorator, Component, Node, Prefab, TiledMap, NodeEventType, EventMouse, TiledLayer } from 'cc';
import { Infinity_Render } from '../Pub/Infinity_Render';
import { TileMap_Utils } from '../Pub/TileMap_Utils';
import { Block_Render } from '../Render/Block_Render';
import { Data_Manager } from './Data_Manager';
import { Infinity_Sprite_Render } from '../Render/Infinity_Sprite_Render';
import { Event_Dispatcher } from '../Pub/Event_Dispatcher';
const { ccclass, property } = _decorator;

@ccclass()
export class GameManager extends Component {
    @property(Node)
    nd_arr_block: Node = undefined;
    @property(Prefab)
    pf_block: Prefab = undefined;
    i_render: Infinity_Render<Block_Render> = undefined;

    @property(Infinity_Sprite_Render)
    i_sp_render: Infinity_Sprite_Render = undefined;

    @property(TiledMap)
    tm_map: TiledMap = undefined;

    readonly map_name_type: { [key: string]: number } = {
        "0-.png":0,
        "Albejons_deuxième_République.png":1,
        "Angesturas.png":2,
        "Auleutian.png":3,
        "Ballera_Free_State.png":4,
        "Commonwealth_of_West_Fragnos.png":5,
        "Coobanos.png":6,
        "Fragnos_Konorix_Clique.png":7,
        "Free_Island_of_Ellsworth.png":8,
        "Golyok.png":9,
        "Greater_Siegerkranz_Reich.png":10,
        "Hjalmar.png":11,
        "Hong'you.png":12,
        "Hypernord_Kolonie.png":13,
        "Ivorica.png":14,
        "Kalecax_Island.png":15,
        "Kalmania.png":16,
        "Kazan.png":17,
        "Kingdom_of_Aotearoa.png":18,
        "Kingdom_of_East_Fragnos.png":19,
        "Kingdom_of_Wilkes_Island.png":20,
        "Kornorix_Republic.png":21,
        "Kurvata.png":22,
        "Lei'zhou.png":23,
        "Lonoys_Island.png":24,
        "Messier.png":25,
        "Mohenzo.png":26,
        "Mohiakhan.png":27,
        "N.B.P.R.png":28,
        "Nordenland.png":29,
        "North_Island_Union.png":30,
        "Nuland_Federation.png":31,
        "Olosk.png":32,
        "Qiao'jiang.png":33,
        "R.K.Baquillat.png":34,
        "R.K.Column.png":35,
        "R.K.Gotnland.png":36,
        "R.K.Wustan_und_Saxum.png":37,
        "Republik_Lokhatskaya.png":38,
        "Shi'cheng.png":39,
        "State_of_Ennlake.png":40,
        "Tabascona.png":41,
        "Tula.png":42,
        "Tulandot.png":43,
        "Tyumen_Republic.png":44,
        "Uballitia.png":45,
        "Union_of_Grand_Santarrtic.png":46,
        "United_Chiefdom_States_of_Tomoyo_Emirate.png":47,
        "United_Further_East.png":48,
        "Unovistan.png":49,
        "Uran.png":50,
        "Vankor.png":51,
        "Vatula.png":52,
        "Veramya.png":53,
        "Virreinato_Parathius.png":54,
        "Wang'guan.png":55,
        "Wu'long.png":56,
        "Wu'yuan.png":57,
        "Zhong'jiao.png":58,
    }

    init_tile_map() {
        //初始化障碍块
        for (let i = 0; i < this.tm_map.node.children.length; i++) {
            const c = this.tm_map.node.children[i];
            let layer = c.getComponent(TiledLayer);
            if(layer?.node.active){
                for (let i = 0; i < layer.tiles.length; i++) {
                    let tile = layer.tiles[i];
                    let image_type = this.map_name_type[layer.getTileSets().find(v => v.firstGid == tile)?.imageName];
                    let tile_pos = TileMap_Utils.get_tile_x_y(i, layer);
                    let world_pos = TileMap_Utils.get_tile_position_by_x_y(tile_pos.x, tile_pos.y, layer);
                    Data_Manager.arr_block.push({
                        x: world_pos.x,
                        y: world_pos.y,
                        width: 88 * 0.8,
                        height: 102 * 0.8,
                        type: image_type || 0,
                    })
                }
            }
        }
    }

    start() {
        // this.i_render = new Infinity_Render(this.nd_arr_block,this.pf_block,Block_Render);
        this.init_tile_map();
        this.i_sp_render.set_data(Data_Manager.arr_block);
        this.tm_map.node.active = false;

        Event_Dispatcher.on("mouse_move", this, this.on_mouse_move)
    }
    get_tilemap_layer_world(){
        for (let i = 0; i < this.tm_map.node.children.length; i++) {
            const c = this.tm_map.node.children[i];
            let layer = c.getComponent(TiledLayer);
            if(layer?.node.active){
                return layer;
            }
        }
        return 
    }
    on_mouse_move(p: { x: number, y: number }) {
        let x_y_id = TileMap_Utils.get_tile_x_y_by_position(p, this.get_tilemap_layer_world());
        let id = TileMap_Utils.get_tile_id(x_y_id, this.get_tilemap_layer_world());
        for (const data of Data_Manager.arr_block) {
            data.width = 88 * 0.8
            data.height = 102 * 0.8
        }
        Data_Manager.arr_block[id].width = 88;
        Data_Manager.arr_block[id].height = 102;
        this.i_sp_render.set_data(Data_Manager.arr_block);
        console.log(`x:${p.x},y:${p.y}`)
    }
    update(deltaTime: number) {
        // this.i_render.fresh(v=>true,Data_Manager.arr_block);
    }
}
