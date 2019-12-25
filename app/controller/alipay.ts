import { Controller } from 'egg';

export default class AlipayController extends Controller {
  public async pay() {
    const { ctx } = this;
    const data = {
      body: 'Iphone6 16G',
      subject: 'Iphone6 16G',
      out_trade_no: new Date().valueOf(),
      total_amount: '88888',
      request_from_url: 'http://127.0.0.1:7001/',
      product_code: 'FAST_INSTANT_TRADE_PAY',
    };

    const url: any = await ctx.service.alipay.doPay(data);
    this.ctx.redirect(url);
  }

  public async alipayReturn() {
    const { ctx } = this;
    let str: string = '';
    for (const key in ctx.request.query) {
      str += `${key}=${ctx.request.query[key]}&`;
    }
    ctx.body = str;
  }

  public async alipayNotify() {
    const { ctx } = this;
    const params = ctx.request.body;
    await ctx.service.alipay.alipayNotify(params);
  }
}
