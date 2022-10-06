import { _decorator, Component, Node, assetManager, JsonAsset, Prefab, instantiate, CCBoolean, Vec3, director, game, debug, profiler, EventTouch, tween } from 'cc';
import { Card } from '../card';
import { MapUtil } from '../editor/mapUtils';
import { GameManager } from '../gameManager';
import { Box } from './box';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property(Prefab)
    cardPrefab: Prefab = null;
    @property(Node)
    cardRoot: Node = null;

    /** 是否是编辑器模式 */
    @property(CCBoolean)
    isEditor: boolean = true;

    private boxClear: Box = null;



    onLoad() {
        game.frameRate = 40;
        profiler.hideStats();
    }

    async start() {
        GameManager.getInstance().game = this;
        this.boxClear = GameManager.getInstance().box;

        const configJson = await this._loadLevelConfig();
        console.log("configJson si ", configJson);
        this._initCard(configJson);
    }

    // 加载关卡数据
    async _loadLevelConfig() {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle("resources", null, (err, bundle) => {
                console.log("bundle is ", bundle);
                bundle.load("map", JsonAsset, (err, value: JsonAsset) => {
                    console.log(value);
                    resolve(value.json);
                })
            });
        });

    }

    _initCard(configs: any) {
        configs.forEach(item => {
            const row = item['row'];
            const col = item['col'];
            const type = item['type'];
            const z = item['z'];
            const isCover = item["isCover"];

            const card = instantiate(this.cardPrefab);
            this.cardRoot.addChild(card);
            const cardComp = card.getComponent(Card);
            cardComp.z = z;
            cardComp.isCover = isCover;
            cardComp.setType(type);
            cardComp.row = row;
            cardComp.col = col;

            card.on(Node.EventType.TOUCH_END, this.tapCard, this);

            const [x, y] = MapUtil.getPosByRowAndCol(row, col);
            console.log("x is ", x, "y is ", y);

            card.setPosition(new Vec3(x, y, 0));

        });
    }

    tapCard(event: EventTouch): void {
        const targetNode = event.target as Node;

        const targetPos = this.boxClear.getCanMovePos();
        const result: Vec3 = new Vec3();
        const localPos = targetNode.parent.inverseTransformPoint(result, targetPos);

        this.boxClear.addCard(targetNode);

        tween(targetNode).to(0.5, {
            position: localPos
        }).call(() => {
            targetNode.destroy();
            this.boxClear.showAllCard();
        }).start();

    }

    update(deltaTime: number) {

    }

    goMapEditor() {
        GameManager.getInstance().game.isEditor = true;
        director.loadScene("editor");
    }
}

