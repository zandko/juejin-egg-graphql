import { Context } from 'egg';
import { IApipayData } from '../../types/index';

export default class AlipayConnector {
  ctx: Context;
  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  public async pay(data: IApipayData) {
    const { ctx } = this;
    return await ctx.service.alipay.doPay(data);
  }
}
