import { _decorator, Component, Node, Vec3, instantiate, SliderJoint2D } from 'cc';
import BaseComp from '../base_comp';
import { GameManager } from '../gameManager';
const { ccclass, property } = _decorator;

@ccclass('Box')
export class Box extends BaseComp {

    /** 所有槽位节点的父节点 */
    private slots: Component = null;

    /** 卡槽的位置数组 */
    private slotPosArr: Vec3[] = [
        new Vec3(-240, 0, 0),
        new Vec3(-160, 0, 0),
        new Vec3(-80, 0, 0),
        new Vec3(0, 0, 0),
        new Vec3(80, 0, 0),
        new Vec3(160, 0, 0),
        new Vec3(240, 0, 0),
    ];

    __preload() {
        this.openFilter = true;
        super.__preload();
    }

    onLoad() {
        GameManager.getInstance().box = this;
    }

    start() {

    }

    update(deltaTime: number) {

    }

    /**
     * 
     * 添加一个卡牌放到槽位上
     *  
     */
    addCard(card: Node) {
        const slotIndex = this.slots.node.children.length;
        const targetLocalPos = this.slotPosArr[slotIndex];

        const node = instantiate(card);
        this.slots.node.addChild(node);
        node.setPosition(targetLocalPos);
        node.active = false;
    }

    /**
     * 
     * 显示卡槽上的所有卡牌
     * 
     */
    showAllCard() {
        this.slots.node.children.forEach(item => {
            if (!item.active) {
                item.active = true;
            }
        })
    }


    /**
     * 
     * 获得当前可以放置卡牌的槽位
     * 
     */
    getCanMovePos() {
        const slotIndex = this.slots.node.children.length;
        // 目标槽位的本地坐标
        const targetSlotPos = this.slotPosArr[slotIndex].clone();
        const boxWorldPos = this.node.worldPosition;
        targetSlotPos.x = boxWorldPos.x + targetSlotPos.x;
        targetSlotPos.y = boxWorldPos.y + targetSlotPos.y;
        targetSlotPos.z = boxWorldPos.z + targetSlotPos.z;

        return targetSlotPos;
    }
}

