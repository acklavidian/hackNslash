import { ControlState } from './ControlState'
const { ccclass, property } = cc._decorator

cc.director.getPhysicsManager().enabled = true;
cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
    cc.PhysicsManager.DrawBits.e_pairBit |
    cc.PhysicsManager.DrawBits.e_centerOfMassBit |
    cc.PhysicsManager.DrawBits.e_jointBit |
    cc.PhysicsManager.DrawBits.e_shapeBit


enum Direction {
  FORWARD,
  BACKWARD,
  UP,
  DOWN
}

type HorizontalDirection = Direction.FORWARD | Direction.BACKWARD
type VerticalDirection = Direction.UP | Direction.DOWN

@ccclass
export default class extends cc.Component {
  @property(cc.Animation)
  public Animation: cc.Animation = null

  @property(cc.Node)
  public Shinobi: cc.Node = null
  public rigidBody: cc.RigidBody = null
  public walkSpeed: number = 100
  public jumpStrength: number = 200


  start () {
    this.rigidBody = this.getComponent(cc.RigidBody)
    new ControlState(this.onControlInput, this)
    this.stop()
  }

  onControlInput ({ isPressed }) {
    if (isPressed.space) {
      this.jump()
    }

    if(isPressed.shift && isPressed.right) {
      this.run(Direction.FORWARD)
    } else if (isPressed.shift && isPressed.left) {
      this.run(Direction.BACKWARD)
    } else if (isPressed.right) {
      this.walk(Direction.FORWARD)
    } else if (isPressed.left) {
      this.walk(Direction.BACKWARD)
    } else {
      this.stop()
    }
  }

  stop () {
    console.log('body', this.rigidBody)
    this.Animation.play('Standing')
  }

  run (direction: HorizontalDirection) {
    const isForward = (direction === Direction.FORWARD)
    const speed = (isForward) ? this.walkSpeed : -this.walkSpeed
    const walkVelocity: cc.Vec2 = new cc.Vec2(speed * 3, this.rigidBody.linearVelocity.y)
    const flip = cc.flipX(!isForward)
    this.Shinobi.runAction(flip)
    this.rigidBody.linearVelocity = walkVelocity
    return (this.Animation.currentClip.name === 'Running') || this.Animation.play('Running')
  }

  walk (direction: HorizontalDirection) {
    const isForward = (direction === Direction.FORWARD)
    const speed = (isForward) ? this.walkSpeed : -this.walkSpeed
    const walkVelocity: cc.Vec2 = new cc.Vec2(speed, this.rigidBody.linearVelocity.y)
    const flip = cc.flipX(!isForward)
    this.Shinobi.runAction(flip)
    this.rigidBody.linearVelocity = walkVelocity
    return (this.Animation.currentClip.name === 'Walking') || this.Animation.play('Walking')
  }

  jump () {
    console.log('jump')
    const jumpVelocity: cc.Vec2 = new cc.Vec2(this.rigidBody.linearVelocity.x, this.jumpStrength)
    this.rigidBody.linearVelocity = jumpVelocity
  }
}
