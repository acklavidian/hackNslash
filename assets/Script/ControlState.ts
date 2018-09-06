const EventType = cc.SystemEvent.EventType
const KEY = cc.macro.KEY

interface State {
    [key: string]: boolean
}

export class ControlState {
    public state: State = {}
    private stateChangeCallback
    public constructor (stateChangeCallback, context) {
        cc.systemEvent.on(EventType.KEY_DOWN, this.onKeyDown, this)
        cc.systemEvent.on(EventType.KEY_UP, this.onKeyUp, this)
        this.stateChangeCallback = stateChangeCallback.bind(context)
    }

    public onKeyDown ({ keyCode }) {
        this.state[keyCode] = true
        this.stateChangeCallback(this, keyCode)
    }

    public onKeyUp ({ keyCode }) {
        this.state[keyCode] = false
        this.stateChangeCallback(this, keyCode)
    }

    public get isPressed () {
        return Object.entries(KEY).reduce((accumulator, [keyName, keyCode]) => {
            return {
                ...accumulator,
                [keyName]: Boolean(this.state[keyCode]) 
            } 
        }, {})
    }
}