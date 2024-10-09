import { Component, Node, Prefab } from "cc";
import { Node_Pool } from "./Node_Pool";


//本脚本为解决长列表渲染问题
/*
    基本思路是当物品在渲染区域以外的时候放入缓存池
    在渲染区域以内时再取出

    过滤由各个调用者处理
*/

export abstract class Infinity_Renderer extends Component {
    public abstract fresh(data: any);
}

export class Infinity_Render<T extends Infinity_Renderer> {
    node_pool: Node_Pool;
    parent: Node;
    pf: Node | Prefab;
    entity: new (...args: any[]) => T;

    /**
     *缓存对应数据节点，所有在其中的节点都为显示中 
     */
    map_id_nd: { [key: number]: Node } = {};

    constructor(parent: Node, pf: Node | Prefab, entity: new (...args: any[]) => T) {
        this.parent = parent;
        this.node_pool = new Node_Pool();
        this.pf = pf;
        this.entity = entity;
    }

    /**
     *组件删除后清理父节点状态 
     */
    public reset_on_destroy() {
        this.clean_and_fresh_filtered_data(() => true, []);
        this.node_pool.clear_parent();
    }

    private put_node_to_pool(data_id) {
        let nd = this.map_id_nd[data_id];
        nd.active = false;
        // nd.removeFromParent();
        this.node_pool.put_node(nd)

        delete this.map_id_nd[data_id];
    }

    private get_node_from_pool(data_id) {
        let nd = this.node_pool.get_node(this.pf);
        nd.active = true;
        if (!nd.parent) {
            //高消耗部分
            this.parent.addChild(nd);
        }

        this.map_id_nd[data_id] = nd;
        return nd;
    }

    /**
     * 缓存节点依据数据清除和刷新
     * @param filter 
     * @param arr_data 
     */
    private clean_and_fresh_filtered_data(filter: (v: any) => boolean, arr_data: { [key: number]: any }) {
        for (const data_id in this.map_id_nd) { //O(n) n大致为显示出组件的数目 一般为常量
            let data = arr_data[data_id];
            //缓存节点对应数据已经消失
            if (data === undefined) {
                this.put_node_to_pool(data_id);
            } else {
                //池子对应数据找到了

                //过滤
                if (!filter(data)) {
                    this.put_node_to_pool(data_id);
                } else {
                    let v = this.map_id_nd[data_id];
                    v.getComponent(this.entity).fresh(data);
                }
            }
        }
    }

    /**
     * 初始化过滤数据的节点
     * @param filter 
     * @param arr_data 
     */
    private first_fresh_filtered_data(filter: (v: any) => boolean, arr_data: { [key: number]: any }) {
        for (const data_id in arr_data) { //O(n)
            let data = arr_data[data_id];
            if (filter(data)) {//满足条件数据
                if (!this.map_id_nd[data_id]) {//未渲染过
                    let nd = this.get_node_from_pool(data_id);
                    nd.getComponent(this.entity).fresh(data);
                }
            }
        }
    }

    /**
     * 刷新渲染
     * @param filter 数据过滤器
     * @param arr_data 数据
     */
    fresh(filter: (v: any) => boolean, arr_data: { [key: number]: any }) {
        this.clean_and_fresh_filtered_data(filter, arr_data);
        this.first_fresh_filtered_data(filter, arr_data);
    }

}