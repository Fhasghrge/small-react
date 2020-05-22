import React from './react/index'
import ReactDOM from './react-dom'
import './index.css'

const app = (
  <div className='active' title='shuang'>
    hello world!
  </div>
)
function Home() {
  return (
    <div className='active' title='shuang'>
      hello world!
    </div>
  )
}
const title = 'active'
/*
JSX对象只是语法糖，React需要处理的是React.createElement里面的内容

const app = React.createElement("div", {
  className: "active",
  title: "shuang"
}, "hello world!");
*/
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 1
    }
  }
  componentWillMount() {
    console.log('组件将要加载')
  }
  componentWillReceiveProps(props) {
    console.log('组件将要更新props')
  }
  componentWillUpdate() {
    console.log('组件将要更新')
  }
  componentDidMount() {
    console.log('组件已经加载')
  }
  componentDidUpdate() {
    console.log('组件更行完成')
  }
  handleAdd() {
    this.setState({
      count: this.state.count + 1
    })
  }
  handleDec() {
    this.setState({
      count: this.state.count - 1
    })
  }
  render() {
    return (
      <div className='active' title='shuang'>
        <div>{this.state.count}</div>
        <button onClick = {this.handleAdd.bind(this)}>+</button>
        <button onClick = {this.handleDec.bind(this)}>-</button>
      </div>
    )
  }
}

ReactDOM.render(<Demo name={title}/>, document.querySelector('#root'))