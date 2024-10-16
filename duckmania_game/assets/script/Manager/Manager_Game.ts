import { _decorator, Component, Node, Prefab, TiledMap, NodeEventType, EventMouse, TiledLayer, UITransform, Camera } from 'cc';
import { Infinity_Render } from '../Pub/Infinity_Render';
import { TileMap_Utils } from '../Pub/TileMap_Utils';
import { Block_Render } from '../Render/Block_Render';
import { Manager_Data } from './Manager_Data';
import { Infinity_Sprite_Render } from '../Render/Infinity_Sprite_Render';
import { Event_Dispatcher } from '../Pub/Event_Dispatcher';
import { Manager_Camera } from './Manager_Camera';
import { Data_Block, Data_UI_Manipulation } from '../Data/Data_Block';
import { Const_Event } from './Const_Event';
import { CONTEXT_BLOCK } from './Const_UI';
const { ccclass, property } = _decorator;

@ccclass()
export class GameManager extends Component {
    i_render: Infinity_Render<Block_Render> = undefined;
    @property(Camera)
    camera: Camera = undefined

    @property(Infinity_Sprite_Render)
    i_block: Infinity_Sprite_Render = undefined;
    @property(Infinity_Sprite_Render)
    i_unit: Infinity_Sprite_Render = undefined;

    @property(TiledMap)
    tm_map: TiledMap = undefined;

    readonly map_name_type: { [key: string]: number } = {
        "0-.png": 0,
        "Albejons_deuxième_République.png": 1,
        "Angesturas.png": 2,
        "Auleutian.png": 3,
        "Ballera_Free_State.png": 4,
        "Commonwealth_of_West_Fragnos.png": 5,
        "Coobanos.png": 6,
        "Fragnos_Konorix_Clique.png": 7,
        "Free_Island_of_Ellsworth.png": 8,
        "Golyok.png": 9,
        "Greater_Siegerkranz_Reich.png": 10,
        "Hjalmar.png": 11,
        "Hong'you.png": 12,
        "Hypernord_Kolonie.png": 13,
        "Ivorica.png": 14,
        "Kalecax_Island.png": 15,
        "Kalmania.png": 16,
        "Kazan.png": 17,
        "Kingdom_of_Aotearoa.png": 18,
        "Kingdom_of_East_Fragnos.png": 19,
        "Kingdom_of_Wilkes_Island.png": 20,
        "Kornorix_Republic.png": 21,
        "Kurvata.png": 22,
        "Lei'zhou.png": 23,
        "Lonoys_Island.png": 24,
        "Messier.png": 25,
        "Mohenzo.png": 26,
        "Mohiakhan.png": 27,
        "N.B.P.R.png": 28,
        "Nordenland.png": 29,
        "North_Island_Union.png": 30,
        "Nuland_Federation.png": 31,
        "Olosk.png": 32,
        "Qiao'jiang.png": 33,
        "R.K.Baquillat.png": 34,
        "R.K.Column.png": 35,
        "R.K.Gotnland.png": 36,
        "R.K.Wustan_und_Saxum.png": 37,
        "Republik_Lokhatskaya.png": 38,
        "Shi'cheng.png": 39,
        "State_of_Ennlake.png": 40,
        "Tabascona.png": 41,
        "Tula.png": 42,
        "Tulandot.png": 43,
        "Tyumen_Republic.png": 44,
        "Uballitia.png": 45,
        "Union_of_Grand_Santarrtic.png": 46,
        "United_Chiefdom_States_of_Tomoyo_Emirate.png": 47,
        "United_Further_East.png": 48,
        "Unovistan.png": 49,
        "Uran.png": 50,
        "Vankor.png": 51,
        "Vatula.png": 52,
        "Veramya.png": 53,
        "Virreinato_Parathius.png": 54,
        "Wang'guan.png": 55,
        "Wu'long.png": 56,
        "Wu'yuan.png": 57,
        "Zhong'jiao.png": 58,
    }

