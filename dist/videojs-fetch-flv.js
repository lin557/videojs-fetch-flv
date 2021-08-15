/*! @name videojs-fetch-flv @version 1.0.0 @license MIT */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('video.js')) :
	typeof define === 'function' && define.amd ? define(['video.js'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.videojsFetchFlv = factory(global.videojs));
}(this, (function (videojs) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var videojs__default = /*#__PURE__*/_interopDefaultLegacy(videojs);

	function createCommonjsModule(fn, basedir, module) {
		return module = {
		  path: basedir,
		  exports: {},
		  require: function (path, base) {
	      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
	    }
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var setPrototypeOf = createCommonjsModule(function (module) {
	  function _setPrototypeOf(o, p) {
	    module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	      o.__proto__ = p;
	      return o;
	    };

	    module.exports["default"] = module.exports, module.exports.__esModule = true;
	    return _setPrototypeOf(o, p);
	  }

	  module.exports = _setPrototypeOf;
	  module.exports["default"] = module.exports, module.exports.__esModule = true;
	});

	var inheritsLoose = createCommonjsModule(function (module) {
	  function _inheritsLoose(subClass, superClass) {
	    subClass.prototype = Object.create(superClass.prototype);
	    subClass.prototype.constructor = subClass;
	    setPrototypeOf(subClass, superClass);
	  }

	  module.exports = _inheritsLoose;
	  module.exports["default"] = module.exports, module.exports.__esModule = true;
	});

	var version = "1.0.0";

	var Plugin = videojs__default['default'].getPlugin('plugin'); // Default options for the plugin.

	var defaults = {
	  beforeElement: 'fullscreenToggle',
	  textControl: 'Download',
	  // 默认实时流
	  isLive: true,
	  position: 'top-right',
	  offsetH: 0,
	  offsetV: 0,
	  padding: 10,
	  opacity: 0.9
	};
	var vjsButton = videojs__default['default'].getComponent('Button');

	var fetchButton = /*#__PURE__*/function (_vjsButton) {
	  inheritsLoose(fetchButton, _vjsButton);

	  function fetchButton(player, options) {
	    var _this;

	    _this = _vjsButton.call(this, player, options) || this;

	    _this.addClass('vjs-fetch-flv-control');

	    return _this;
	  }

	  var _proto = fetchButton.prototype;

	  _proto.handleClick = function handleClick() {
	    this.player().trigger('onFetchFlv');
	  };

	  return fetchButton;
	}(vjsButton);
	/**
	 * An advanced Video.js plugin. For more information on the API
	 *
	 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
	 */


	var FetchFlv = /*#__PURE__*/function (_Plugin) {
	  inheritsLoose(FetchFlv, _Plugin);

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
	    _this2.options = videojs__default['default'].mergeOptions(defaults, options);
	    _this2.div = null;
	    _this2.fetching = false;
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
	   * @private
	   */


	  var _proto2 = FetchFlv.prototype;

	  _proto2.createCtx = function createCtx() {
	    var video = this.player.el(); // Create div element

	    var div = document.createElement('div');
	    div.classList.add('vjs-fetch-flv-ctx');
	    div.classList.add('vjs-fetch-flv-ctx-hide');
	    div.style.padding = this.options.padding + 'px'; // Setup position

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
	  };

	  _proto2.createButton = function createButton() {
	    var _this3 = this;

	    var player = this.player;
	    var btn = player.controlBar.addChild(new fetchButton(player, this.options), {});
	    btn.controlText(this.options.textControl);
	    player.controlBar.el().insertBefore(btn.el(), player.controlBar.getChild(this.options.beforeElement).el());
	    player.on('onFetchFlv', function () {
	      _this3.handleClick();
	    });
	    this.button = btn;
	  };

	  _proto2.setup = function setup() {
	    if (this.div != null) {
	      return;
	    }

	    this.createCtx();
	    this.createButton();
	  };

	  _proto2.show = function show() {
	    if (this.div) {
	      this.div.classList.remove('vjs-fetch-flv-ctx-hide');
	    }

	    if (this.button) {
	      this.button.addClass('vjs-fetch-flv-fetching');
	    }
	  };

	  _proto2.hide = function hide() {
	    if (this.div) {
	      this.div.classList.add('vjs-fetch-flv-ctx-hide');
	    }

	    if (this.button) {
	      this.button.removeClass('vjs-fetch-flv-fetching');
	    }
	  }
	  /**
	   * 将数据转成文件
	   */
	  ;

	  _proto2.blob2File = function blob2File(blob) {
	    if (blob == null) {
	      return;
	    }

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
	  /**
	   * 利用fetch按帧下载数据并合并成blob
	   */
	  ;

	  _proto2.fetchMedia = function fetchMedia() {
	    var _this4 = this;

	    var that = this;
	    var player = this.player;
	    this.fetching = true;
	    var url = player.currentSrc();
	    this.filename = url.split('\\').pop().split('/').pop();
	    this.controller = new AbortController();
	    var signal = this.controller.signal;
	    fetch(url, {
	      signal: signal
	    }).then(function (res) {
	      // console.log(res)
	      // 自己读取每一帧
	      var reader = res.body.getReader();
	      that.type = res.headers.get('Content-Type');
	      that.data = [];
	      return new Promise(function (resolve) {
	        // 读取所有数据
	        function push() {
	          reader.read().then(function (_ref) {
	            var done = _ref.done,
	                value = _ref.value;
	            that.data.push(value);

	            if (done) {
	              // 包装成 blob 对象并返回
	              resolve(new Blob(that.data, {
	                type: that.type
	              }));
	            } else {
	              push();
	            }
	          });
	        }

	        push();
	      });
	    }).then(function (blob) {
	      // 成功
	      _this4.fetching = false;

	      _this4.hide();

	      _this4.blob2File(blob);
	    }).catch(function (error) {
	      _this4.fetching = false;

	      _this4.hide();

	      console.log(error);
	    });
	  };

	  _proto2.handleClick = function handleClick() {
	    if (!this.options.isLive) {
	      // 不是实时文件 直接下载
	      var player = this.player;
	      window.open(player.currentSrc(), 'Download');
	      return;
	    }

	    if (this.fetching) {
	      this.fetching = false;

	      if (this.data.length > 0) {
	        var blob = new Blob(this.data, {
	          type: this.type
	        });
	        this.blob2File(blob);
	      }

	      this.hide(); // 中止fetch

	      this.controller.abort(); //player.trigger('finishFetch')

	      return;
	    } // window.open(this.options_.downloadURL || p.currentSrc(), 'Download');
	    //player.trigger('startFetch')
	    // console.log(this)


	    this.show(); // 下载文件

	    this.fetchMedia();
	  };

	  return FetchFlv;
	}(Plugin); // Define default values for the plugin's `state` object here.


	FetchFlv.defaultState = {}; // Include the version number.

	FetchFlv.VERSION = version; // Register the plugin with video.js.

	videojs__default['default'].registerPlugin('fetchFlv', FetchFlv);

	return FetchFlv;

})));
