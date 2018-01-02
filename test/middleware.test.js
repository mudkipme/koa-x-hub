'use strict';

const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const request = require('supertest');
const xHub = require('../');

const app = new Koa();
app.use(bodyparser());
app.use(xHub({secret: 'my_little_secret'}));
app.use(async (ctx, next) => {
  ctx.body = {isXHub: ctx.request.isXHub, isXHubValid: ctx.request.isXHubValid && ctx.request.isXHubValid()};
});
const server = app.callback();

describe('xhub.middleware', () => {
  test('should set isXHub to false when the xhub header is not in the request', async () => {
    const response = await request(server).post('/').send(null);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({isXHub: false});
  });

  test('should set isXHub to true when the request is x-hub', async () => {
    const response = await request(server).post('/')
      .set('X-Hub-Signature', 'sha1=c1a072c0aca15c6bd2f5bfae288ff8420e74aa5e');
    expect(response.status).toEqual(200);
    expect(response.body.isXHub).toEqual(true);
  });

  test('should set isXHubValid to true when the request signature is valid', async () => {
    const response = await request(server).post('/')
      .set('X-Hub-Signature', 'sha1=c1a072c0aca15c6bd2f5bfae288ff8420e74aa5e')
      .send('{ "id": "realtime_update" }');
    expect(response.status).toEqual(200);
    expect(response.body.isXHubValid).toEqual(true);
  });

  test('should set isXHubValid to false when the request signature is invalid', async () => {
    const response = await request(server).post('/')
      .set('X-Hub-Signature', 'sha1=invalid_req_signature')
      .send('{ "id": "realtime_update" }');
    expect(response.status).toEqual(200);
    expect(response.body.isXHubValid).toEqual(false);
  })
});