export class Event_Dispatcher{
    public static map:{[key:string]:{target:any,selector:Function}[]} = {};
    public static on(event:string|number,target:any,selector:Function){
        if(!this.map[event]){
            this.map[event] = [];
        }
        this.map[event].push({
            target:target,
            selector:selector,
        })
    }
    
    public static off(event:string|number,target:any,selector:Function){
        if(!this.map[event]){
            this.map[event] = [];
        }
        let array = this.map[event];
        for (let i = array.length - 1; i >= 0 ; i--) {
            const obj = array[i];
            if(obj.selector == selector && obj.target == target){
                array.splice(i,1);
            }
        }
    }

    public static post(event:string|number,...params:any[]){
        if(!this.map[event]){
            return;
        }
        for (const obj of this.map[event]) {
            obj.selector.apply(obj.target,params)
        }
    }
}