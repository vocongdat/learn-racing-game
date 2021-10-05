import {
  _decorator,
  Component,
  Prefab,
  instantiate,
  Node,
  CCInteger,
  Vec3,
  PhysicsSystem2D,
  random,
} from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

enum BlockType {
  BT_NONE,
  OBSTACLE_ITEM,
  SPEEDUP_ITEM,
  SPEEDUP_TILE,
  WATER_BLUE_TILE,
  WATER_RED_TILE,
}

enum GameState {
  GS_INIT,
  GS_PLAYING,
  GS_END,
}

@ccclass('GameManager')
export class GameManager extends Component {
  @property({ type: Prefab })
  public cubePrfb: Prefab | null = null;
  public raceLength: Number = 50;

  @property({ type: PlayerController })
  public playerCtrl: PlayerController = null;

  @property({ type: Node })
  public startMenu: Node = null;

  private _curState: GameState = GameState.GS_INIT;

  @property({ type: Prefab })
  public obstaclePrfb: Prefab | null = null;
  @property({ type: Prefab })
  public speddupPrfb: Prefab | null = null;
  @property({ type: Prefab })
  public speeduptilePrfb: Prefab | null = null;
  @property({ type: Prefab })
  public waterBluePrfb: Prefab | null = null;
  @property({ type: Prefab })
  public waterRedPrfb: Prefab | null = null;
  @property({ type: CCInteger })
  public roadLength: Number = 1000;
  private _road: number[] = [];

  start() {
    this.curState = GameState.GS_INIT;
  }

  init() {
    if (this.startMenu) {
      this.startMenu.active = true;
    }

    this.generateRoad();
    if (this.playerCtrl) {
      this.playerCtrl.setInputActive(false);
      this.playerCtrl.node.setPosition(Vec3.ZERO);
    }
  }

  set curState(value: GameState) {
    switch (value) {
      case GameState.GS_INIT:
        this.init();
        break;
      case GameState.GS_PLAYING:
        if (this.startMenu) {
          this.startMenu.active = false;
        }
        setTimeout(() => {
          if (this.playerCtrl) {
            this.playerCtrl.setInputActive(true);
          }
        }, 0.1);
        break;
      case GameState.GS_END:
        break;
    }
    this._curState = value;
  }

  generateRoad() {
    this.node.removeAllChildren();

    for (let j = 0; j < this.raceLength; j++) {
      let block = instantiate(this.cubePrfb);
      if (block) {
        this.node.addChild(block);
        block.setPosition(j * 1900, 0, 0);
      }
    }

    this._road = [];
    // startPos
    this._road.push(BlockType.BT_NONE);

    for (let i = 1; i < this.roadLength; i++) {
      this._road.push(Math.trunc(Math.random() * 6));
    }

    for (let j = 0; j < this._road.length; j++) {
      let block: Node = this.spawnBlockByType(this._road[j]);
      if (block) {
        this.node.addChild(block);
        const lane = Math.trunc(Math.random() * 4);
        let objectPos = 0;
        if (lane < 2) {
          objectPos = lane * -200;
        } else {
          objectPos = lane * 120;
        }
        const distance = Math.trunc(Math.random() * 400);
        block.setPosition(j * 400 + distance, objectPos, 0);
      }
    }
  }

  onStartButtonClicked() {
    this.curState = GameState.GS_PLAYING;
  }

  spawnBlockByType(type: BlockType) {
    if (!this.obstaclePrfb) {
      return null;
    }

    let block: Node | null = null;
    switch (type) {
      case BlockType.BT_NONE:
        block = instantiate(this.obstaclePrfb);
        break;
      case BlockType.OBSTACLE_ITEM:
        block = instantiate(this.obstaclePrfb);
        break;
      case BlockType.SPEEDUP_ITEM:
        block = instantiate(this.speddupPrfb);
        break;
      case BlockType.SPEEDUP_TILE:
        block = instantiate(this.speeduptilePrfb);
        break;
      case BlockType.WATER_BLUE_TILE:
        block = instantiate(this.waterBluePrfb);
        break;
      case BlockType.WATER_RED_TILE:
        block = instantiate(this.waterRedPrfb);
        break;
    }

    return block;
  }

  // update (deltaTime: number) {
  //     // Your update function goes here.
  // }
}
