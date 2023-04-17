/**
 * 获取该DOM最近的含有指定class的祖先元素
 *
 * @param {DOM} dom 需要寻找祖先节点的DOM节点
 * @param {string} cls 祖先节点类名
 * @returns DOM || {}
 */

function getAncestorDom(dom, cls, limit) {
  // debugger;
  try {
    if ((dom.getAttribute("class") || "").includes(cls)) {
      return dom;
    }
    if (dom.parentNode) {
      let str = dom.parentNode.getAttribute("class") || "";
      if (str.includes(cls)) {
        return dom.parentNode;
      } else if (str.includes(limit)) {
        return null;
      } else {
        return getAncestorDom(dom.parentNode, cls, limit);
      }
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

class Draggable {
  constructor(options) {
    this.wrap = options.wrap;
    this.contentClass = options.contentClass;
    this.triggerClass = options.triggerClass;
    this.dragTargetIndex = -1;
    this.dropTargetIndex = -1;
    this.list = [];
    this.source = options.source || [];
    this.callback = options.afterDragCallback;
    this.init();
  }
  init() {
    this.getRect();
    this.dataIndex("set");
    this.bindEventListener();
  }
  dataIndex(opt) {
    let indexList = [];
    let children = this.wrap.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      let cls = child.getAttribute("class");
      if (cls && cls.includes(this.contentClass)) {
        if (opt === "set") {
          child.setAttribute("data-index", i);
        } else if (opt === "get") {
          indexList.push(+child.getAttribute("data-index"));
        }
      }
    }
    return indexList;
  }
  getRect() {
    this.list = [];
    let children = this.wrap.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      let cls = child.getAttribute("class");
      if (cls && cls.includes(this.contentClass)) {
        let rect = child.getBoundingClientRect();
        this.list.push({
          ele: child,
          rect: rect,
        });
      }
    }
  }
  bindEventListener() {
    let isOnPointer = false;
    let dragTarget;
    let dropTarget;
    let moveTarget;
    let dragTargetIndex;
    let dragTargetRect;
    this.wrap.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) {
        return;
      }
      if (getAncestorDom(e.target, this.triggerClass)) {
        this.wrap.setPointerCapture(e.pointerId);
        console.log("点击");
        dragTarget = getAncestorDom(e.target, this.contentClass);
        isOnPointer = true;
        moveTarget = dragTarget.cloneNode(true);
        dragTargetRect = dragTarget.getBoundingClientRect();
        moveTarget.style.opacity = "0";
        moveTarget.style.position = "fixed";
        moveTarget.style.top = `0px`;
        moveTarget.style.left = `0px`;
        this.wrap.style.userSelect = "none";
        document.body.appendChild(moveTarget);
        dragTargetIndex = this.list.findIndex((l) => l.ele === dragTarget);
        this.dragTargetIndex = dragTargetIndex;
      }
    });

    this.wrap.addEventListener("pointermove", (e) => {
      if (isOnPointer) {
        dragTarget.style.opacity = "0.5";
        moveTarget.style.opacity = `0.5`;
        moveTarget.style.transform = `translate3d(${e.x}px, ${e.y}px, 0)`;
        for (let i = 0; i < this.list.length; i++) {
          let { ele, rect } = this.list[i];
          let index = this.list.findIndex((l) => l.ele === ele);
          if (ele !== dragTarget /* 不与自己比较 */) {
            if (
              /* 判断鼠标指针与drag-item位置 */
              rect.x < e.x &&
              e.x < rect.x + rect.width &&
              rect.y < e.y &&
              e.y < rect.y + rect.height
            ) {
              console.log("被交换：", {
                ele,
                rect,
              });
              console.log("交换：", {
                e,
              });
              let swapNode =
                index > dragTargetIndex ? ele.nextElementSibling : ele;
              this.wrap.insertBefore(dragTarget, swapNode);
              dragTargetIndex = index;
              console.log("交换");
              this.getRect();
              dragTarget.style.transition = "none";
              dragTarget.style.transform = `translate3d(${
                ele.offsetLeft - dragTarget.offsetLeft
              }px, ${ele.offsetTop - dragTarget.offsetTop}px, 0)`;
              dragTarget.offsetLeft; // 触发重绘
              dragTarget.style.transition = "transform 150ms";
              dragTarget.style.transform = "translate3d(0px, 0px, 0px)";
              ele.style.transition = "none";
              ele.style.transform = `translate3d(${
                dragTarget.offsetLeft - ele.offsetLeft
              }px, ${dragTarget.offsetTop - ele.offsetTop}px, 0)`;
              ele.offsetLeft; // 触发重绘
              ele.style.transition = "transform 150ms";
              ele.style.transform = "translate3d(0px, 0px, 0px)";
            }
          }
        }
      }
    });

    this.wrap.addEventListener("pointerup", (e) => {
      if (isOnPointer) {
        isOnPointer = false;
        this.dropTargetIndex = dragTargetIndex;
        moveTarget.remove();
        dragTarget.style.opacity = null;
        this.wrap.style.userSelect = "auto";
        console.log("停止");
        this.afterDrag();
      }
    });
  }
  afterDrag() {
    // let indexList = this.dataIndex('get');
    if (this.dragTargetIndex < this.dropTargetIndex) {
      let temp = this.source[this.dragTargetIndex];
      for (let i = this.dragTargetIndex + 1; i <= this.dropTargetIndex; i++) {
        this.source[i - 1] = this.source[i];
      }
      this.source[this.dropTargetIndex] = temp;
    } else if (this.dragTargetIndex > this.dropTargetIndex) {
      let temp = this.source[this.dragTargetIndex];
      for (let i = this.dragTargetIndex; i > this.dropTargetIndex; i--) {
        this.source[i] = this.source[i - 1];
      }
      this.source[this.dropTargetIndex] = temp;
    }
    let result = {
      dragIndex: this.dragTargetIndex,
      dropIndex: this.dropTargetIndex,
      source: this.source,
    };
    this.callback(result);
  }
}
