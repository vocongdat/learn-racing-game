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

  private _startRace: boolean = false;
  private _speed: number = 400;
  private _curRunTime: number = 0;
  private _runTime: number = 0.05;
  private _curRunSpeed: number = 0;
  private _curPos: Vec3 = new Vec3();
  private _deltaPos: Vec3 = new Vec3(0, 0, 0);
  private _targetPos: Vec3 = new Vec3();
  private _isMoving = false;

  start() {}

  setInputActive(active: boolean) {
    if (active) {
      systemEvent.on(SystemEvent.EventType.KEY_UP, this.onPressKey, this);
    } else {
      systemEvent.off(SystemEvent.EventType.KEY_UP, this.onPressKey, this);
    }
  }

  //   onMouseUp(event: EventMouse) {
  //     if (event.getButton() === 0) {
  //       this.jumpByStep(100);
  //     } else if (event.getButton() === 2) {
  //       this.jumpByStep(400);
  //     }
  //   }

  onPressKey(event: EventKeyboard) {
    switch (event.keyCode) {
      case 32: {
        this._startRace = !this._startRace;
        this.jumpByStep();
        break;
      }
      case 40: {
        this._startRace = !this._startRace;
        this.moveDown();
        break;
      }
      case 38: {
        this._startRace = !this._startRace;
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
    Vec3.add(this._targetPos, this._curPos, new Vec3(0, -200, 0));
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

    Vec3.add(this._targetPos, this._curPos, new Vec3(0, 200, 0));
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
        this.FireAnim.getState('AnimaFire').speed = 3.5;
        this.FireAnim.play('AnimaFire');
      }

      this._isMoving = true;
    }
    // if (this.FireAnim) {
    //   this.FireAnim.play('AnimaFire');

    //   if (step === 100) {
    //     this.FireAnim.play('AnimaFire');
    //   } else if (step === 400) {
    //     this.FireAnim.play('AnimaFire2');
    //   }
    // }
  }

  onOnceJumpEnd() {
    this._isMoving = false;
  }

  update(deltaTime: number) {
    if (this._startRace) {
      this._curRunTime += deltaTime;
      if (this._curRunTime > this._runTime) {
        // end
        this.node.setPosition(this._targetPos);
        this._startRace = false;
        this.onOnceJumpEnd();
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
