import { IAssembler, IRenderData, RenderData, dynamicAtlasManager, UIRenderer } from "cc";
import { Infinity_Sprite_Render } from "./Infinity_Sprite_Render";

export const RoundBoxAssembler: IAssembler = {

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
        let indexBuffer = RoundBoxAssembler.GetIndexBuffer(sprite);
        
        renderData.resize(vNum,indexBuffer.length);
        renderData.chunk.setIndexBuffer(indexBuffer);
        return renderData;
    },

    
    // 照抄simple的
    updateRenderData (sprite: Infinity_Sprite_Render) {
        const frame = sprite.spriteFrame;

        dynamicAtlasManager.packToDynamicAtlas(sprite, frame);
        this.updateUVs(sprite);// dirty need
        //this.updateColor(sprite);// dirty need

        const renderData = sprite.renderData;
        if (renderData && frame) {
            if (renderData.vertDirty) {
                this.updateVertexData(sprite);
            }
            renderData.updateRenderData(sprite, frame);
        }
    },
}