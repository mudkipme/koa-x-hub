koa-x-hub
=========

[![NPM version](https://img.shields.io/npm/v/koa-x-hub.svg)](https://npmjs.org/package/koa-x-hub)
[![build status](https://img.shields.io/travis/mudkipme/koa-x-hub.svg)](https://travis-ci.org/mudkipme/koa-x-hub)
[![node version](https://img.shields.io/badge/node.js-%3E=_7.6-green.svg)](https://nodejs.org/en/download/)

X-Hub-Signature Koa Middleware.

## Install

[![NPM](https://nodei.co/npm/koa-x-hub.png?downloads=true)](https://nodei.co/npm/koa-x-hub/)

## Usage

Add the middleware to Koa. It needs to be *after* `bodyParser()`.

```js
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const xHub = require('koa-x-hub');

const app = new Koa();
app.use(bodyParser());
app.use(xHub({algorithm: 'sha1', secret: XHUB_SECRET_HERE}));
```

Where `XHUB_SECRET_HERE` is your platform's (facebook, github, etc) secret.

This will add some special sauce to your `ctx.request` object:

### isXHub ```boolean```

Is the request X-Hub. Allows you to early reject any messages without XHub content.

```js
if (!ctx.request.isXHub) { ctx.throw(403, 'No X-Hub Signature'); }
```

### isXHubValid ```ctx.request.isXHubValid()```

Returns a boolean value. Validates the request body against the X-Hub signature using your secret.

```js
if (!ctx.request.isXhub || !ctx.request.isXHubValid()) { ctx.throw(403, 'Invalid X-Hub Request'); }
```

If it's valid, then the request has not been tampered with and you are safe to process it.

## Options

* **secret**: X-Hub secret that is used to validate the request body against the signed X-HUB signature on the header. **Required.**
* **algorithm**: Encryption algorithm used to generate the signature. Default is `sha1`.

## License

[MIT](LICENSE)

## Acknowledgements

This project is inspired by [express-x-hub](https://github.com/alexcurtis/express-x-hub).