/**!
 * koa-x-hub - index.js
 * Copyright 2018 Mudkip.Me
 * MIT Licensed
 */

'use strict';

const crypto = require('crypto');

/**
 * X-Hub-Signature Koa Middleware
 * @param {Object} [opts] 
 * @param {string} [opts.algorithm="sha1"]
 * @param {string} [opts.secret]
 */

module.exports = function (opts) {    
  const algorithm = opts.algorithm || 'sha1';
  const secret = opts.secret;

  function isValid(raw, xhub) {
    if (!secret) {
      throw new Error('No Secret Found');
    }
    if (!raw) {
      return false;
    }
    const hmac = crypto.createHmac(algorithm, secret);
    hmac.update(raw, 'utf-8');
    const expected = `${algorithm}=${hmac.digest('hex')}`;
    return expected === xhub;
  }

  return async function XHub(ctx, next) {
    ctx.request.isXHub = false;

    const xhub = ctx.request.get('X-Hub-Signature');

    if (!xhub) {
      return await next();
    }

    ctx.request.isXHub = true;
    ctx.request.isXHubValid = () => isValid(ctx.request.rawBody, xhub);
    await next();
  }
}