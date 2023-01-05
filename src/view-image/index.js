class ViewImage {
  /*
  obj = {
    srcList: [],
    selector: ''
  }
  */
  scale = 1;
  rotate = 0;
  sourceList = [];
  imgNode = null;
  constructor(obj) {
    if (obj.srcList) {
      this.sourceList = obj.srcList;
    }
    if (obj.selector) {
      let allImgNode = document.querySelectorAll(obj.selector);
      if (allImgNode) {
        for (const value of allImgNode) {
          this.sourceList.push(value.src);
          value.addEventListener("click", () => {
            this.open(value.src);
          });
        }
      }
    }
    this.run(this.sourceList);
  }
  run(srcArr) {
    this.addStyleAndHTML();
    this.mainImgMove();
    this.imgItemEvent(srcArr);
    let close = document.querySelector(".gg-view-image .close");
    let toLeft = document.querySelector(".gg-view-image .bar .to-left");
    let toRight = document.querySelector(".gg-view-image .bar .to-right");
    let prev = document.querySelector(".gg-view-image .bar .prev");
    let next = document.querySelector(".gg-view-image .bar .next");
    let increase = document.querySelector(".gg-view-image .bar .increase");
    let decrease = document.querySelector(".gg-view-image .bar .decrease");
    let reset = document.querySelector(".gg-view-image .bar .reset");
    close.addEventListener("click", () => this.close());
    toLeft.addEventListener("click", () => this.toRotate(true));
    toRight.addEventListener("click", () => this.toRotate(false));
    prev.addEventListener("click", () => this.next(false));
    next.addEventListener("click", () => this.next(true));
    increase.addEventListener("click", () => this.shrink(false));
    decrease.addEventListener("click", () => this.shrink(true));
    reset.addEventListener("click", () => this.resetSize());
    document.body.addEventListener("keydown", (e) => {
      if (e.code === "Escape") {
        this.close();
      }
    });
  }

  addStyleAndHTML() {
    let div = document.createElement("div");
    div.innerHTML = `
  <div class="gg-view-image">
    <div class="bar">
      <span class="prev"></span>
      <span class="reset"></span>
      <span class="next"></span>
      <span class="to-left"></span>
      <span class="to-right"></span>
      <span class="increase"></span>
      <span class="decrease"></span>
      <span class="close"></span>
    </div>
    <div class="main">
      <img src="" alt="">
    </div>
    <div class="footer">
      <div class="group"></div>
    </div>
  </div>
  `;
    let style = document.createElement("style");
    style.innerText = `
    /* CDN 服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
    /* CDN 服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
    @font-face {
        font-family: 'iconfont';  /* Project id 2054658 */
        src: url('https://at.alicdn.com/t/c/font_2054658_j48a4pq09p.woff2?t=1670230773605') format('woff2'),
            url('https://at.alicdn.com/t/c/font_2054658_j48a4pq09p.woff?t=1670230773605') format('woff'),
            url('https://at.alicdn.com/t/c/font_2054658_j48a4pq09p.ttf?t=1670230773605') format('truetype');
      }
    .gg-view-image {
      display: none;
      position: fixed;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 999;
      top: 0;
      left: 0;
      width: 100%;
      transition: transform 0.3s ease 0s;
    }

    .gg-view-image .main {
      flex-grow: 1;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .gg-view-image .main img {
      margin-left: 0px;
      margin-top: 0px;
      max-height: 100%;
      max-width: 100%;
      cursor: grab;
      transition: transform 0.3s ease 0s;
    }

    .gg-view-image .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      height: 60px;
      width: 100%;
      line-height: 100px;
      color: #fff;
      background: #11111133;
      font-family: "iconfont";
      font-size: 18px;
      font-weight: 900;
      user-select: none;
    }

    .gg-view-image .footer .group .group-item {
      height: 40px;
      margin: 8px;
      border: 2px solid rgba(255, 255, 255, 0);
    }

    .item-active {
      border: 2px solid #1890ff !important;
    }
    .gg-view-image .bar {
      color: #ccc;
      font-size: 30px;
      position: fixed;
      z-index: 1000;
      top: 0;
      right: 0;
      margin: 10px;
      cursor: pointer;
      font-family: "iconfont";
      background: #00000060;
      border-radius: 20px;
      user-select: none;
    }
    .bar span {
      margin: 2px 5px;
    }
    .bar span:hover {
      color: #fff;
    }
    .bar .reset::after {
      content: "\\e638";
    }
    .bar .close::after {
      content: "\\e685";
    }
    .bar .to-left::after {
      content: "\\e69a";
    }
    .bar .to-right::after {
      content: "\\e69b";
    }
    .bar .prev::after {
      content: '\\e659';
    }
    .bar .next::after {
      content: '\\e667';
    }
    .bar .increase::after {
      content: '\\e727';
    }
    .bar .decrease::after {
      content: '\\e729';
    }
    .gg-view-image .gg-view-notify {
      z-index: 2000;
      position: fixed;
      top: 15px;
      left: 0;
      right: 0;
      margin: auto;
      padding: 4px 10px;
      width: 200px;
      height: 26px;
      min-height: 26px;
      line-height: 26px;
      color: #fff;
      background-color: #909399;
      border-radius: 50px;
      opacity: 0.9;
      text-align: center;
    }
  `;
    document.head.appendChild(style);
    document.body.appendChild(div);
  }

  mainImgMove() {
    let isDrag = false;
    let mouse = null;
    if (!this.imgNode) {
      this.imgNode = document.querySelector(".gg-view-image .main img");
    }
    this.imgNode.addEventListener("dragstart", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    this.imgNode.addEventListener("mousedown", (e) => {
      this.imgNode.style.cursor = "grabbing";
      isDrag = true;
      mouse = e;
    });

    this.imgNode.addEventListener("mousemove", (e) => {
      if (isDrag === true) {
        let { marginLeft, marginTop } = e.target.style;
        let left = +marginLeft.split("px")[0];
        let top = +marginTop.split("px")[0];
        let moveX = e.offsetX - mouse.offsetX;
        let moveY = e.offsetY - mouse.offsetY;
        if (this.rotate === 0) {
        }
        let rotate = (this.rotate / 360) % 1;
        if (rotate === 0) {
          this.imgNode.style.marginLeft = left + moveX + "px";
          this.imgNode.style.marginTop = top + moveY + "px";
        } else if (rotate === 0.25 || rotate === -0.75) {
          this.imgNode.style.marginLeft = left - moveY + "px";
          this.imgNode.style.marginTop = top + moveX + "px";
        } else if (rotate === -0.25 || rotate === 0.75) {
          this.imgNode.style.marginLeft = left + moveY + "px";
          this.imgNode.style.marginTop = top - moveX + "px";
        } else if (rotate === 0.5 || rotate === -0.5) {
          this.imgNode.style.marginLeft = left - moveX + "px";
          this.imgNode.style.marginTop = top - moveY + "px";
        }
      }
    });
    this.imgNode.addEventListener("mouseleave", (e) => {
      if (isDrag === true) {
        this.imgNode.style.cursor = "grab";
        isDrag = false;
      }
    });
    this.imgNode.addEventListener("mouseup", (e) => {
      if (isDrag === true) {
        this.imgNode.style.cursor = "grab";
        isDrag = false;
      }
    });
  }

  imgItemEvent(imgList) {
    let groupNode = document.querySelector(".gg-view-image .footer .group");
    let img = document.createElement("img");
    img.className = "group-item";
    imgList.forEach((src) => {
      let item = img.cloneNode(true);
      item.src = src;
      item.addEventListener("click", (e) => {
        this.initMainImage();
        this.close();
        this.open(e.target.src);
      });
      groupNode.appendChild(item);
    });
  }

  initMainImage() {
    this.scale = 1;
    this.rotate = 0;
    this.imgNode.setAttribute("style", "");
    this.imgNode.onmousewheel = null;
  }

  resetSize() {
    this.rotate = 0;
    this.scale = 1;
    this.imgNode.style.transform = "scale(1) rotate(0deg)";
    this.imgNode.style.marginLeft = "0px";
    this.imgNode.style.marginTop = "0px";
  }
  open(src) {
    src = src ? src : this.sourceList[0];
    let container = document.querySelector(".gg-view-image");
    if (!this.imgNode) {
      this.imgNode = document.querySelector(".gg-view-image .main img");
    }
    let groupItemList = document.querySelectorAll(
      ".gg-view-image .footer .group .group-item"
    );
    container.style.display = "block";
    container.style.height = window.innerHeight + "px";
    this.imgNode.src = src;
    for (const item of groupItemList) {
      if (item.src === src) {
        item.className = "group-item item-active";
      } else {
        item.className = "group-item";
      }
    }
    setTimeout(() => {
      // 打开图片后...
      this.imgNode.onmousewheel = (e) => {
        e.preventDefault();
        e.stopPropagation();
        let transform = this.imgNode.style.transform || "scale(1) rotate(0deg)";
        if (e.deltaY > 0) {
          // 低于 0.3 会紊乱，未解
          if (this.scale > 0.3) {
            this.shrink(true);
          }
        }
        if (e.deltaY < 0) {
          if (this.scale < 10) {
            this.shrink(false);
          }
        }
      };
    }, 10);
  }
  shrink(bool) {
    let transform = this.imgNode.style.transform || "scale(1) rotate(0deg)";
    if (!!bool === true) {
      this.scale -= 0.05;
      transform = transform.replace(/(?<=scale\()\S+(?=\))/g, this.scale + "");
      this.imgNode.style.transform = transform;
    } else {
      this.scale += 0.05;
      transform = transform.replace(/(?<=scale\()\S+(?=\))/g, this.scale + "");
      this.imgNode.style.transform = transform;
    }
  }
  toRotate(isLeft) {
    this.rotate = isLeft ? this.rotate - 90 : this.rotate + 90;
    let transform = this.imgNode.style.transform;
    if (transform) {
      transform = transform.replace(
        /(?<=rotate\()\S+(?=\))/g,
        this.rotate + "deg"
      );
      this.imgNode.style.transform = transform;
    } else {
      this.imgNode.style.transform = "scale(1) rotate(" + this.rotate + "deg)";
    }
  }
  close() {
    let container = document.querySelector(".gg-view-image");
    container.style.display = "none";
    this.initMainImage();
  }
  next(bool) {
    let group = document.querySelectorAll(".gg-view-image .footer .group-item");
    let activeItem;
    group.forEach((v) => {
      let cls = v.getAttribute("class");
      if (cls.split(" ").includes("item-active")) {
        activeItem = v;
      }
    });
    let s = bool === true ? "nextSibling" : "previousSibling";
    let item = activeItem[s];
    if (item) {
      item.click();
    } else {
      // this.notify('没有了');
    }
  }
}
