import { _decorator, Component, Node, SpriteAtlas, SpriteFrame, Sprite } from 'cc';
import BaseComp from './base_comp';
const { ccclass, property } = _decorator;

@ccclass('Card')
export class Card extends BaseComp {

    private bgNode: Component = null;
    private type: Component = null;
    private mask: Component = null;

    @property(SpriteAtlas)
    cardAtlas: SpriteAtlas = null;

    __preload() {
        this.openFilter = true;
        super.__preload();
    }

    start() {
        console.log(this);
    }

    update(deltaTime: number) {
        
    }

    setType(type: string) {
        const frame: SpriteFrame = this.cardAtlas.getSpriteFrame(type);
        this.type.node.getComponent(Sprite).spriteFrame = frame;

    }
}

