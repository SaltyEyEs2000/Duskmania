import { RenderData, Texture2D, UIRenderer, UIVertexFormat, __private, _decorator } from "cc";
import { Block_Data } from "../Data/Block_Data";
import { Infinity_Sprite_Assembler } from "./Infinity_Sprite_Assembler";

const { ccclass, property,type} = _decorator;
interface Type_Render_Data{
    texture:Texture2D;
    render_data:RenderData;
}


const MaxGridsLimit = Math.ceil(1000);
@ccclass('Infinity_Sprite_Render')

export class Infinity_Sprite_Render extends UIRenderer {
    @property(Texture2D)
    arr_texture:Texture2D[]=[];

    data:Block_Data[]=[];
    data_map:Block_Data[][]=[];

    size_w:number=88;
    size_h:number=102;
    _type_render_data:Type_Render_Data[]=[];
    _type_render_idx = 0;

    set_data(data:Block_Data[]){
        this.data = data;
        this.markForUpdateRenderData();
    }

    get_data_map():Block_Data[][]{
        for (let i = 0; i < this.data.length; i++) {
            const data = this.data[i];

            let need_new_space = true;
            for (let i = 0; i < this.data_map.length; i++) {
                let slice = this.data_map[i];
                if(slice.length<MaxGridsLimit){
                    if(slice[0].type == data.type){
                        slice.push(data);
                        need_new_space = false;
                    }
                }
            }
            if(need_new_space){
                this.data_map.push([data]);
            }

            // if(!this.data_map[data.type]){
            //     this.data_map[data.type] = [];
            // }
            // this.data_map[data.type].push(data);
        }
        return this.data_map;
    }

    protected _render(ui: __private._cocos_2d_renderer_i_batcher__IBatcher): void {
        for (let i = 0; i < this._type_render_data.length; i++) {
            this._type_render_idx = i;
            const td = this._type_render_data[i];
            if (td.texture) {
                ui.commitComp(this, td.render_data, td.texture, this._assembler, null);
            }
        }
    }

    destroyRenderData(){
        this._type_render_data.forEach((rd) => {
            const renderData = (rd).render_data;
            if (renderData) RenderData.remove(renderData);
        });
        this._type_render_data = [];
        super.destroyRenderData();
    }
    
    protected _flushAssembler () {
        const assembler = Infinity_Sprite_Assembler;

        if (this._assembler !== assembler) {
            this.destroyRenderData();
            this._assembler = assembler;
        }
        if (this.data.length === 0) {
            this.markForUpdateRenderData();
            this._updateColor();
        }
    }
}

