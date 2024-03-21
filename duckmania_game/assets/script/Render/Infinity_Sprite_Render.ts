import { _decorator, ccenum, CCFloat, CCInteger, cclegacy, Component, InstanceMaterialType, Material, Node, NodeEventType, RenderTexture, serializeTag, Sprite, SpriteAtlas, SpriteFrame, UIRenderer, Vec2} from 'cc';
import { BUILD, EDITOR } from 'cc/env';
import { Block_Data } from '../Data/Block_Data';
import { Infinity_Sprite_Assembler } from './Infinity_Sprite_Assembler';

const { ccclass, property,type} = _decorator;


enum EventType {
    SPRITE_FRAME_CHANGED = 'spriteframe-changed',
}
const MaxGridsLimit = Math.ceil(1000);
@ccclass('Infinity_Sprite_Render')

export class Infinity_Sprite_Render extends UIRenderer {
    data:Block_Data[]
    _arr_render_data:{
        
    }
    set_data(data:Block_Data[]){
        this.data = data;
        this.resetAssembler();
    }

    @property({serializable:true})
    protected _spriteFrame: SpriteFrame | null = null;
    @type(SpriteFrame)
    get spriteFrame () {
        return this._spriteFrame;
    }
    set spriteFrame (value) {
        if (this._spriteFrame === value) {
            return;
        }

        const lastSprite = this._spriteFrame;
        this._spriteFrame = value;
        this.markForUpdateRenderData();
        this._applySpriteFrame(lastSprite);
        if (EDITOR) {
            this.node.emit(EventType.SPRITE_FRAME_CHANGED, this);
        }
    }

    onLoad(): void {
        this._flushAssembler();
    }

    public __preload () {
        super.__preload();
    }

    public onEnable () {
        super.onEnable();

        // Force update uv, material define, active material, etc
        this._activateMaterial();
        const spriteFrame = this._spriteFrame;
        if (spriteFrame) {
            this._updateUVs();
        }
    }

    public onDestroy () {
        super.onDestroy();
    }

    protected _render (render) {
        render.commitComp(this, this.renderData, this._spriteFrame, this._assembler, null);
    }

    protected _canRender () {
        if (!super._canRender()) {
            return false;
        }

        const spriteFrame = this._spriteFrame;
        if (!spriteFrame || !spriteFrame.texture) {
            return false;
        }

        return true;
    }

    protected resetAssembler() {
        this._assembler = null;
        this._flushAssembler();
    }
    protected _flushAssembler () {
        const assembler = Infinity_Sprite_Assembler;

        if (this._assembler !== assembler) {
            this.destroyRenderData();
            this._assembler = assembler;
        }


        if (!this._renderData) {
            if (this._assembler && this._assembler.createData) {
                this._renderData = this._assembler.createData(this);
                this._renderData!.material = this.getRenderMaterial(0);
                this.markForUpdateRenderData();
                if (this.spriteFrame) {
                    this._assembler.updateRenderData(this);
                }
                this._updateColor();
            }
        }
    }

    private _activateMaterial () {
        const spriteFrame = this._spriteFrame;
        const material = this.getRenderMaterial(0);
        if (spriteFrame) {
            if (material) {
                this.markForUpdateRenderData();
            }
        }

        if (this.renderData) {
            this.renderData.material = material;
        }
    }

    private _updateUVs () {
        if (this._assembler) {
            this._assembler.updateUVs(this);
        }
    }

    private _applySpriteFrame (oldFrame: SpriteFrame | null) {
        const spriteFrame = this._spriteFrame;

        let textureChanged = false;
        if (spriteFrame) {
            if (!oldFrame || oldFrame.texture !== spriteFrame.texture) {
                textureChanged = true;
            }
            if (textureChanged) {
                if (this.renderData) this.renderData.textureDirty = true;
            }
        }
    }
}
