import { IAssembler, IRenderData, RenderData, dynamicAtlasManager, UIRenderer, UIVertexFormat, __private, Vec3 } from "cc";
import { Infinity_Sprite_Render } from "./Infinity_Sprite_Render";

export const Infinity_Sprite_Assembler : IAssembler = {
    updateRenderData (sprite: Infinity_Sprite_Render) {        
        let data_map = sprite.get_data_map();
        sprite._type_render_data = [];
        
        const matrix = sprite.node.worldMatrix;
        const vertStep = 9;
        const vertStep2 = vertStep * 2;
        const vertStep3 = vertStep * 3;
        const color: Float32Array = new Float32Array(4);
        color[0] = sprite.color.r / 255;
        color[1] = sprite.color.g / 255;
        color[2] = sprite.color.b / 255;
        color[3] = sprite.color.a / 255;

        for (const key in data_map) {
            let data = data_map[key];
            let rd = RenderData.add(UIVertexFormat.vfmtPosUvColor);
            sprite._type_render_data.push({
                render_data:rd,
                texture:sprite.arr_texture[data[0].type],
            });

            rd.resize(data.length * 4,data.length * 6);
            let vertexBuf = new Float32Array(data.length * 9 * 4);
            rd.chunk.vb.set(vertexBuf)

            for (let i = 0; i < data.length; i++) {
                const quad = data[i];
                let _vfOffset = i * 4 * 9;
                const vec3_temps: Vec3[] = [];
                for (let i = 0; i < 4; i++) {
                    vec3_temps.push(new Vec3());
                }
                const left = quad.x - sprite.size_w/2;
                const top = quad.y + sprite.size_h/2;
                const bottom = quad.y - sprite.size_h/2;
                const right = quad.x + sprite.size_w/2;
                
                vec3_temps[0].x = left;
                vec3_temps[0].y = top;

                vec3_temps[1].x = left;
                vec3_temps[1].y = bottom;

                vec3_temps[2].x = right;
                vec3_temps[2].y = top;

                vec3_temps[3].x = right;
                vec3_temps[3].y = bottom;
    
                vec3_temps[0].transformMat4(matrix);
                vertexBuf[_vfOffset] = vec3_temps[0].x;
                vertexBuf[_vfOffset + 1] = vec3_temps[0].y;
                vertexBuf[_vfOffset + 2] = vec3_temps[0].z;
    
                vec3_temps[1].transformMat4(matrix);
                vertexBuf[_vfOffset + vertStep] = vec3_temps[1].x;
                vertexBuf[_vfOffset + vertStep + 1] = vec3_temps[1].y;
                vertexBuf[_vfOffset + vertStep + 2] = vec3_temps[1].z;
    
                vec3_temps[2].transformMat4(matrix);
                vertexBuf[_vfOffset + vertStep2] = vec3_temps[2].x;
                vertexBuf[_vfOffset + vertStep2 + 1] = vec3_temps[2].y;
                vertexBuf[_vfOffset + vertStep2 + 2] = vec3_temps[2].z;
    
                vec3_temps[3].transformMat4(matrix);
                vertexBuf[_vfOffset + vertStep3] = vec3_temps[3].x;
                vertexBuf[_vfOffset + vertStep3 + 1] = vec3_temps[3].y;
                vertexBuf[_vfOffset + vertStep3 + 2] = vec3_temps[3].z;
    
                vertexBuf.set(color, _vfOffset + 5);
                vertexBuf.set(color, _vfOffset + vertStep + 5);
                vertexBuf.set(color, _vfOffset + vertStep2 + 5);
                vertexBuf.set(color, _vfOffset + vertStep3 + 5);
                
            }


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
            const renderData = (r as any).renderData;
            const vs = renderData.vData;
            for (let i = renderData.vertexStart, l = renderData.vertexCount; i < l; i++) {
                vs.set(colorV, i * 9 + 5);
            }
        }
    },
}