const { ccclass, property } = cc._decorator;
const EventType = cc.SystemEvent.EventType
const KEY = cc.KEY

@ccclass
export default class extends cc.Component {
  @property(cc.Animation)
  WalkingAnimation: cc.Animation = null

  @property(cc.Node)
  public Shinobi: cc.Node = null
  public isWalking: boolean = false

  onLoad () {
    console.log('/////////////////////HERE!!!!!!!!!', EventType)
    cc.systemEvent.on(EventType.KEY_DOWN, this.onKeyDown, this)
    cc.systemEvent.on(EventType.KEY_UP, this.onKeyUp, this)
  }

  onKeyDown (event) {
    console.log('event', event.keyCode)
    switch (event.keyCode) {
      case KEY.right:
      case KEY.left:
        return this.walk()
    }
  }

  onKeyUp (event) {
    switch (event.keyCode) {
      case KEY.right:
      case KEY.left:
        return this.stop()
    }
  }

  stop () {
    if (this.isWalking) {
      this.isWalking = false
      return this.WalkingAnimation.stop()
    }
  }

  walk () {
    console.log('here', this.WalkingAnimation)
    if (!this.isWalking) {
      this.isWalking = true
      this.WalkingAnimation.play()
    }
  }
}
