# HyperDeck Emulator ![CI](https://github.com/meyer/hyperdeck-server-connection/workflows/CI/badge.svg) ![Canary](https://github.com/meyer/hyperdeck-server-connection/workflows/Canary/badge.svg)

## Technology highlights

- Typescript
- Yarn
- Jest
- standard-version
- codecov

## Installation

<!-- For usage by library consumers installation is as easy as:
```sh
yarn add hyperdeck-server-connection
``` -->

For library developers installation steps are as following:

```sh
git clone https://github.com/baltedewit/hyperdeck-server-connection
yarn build
```

If you want to make a contribution, feel free to open a PR.

## Usage

```javascript
const { HyperdeckServer } = require('../dist/server');
const myHyperdeck = new Hyperdeck();

const s = new HyperdeckServer();
s.onPlay = async (cmd) => {
  console.log('playing', cmd);
  status.status = 'play';
  s.notifyTransport({
    ...status,
    speed: '100',
    'slot id': '1',
    'clip id': '1',
    'single clip': 'true',
    'video format': '1080i50',
    loop: false,
  });
};
```

## Acknowledgements

- Inspired by [CasparCG Hyperdeck](https://github.com/peschuster/casparcg-hyperdeck) from [peschuster](https://github.com/peschuster)
- Parser and some constants are derived from [hyperdeck-connection](https://github.com/nrkno/tv-automation-hyperdeck-connection)
- The public callback-promise API was inspired by [mos-connection](https://github.com/nrkno/tv-automation-mos-connection)
