import { _decorator, Component, Node, Vec3, Prefab, instantiate, EventTouch, JsonAsset, CCInteger, sys, BloomStage, director } from 'cc';
import { Card } from '../card';
import { Consts } from '../consts/Const';
import { GameManager } from '../gameManager';
import { createRandom, shuffle } from '../util';
const { ccclass, property } = _decorator;

export enum OpationType {
	DELETE,
	ADD
}

@ccclass('map')
export class map extends Component {

	@property(Prefab)
	mapItem: Prefab = null;
	@property(Prefab)
	cartItem: Prefab = null;
	@property(Node)
	cards: Node = null;

	@property({
		type: [JsonAsset]
	})
	levelJson: JsonAsset[] = [];

	@property(CCInteger)
	curLevel: number = 0;


	/// 操作类型
	private optionType: OpationType = OpationType.ADD;

	private map: Vec3[][] = [];

	private mapItemMap: { [key: string]: Node[] } = {};

	private typeArr: string[] = [];


	async start() {
		if (GameManager.getInstance().game.isEditor) {
			this.node.parent.active = true;
		} else {
			this.node.parent.active = false;
			return;
		}
		this._initMap();
		await this._initCardTypeArr();
	}

	/// 生成可以消除的3的倍数的卡牌
	async _initCardTypeArr() {
		const levelConfig: JsonAsset = this.levelJson[this.curLevel];
		const total = levelConfig.json["type_count"]
		const typeACount = levelConfig.json['typeA'];
		const typeBCount = levelConfig.json['typeB'];
		const typeCCount = levelConfig.json['typeC'];
		const typeDCount = levelConfig.json['typeD'];
		const typeECount = levelConfig.json['typeE'];
		const typeFCount = levelConfig.json['typeF'];

		this._createType(typeACount, "typeA");
		this._createType(typeBCount, "typeB");
		this._createType(typeCCount, "typeC");
		this._createType(typeDCount, "typeD");
		this._createType(typeECount, "typeE");
		this._createType(typeFCount, "typeF");

		this._shuffle(this.typeArr);
		console.log("typeArr is ", this.typeArr);
	}

	_createType(count: number, type: string) {
		for (let i = 0; i < count; i++) {
			this.typeArr.push(type);
		}
	}

	/// 乱序
	_shuffle(typeArr: string[]) {
		shuffle(typeArr);
	}

	_initMap() {
		console.log("init map");

		for (let i = 0; i < Consts.row; i++) {
			for (let j = 0; j < Consts.col; j++) {
				// if(j % 2 == 1) continue;
				const prefabNode = instantiate(this.mapItem);
				const x = Consts.mapStart.x + j * Consts.mapWidth + Consts.spaceX * j;
				const y = Consts.mapStart.y - i * Consts.mapHeight - Consts.spaceY * i;
				this.node.addChild(prefabNode);
				const pos: Vec3 = new Vec3(x, y, Consts.mapStart.z);

				prefabNode.setPosition(pos);
				this.mapItemMap[`${i}-${j}`] = [];

				prefabNode.on(Node.EventType.TOUCH_END, this.tapMapItemEnd, this);
			}
		}
		console.log(this.mapItemMap);


	}

	getRowColInfo(x: number, y: number): number[] {
		const row = (Consts.mapStart.y - y) / (Consts.mapHeight + Consts.spaceY);
		const col = (x - Consts.mapStart.x) / (Consts.mapWidth + Consts.spaceX);
		console.log(`row is ${row} col is ${col}`);
		return [row, col];
	}

	tapMapItemEnd(event: EventTouch) {
		const target = event.target as Node;

		const x = target.getPosition().x;
		const y = target.getPosition().y;

		const res = this.getRowColInfo(x, y);
		const row = res[0];
		const col = res[1];

		if (this.optionType == OpationType.ADD) {

			let typeStr = this.typeArr.pop();
			if (!typeStr) return;
			const card = instantiate(this.cartItem);
			this.cards.addChild(card);
			card.setPosition(target.position);

			const maxZ = this._checkCollision(row, col);
			console.log("isCollision is " + maxZ);
			this.mapItemMap[`${row}-${col}`].push(card);

			const cardComp: Card = card.getComponent(Card);
			cardComp.row = row;
			cardComp.col = col;

			console.log("typeStr is ", typeStr);
			cardComp.setType(typeStr);
			cardComp.isCover = false;
			if (maxZ < 0) {
				cardComp.z = 0;
			} else {
				cardComp.z = maxZ + 1;
			}

		} else {
			if (this.mapItemMap[`${row}-${col}`].length == 0) return;
			/// 取最顶层的节点删除
			let len = this.mapItemMap[`${row}-${col}`].length;
			if (len < 1) return;
			const topNode = this.mapItemMap[`${row}-${col}`][len - 1];
			const targetZ = topNode.getComponent(Card).z;
			topNode && topNode.destroy();
			/// 弹出数据
			this.mapItemMap[`${row}-${col}`].pop();
			this._recoverCollision(row, col, targetZ < 0 ? 0 : targetZ);

		}

	}

