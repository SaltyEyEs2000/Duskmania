import { IAssembler, IRenderData, RenderData, SpriteFrame, dynamicAtlasManager, sp ,Node} from "cc";
import { Infinity_Render_Data, Infinity_Sprite_Render } from "./Infinity_Sprite_Render";
import { Block_Data } from "../Data/Block_Data";

export const Infinity_Sprite_Assembler: IAssembler = {

    // 根据圆角segments参数，构造网格的顶点索引列表
    GetIndexBuffer(sprite:Infinity_Sprite_Render) {
        let indexBuffer = [
            0, 1, 2, 2, 3, 0,
        ]
        return indexBuffer
    },
    createData (sprite: Infinity_Sprite_Render) {
        for (const data of sprite.data) {
            const renderData = sprite.requestRenderData();
    
            let vNum = 4 ;
            renderData.dataLength = vNum;
            renderData.resize(vNum, 6);
    
            let indexBuffer = Infinity_Sprite_Assembler.GetIndexBuffer(sprite);
            renderData.chunk.setIndexBuffer(indexBuffer);
            renderData!.material = sprite.getRenderMaterial(0)
            sprite._arr_render_data.push({
                spriteFrame:sprite.arr_sf[data.type],
                render_data:renderData,
                data:data,
            })
        }
    },

    // 照抄simple的
    updateRenderData (sprite: Infinity_Sprite_Render) {
        for (const data of sprite._arr_render_data){
            const frame = data.spriteFrame;
    
            dynamicAtlasManager.packToDynamicAtlas(sprite, frame);
            this.updateUVs(data);// dirty need
            //this.updateColor(sprite);// dirty need
    
            const renderData = data.render_data;
            if (renderData && frame) {
                if (renderData.vertDirty) {
                    this.updateVertexData(data);
                }
                renderData.updateRenderData(sprite, frame);
            }
        }
    },

    // 局部坐标转世界坐标 照抄的，不用改
    updateWorldVerts (sprite: Infinity_Render_Data,render:Infinity_Sprite_Render, chunk: { vb: any; }) {
        const renderData = sprite.render_data!;
        const vData = chunk.vb;

        const dataList: IRenderData[] = renderData.data;
        const m = render.node.worldMatrix;

        const stride = renderData.floatStride;
        let offset = 0;
        const length = dataList.length;
        for (let i = 0; i < length; i++) {
            const curData = dataList[i];
            const x = curData.x;
            const y = curData.y;
            let rhw = m.m03 * x + m.m07 * y + m.m15;
            rhw = rhw ? 1 / rhw : 1;

            offset = i * stride;
            vData[offset + 0] = (m.m00 * x + m.m04 * y + m.m12) * rhw;
            vData[offset + 1] = (m.m01 * x + m.m05 * y + m.m13) * rhw;
            vData[offset + 2] = (m.m02 * x + m.m06 * y + m.m14) * rhw;
        }
    },

    // 每帧调用的，把数据和到一整个meshbuffer里
    fillBuffers (sprite: Infinity_Sprite_Render) {
        let data = sprite._arr_render_data[sprite._idx_render_data]
        const renderData = data.render_data!;
        const chunk = renderData.chunk;
        if (sprite.node.hasChangedFlags || renderData.vertDirty) {
            // const vb = chunk.vertexAccessor.getVertexBuffer(chunk.bufferId);
            this.updateWorldVerts(data,sprite, chunk);
            renderData.vertDirty = false;
        }

        // quick version
        const bid = chunk.bufferId;
        const vidOrigin = chunk.vertexOffset;
        const meshBuffer = chunk.meshBuffer;
        const ib = chunk.meshBuffer.iData;
        let indexOffset = meshBuffer.indexOffset;

        const vid = vidOrigin;
        // 沿着当前这个位置往后将我们这个对象的index放进去
        let indexBuffer = Infinity_Sprite_Assembler.GetIndexBuffer(sprite);
        for (let i = 0; i < renderData.indexCount; i++) {
            ib[indexOffset++] = vid + indexBuffer[i];
        }
        meshBuffer.indexOffset += renderData.indexCount;
    },

    // 计算每个顶点相对于sprite坐标的位置
    updateVertexData (sprite: Infinity_Render_Data) {
        const renderData: RenderData | null = sprite.render_data;
        if (!renderData) {
            return;
        }

        const dataList: IRenderData[] = renderData.data;
        const cw = sprite.data.width;
        const ch = sprite.data.height;
        const appX = 0.5 * sprite.data.width;
        const appY = 0.5 * sprite.data.height;

        const left = 0 - appX + sprite.data.x;
        const right = cw - appX + sprite.data.x;
        const top = ch - appY + sprite.data.y;
        const bottom = 0 - appY + sprite.data.y;

        const left_r = left;
        const right_r = right;

        // 三个矩形的顶点
        dataList[0].x = left_r;
        dataList[0].y = bottom;
        dataList[1].x = left_r;
        dataList[1].y = top;
        dataList[2].x = right_r;
        dataList[2].y = top;
        dataList[3].x = right_r;
        dataList[3].y = bottom;
        

        renderData.vertDirty = true;
    },

    // 更新计算uv
    updateUVs (sprite: Infinity_Render_Data) {
        if (!sprite.spriteFrame) return;
        const renderData = sprite.render_data!;
        const vData = renderData.chunk.vb;
        const uv = sprite.spriteFrame.uv;

        // 这里我打印了一下uv的值，第一个看上去是左上角，但其实，opengl端的纹理存在上下颠倒问题，所以这里其实还是左下角
        // 左下，右下，左上，右上
        const uv_l = uv[0];
        const uv_b = uv[1];
        const uv_r = uv[2];
        const uv_t = uv[5];

        vData[0 * renderData.floatStride + 3] = uv_l;
        vData[0 * renderData.floatStride + 4] = uv_b;
        vData[1 * renderData.floatStride + 3] = uv_l;
        vData[1 * renderData.floatStride + 4] = uv_t;
        vData[2 * renderData.floatStride + 3] = uv_r;
        vData[2 * renderData.floatStride + 4] = uv_t;
        vData[3 * renderData.floatStride + 3] = uv_r;
        vData[3 * renderData.floatStride + 4] = uv_b;

        // 用相对坐标，计算uv
        // for (let i = 0; i < renderData.dataLength; i++) {
        //     vData[i * renderData.floatStride + 3] = uv_l + (dataList[i].x + appX) / cw * uv_w;
        //     vData[i * renderData.floatStride + 4] = uv_b + (dataList[i].y + appY) / ch * uv_h;
        // }
    },

    // 照抄，不用改
    updateColor (sprite: Infinity_Sprite_Render) {
        for (const data of sprite._arr_render_data) {
            const renderData = data.render_data;
            const vData = renderData.chunk.vb;
            let colorOffset = 5;
            const color = sprite.color;
            const colorR = color.r / 255;
            const colorG = color.g / 255;
            const colorB = color.b / 255;
            const colorA = color.a / 255;
            for (let i = 0; i < renderData.dataLength; i++, colorOffset += renderData.floatStride) {
                vData[colorOffset] = colorR;
                vData[colorOffset + 1] = colorG;
                vData[colorOffset + 2] = colorB;
                vData[colorOffset + 3] = colorA;
            }
        }
    },
};