/*! @name videojs-fetch-flv @version 1.0.11 @license MIT */
import _inheritsLoose from '@babel/runtime/helpers/inheritsLoose';
import document from 'global/document';
import window from 'global/window';
import videojs from 'video.js';

var version = "1.0.11";

var Plugin = videojs.getPlugin('plugin'); // Default options for the plugin.

var defaults = {
  beforeElement: 'fullscreenToggle',
  controlText: 'Download',
  // 默认实时流
  isLive: true,
  position: 'top-right',
  offsetH: 0,
  offsetV: 0,
  padding: 10,
  opacity: 0.9
};
var vjsButton = videojs.getComponent('Button');
/**
 * Extends vjsButton
 */

var FetchButton = /*#__PURE__*/function (_vjsButton) {
  _inheritsLoose(FetchButton, _vjsButton);

  /**
   * constructor
   *
   * @param {*} player videojs
   * @param {*} options param
   */
  function FetchButton(player, options) {
    var _this;

    _this = _vjsButton.call(this, player, options) || this;

    _this.addClass('vjs-fetch-flv-control');

    return _this;
  }
  /**
   * control button click event
   */


  var _proto = FetchButton.prototype;

  _proto.handleClick = function handleClick() {
    this.player().trigger('onFetchFlv');
  };

  return FetchButton;
}(vjsButton);
/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */


