import { Vec3 } from "cc";

export class Consts {

    /** 游戏地图的左上角起点 */
    static mapStart: Vec3 = new Vec3(-260, 300, 0);
    /** 游戏的行数 */
    static row: number = 14;
    /** 游戏的列数 */
    static col: number = 14;

    /** 地图宽度 */
    static mapWidth: number = 40;
    /** 地图高度 */
    static mapHeight: number = 40;
    /** 地图格子之间的水平间距 */
    static spaceX = 0;
    /** 地图格子之间的竖直距离 */
    static spaceY = 0;
}