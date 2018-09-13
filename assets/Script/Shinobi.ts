import { ControlState } from './ControlState'
const { ccclass, property } = cc._decorator

cc.director.getPhysicsManager().enabled = true;
cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
    cc.PhysicsManager.DrawBits.e_pairBit |
    cc.PhysicsManager.DrawBits.e_centerOfMassBit |
    cc.PhysicsManager.DrawBits.e_jointBit |
    cc.PhysicsManager.DrawBits.e_shapeBit

@ccclass
export default class extends cc.Component {
  @property(cc.Animation)
  public Animation: cc.Animation = null

  @property(cc.Node)
  public Shinobi: cc.Node = null
  public rigidBody: cc.RigidBody = null

  onLoad () {
    this.rigidBody = this.getComponent(cc.RigidBody)
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
    console.log('body', this.rigidBody)
    this.Animation.play('Standing')
  }

  run () {
    (this.Animation.currentClip.name === 'Running') || this.Animation.play('Running')
  }

  walk () {
    this.rigidBody.applyForceToCenter(1)
    return (this.Animation.currentClip.name === 'Walking') || this.Animation.play('Walking')
  }
}
