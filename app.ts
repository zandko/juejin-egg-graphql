import { Application } from 'egg';

export default class AppBootHook {
  app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  async didReady() {
    const ctx = await this.app.createAnonymousContext();
    await ctx.service.alipay.paymentRedisPubSub();
  }
}
