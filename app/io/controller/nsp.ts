import { Controller } from 'egg';

export default class NspController extends Controller {
  async exchange() {
    const { ctx, app } = this;
    const nsp = app.io.of('/');
    const message = ctx.args[0] || {};
    const socket = ctx.socket;
    const client = socket.id;

    try {
      const { target, payload } = message;
      if (!target) return;
      const msg = ctx.helper.parseMsg('exchange', payload, { client, target });
      if (target === '群聊') {
        socket.broadcast.emit(target, msg);
      } else {
        // tslint:disable-next-line: no-string-literal
        nsp['emit'](target, msg);
        // socket.emit(target, msg);
      }
    } catch (error) {
      app.logger.error(error);
    }
  }
}
