import videojs from 'video.js'
import {version as VERSION} from '../package.json'

const Plugin = videojs.getPlugin('plugin')

// Default options for the plugin.
const defaults = {
  beforeElement: 'fullscreenToggle',
  textControl: 'Download',
  // 默认实时流
  isLive: true,
  position: 'top-right',
  offsetH: 0,
  offsetV: 0,
  padding: 10,
  opacity: 0.9
}

const vjsButton = videojs.getComponent('Button')

class fetchButton extends vjsButton {
  
  constructor(player, options) {
    super(player, options)
    this.addClass('vjs-fetch-flv-control')
  }

  handleClick() {
    this.player().trigger('onFetchFlv')
  }
}

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class FetchFlv extends Plugin {

  /**
   * Create a FetchFlv plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player)
    this.options = videojs.mergeOptions(defaults, options)
    this.div = null
    this.fetching = false
    this.data = []
    this.type = 'video/x-flv'
    this.button = null
    this.controller = null
    this.filename = null

    this.player.ready(() => {
      this.setup()
      this.player.addClass('vjs-fetch-flv')
    })
  }

  /**
   * Create div element to dispaly record status
   * @private
   */
  createCtx() {
    const video = this.player.el()
    // Create div element
    const div = document.createElement('div')
    div.classList.add('vjs-fetch-flv-ctx')
    div.classList.add('vjs-fetch-flv-ctx-hide')
    div.style.padding = this.options.padding + 'px'
    // Setup position
    const { offsetH, offsetV } = this.options
    switch (this.options.position) {
    case 'top-left':
      div.style.top = offsetV + 'px'
      div.style.left = offsetH + 'px'
      break
    case 'top-right':
      div.style.top = offsetV + 'px'
      div.style.right = offsetH + 'px'
      break
    case 'bottom-left':
      div.style.bottom = offsetV + 'px'
      div.style.left = offsetH + 'px'
      break
    case 'bottom-right':
      div.style.bottom = offsetV + 'px'
      div.style.right = offsetH + 'px'
      break
    default:
      div.style.top = offsetV + 'px'
      div.style.right = offsetH + 'px'
    }    
    this.div = div
    div.innerHTML = '<span>REC</span> <span class="vjs-icon-placeholder vjs-fetch-flv-icon"></span>'
    
    const { opacity } = this.options

    if (opacity) {
      div.style.opacity = opacity
    }
    video.appendChild(div)
  }

  createButton() {
    let player = this.player
    let btn = player.controlBar.addChild(new fetchButton(player, this.options), {})
    btn.controlText(this.options.textControl)
    player.controlBar.el().insertBefore(btn.el(), player.controlBar.getChild(this.options.beforeElement).el())
    player.on('onFetchFlv', () => {
      this.handleClick()
    })
    this.button = btn
  }

  setup() {
    if (this.div != null) {
      return
    }
    this.createCtx()
    this.createButton()
  }

  show() {
    if (this.div) {
      this.div.classList.remove('vjs-fetch-flv-ctx-hide')
    }
    if (this.button) {
      this.button.addClass('vjs-fetch-flv-fetching')
    }
  }

  hide() {
    if (this.div) {
      this.div.classList.add('vjs-fetch-flv-ctx-hide')
    }
    if (this.button) {
      this.button.removeClass('vjs-fetch-flv-fetching')
    }
  }

  /**
   * 将数据转成文件
   */
  blob2File(blob) {
    if (blob == null) {
      return
    }
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.download = this.filename
    document.body.appendChild(link)
    link.click()
    // 下载完成移除元素
    document.body.removeChild(link)
    // 释放掉blob对象
    window.URL.revokeObjectURL(url)
  }

  /**
   * 利用fetch按帧下载数据并合并成blob
   */
  fetchMedia() {
    const that = this
    const player = this.player
    this.fetching = true

    const url = player.currentSrc()
    this.filename = url.split('\\').pop().split('/').pop()
    this.controller = new AbortController()
    const signal =  this.controller.signal

    fetch(url, {
      signal: signal
    })
    .then(res => {
      // console.log(res)
      // 自己读取每一帧
      const reader = res.body.getReader()
      that.type = res.headers.get('Content-Type')
      that.data = []
      return new Promise((resolve) => {
        // 读取所有数据
        function push() {
          reader.read().then(({done, value}) => {
            that.data.push(value)
            if (done) {
              // 包装成 blob 对象并返回
              resolve(new Blob(that.data, {type: that.type }))
            } else {
              push()
            }
          })
        }
        push()
      })
    }).then(blob => {
      // 成功
      this.fetching = false
      this.hide()
      this.blob2File(blob)
    })
    .catch(error => {
      this.fetching = false
      this.hide()
      console.log(error)
    })
  }  

  handleClick() {
    if (!this.options.isLive) {
      // 不是实时文件 直接下载
      const player = this.player
      window.open(player.currentSrc(), 'Download')
      return
    }
    if (this.fetching) {
      this.fetching = false
      if (this.data.length > 0) {
        const blob = new Blob(this.data, {type: this.type })
        this.blob2File(blob)
      }
      this.hide()
      // 中止fetch
      this.controller.abort()
      //player.trigger('finishFetch')
      return
    }

    // window.open(this.options_.downloadURL || p.currentSrc(), 'Download');
    //player.trigger('startFetch')

    // console.log(this)
    this.show()
    // 下载文件
    this.fetchMedia()
    }
}

// Define default values for the plugin's `state` object here.
FetchFlv.defaultState = {}

// Include the version number.
FetchFlv.VERSION = VERSION

// Register the plugin with video.js.
videojs.registerPlugin('fetchFlv', FetchFlv)

export default FetchFlv