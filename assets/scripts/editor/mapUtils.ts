import { instantiate } from "cc";
import { Consts } from "../consts/Const";

/**
 * 
 * 生成地图的工具类
 * 
 */
export class MapUtil {

    /**
     * 根据行列来生成位置点
     * @param  {number} row
     * @param  {number} col
     * @returns void
     */
    static initMapItemPosition(row: number, col: number): void {

    }

    /**
     * 根据位置信息来获取行列信息
     * @param  {number} x 横坐标
     * @param  {number} y 纵坐标
     * @returns number 行列信息
     */
    static getRowColInfo(x: number, y: number): number[] {
        const row = (Consts.mapStart.y - y) / (Consts.mapHeight + Consts.spaceY);
        const col = (x - Consts.mapStart.x) / (Consts.mapWidth + Consts.spaceX);
        console.log(`row is ${row} col is ${col}`);
        return [row, col];
    }

    /**
     * 根据行列信息获取位置信息
     * @param  {number} row 行
     * @param  {number} col 列
     * @returns number 坐标信息
     */
    static getPosByRowAndCol(row: number, col: number): number[] {
        const x = Consts.mapStart.x + col * Consts.mapWidth + Consts.spaceX * col;
        const y = Consts.mapStart.y - row * Consts.mapHeight - Consts.spaceY * row;

        return [x, y];
    }
}