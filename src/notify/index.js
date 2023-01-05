class Notify {
  className = "";
  style = "";
  duration = 3000;
  top = "";
  constructor(config, mode) {
    if (config) {
      let { duration, top, className, style } = config;
      this.className = className || "";
      this.style = style || "";
      this.duration = duration || 3000;
      this.top = top ? top + "px" : "10px";
    }
    if (mode) {
    }
    let div = document.createElement("div");
    div.className = "gg-notify-wrap";
    document.body.appendChild(div);
    this.wrap = div;
    this.addStyle();
  }
  status = "";
  color = {
    success: "&#xe78d;",
    warn: "&#xe651;",
    error: "&#xe6a6;",
    info: "&#xe605;",
    loading: "&#xe73c;",
  };
  addStyle() {
    let style = document.createElement("style");
    style.innerHTML = `
@font-face {
  font-family: 'iconfont';
  src: url('https://at.alicdn.com/t/c/font_2054658_cvd55grfj67.woff2?t=1670378441898') format('woff2'),
    url('https://at.alicdn.com/t/c/font_2054658_cvd55grfj67.woff?t=1670378441898') format('woff'),
    url('https://at.alicdn.com/t/c/font_2054658_cvd55grfj67.ttf?t=1670378441898') format('truetype');
}

.gg-notify-wrap {
  z-index: 2000;
  position: fixed;
  width: 100%;
  pointer-events: none;
  top: ${this.top};
  transition: height 0.3s ease 0s;
  display: flex;
  flex-direction: column;
}

.gg-notify-content {
  opacity: 0;
  overflow: hidden;
  display: inline-flex;
  pointer-events: all;
  max-width: 50%;
  line-height: 26px;
  margin: 8px auto;
  padding: 2px 0;
  padding-right: 8px;
  border-radius: 8px;
  transition: opacity 0.3s ease;
  box-shadow: 0 6px 16px 0 rgb(0 0 0 / 8%), 0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%);
}

.icon {
  align-items: start;
  margin: 0 4px;
  user-select: none;
  font-family: 'iconfont';
}

.icon-loading {
  animation: iconrotate 0.5s linear infinite;
}

.success {
  color: #67c23a;
  background-color: #f0f9eb;
  border: 4px solid #f0f9eb;
}

.warn {
  color: #faad14;
  background-color: #fdf6ec;
  border: 4px solid #fdf6ec;
}

.info {
  color: #1677ff;
  background-color: #edf2fc;
  border: 4px solid #edf2fc;
}

.loading {
  color: #1677ff;
  background-color: #edf2fc;
  border: 4px solid #edf2fc;
}

.error {
  color: #ff4d4f;
  background-color: #fef0f0;
  border: 4px solid #fef0f0;
}

/*自定义动画类----顺时针旋转（使用这个动画的时候才设置动画执行时间）*/
@keyframes iconrotate {

  0% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(180deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
        `;
    document.body.appendChild(style);
  }
  getTime(time) {
    time = Number(time);
    time = Math.abs(time);
    time = isNaN(time) ? this.duration : time;
    return time;
  }
  toConfig(p) {
    if (p instanceof Object) {
      let { duration, top, bottom, left, right, className, style } = p;
      let config = {};
      config.className = className || "";
      config.style = style || "";
      config.duration = this.getTime(duration);
      config.top = top ? top + "px" : "auto";
      config.left = left ? left + "px" : "auto";
      config.right = right ? right + "px" : "auto";
      config.bottom = bottom ? bottom + "px" : "auto";
      return config;
    }
    if (typeof p === "number" || typeof p === "string") {
      return {
        duration: this.getTime(p),
      };
    }
    return {
      duration: this.duration,
    };
  }
  success(msg, config) {
    this.status = "success";
    this.create(msg, config);
  }
  error(msg, config) {
    this.status = "error";
    this.create(msg, config);
  }
  warn(msg, config) {
    this.status = "warn";
    this.create(msg, config);
  }
  info(msg, config) {
    this.status = "info";
    this.create(msg, config);
  }
  loading(msg) {
    this.status = "loading";
    let el = this.create(msg);
    return (status, msg, config) => {
      config = this.toConfig(config);
      let icon = el.querySelector(".icon");
      icon.className = "icon";
      icon.innerHTML = this.color[status];
      el.querySelector(".text").innerHTML = msg;
      this.setClassAndStyle(el, status, config);
      setTimeout(() => {
        this.destroy(el);
      }, config.duration);
    };
  }
  destroy(el) {
    el.style.opacity = "0";
    setTimeout(() => {
      el.remove();
    }, 300);
  }

  setClassAndStyle(el, status, config) {
    el.className = `gg-notify-content ${status} ${this.className} ${config.className}`;
    let position = "";
    if (config.left || config.right || config.top || config.bottom) {
      position = `
        position: fixed;
        top: ${config.top};
        left: ${config.left};
        bottom: ${config.bottom};
        right: ${config.right};`;
    }
    el.style = `${position}${this.style};${config.style}`;
  }

  create(msg, config) {
    let status = this.status ? this.status : "info";
    config = this.toConfig(config);
    let contentHTML = `
      <span class="icon icon-${status}">${this.color[status]}</span>
      <span class="text">${msg}</span>
      `;
    let div = document.createElement("div");
    this.setClassAndStyle(div, status, config);
    div.innerHTML = contentHTML;
    if (this.wrap.childNodes.length > 0) {
      this.wrap.insertBefore(div, this.wrap.childNodes[0]);
    } else {
      this.wrap.appendChild(div);
    }
    setTimeout(() => {
      div.style.opacity = "1";
    });
    if (status === "loading") {
      return div;
    }
    if (config.duration) {
      setTimeout(() => {
        this.destroy(div);
      }, config.duration);
    }
  }
}
