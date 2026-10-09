import {Client, expect} from '@loopback/testlab';
import {BookServiceApplication} from '../..';
import {setupApplication} from './test-helper';
import { before, after, describe, it } from 'node:test';

describe('PingController', () => {
  let app: BookServiceApplication;
  let client: Client;

  before(async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /ping', async () => {
    const res = await client.get('/ping?msg=world').expect(200);
    expect(res.body).to.containEql({greeting: 'Hello from LoopBack'});
  });
});
