import {renderComponent} from '../react-dom/index'
class Component {
  constructor(props = {}) {
    this.props = props
    this.state = {}
  }
  setState(options) {
    Object.assign(this.state, options)
    renderComponent(this)
  }
}

export default Component;
