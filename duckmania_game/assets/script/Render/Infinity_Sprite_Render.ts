import { __private, _decorator, ccenum, CCFloat, CCInteger, cclegacy, Component, InstanceMaterialType, Material, Node, NodeEventType, RenderData, RenderTexture, serializeTag, Sprite, SpriteAtlas, SpriteFrame, UIRenderer, Vec2, UITransform, EventMouse } from 'cc';
import { BUILD, EDITOR } from 'cc/env';
import { Data_Block } from '../Data/Data_Block';
import { Infinity_Sprite_Assembler } from './Infinity_Sprite_Assembler';

const { ccclass, property, type } = _decorator;

export interface Infinity_Render_Data {
    spriteFrame: SpriteFrame,
    render_data: RenderData,
    data: Data_Block,
}
enum EventType {
    SPRITE_FRAME_CHANGED = 'spriteframe-changed',
}
const MaxGridsLimit = Math.ceil(1000);
@ccclass('Infinity_Sprite_Render')

export class Infinity_Sprite_Render extends UIRenderer {
    data: Data_Block[] = [];
    _arr_render_data: Infinity_Render_Data[] = [];
    _idx_render_data = 0;
    set_data(data: Data_Block[]) {
        this.data = data;
        this.resetAssembler();
        this.markForUpdateRenderData();
        let minx = Number.POSITIVE_INFINITY;
        let miny = Number.POSITIVE_INFINITY;
        let maxx = Number.NEGATIVE_INFINITY;
        let maxy = Number.NEGATIVE_INFINITY;
        for (const d of this.data) {
            if (d.x - d.width / 2 < minx) {
                minx = d.x - d.width / 2;
            }
            if (d.y - d.height / 2 < miny) {
                miny = d.y - d.height / 2;
            }
            if (d.x + d.width / 2 > maxx) {
                maxx = d.x + d.width / 2;
            }
            if (d.y + d.height / 2 > maxy) {
                maxy = d.y + d.height / 2;
            }
        }
        this.getComponent(UITransform).width = maxx - minx;
        this.getComponent(UITransform).height = maxy - miny;
    }

    @property(SpriteFrame)
    public arr_sf: SpriteFrame[] = [];

    onLoad(): void {
        this._flushAssembler();
    }

    public __preload() {
        super.__preload();
    }

    public onEnable() {
        super.onEnable();

        // Force update uv, material define, active material, etc
    }

    public onDestroy() {
        super.onDestroy();
    }

    protected _render(render: __private._cocos_2d_renderer_i_batcher__IBatcher) {
        for (let i = 0; i < this.data.length; i++) {
            const data = this.data[i];
            this._idx_render_data = i;
            let render_data = this._arr_render_data[i];
            if (render_data) {
                render.commitComp(this, render_data.render_data, render_data.spriteFrame, this._assembler, null);
            }

        }
    }

    protected _canRender() {
        if (!super._canRender()) {
            return false;
        }

        if (!this.arr_sf || !this.arr_sf.length) {
            return false;
        }

        return true;
    }

    protected resetAssembler() {
        this._assembler = null;
        this._flushAssembler();
    }
    protected _flushAssembler() {
        const assembler = Infinity_Sprite_Assembler;

        if (this._assembler !== assembler) {
            this._assembler = assembler;
        }
        for (const rd of this._arr_render_data) {
            RenderData.remove(rd.render_data);
        }
        this._arr_render_data = [];


        if (!this._arr_render_data.length) {
            if (this._assembler && this._assembler.createData) {
                this._assembler.createData(this);
                this._updateColor();
            }
        }
    }

}
