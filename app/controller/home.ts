import { Controller } from 'egg';
import * as JWT from 'jsonwebtoken';

export default class HomeController extends Controller {
  public async index() {
    // const { config } = this.app;
    // const data = {
    //   client_id: config.github.client_id,
    //   scope: config.github.scope,
    // };
    // await this.ctx.render('login.html', data);
    const token = JWT.sign({
      id: 1,
      username: 'priase',
    }, 'private.key', { expiresIn: 60 });

    // console.log(token)

    const verify = JWT.verify(token, 'private.key');
    this.ctx.body = verify;
    // decode = JWT.verify(token, options.secret);
    // if (!decode || !decode.userName) {
    //   ctx.throw(401, '没有权限，请登录');
    // }
    // if (Date.now() - decode.expire > 0) {
    //   ctx.throw(401, 'Token已过期');
    // }
    // await this.ctx.render('socket.html');
  }
}
