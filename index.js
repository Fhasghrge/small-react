import React from './react/index'
import ReactDOM from './react-dom'

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

ReactDOM.render(<Home name={title}/>, document.querySelector('#root'))