import {
  setAttribute,
  setComponentProps,
  createComponent
} from "./index"

export function diff(dom, vnode, container) {
  const ret = diffNode(dom, vnode)
  if (container) {
    container.appendChild(ret)
  }
  return ret
}
export function diffNode(dom, vnode) {
  let out = dom
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') return

  if (typeof vnode === 'number') vnode = String(vnode)
  if (typeof vnode === 'string') {
    if (dom && dom.nodeType === 3) {
      if (dom.textContent !== vnode) {
        dom.textContent = vnode
      }
    } else {
      out = document.createTextNode(vnode)
      if (dom && dom.parentNode) {
        dom.parentNode.replaceNode(out, dom)
      }
    }
    return out
  }
  if (typeof vnode.tag === 'function') {
    return diffComponent(out, vnode);
  }
  if (!dom) {
    out = document.createElement(vnode.tag)
  }
  console.log(vnode)
  if (vnode.childrens && vnode.childrens.length > 0 || (out.childrens && out.childrens.length > 0)) {
    diffChildren(out, vnode.childrens)
  }
  diffAttribute(out, vnode)
  return out
}
function diffComponent(dom, vnode) {
  let comp = dom;
  // 如果组件没有变化，重新设置props
  if (comp && comp.constructor === vnode.tag) {
    setComponentProps(comp, vnode.attrs)
    dom = comp.base
  } else {
    // 组件类型发生变化
    if (comp) {
      // 先移除旧的组件
      unmountComponent(comp)
      comp = null
    }
    // 创建新组件
    comp = createComponent(vnode.tag, vnode.attrs) 
    // 设置组件的属性
    setComponentProps(comp, vnode.attrs)
    // 给当前组件挂载base
    dom = comp.base;
  }
  return dom;
}
function unmountComponent(comp) {
  removeNode(comp.base)
}
function removeNode(dom) {
  if (dom && dom.parentNode) {
    dom.parentNode.removeNode(dom)
  }
}
function diffChildren(dom, vChildren) {
  const domChildren = dom.childNodes;
  const children = [];
  const keyed = {};
  if (domChildren.length > 0) {

  }
  if (vChildren && vChildren.length > 0) {
    let min = 0;
    let childrenLen = children.length;
    [...vChildren].forEach((vchild, i) => {
      const key = vchild.key;
      let child;
      if (key) {
        if (keyed[key]) {
          child = keyed[key];
          keyed[key] = undefined
        }
      } else if (childrenLen > min) {
        for (let j = min; i < childrenLen; j++) {
          let c = children[j];
          if (c) {
            child = c;
            children[j] = undefined;
            if (j === childrenLen - 1) childrenLen--;
            if (j === min) min++;
            break;
          }
        }
      }
      child = diffNode(child, vchild);
      const f = domChildren[i]
      if (child && child !== dom && child !== f) {
        if (!f) {
          dom.appendChild(child);
        } else if (child === f.nextSibling) {
          removeNode(f)
        } else {
          dom.insertBefore(child, f)
        }
      }
    })
  }
}
function diffAttribute(dom, vnode) {
  const oldAttrs = {}
  const newAttrs = vnode.attrs
  const domAttrs = dom.attributes;
  [...domAttrs].forEach(item => {
    oldAttrs[item] = item.value
  })
  for (let key in oldAttrs) {
    if (!key in newAttrs) {
      setAttribute(dom, key, undefined)
    }
  }
  for (let key in newAttrs) {
    if (oldAttrs[key] !== newAttrs[key]) {
      setAttribute(dom, key, newAttrs[key])
    }
  }
}