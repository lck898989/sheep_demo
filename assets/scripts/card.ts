import { _decorator, Component, Node, SpriteAtlas, SpriteFrame, Sprite } from 'cc';
import BaseComp from './base_comp';
const { ccclass, property } = _decorator;

@ccclass('Card')
export class Card extends BaseComp {

    private bgNode: Component = null;
    private type: Component = null;
    private mask: Component = null;

    private _row: number = 0;
    private _col: number = 0;
    /// 展示的类型
    public showType: String = "";

    /// 是否被覆盖
    private _isCover: boolean = false;

    private _z: number = 0;

    public set z(value: number) {
        this._z = value;
    }

    public get z() {
        return this._z;
    }

    public get row() {
        return this._row
    }

    public set col(colValue: number) {
        this._col = colValue;
    }

    public set row(rowValue: number) {
        this._row = rowValue;
    }

    public get col() {
        return this._col;
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
    }

    update(deltaTime: number) {

    }

    setType(type: string) {
        this.showType = type;
        const frame: SpriteFrame = this.cardAtlas.getSpriteFrame(type);
        this.type.node.getComponent(Sprite).spriteFrame = frame;

    }


}

