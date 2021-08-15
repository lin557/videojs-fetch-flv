# videojs-fetch-flv

A videojs plugin to download http-flv stream

![image](docs/images/step0.png)

## Installation

```sh
npm install --save videojs-fetch-flv
```

Other

```sh
npm install --save video.js videojs-flvjs flv.js

# or 

npm install --save video.js videojs-flvjs-es6 flv.js
```

## Usage

To include videojs-fetch-flv on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/flv.min.js"></script>
<script src="//path/to/videojs-flvjs.min.js"></script>
<script src="//path/to/videojs-fetch-flv.min.js"></script>
<script>
  var player = videojs('my-video')
  player.fetchFlv()
</script>
```

or

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/flv.min.js"></script>
<script src="//path/to/videojs-flvjs.min.js"></script>
<script src="//path/to/videojs-fetch-flv.min.js"></script>
<script>
  var player = videojs('my-video')
  var options = {
    isLive: false,
    ...
  }
  player.fetchFlv(options)
</script>
```

or 

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/flv.min.js"></script>
<script src="//path/to/videojs-flvjs.min.js"></script>
<script src="//path/to/videojs-fetch-flv.min.js"></script>
<script>
  var options = {
        plugins: {
          fetchFlv: {
            isLive: false,
            ...
          }
        }
      }
  var player = videojs('my-video', options)
</script>
```

### ES Modules

Install videojs-fetch-flv via npm and `import` the plugin as you would any other module.
You will also need to import the stylesheet in some way.

```js
import videojs from 'video.js'
import 'videojs-fetch-flv'
import 'videojs-fetch-flv/dist/videojs-fetch-flv.css'

const player = videojs('my-video')
player.fetchFlv()
// player.fetchFlv({
//   isLive: true
// })
```

or

```js
import videojs from 'video.js'
import 'videojs-flvjs-es6'
import 'videojs-fetch-flv'
import 'videojs-fetch-flv/dist/videojs-fetch-flv.css'

const options = {
        plugins: {
          fetchFlv: {
            isLive: false,
            ...
          }
        }
      }
const player = videojs('my-video', options)
```


### Browserify/CommonJS

When using with Browserify, install videojs-fetch-flv via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js')

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-fetch-flv')

var player = videojs('my-video')
player.fetchFlv()
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-fetch-flv'], function(videojs) {
  var player = videojs('my-video')
  player.fetchFlv()
})
```

## License

MIT. Copyright (c) lin557


[videojs]: http://videojs.com/
