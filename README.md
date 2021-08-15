# videojs-fetch-flv

download http-flv

## Installation

```sh
npm install --save videojs-fetch-flv
```

## Usage

To include videojs-fetch-flv on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-fetch-flv.min.js"></script>
<script>
  var player = videojs('my-video');

  player.fetchFlv();
</script>
```

### Browserify/CommonJS

When using with Browserify, install videojs-fetch-flv via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-fetch-flv');

var player = videojs('my-video');

player.fetchFlv();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-fetch-flv'], function(videojs) {
  var player = videojs('my-video');

  player.fetchFlv();
});
```

## License

MIT. Copyright (c) lin557


[videojs]: http://videojs.com/
