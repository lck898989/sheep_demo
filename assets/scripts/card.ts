import { _decorator, Component, Node, SpriteAtlas, SpriteFrame, Sprite } from 'cc';
import BaseComp from './base_comp';
const { ccclass, property } = _decorator;

@ccclass('Card')
export class Card extends BaseComp {

    private bgNode: Component = null;
    private type: Component = null;
    private mask: Component = null;

    /// 是否被覆盖
    private _isCover: boolean = false;

    private _z: number = 0;

    public set z(value: number) {
        this._z = value;
    }

    public get z() {
        return this._z;
    }

    public set isCover(value: boolean) {
        this._isCover = value;
        if (this.mask) {
            this.mask.node.active = value;
        }

    }

    public get isCover() {
        return this._isCover;
    }

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

