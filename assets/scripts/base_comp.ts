import { Component, director, Game, game, Node, ProgressBar, Sprite, _decorator } from "cc";
const { ccclass, property } = _decorator;
/**
 * 
 * 节点不能同名（仅在开启过滤模式时候会出现问题）
 * 
 */
@ccclass("BaseComp")
export default class BaseComp extends Component {

    public viewMap: {[key: string]: Node} = {};
    /** 是否开启过滤(默认关闭)，如果开启过滤的话只有这个类有这个属性才会加入到viewMap并且给这个属性赋值 */
    public openFilter: boolean = false;

    __preload() {
        this._loadAllNode(this.node,'');
    }

    onEnable() {
        
        /** 前后台事件触发浏览器不是100%触发 */
        game.on(Game.EVENT_HIDE,this.hide,this);
        game.on(Game.EVENT_SHOW,this.show,this);
    }

    onDisable() {
        /** 前后台事件触发浏览器不是100%触发 */
        game.off(Game.EVENT_HIDE,this.hide,this);
        game.off(Game.EVENT_SHOW,this.show,this);
    }

    /**
     * 游戏切换到后台时候触发
     * @returns void
     */
    protected hide(): void {
        console.log("后台");
    }

    /**
     * 游戏切换到前台触发
     * @returns void
     */
    protected show(): void {
        console.log("前台");
    }

    private _loadAllNode(node: Node,path: string): void {
        if(!node) {
            return;
        }
        for(let i = 0,len = node.children.length; i < len; i++) {
            const nodeItem: Node = node.children[i];
            if(this.openFilter) {
                const hasThePropery = this.hasOwnProperty(nodeItem.name);
                if(hasThePropery) {
                    if(nodeItem.getComponent(Component)) {
                        this[`${nodeItem.name}`] = nodeItem.getComponent(Component);
                    } else {
                        this[`${nodeItem.name}`] = nodeItem;
                    }

                    if(nodeItem.getComponent(Sprite) && nodeItem.getComponent(ProgressBar)) {
                        this[`${nodeItem.name}`] = nodeItem.getComponent(ProgressBar);
                    }
                    // 如果有该属性直接赋值
                    // this.viewMap[path + nodeItem.name] = nodeItem;
                }
                this._loadAllNode(nodeItem,path + nodeItem.name + '/');
            } else {
                this.viewMap[path + nodeItem.name] = nodeItem;
                this._loadAllNode(nodeItem,path + nodeItem.name + '/');
            }
        }
    }

    onDestroy() {
        this.viewMap = {};   
    }
    
    
}
