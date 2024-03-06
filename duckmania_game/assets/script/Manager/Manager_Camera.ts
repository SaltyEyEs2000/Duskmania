import { _decorator, Component, Node, Button, NodeEventType, Camera, v3, game, UITransform, misc, input, Input, EventMouse } from 'cc';
const { ccclass, property } = _decorator;
@ccclass('Manager_Camera')
export class Manager_Camera extends Component {
    @property(Node)
    canvas:Node = undefined
    @property(Node)
    worldmap:Node = undefined
    @property
    MOVE_SPD:number = 50
    @property(Button)
    btn_right:Button = undefined;
    @property(Button)
    btn_left:Button = undefined;
    @property(Button)
    btn_up:Button = undefined;
    @property(Button)
    btn_down:Button = undefined;
    @property(Camera)
    camera:Camera = undefined
    right_spd = 0;
    up_spd = 0;
    start() {
        
        this.btn_right.node.on(NodeEventType.MOUSE_ENTER,this.hover_right,this);
        this.btn_left.node.on(NodeEventType.MOUSE_ENTER,this.hover_left,this);
        this.btn_up.node.on(NodeEventType.MOUSE_ENTER,this.hover_up,this);
        this.btn_down.node.on(NodeEventType.MOUSE_ENTER,this.hover_down,this);
        this.btn_right.node.on(NodeEventType.TOUCH_START,this.hover_right,this);
        this.btn_left.node.on(NodeEventType.TOUCH_START,this.hover_left,this);
        this.btn_up.node.on(NodeEventType.TOUCH_START,this.hover_up,this);
        this.btn_down.node.on(NodeEventType.TOUCH_START,this.hover_down,this);
        this.btn_right.node.on(NodeEventType.MOUSE_LEAVE,this.hover_end,this);
        this.btn_left.node.on(NodeEventType.MOUSE_LEAVE,this.hover_end,this);
        this.btn_up.node.on(NodeEventType.MOUSE_LEAVE,this.hover_end,this);
        this.btn_down.node.on(NodeEventType.MOUSE_LEAVE,this.hover_end,this);
        this.btn_right.node.on(NodeEventType.TOUCH_END,this.hover_end,this);
        this.btn_left.node.on(NodeEventType.TOUCH_END,this.hover_end,this);
        this.btn_up.node.on(NodeEventType.TOUCH_END,this.hover_end,this);
        this.btn_down.node.on(NodeEventType.TOUCH_END,this.hover_end,this);

        
        input.on(Input.EventType.MOUSE_WHEEL, this.on_wheel, this);
    }
    on_wheel(e:EventMouse){
        this.camera.orthoHeight += e.getScrollY() * 0.1;
       
    }
    hover_right(){
        this.right_spd = this.MOVE_SPD;
    }
    hover_left(){
        this.right_spd = -this.MOVE_SPD;
    }
    hover_up(){
        this.up_spd = this.MOVE_SPD;
    }
    hover_down(){
        this.up_spd = -this.MOVE_SPD;
    }
    hover_end(){
        this.right_spd = 0;
        this.up_spd = 0;
    }

    update(deltaTime: number) {
        this.camera.node.translate(v3(this.right_spd,this.up_spd,0));
        let map_height = this.worldmap.getComponent(UITransform).height;
        let map_width = this.worldmap.getComponent(UITransform).width;
        let camera_height = this.canvas.getComponent(UITransform).height;
        let camera_width = this.canvas.getComponent(UITransform).width;
        let camera_x = this.camera.node.position.x;
        let camera_y = this.camera.node.position.y;
        let calc_y = misc.clampf(camera_y,camera_height/2-map_height/2,-camera_height/2+map_height/2);
        let calc_x = misc.clampf(camera_x,camera_width/2-map_width/2,-camera_width/2+map_width/2);
        this.camera.node.setPosition(v3(calc_x,calc_y,0));
    }
}


