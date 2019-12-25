import { Service, Context } from 'egg';
import AlipaySdk from 'alipay-sdk';
import AlipayFormData from 'alipay-sdk/lib/form';
import { IApipayData } from '../types/index';

/**
 * Alipay Service
 */
export default class Alipays extends Service {
  private alipaySdk: any;
  constructor(ctx: Context) {
    super(ctx);
    const { appId, privateKey, alipayPublicKey, gateway } = ctx.app.config.alipay;
    this.alipaySdk = new AlipaySdk({
      privateKey,
      alipayPublicKey,
      appId,
      gateway,
    });
  }

  public async doPay(data: IApipayData) {
    const { ctx, alipaySdk } = this;
    const { return_url, notify_url } = ctx.app.config.alipay;

    const data1 = {
      product_code: 'FAST_INSTANT_TRADE_PAY', // 销售产品码 注：目前仅支持FAST_INSTANT_TRADE_PAY
      out_trade_no: new Date().valueOf(), // 商户订单号
    };

    try {
      const formData = new AlipayFormData();
      formData.setMethod('get');     // 请求方式
      formData.addField('notify_url', notify_url);  // 支付完成后，支付宝主动向我们的服务器发送回调的地址
      formData.addField('return_url', return_url);  // 支付完成后，当前页面跳转的地址
      formData.addField('biz_content', { ...data, ...data1 });   // 请求参数的集合，最大长度不限，除公共参数外所有请求参数都必须放在这个参数中传递
      return await alipaySdk.exec('alipay.trade.page.pay', {}, {
        formData,
        validateSign: true,
      });
    } catch (error) {
      throw error;
    }
  }

  // 验证异步通知的数据是否正确
  public async alipayNotify(params: any) {
    const { ctx } = this;

    if (params.trade_status === 'TRADE_SUCCESS') {
      await ctx.service.redis.lpush('payInfo', params);
    }
  }

  public async paymentRedisPubSub() {
    // const { ctx } = this;
    // let num = 0;
    // // tslint:disable-next-line: no-constant-condition
    // while (true) {
    //   const result = await ctx.service.redis.brpop('payInfo');
    //   num++;
    //   // 处理各种事宜
    //   console.log(num, '==============', result);
    // }
  }
}
