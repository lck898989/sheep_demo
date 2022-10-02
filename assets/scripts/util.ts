// import { resourceManager } from "../managers/resourceManager";

import { Animation, AnimationState, Asset, dragonBones, Node, Skeleton, tween } from "cc";
import { DEBUG } from "cc/env";

/**
 * 输出debug信息
 * @param  {string} tag tag
 * @param  {any[]} ...log
 */
export function debugLog(tag: string, ...log: any[]) {
    if (DEBUG) {
        console.log.call(null, `[DEBUG]: ${tag}`,...log);
    }
}
/**
 * 休眠一段时间
 * @param  {number} time 休眠时间
 */
export async function sleep(time: number) {
    return new Promise((resolve) => {
        setTimeout(resolve,time);
    })
}

/**
 * 产生 [min,max - 1]之间的随机数
 * @param  {number} min
 * @param  {number} max
 * @returns number
 */
export function createRandom(min: number,max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 向着目标产生随机数：目标值的随机数概率很大
 * @param  {number} min
 * @param  {number} max
 * @param  {number} wantNumber 目标值
 */
export function createRandomTowardTarget(min: number,max: number,wantNumber: number) {
    const random = Math.floor(Math.random() * (max - min) * 100 + min * 100);

    if(random > (min * 100) && random < (max - 2) * 100) {
        return wantNumber;
    } else {
        return Math.floor(random / 100);
    }
}

/**
 * 等待动画播放完毕
 * @param  {Node} node 想要播放动画的节点
 * @param  {string} animationName 动画名称
 * @param  {boolean} isReverse 是否倒序播放
 */
export async function waitAnimOver(
    node: Node,
    animationName: string,
    isReverse: boolean = false
) {
    if (!node) {
        console.warn("node is null");
        return;
    }
    const animCom = node.getComponent(Animation);
    if (animCom) {
        return new Promise((resolve) => {
            const animState = animCom.play(animationName);
            if (isReverse) {
                // animState = Wr.Reverse;
            }
            // animCom.once(Animation, resolve);
        });
    } else {
        console.warn("node's animation is null,please add animation component");
    }
}

/**
 * 循环播放一个动画
 * @param  {Node} node 动画所在的节点
 * @param  {string} animationName 动画名
 */
export function loopAnimation(node: Node, animationName: string) {
    if (node) {
        const animCom = node.getComponent(Animation);
        if (animCom) {
            const state = animCom.play(animationName);
            // state.wrapMode = cc.WrapMode.Loop;
        }
    }
}

/**
 * 停止当前节点正在播放的动画
 * @param  {Node} node
 */
export function stopCurAnimation(node: Node) {
    if(node) {
        const animComp = node.getComponent(Animation);
        if(!animComp) return;
        animComp.stop();
    }
}

/**
 * @param  {Node} node 播放动画的节点
 * @param  {number} clipIndex clip在animation中的索引
 */
export async function waitAnimOverByIndex(node: Node, clipIndex: number) {
    // if (!node) {
    //     console.warn("node is null");
    //     return;
    // }
    // const animCom = node.getComponent(Animation);
    // const clips = animCom.getClip();
    // if (animCom) {
    //     return new Promise((resolve) => {
    //         animCom.play(clips[clipIndex].name);
    //         animCom.once("finished", resolve);
    //     });
    // } else {
    //     console.warn("node's animation is null,please add animation component");
    // }
}

/**
* @param  {sp.Skeleton} sp 骨骼动画组件
* @param  {string} fromAnimation 从哪个动画过渡到目标动画
* @param  {string} toAnimation 目标动画
* @param  {number} delay 过渡时长 默认0.2秒 过度到目标动画循环播放
*/
export function smoothTransitionSpAnimation(
    sp: Skeleton,
    fromAnimation: string,
    toAnimation: string,
    delay: number = 0.5,
    isLoop: boolean = true
) {
    /** 过渡到目标动画循环播放 */
    
    // sp.loop = isLoop;
    // sp.setMix(fromAnimation, toAnimation, delay);
    // sp.animation = toAnimation;

    // return new Promise((resolve) => {
    //     sp.setCompleteListener(resolve);
    // });
}

/**
 * 播放龙骨动画
 * @param  {dragonBones.ArmatureDisplay} dragonbone 龙骨组件
 * @param  {string} animationName 动画名称
 * @param  {number=1} playTime 播放次数 默认1次 0：无限循环 >0：播放制定的次数
 */
export async function playDragonBonesAnim(dragonbone: dragonBones.ArmatureDisplay,animationName: string,playTime: number = 1) {
    // if(playTime === 0) {
    //     dragonbone.playAnimation(animationName,playTime);
    // } else {
    //     dragonbone.playAnimation(animationName,playTime);
    //     return new Promise((resolve) => {
    //         dragonbone.addEventListener(dragonBones.EventObject.COMPLETE,() => {
    //             dragonbone.removeEventListener(dragonBones.EventObject.COMPLETE);
    //             resolve(null);
    //         });
    //     });
    // }
}

/**
 * 预加载bundle里面的资源
 * @param  {string} url bundle里面的路径
 * @param  {typeofcc.Asset} type 资源类型
 * @param  {string='resources'} bundleName bundle名字
 * @returns Promise
 */
// export async function preloadAssetInBundle<T extends Asset>(url: string,type: typeof Asset,bundleName: string = 'resources'): Promise<T> {
//     if(!url) return;

//     let bundle = null;
//     bundle = await resourceManager.loadBundle(bundleName);
//     console.log('bundle is ',bundle);
//     if(!bundle) return;
//     const res = await resourceManager.loadAssetInBundle<T>(bundle,url,type) as T;
//     console.log('res is ',res);
//     if(!res) return;
//     return res;
// }

/**
 * 深复制某一个对象
 * @param  {Object} obj 需要深复制的对象
 */
export function deepClone(obj) {
    var newObj;
    if (obj instanceof Array) {
        newObj = [];
    }
    else if (obj instanceof Object) {
        newObj = {};
    }
    else {
        return obj;
    }
    for (let item in obj) {
        newObj[item] = deepClone(obj[item]);
    }
    return newObj;
}

// export function blink(node: Node,times: number = 1): Promise<void> {
//     return new Promise((resolve) => {
//         tween(node)(0.0001,times).call(resolve).start();
//     });
    
// }

export function getMaxInArr(arr: number[]) {
    return Math.max(...arr);
}

export function getMinInArr(arr: number[]) {
    return Math.min(...arr);
}

/**
 * 弧度转角度
 * @param  {number} rad 弧度值
 */
export function radianToAngle(rad: number) {
    return rad * 180 / Math.PI;
}