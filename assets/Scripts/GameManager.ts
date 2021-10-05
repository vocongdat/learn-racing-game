import {
  _decorator,
  Component,
  Prefab,
  instantiate,
  Node,
  CCInteger,
  Vec3,
} from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

enum BlockType {
  BT_NONE,
  BT_STONE,
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
  @property({ type: CCInteger })
  public roadLength: Number = 2;
  //   private _road: number[] = [];

  @property({ type: PlayerController })
  public playerCtrl: PlayerController = null;

  @property({ type: Node })
  public startMenu: Node = null;

  private _curState: GameState = GameState.GS_INIT;

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
    // startPos
    // this._road.push(BlockType.BT_STONE);

    // for (let i = 1; i < this.roadLength; i++) {
    //   if (this._road[i - 1] === BlockType.BT_NONE) {
    //     this._road.push(BlockType.BT_STONE);
    //   } else {
    //     this._road.push(Math.floor(Math.random() * 2));
    //   }
    // }

    for (let j = 0; j <= this.roadLength; j++) {
      let block = instantiate(this.cubePrfb);
      if (block) {
        this.node.addChild(block);
        block.setPosition(j * 1900, 0, 0);
      }
    }
  }

  onStartButtonClicked() {
    this.curState = GameState.GS_PLAYING;
  }

  //   spawnBlockByType(type: BlockType) {
  //     if (!this.cubePrfb) {
  //       return null;
  //     }

  //     let block: Node | null = null;
  //     switch (type) {
  //       case BlockType.BT_STONE:
  //         block = instantiate(this.cubePrfb);
  //         break;
  //     }

  //     return block;
  //   }

  // update (deltaTime: number) {
  //     // Your update function goes here.
  // }
}
