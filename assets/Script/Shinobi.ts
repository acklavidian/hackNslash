import { ControlState } from './ControlState'
const { ccclass, property } = cc._decorator

const debug = cc.PhysicsManager.DrawBits

console.log(cc.PhysicsManager.DrawBits)
cc.director.getPhysicsManager().enabled = true;
cc.director.getPhysicsManager().debugDrawFlags = debug['e_aabbBit'] |
    debug['e_shapeBit'] |
    debug['e_jointBit'] |
    debug['e_centerOfMassBit'] |
    debug['e_particleBit'] |
    debug['e_all'] |
    debug['e_controllerBit']


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


  public start () {
    this.rigidBody = this.getComponent(cc.RigidBody)
    new ControlState(this.onControlInput, this)
    this.stop()
  }

  public update () {
    this.react()
  }

  public isMoving(direction?: Direction) {
    const velocity = this.rigidBody.linearVelocity
    switch (direction) {
      case (Direction.FORWARD): return velocity.x > 0
      case (Direction.BACKWARD): return velocity.x < 0
      case (Direction.DOWN): return velocity.y < 0
      case (Direction.FORWARD): return velocity.y > 0
      default: return ((velocity.y !== 0) || (velocity.x !== 0))
    }
  }

  public react () {
    console.log(this.isMoving() ? 'YES' : 'NO')
    if (this.isMoving(Direction.FORWARD)) console.log('FORWARD')
    else if (this.isMoving(Direction.BACKWARD)) console.log('BACKWARD')
    else if (this.isMoving(Direction.DOWN)) console.log('DOWN')
    else if (this.isMoving(Direction.UP)) console.log('UP')
  }

  private onControlInput ({ isPressed }) {
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

  public stop () {
    const velocity = new cc.Vec2(this.rigidBody.linearVelocity.x / 2, this.rigidBody.linearVelocity.y)
    this.rigidBody.linearVelocity = velocity
    this.Animation.play('Standing')
  }

  public run (direction: HorizontalDirection) {
    return this.move(direction, 'Running', this.walkSpeed * 3)
  }

  public walk (direction: HorizontalDirection) {
    return this.move(direction, 'Walking', this.walkSpeed)
  }

  public jump () {
    const velocity: cc.Vec2 = new cc.Vec2(this.rigidBody.linearVelocity.x, this.jumpStrength)
    this.rigidBody.linearVelocity = velocity
    console.log(this.Animation.currentClip.name)
    return (this.Animation.currentClip.name === 'Jumping' || this.Animation.play('Jumping'))
  }

  protected move (direction: HorizontalDirection, animationName: string, movementSpeed: number) {
    const isForward = (direction === Direction.FORWARD)
    const speed = (isForward) ? movementSpeed : -movementSpeed
    const velocity: cc.Vec2 = new cc.Vec2(speed, this.rigidBody.linearVelocity.y)
    const flip = cc.flipX(!isForward)
    this.Shinobi.runAction(flip)
    this.rigidBody.linearVelocity = velocity
    return (this.Animation.currentClip.name === animationName) || this.Animation.play(animationName)
  }
}