	_recoverCollision(row: number, col: number, targetZ: number) {
		let len = this.mapItemMap[`${row}-${col}`].length;
		if (len >= 1) {
			const topNode = this.mapItemMap[`${row}-${col}`][len - 1];
			const topCard = topNode.getComponent(Card);
			topCard.isCover = false;
			/// 该牌底下的一定也是覆盖状态的不改变了
		} else {
			const recoverZIndex = (r: number, c: number, recover: boolean) => {
				const checkNodeRes = this.mapItemMap[`${r}-${c}`];
				if (checkNodeRes.length >= 1) {

					const tpNode = checkNodeRes[checkNodeRes.length - 1];
					const cardComp = tpNode.getComponent(Card);
					console.log("检测到的卡牌的层级：", cardComp.z, " 是否显示mask: " + recover);
					cardComp.isCover = recover;

				}
			}
			console.log("targetZ is " + targetZ);
			/// 上面压的牌弹出了，恢复底下牌的遮挡关系
			for (let rowItem = row - 1; rowItem < row + 2; rowItem++) {
				if (rowItem < 0 || rowItem > Consts.row - 1) continue;
				for (let colItem = col - 1; colItem < col + 2; colItem++) {
					if (colItem < 0 || colItem > Consts.col - 1) continue;
					if (rowItem == row && colItem == col) continue;

					/// 如果该行该列没有牌继续检测
					if (this.mapItemMap[`${rowItem}-${colItem}`].length == 0) continue;
					// 恢复的节点的层级
					const resZ = this._isCovered(rowItem, colItem);
					console.log("resZ is " + resZ, "row is " + rowItem, " col is " + colItem);

					if (resZ) {
						/// 有遮挡关系
						recoverZIndex(rowItem, colItem, true);
					} else {
						/// 没有遮挡关系
						recoverZIndex(rowItem, colItem, false);
					}
				}
			}
		}
	}

	/// row行col列的节点是否被覆盖了
	_isCovered(row: number, col: number) {
		const nodes = this.mapItemMap[`${row}-${col}`];
		const z = nodes[nodes.length - 1].getComponent(Card).z;

		for (let rowItem = row - 1; rowItem < row + 2; rowItem++) {
			if (rowItem < 0 || rowItem > Consts.row - 1) continue;
			for (let colItem = col - 1; colItem < col + 2; colItem++) {
				if (colItem < 0 || colItem > Consts.col - 1) continue;
				if (row == rowItem && col == colItem) continue;

				const checkNodeRes = this.mapItemMap[`${rowItem}-${colItem}`];
				/// 如果该行列对应的节点的层级比目标行列给的层级大就证明被覆盖了
				if (checkNodeRes.length >= 1 && checkNodeRes[checkNodeRes.length - 1].getComponent(Card).z > z) {
					console.log(`row: ${rowItem} col: ${colItem} is covered`);
					return true;
				}
			}
		}
		return false;
	}

	/// 检查重叠情况
	_checkCollision(row: number, col: number) {
		// let isCover = false;
		let maxZ = -999999;

		/// 检查周边格子的覆盖状态 获取周边格子的最高层级，新加上的各自的层级在此基础上加一
		for (let rowItem = row - 1; rowItem < row + 2; rowItem++) {
			if (rowItem < 0 || rowItem > Consts.row - 1) continue;
			for (let colItem = col - 1; colItem < col + 2; colItem++) {
				if (colItem < 0 || colItem > Consts.col - 1) continue;

				const checkNodeRes = this.mapItemMap[`${rowItem}-${colItem}`];
				if (checkNodeRes.length >= 1) {
					const tpNode = checkNodeRes[checkNodeRes.length - 1];
					const cardComp = tpNode.getComponent(Card);
					if (cardComp.z > maxZ) {
						maxZ = cardComp.z;
					}
					cardComp.isCover = true;
					// isCover = true;
				}

			}
		}
		return maxZ;
	}

	deleteCallback() {
		console.log("delete");
		this.optionType = OpationType.DELETE;
	}

	deletaAllCallback() {
		const keys = Object.keys(this.mapItemMap);
		keys.forEach(item => {
			this.mapItemMap[item].forEach(it => {
				it.destroy();
			});
			this.mapItemMap[item] = [];
		});
	}

	hideMap() {
		this.node.active = !this.node.active;
	}

	addMapCallback() {
		console.log("add");
		this.optionType = OpationType.ADD;
	}

	goGame() {
		GameManager.getInstance().game.isEditor = false;
		director.loadScene("game");
	}

	exportData() {
		console.log("导出数据");
		const keys = Object.keys(this.mapItemMap);
		let data = [];
		keys.forEach(item => {
			const nodes = this.mapItemMap[item];
			nodes.forEach(item => {
				const cardComp: Card = item.getComponent(Card);
				data.push({
					row: cardComp.row,
					col: cardComp.col,
					type: cardComp.showType,
					z: cardComp.z,
					isCover: cardComp.isCover
				});
			});
		});
		console.log(data);
		this._saveForBrowser(JSON.stringify(data));
	}

	_saveForBrowser(jsonStrData: string, fileName: string = "map") {
		if (sys.isBrowser) {
			let textFileBlob = new Blob([jsonStrData], { type: "application/json" });
			let downloadLink = document.createElement("a");
			downloadLink.download = fileName;
			downloadLink.innerHTML = "downloadFile";
			if (window.webkitURL != null) {
				downloadLink.href = window.webkitURL.createObjectURL(textFileBlob);
			} else {
				downloadLink.href = window.URL.createObjectURL(textFileBlob);
				downloadLink.onclick = () => {
					downloadLink.remove();
				};
				downloadLink.style.display = "none";
				document.body.appendChild(downloadLink);
			}
			downloadLink.click();
		}
	}

	_initMapType() {

	}

	update(deltaTime: number) {

	}
}

