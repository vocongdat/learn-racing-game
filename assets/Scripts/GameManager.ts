import {
  _decorator,
  Component,
  Prefab,
  instantiate,
  Node,
  CCInteger,
  Vec3,
  Label,
} from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

enum BlockType {
  NONE_ITEM,
  OBSTACLE_ITEM,
  SPEEDUP_ITEM,
  SPEEDUP_TILE,
  WATER_BLUE_TILE,
  WATER_RED_TILE,
  SCOREUP_ITEM,
}

enum GameState {
  GS_INIT,
  GS_PLAYING,
  GS_END,
}

enum LaneRace {
  LANE_TOP,
  LANE_MIDDLE_TOP,
  LANE_MIDDLE_BOTTOM,
  LANE_BOTTOM,
}

@ccclass('GameManager')
export class GameManager extends Component {
  @property({ type: Prefab })
  public cubePrfb: Prefab | null = null;
  public raceLength: number = 50;

  @property({ type: PlayerController })
  public playerCtrl: PlayerController = null;

  @property({ type: Node })
  public startMenu: Node = null;

  private _curState: GameState = GameState.GS_INIT;

  public _widthOneRace: number = 1900;

  @property({ type: Prefab })
  public obstaclePrfb: Prefab = null!;
  @property({ type: Prefab })
  public speddupPrfb: Prefab = null!;
  @property({ type: Prefab })
  public speeduptilePrfb: Prefab = null!;
  @property({ type: Prefab })
  public waterBluePrfb: Prefab = null!;
  @property({ type: Prefab })
  public waterRedPrfb: Prefab = null!;
  @property({ type: Prefab })
  public scoreupPrfb: Prefab = null!;

  @property({ type: CCInteger })
  public roadLength: Number = 50;

  @property(Label)
  public scoreLabel: Label = null!;

  public blood: number = 1000;

  private _road: number[] = [];

  private _checkResult: number = null;

  private _score: number = 0;

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
        if (this.scoreLabel) {
          //  reset the number of steps to 0
          this.scoreLabel.string = 'Score: 0';
        }
        setTimeout(() => {
          if (this.playerCtrl) {
            this.playerCtrl.setInputActive(true);
            this.checkResult();
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
        block.setPosition(j * this._widthOneRace, 0, 0);
      }
    }

    this._road = [];
    // startPos
    this._road.push(BlockType.NONE_ITEM);
    for (let i = 1; i < this.roadLength; i++) {
      this._road.push(Math.trunc(Math.random() * 7));
    }

    for (let j = 0; j < this._road.length; j++) {
      let block: Node = this.spawnBlockByType(this._road[j]);
      if (block) {
        this.node.addChild(block);
        const lane: LaneRace = Math.trunc(Math.random() * 4);
        let objectPos = 0;
        switch (lane) {
          case LaneRace.LANE_TOP:
            objectPos = 220;
            break;
          case LaneRace.LANE_MIDDLE_TOP:
            objectPos = -165;
            break;
          case LaneRace.LANE_MIDDLE_BOTTOM:
            objectPos = -370;
            break;
          default:
            objectPos = 30;
            break;
        }

        const distance = Math.trunc(Math.random() * 400);
        const totalRace = this.raceLength * this._widthOneRace;
        if (j * 400 < totalRace - 400)
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
      case BlockType.NONE_ITEM:
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
      case BlockType.SCOREUP_ITEM:
        block = instantiate(this.scoreupPrfb);
        break;
    }

    return block;
  }

  checkResult() {
    const { width, height } =
      this.playerCtrl.node.children[1]._uiProps.uiTransformComp.contentSize;
    const midWidth = width / 2;
    const midHeight = height / 2;

    const childrenBlock = this.node.children;

    const indexObject = childrenBlock.findIndex((block) => {
      const { x: xPlayer, y: yPlayer } = this.playerCtrl._curPos;
      const { x: xObject, y: yObject } = block.position;
      return (
        xPlayer - midWidth <= xObject &&
        xObject <= xPlayer + midWidth &&
        yPlayer - midHeight <= yObject &&
        yObject <= yPlayer + midHeight
      );
    });
    if (this._checkResult != indexObject) {
      const curSpeed = this.playerCtrl._speed;
      if (indexObject >= 0) {
        switch (this._road[indexObject]) {
          case BlockType.NONE_ITEM:
            break;
          case BlockType.OBSTACLE_ITEM:
            this.blood = this.blood - 100;
            console.warn(this.blood);
            break;
          case BlockType.SPEEDUP_ITEM:
            this.playerCtrl._speed = curSpeed + 20;
            console.warn('SPEEDUP_ITEM');
            break;
          case BlockType.SPEEDUP_TILE:
            this.playerCtrl._speed = curSpeed + 40;
            console.warn('SPEEDUP_TILE');
            break;
          case BlockType.WATER_BLUE_TILE:
            console.warn('WATER_BLUE_TILE');
            if (curSpeed >= 40) this.playerCtrl._speed = curSpeed - 20;

            break;
          case BlockType.WATER_RED_TILE:
            console.warn('WATER_RED_TILE');
            if (curSpeed >= 40) this.playerCtrl._speed = curSpeed - 40;
            break;
          case BlockType.SCOREUP_ITEM:
            console.warn('SCOREUP_ITEM');
            this._score = this._score + 100;
            this.scoreLabel.string = `Score: ${this._score}`;
            break;
        }
      }
      this._checkResult = indexObject;
    }
  }

  update() {
    if (this.playerCtrl._isMoving) {
      this.checkResult();
      if (this.blood <= 0) {
        this.playerCtrl._startRace = false;
      }
    }
  }
}
