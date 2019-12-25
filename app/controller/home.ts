import { Controller } from 'egg';

export default class HomeController extends Controller {
  public async index() {
    // const { config } = this.app;
    // const data = {
    //   client_id: config.github.client_id,
    //   scope: config.github.scope,
    // };
    // await this.ctx.render('login.html', data);
    await this.ctx.render('socket.html');
  }
}
