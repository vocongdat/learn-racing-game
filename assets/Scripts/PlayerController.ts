import {
  _decorator,
  Component,
  Vec3,
  systemEvent,
  SystemEvent,
  EventMouse,
  Animation,
  EventKeyboard,
} from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PlayerController
 * DateTime = Tue Oct 05 2021 08:56:02 GMT+0700 (Indochina Time)
 * Author = congdat
 * FileBasename = PlayerController.ts
 * FileBasenameNoExtension = PlayerController
 * URL = db://assets/Scripts/PlayerController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('PlayerController')
export class PlayerController extends Component {
  @property({ type: Animation })
  public FireAnim: Animation | null = null;
  @property({ type: Animation })
  public FireAnim1: Animation | null = null;
  @property({ type: Animation })
  public FireAnim2: Animation | null = null;
  @property({ type: Animation })
  public FireAnim3: Animation | null = null;

  private _startRace: boolean = false;
  public _speed: number = 60;
  private _curRunTime: number = 0;
  private _runTime: number = 0.2;
  private _curRunSpeed: number = 0;
  public _curPos: Vec3 = new Vec3();
  private _deltaPos: Vec3 = new Vec3(0, 0, 0);
  private _targetPos: Vec3 = new Vec3();
  public _isMoving = false;

  start() {}

  setInputActive(active: boolean) {
    if (active) {
      systemEvent.on(SystemEvent.EventType.KEY_UP, this.onPressKey, this);
    } else {
      systemEvent.off(SystemEvent.EventType.KEY_UP, this.onPressKey, this);
    }
  }

  onPressKey(event: EventKeyboard) {
    switch (event.keyCode) {
      case 32: {
        this._startRace = !this._startRace;
        break;
      }
      case 40: {
        this.moveDown();
        break;
      }
      case 38: {
        this.moveUp();
        break;
      }
    }
  }

  moveDown() {
    if (!this._startRace) {
      return;
    }

    this.node.getPosition(this._curPos);

    if (this._curPos.y <= -400) {
      return;
    }

    Vec3.add(this._targetPos, this._curPos, new Vec3(50, -200, 0));
    this.node.setPosition(this._targetPos);
  }

  moveUp() {
    if (!this._startRace) {
      return;
    }

    this.node.getPosition(this._curPos);

    if (this._curPos.y >= 200) {
      return;
    }

    Vec3.add(this._targetPos, this._curPos, new Vec3(50, 200, 0));
    this.node.setPosition(this._targetPos);
  }

  jumpByStep() {
    if (this._isMoving) {
      return;
    }
    if (this._startRace) {
      this._curRunTime = 0;
      this._curRunSpeed = this._speed / this._runTime;
      this.node.getPosition(this._curPos);
      Vec3.add(this._targetPos, this._curPos, new Vec3(this._speed, 0, 0));

      if (this.FireAnim) {
        this.FireAnim.getState('Obstacle collision').speed = 0.75;
        this.FireAnim.play('Obstacle collision');
      }

      this._isMoving = true;
    }
  }

  onOnceJumpEnd() {
    this._isMoving = false;
  }

  update(deltaTime: number) {
    if (this._startRace) {
      this._curRunTime += deltaTime;
      if (this._curRunTime > this._runTime) {
        // end
        this._startRace = true;
        this.onOnceJumpEnd();
        this.jumpByStep();
        this.node.setPosition(this._targetPos);
      } else {
        // tween
        this.node.getPosition(this._curPos);
        this._deltaPos.x = this._curRunSpeed * deltaTime;
        Vec3.add(this._curPos, this._curPos, this._deltaPos);
        this.node.setPosition(this._curPos);
      }
    }
  }
}
