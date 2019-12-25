import { Application } from 'egg';

export default (app: Application) => {
  const { router, controller, io } = app;

  router.get('/', controller.home.index);

  // 支付
  router.get('/alipay/pay', controller.alipay.pay);
  // 支付成功回调
  router.get('/alipay/alipayReturn', controller.alipay.alipayReturn);
  // 支付成功异步通知
  router.post('/alipay/alipayNotify', controller.alipay.alipayNotify);

  // 第三方登录回调
  router.get('/github/callback', controller.user.githubLogin);

  // tslint:disable-next-line: no-string-literal
  io.of('/').route('exchange', io.controller[ 'nsp' ].exchange);
};