    init_tile_map() {
        //初始化障碍块
        for (let i = 0; i < this.tm_map.node.children.length; i++) {
            const c = this.tm_map.node.children[i];
            let layer = c.getComponent(TiledLayer);
            if (layer?.node.active) {
                for (let i = 0; i < layer.tiles.length; i++) {
                    let tile = layer.tiles[i];
                    let image_type = this.map_name_type[layer.getTileSets().find(v => v.firstGid == tile)?.imageName];
                    let tile_pos = TileMap_Utils.get_tile_x_y(i, layer);
                    let world_pos = TileMap_Utils.get_tile_position_by_x_y(tile_pos.x, tile_pos.y, layer);
                    if (image_type) {
                        Manager_Data.arr_block.push({
                            x: world_pos.x,
                            y: world_pos.y,
                            width: Manager_Data.tile_width * Manager_Data.init_scale,
                            height: Manager_Data.tile_height * Manager_Data.init_scale,
                            type: image_type || 0,
                        })
                    }
                }
            }
        }
    }

    start() {
        this.init_tile_map();
        this.i_block.set_data(Manager_Data.arr_block);
        this.tm_map.node.active = false;

        Event_Dispatcher.on(Const_Event.mouse_move, this, this.on_mouse_move)
        Event_Dispatcher.on(Const_Event.mouse_click, this, this.on_mouse_click)
    }
    get_tilemap_layer_world() {
        for (let i = 0; i < this.tm_map.node.children.length; i++) {
            const c = this.tm_map.node.children[i];
            let layer = c.getComponent(TiledLayer);
            if (layer?.node.active) {
                return layer;
            }
        }
        return
    }
    get_mouse_block(p: { x: number, y: number }) {
        let ret: Data_Block;
        for (const data of Manager_Data.arr_block) {
            data.width = Manager_Data.tile_width * Manager_Data.init_scale;
            data.height = Manager_Data.tile_height * Manager_Data.init_scale;

            if (p.x < data.x + Manager_Data.tile_width / 2
                && p.x > data.x - Manager_Data.tile_width / 2
                && p.y < data.y + Manager_Data.tile_height / 2
                && p.y > data.y - Manager_Data.tile_height / 2) {
                ret = data;
            }
        }
        return ret;
    }
    on_mouse_click(p: { x: number, y: number }) {
        if (Manager_Data.last_hide_manipulation_tm == Manager_Data.curTm) return;
        if (Manager_Data.is_show_manipulation) {
            Event_Dispatcher.post(Const_Event.manipulation, {
                index: 0,
                block: null,
                value: CONTEXT_BLOCK.CLOSE_MANIPULATION,
            } as Data_UI_Manipulation);
            return;
        }
        let d: Data_Block = this.get_mouse_block(p);
        if (d) {
            Event_Dispatcher.post(Const_Event.map_block_click, d)
        }
    }
    on_mouse_move(p: { x: number, y: number }) {
        // let x_y_id = TileMap_Utils.get_tile_x_y_by_position(p, this.get_tilemap_layer_world());
        // let id = TileMap_Utils.get_tile_id(x_y_id, this.get_tilemap_layer_world());
        let data = this.get_mouse_block(p);
        if (!data) return;
        data.width = Manager_Data.tile_width;
        data.height = Manager_Data.tile_height;
        // console.log(`x:${p.x},y:${p.y}`)
    }
    update(deltaTime: number) {
        Manager_Data.curTm = (new Date()).getTime();
        let filterOutCamera = b => {
            let x = b.x - this.camera.node.position.x;
            let y = b.y - this.camera.node.position.y;
            let rect = this.getComponent(UITransform);
            let w = this.camera.orthoHeight * 2 * rect.width / rect.height;
            let h = this.camera.orthoHeight * 2
            return x > -w / 2 && x < w / 2 && y > -h / 2 && y < h / 2;
        }
        let arr_block = Manager_Data.arr_block.filter(filterOutCamera);
        this.i_block.set_data(arr_block);

        let arr_unit_bg = Manager_Data.get_arr_block_unit_bg().filter(filterOutCamera);
        this.i_unit.set_data(arr_unit_bg);
        // this.i_render.fresh(v=>true,Data_Manager.arr_block);
    }
}
