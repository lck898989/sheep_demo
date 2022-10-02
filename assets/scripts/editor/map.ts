import { _decorator, Component, Node, CCObject, Vec2, Vec3, Prefab, instantiate } from 'cc';
import { Card } from '../card';
import { createRandom } from '../util';
const { ccclass, property } = _decorator;

@ccclass('map')
export class map extends Component {

	@property(Prefab)
	mapItem: Prefab = null;
	@property(Prefab)
	cartItem: Prefab = null;
	@property(Node)
	cards: Node = null;

	private mapStart: Vec3 = new Vec3(-200, 300, 0);

	private row: number = 6;
	private col: number = 6;

	private mapWidth = 80;
	private mapHeight = 80;

	private map: Vec3[][] = [];

	private mapItemMap: {[key: string]: Node} = {};

	private randomType: string[] = ["typeA","typeB","typeC","typeD","typeE","typeF","typeG"];

	start() {
		this._initMap();

	}

	_initMap() {
		console.log("init map");
		const mapCenterStart: Vec3 = new Vec3(-160,260,0);
		
		for (let i = 0; i < this.row; i++) {
			for(let j = 0; j < this.col; j++) {
				const prefabNode = instantiate(this.mapItem);
				const x = this.mapStart.x + j * this.mapWidth;
				const y = this.mapStart.y - i * this.mapHeight;
				this.node.addChild(prefabNode);
				const pos: Vec3 = new Vec3(x,y,this.mapStart.z);

				prefabNode.setPosition(pos);
				this.mapItemMap[`${pos.x}${pos.y}`] = prefabNode;
				
				const card = instantiate(this.cartItem);
				this.cards.addChild(card);
				card.setPosition(pos);
				
				const cardComp: Card = card.getComponent(Card);
				cardComp.setType(this.randomType[createRandom(0,7)]);
				
				if(i < this.row - 1 && j < this.col - 1) {
					const centerMapItem = instantiate(this.mapItem);
					const x = mapCenterStart.x + j * this.mapWidth;
					const y = mapCenterStart.y - i * this.mapHeight;
					this.node.addChild(centerMapItem);
					const centPos = new Vec3(x,y,mapCenterStart.z);
					centerMapItem.setPosition(new Vec3(x,y,mapCenterStart.z));

					this.mapItemMap[`${centPos.x}${centPos.y}`] = centerMapItem; 
				}
			}

		}
		console.log(this.mapItemMap);

		if (true) {
			console.log("asdf");

		}

	}

	_initMapType() {

	}

	update(deltaTime: number) {

	}
}

