import { IAssembler, IRenderData, RenderData, dynamicAtlasManager, UIRenderer, UIVertexFormat } from "cc";
import { Infinity_Sprite_Render } from "./Infinity_Sprite_Render";

export const Infinity_Sprite_Assembler : IAssembler = {

    gen_index_buff(render:Infinity_Sprite_Render):number[]{
        let l = render.data.length;
        let ret = [];
        for (let i = 0; i < l; i++) {
            ret.push(...[i*3,i*3+1,i*3+2,i*3+1,i*3+2,i*3])
        }
        return ret;
    },

    createData (sprite:Infinity_Sprite_Render){
        const renderData = sprite.requestRenderData();

        let vNum = sprite.data.length*4;
        renderData.dataLength = vNum;
        let indexBuffer = Infinity_Sprite_Assembler.GetIndexBuffer(sprite);
        
        renderData.resize(vNum,indexBuffer.length);
        renderData.chunk.setIndexBuffer(indexBuffer);
        return renderData;
    },

    
    // 照抄simple的
    updateRenderData (sprite: Infinity_Sprite_Render) {
        
        let data_map = sprite.get_data_map();
        for (const key in data_map) {
            let data = data_map[key];
            let rd = RenderData.add(UIVertexFormat.vfmtPosUvColor);
            this._type_render_data.push({
                render_data:rd,
                texture:this.arr_texture[key],
            });

            rd.resize(data.length * 4,data.length * 6);
            let buffer = new Float32Array(data.length * 9 * 4)
            rd.chunk.vb.set(buffer)
        }
    },
}