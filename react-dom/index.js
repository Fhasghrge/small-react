import Component from '../react/component'
import {diff, diffNode} from './diff';

const ReactDOM = {
  render
}

/**
 * 渲染虚拟DOM到根节点
 * 对虚拟DOM解析成真实DOM
 * diff算法
 * @param {*} vnode 
 * @param {*} container 
 */
function render(vnode, container, dom) {
  // return container.appendChild(_render(vnode))
  return diff(dom, vnode, container)
}

// 统一转换成类组件
export function createComponent(comp, props) {
  let inst;
  // 如果是类组件
  if (comp.prototype && comp.prototype.render) {
    inst = new comp(props)
  } else {
    //如果是函数组件
    inst = new Component(props)
    inst.constructor = comp
    inst.render = function () {
      return this.constructor(props)
    }
  }
  return inst
}
export function renderComponent(comp) {
  let base;
  const renderer = comp.render()
  // base = _render(renderer)
  base = diffNode(comp.base, renderer)
  if (comp.base) {
    comp.componentWillUpdate && comp.componentWillUpdate()
  }
  if (comp.base) {
    comp.componentDidUpdate && comp.componentDidUpdate()
  } else {
    comp.componentDidMount && comp.componentDidMount()
  }
  // if (comp.base) {
  //   comp.base.parentNode && comp.base.parentNode.replaceChild(base, comp.base)
  // }
  comp.base = base
}
// 对类组件进行统一处理成DOM对象
export function setComponentProps(comp, props) {
  if (!comp.base) {
    comp.componentWillMount && comp.componentWillMount()
  } else {
    comp.componentWillReceiveProps && comp.componentWillReceiveProps()
  }
  comp.props = props
  renderComponent(comp)
}
function _render(vnode) {

  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') return

  if (typeof vnode === 'number') vnode = String(vnode)
  if (typeof vnode === 'string') { // 判断的优化
    return document.createTextNode(vnode)
  }

  //如果是函数组件或者类组件
  if (typeof vnode.tag === 'function') {
    // 1.创建组件实例
    const comp = createComponent(vnode.tag, vnode.attrs)
    // 2.设置组件的属性
    setComponentProps(comp, vnode.attrs)
    // 3.返回组件
    return comp.base
  }

  if (typeof vnode === 'object') {
    const { tag, attrs } = vnode;
    const dom = document.createElement(tag)
    if (attrs) {
      Object.keys(attrs).forEach(key => {
        const value = attrs[key]
        setAttribute(dom, key, value)
      })
    }
    // 渲染子节点
    vnode.childrens && vnode.childrens.forEach(child => {
      render(child, dom)
    })

    return dom
  }
}
/**
 * 对属性进行绑定
 */
export function setAttribute(dom, key, value) {
  if (key === 'className') {
    key = 'class'
  }

  if (/on\w+/.test(key)) {
    key = key.toLowerCase()
    dom[key] = value || ''
  } else if (key === 'style') {
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || ''
    } else if (value && typeof value === 'object') {
      for (let k in value) {
        if (typeof value[k] === 'number') {
          dom.style[k] = value[k] + 'px'
        } else {
          dom.style[k] = value[k]
        }
      }
    }
  } else {
    if (key in dom) {
      dom[key] = value || ''
    }
    if (value) {
      dom.setAttribute(key, value)
    } else {
      dom.removeAttribute(key)
    }
  }
}
export default ReactDOM;
