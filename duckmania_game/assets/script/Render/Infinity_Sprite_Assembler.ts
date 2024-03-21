import { IAssembler, IRenderData, RenderData, dynamicAtlasManager, UIRenderer, UIVertexFormat, __private, Vec3 } from "cc";
import { Infinity_Sprite_Render } from "./Infinity_Sprite_Render";

export const Infinity_Sprite_Assembler : IAssembler = {

    initRenderData(sprite: Infinity_Sprite_Render){ 
        let all_data = sprite.data;
        sprite._type_render_data = [];

        for (const data of all_data) {
            let rd = sprite.requestRenderData();;
            sprite._type_render_data.push({
                render_data:rd,
                texture:sprite.arr_texture[data.type],
            });

            rd.dataLength = 4;
            rd.resize(1 * 4,1 * 6);
            rd.chunk.setIndexBuffer([0,1,2,2,3,0])

            const material = sprite.getRenderMaterial(0);
            rd.material = material;

            
            const left = data.x - sprite.size_w/2;
            const top = data.y + sprite.size_h/2;
            const bottom = data.y - sprite.size_h/2;
            const right = data.x + sprite.size_w/2;
            
            rd.data[0].x = left;
            rd.data[0].y = top;
            rd.data[1].x = left;
            rd.data[1].y = bottom;
            rd.data[2].x = right;
            rd.data[2].y = top;
            rd.data[3].x = right;
            rd.data[3].y = bottom;

            
            const uv = sprite.arr_texture[data.type].uv;
            const uv_l = uv[0];
            const uv_b = uv[1];
            const uv_r = uv[2];
            const uv_t = uv[5];

            rd.data[0].u = uv_l;
            rd.data[0].v = uv_t;
            rd.data[1].u = uv_r;
            rd.data[1].v = uv_t;
            rd.data[2].u = uv_l;
            rd.data[2].v = uv_b;
            rd.data[3].u = uv_r;
            rd.data[3].v = uv_b;

            rd.data[0].color = sprite.color;
            rd.data[1].color = sprite.color;
            rd.data[2].color = sprite.color;
            rd.data[3].color = sprite.color;
        }

    },
    updateRenderData (sprite: Infinity_Sprite_Render) {    
        for (const pack of sprite._type_render_data) {  
            pack.render_data.updateRenderData(sprite,pack.texture);
        }
    },
    
    fillBuffers (sprite: Infinity_Sprite_Render, renderer: __private._cocos_2d_renderer_i_batcher__IBatcher) {
        if (!sprite || sprite._type_render_data.length === 0) return;

        const dataArray = sprite._type_render_data;

        // 当前渲染的数据
        const data = dataArray[sprite._type_render_idx];
        const renderData = data.render_data!;
        const iBuf = renderData.chunk.meshBuffer.iData;

        let indexOffset = renderData.chunk.meshBuffer.indexOffset;
        let vertexId = renderData.chunk.vertexOffset;
        const quadCount = renderData.vertexCount / 4;
        for (let i = 0; i < quadCount; i += 1) {
            iBuf[indexOffset] = vertexId;
            iBuf[indexOffset + 1] = vertexId + 1;
            iBuf[indexOffset + 2] = vertexId + 2;
            iBuf[indexOffset + 3] = vertexId + 2;
            iBuf[indexOffset + 4] = vertexId + 1;
            iBuf[indexOffset + 5] = vertexId + 3;
            indexOffset += 6;
            vertexId += 4;
        }
        renderData.chunk.meshBuffer.indexOffset = indexOffset;
    },
    
    updateColor (sprite: Infinity_Sprite_Render) {
        const color = sprite.color;
        const colorV = new Float32Array(4);
        colorV[0] = color.r / 255;
        colorV[1] = color.g / 255;
        colorV[2] = color.b / 255;
        colorV[3] = color.a / 255;
        const rs = sprite._type_render_data;
        for (const r of rs) {
            if (!r.render_data) continue;
            const renderData = (r as any).render_data;
            const vs = renderData.vData;
            for (let i = renderData.vertexStart, l = renderData.vertexCount; i < l; i++) {
                vs.set(colorV, i * 9 + 5);
            }
        }
    },
}