import { Controller } from 'egg';

export default class UserController extends Controller {
  /**
   * GitHub 登录
   * @memberof UserController
   */
  async githubLogin() {
    const { ctx, app } = this;
    const { client_id, client_secret } = app.config.github;
    try {
      const code = ctx.query.code;
      const tokenResult = await ctx.curl('https://github.com/login/oauth/access_token', {
        method: 'POST',
        contentType: 'json',
        data: {
          client_id,
          client_secret,
          code,
        },
        dataType: 'json',
        timeout: 8000,
      });
      if (tokenResult.data.error || tokenResult.status !== 200) {
        return await this.ctx.render('transit.html', { uuid: tokenResult.data.error });
      }
      const { access_token } = tokenResult.data;
      const userResult = await ctx.curl(`https://api.github.com/user?access_token=${access_token}`, {
        dataType: 'json',
        timeout: 8000,
      });
      if (userResult.data.error || userResult.status !== 200) {
        return await this.ctx.render('transit.html', { uuid: userResult.data.error });
      }
      const { login, node_id } = userResult.data;
      if (!login || !node_id) {
        return await this.ctx.render('transit.html', { uuid: '权限验证失败, 请重试' });
      } else {
        const uuid = ctx.helper.uuidv1();
        const oauth = await ctx.service.oauth.findById(node_id);
        if (!oauth) {
          userResult.data.oauth_type = 'GtiHub';
          const user = await ctx.service.user.githubRegister(userResult.data);
          const userInfo = JSON.stringify(user);
          await ctx.service.redis.set(uuid, userInfo, 3600 * 24);
        } else await ctx.service.redis.set(uuid, oauth, 3600 * 24);
        await this.ctx.render('transit.html', { uuid });
      }
    } catch (err) {
      if (err.toString().indexOf('timeout') > -1) {
        return await this.ctx.render('transit.html', { uuid: '接口请求超时,请重试！' });
      }
      return await this.ctx.render('transit.html', { uuid: err });
    }
  }

  async validationCode() {
    const { ctx, app } = this;
    const { client_id, client_secret } = app.config.github;

    const code = ctx.query.code;
    const tokenResult = await ctx.curl('https://github.com/login/oauth/access_token', {
      method: 'POST',
      contentType: 'json',
      data: {
        client_id,
        client_secret,
        code,
      },
      dataType: 'json',
      timeout: 8000,
    });
    if (tokenResult.data.error || tokenResult.status !== 200) {
      return await this.ctx.render('transit.html', { uuid: tokenResult.data.error });
    }
  }
}
