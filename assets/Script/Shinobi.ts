import { ControlState } from './ControlState'
const { ccclass, property } = cc._decorator

cc.director.getPhysicsManager().enabled = true;

@ccclass
export default class extends cc.Component {
  @property(cc.Animation)
  Animation: cc.Animation = null

  @property(cc.Node)
  public Shinobi: cc.Node = null
  public isWalking: boolean = false

  onLoad () {
    new ControlState(this.onControlInput, this)
    this.stop()
  }

  onControlInput ({ isPressed }) {
    if(isPressed.shift && (isPressed.left || isPressed.right)) {
      this.run()
    } else if (isPressed.left || isPressed.right) {
      this.walk()
    } else {
      this.stop()
    }
  }

  stop () {
    this.Animation.play('Standing')
  }

  run () {
    (this.Animation.currentClip.name === 'Running') || this.Animation.play('Running')
  }

  walk () {
    (this.Animation.currentClip.name === 'Walking') || this.Animation.play('Walking')
  }
}
