import { Node, Prefab, instantiate } from "cc";
/**
 * 本节点池不会自动调用removeFromParent()操作
 */
export class Node_Pool {
    arr_node: Node[] = [];

    //清理对象池
    clear_pool() {
        for (let node of this.arr_node) {
            node.destroy();
        }
    }

    //清理父节点
    clear_parent() {
        for (let n of this.arr_node) {
            n.removeFromParent();
        }
    }

    //放回对象池
    put_node(node) {
        this.arr_node.push(node);
    }

    //获取对象池中对象
    get_node(pf: Node | Prefab) {
        let item = this.arr_node.shift();
        if (item === undefined) {
            item = instantiate(pf as Node);
        }
        return item;
    }

}