var FetchFlv = /*#__PURE__*/function (_Plugin) {
  _inheritsLoose(FetchFlv, _Plugin);

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
  function FetchFlv(player, options) {
    var _this2;

    // the parent class will add player under this.player
    _this2 = _Plugin.call(this, player) || this;
    _this2.options = videojs.mergeOptions(defaults, options);
    _this2.div = null;
    _this2.fetching = false;
    _this2.flash = true;
    _this2.flashCount = 0;
    _this2.data = [];
    _this2.type = 'video/x-flv';
    _this2.button = null;
    _this2.controller = null;
    _this2.filename = null;

    _this2.player.ready(function () {
      _this2.setup();

      _this2.player.addClass('vjs-fetch-flv');
    });

    return _this2;
  }
  /**
   * Create div element to dispaly record status
   *
   * @private
   */


  var _proto2 = FetchFlv.prototype;

  _proto2.createCtx = function createCtx() {
    var video = this.player.el(); // Create div element

    var div = document.createElement('div');
    div.classList.add('vjs-fetch-flv-ctx');
    div.classList.add('vjs-fetch-flv-ctx-hide'); // Setup position

    var _this$options = this.options,
        offsetH = _this$options.offsetH,
        offsetV = _this$options.offsetV;

    switch (this.options.position) {
      case 'top-left':
        div.style.top = offsetV + 'px';
        div.style.left = offsetH + 'px';
        break;

      case 'top-right':
        div.style.top = offsetV + 'px';
        div.style.right = offsetH + 'px';
        break;

      case 'bottom-left':
        div.style.bottom = offsetV + 'px';
        div.style.left = offsetH + 'px';
        break;

      case 'bottom-right':
        div.style.bottom = offsetV + 'px';
        div.style.right = offsetH + 'px';
        break;

      default:
        div.style.top = offsetV + 'px';
        div.style.right = offsetH + 'px';
    }

    this.div = div;
    div.innerHTML = '<span>REC</span> <span class="vjs-icon-placeholder vjs-fetch-flv-icon"></span>';
    var opacity = this.options.opacity;

    if (opacity) {
      div.style.opacity = opacity;
    }

    video.appendChild(div);
  }
  /**
   * Create a control button
   */
  ;

  _proto2.createButton = function createButton() {
    var _this3 = this;

    var player = this.player;
    var btn = player.controlBar.addChild(new FetchButton(player, this.options), {});
    btn.controlText(this.options.controlText);
    player.controlBar.el().insertBefore(btn.el(), player.controlBar.getChild(this.options.beforeElement).el());
    player.on('onFetchFlv', function () {
      _this3.handleClick();
    });
    this.button = btn;
    player.on('timeupdate', function () {
      if (_this3.fetching) {
        _this3.flashCount++;

        if (_this3.flashCount % 3 === 0) {
          _this3.flash = !_this3.flash;

          if (_this3.div) {
            if (_this3.flash) {
              _this3.div.classList.remove('vjs-fetch-flv-ctx-hide');
            } else {
              _this3.div.classList.add('vjs-fetch-flv-ctx-hide');
            }
          }
        }
      }
    });
  }
  /**
   * init element
   */
  ;

  _proto2.setup = function setup() {
    if (this.div === null) {
      this.createCtx();
      this.createButton();
    }
  }
  /**
   * show fetch status
   */
  ;

  _proto2.showFetch = function showFetch() {
    if (this.div) {
      this.div.classList.remove('vjs-fetch-flv-ctx-hide');
    }

    if (this.button) {
      this.button.addClass('vjs-fetch-flv-fetching');
    }
  }
  /**
   * hide fetch status
   */
  ;

  _proto2.hideFetch = function hideFetch() {
    if (this.div) {
      this.div.classList.add('vjs-fetch-flv-ctx-hide');
    }

    if (this.button && this.button.el_) {
      this.button.removeClass('vjs-fetch-flv-fetching');
    }
  }
  /**
   * hide button
   */
  ;

  _proto2.show = function show() {
    if (this.button) {
      this.button.show();
    }
  }
  /**
   * show button
   */
  ;

  _proto2.hide = function hide() {
    if (this.button) {
      this.button.hide();
    }
  }
  /**
   * start fetch
   */
  ;

  _proto2.start = function start() {
    if (!this.options.isLive) {
      // 不是实时文件 直接下载
      var player = this.player;
      window.open(player.currentSrc(), 'Download');
    } else if (!this.fetching) {
      this.fetching = true;
      this.flash = true;
      this.flashCount = 0;
      this.showFetch(); // 下载文件

      this.fetchMedia(); // 触发下载事件

      this.player.trigger('fetchStart');
    }
  }
  /**
   * stop fetch
   *
   * @param {*} isSaveFile Save file when stopped
   */
  ;

  _proto2.stop = function stop(isSaveFile) {
    if (this.fetching) {
      this.hideFetch();

      if (this.controller) {
        this.controller.abort();
      }

      this.fetching = false;

      if (this.data.length > 0 && isSaveFile) {
        var blob = new window.Blob(this.data, {
          type: this.type
        });
        this.blob2File(blob);
      } // 触发下载事件


      this.player.trigger('fetchStop');
    }
  }
  /**
   * save blob to media file
   *
   * @param {Blob} blob media data
   */
  ;

  _proto2.blob2File = function blob2File(blob) {
    if (blob !== null) {
      var url = window.URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = this.filename;
      document.body.appendChild(link);
      link.click(); // 下载完成移除元素

      document.body.removeChild(link); // 释放掉blob对象

      window.URL.revokeObjectURL(url);
    }
  }
  /**
   * url to filename
   *
   * @param {string} url url string
   * @return {string} filename string
   */
  ;

  _proto2.url2Filename = function url2Filename(url) {
    if (url) {
      var vlist = url.split('?');
      return vlist[0].split('\\').pop().split('/').pop();
    }

    return null;
  }
  /**
   * 利用fetch按帧下载数据并合并成blob
   */
  ;

  _proto2.fetchMedia = function fetchMedia() {
    var _this4 = this;

    var that = this;
    var player = this.player;
    var url = player.currentSrc();
    this.filename = this.url2Filename(url);
    this.controller = new window.AbortController();
    var signal = this.controller.signal;
    /* eslint-disable no-undef */

    fetch(url, {
      signal: signal
    }).then(function (res) {
      // console.log(res)
      // 自己读取每一帧
      var reader = res.body.getReader();
      that.type = res.headers.get('Content-Type');
      that.data = [];
      return new Promise(function (resolve) {
        /**
         * 读取所有数据
         */
        function push() {
          reader.read().then(function (_ref) {
            var done = _ref.done,
                value = _ref.value;
            that.data.push(value);

            if (done) {
              // 包装成 blob 对象并返回

              /* eslint-disable no-undef */
              resolve(new Blob(that.data, {
                type: that.type
              }));
            } else {
              push();
            }
          }).catch(function () {// console.log(e)
          });
        }

        push();
      });
    }).then(function (blob) {
      // 成功
      _this4.fetching = false;

      _this4.hideFetch();

      _this4.blob2File(blob);
    }).catch(function () {
      _this4.fetching = false;

      _this4.hideFetch();
    });
  }
  /**
   * 运行期更新isLive状态
   *
   * @param {boolean} value 实时状态
   */
  ;

  _proto2.updateIsLive = function updateIsLive(value) {
    this.options.isLive = value;
  }
  /**
   * control button click event
   */
  ;

  _proto2.handleClick = function handleClick() {
    if (this.options.isLive) {
      // live stream
      if (this.fetching) {
        this.stop(true);
      } else {
        this.start();
      }
    } else {
      this.start();
    }
  };

  return FetchFlv;
}(Plugin); // Define default values for the plugin's `state` object here.


FetchFlv.defaultState = {}; // Include the version number.

FetchFlv.VERSION = version; // Register the plugin with video.js.

videojs.registerPlugin('fetchFlv', FetchFlv);

export { FetchFlv as default };
