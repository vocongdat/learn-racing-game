import { _decorator, Component, Node, AudioSource, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
  @property(AudioClip)
  public clip: AudioClip = null!;

  @property(AudioSource)
  public audioSource: AudioSource = null!;

  play() {
    this.audioSource.play();
  }

  playOneShot() {
    this.audioSource.playOneShot(this.clip, 1);
  }

  pause() {
    this.audioSource.pause();
  }
}
