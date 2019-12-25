import { Context, Application } from 'egg';

export default function AuthMiddleware(_options: any, _app: Application) {
  return async (ctx: Context, next: any) => {
    if (ctx.app.config.graphql.graphiql) {
      await next();
      return;
    }
    const whitelist = [ 'login', 'register', 'sendSms', 'githubURL' ];
    const body = ctx.request.body;
    if (!whitelist.includes(body.operationName)) {
      const uuid = ctx.request.header.authorization;
      const token = ctx.helper.JSONParse(await ctx.service.redis.get(uuid)) || {};
      const { name } = token;
      if (name) {
        await next();
      } else {
        ctx.body = { message: '访问令牌鉴权无效，请重新登陆获取！' };
        ctx.status = 401;
      }
    } else {
      await next();
    }
  };
}
