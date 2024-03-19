import { RenderData, Texture2D, UIRenderer, UIVertexFormat } from "cc";
import { Block_Data } from "../Data/Block_Data";

interface Type_Render_Data{
    texture:Texture2D;
    render_data:RenderData;
}
export class Infinity_Sprite_Render extends UIRenderer {

    arr_texture:Texture2D[];
    data:Block_Data[]
    data_map:Block_Data[][];

    _type_render_data:Type_Render_Data[]=[];

    get_data_map():Block_Data[][]{
        for (let i = 0; i < this.data.length; i++) {
            const data = this.data[i];
            if(!this.data_map[data.type]){
                this.data_map[data.type].push(data);
            }
        }
        return this.data_map;
    }

    gen_type_render_data(){
    }
}