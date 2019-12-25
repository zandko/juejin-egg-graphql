const PREFIX = 'room';

import { Context, Application } from 'egg';

export default function AuthMiddleware(_options: any, _app: Application) {
  return async (ctx: Context, next: any) => {
    const { app, socket, logger, helper } = ctx;
    const id = socket.id;
    const nsp = app.io.of('/');
    const query = socket.handshake.query;

    const { room } = query;
    const rooms = [ room ];

    const tick = (id: any, msg: {} | undefined) => {
      socket.emit(id, helper.parseMsg('deny', msg));
      // tslint:disable-next-line: no-string-literal
      nsp['adapter'].remoteDisconnect(id, true, (err: any) => {
        logger.error(err);
      });
    };

    const hasRoom = await app.redis.get(`${PREFIX}:${room}`);

    if (!hasRoom) {
      tick(id, {
        type: '已删除',
        message: '删除，房间已删除.',
      });
      return;
    }

    socket.join(room);

    // tslint:disable-next-line: no-string-literal
    nsp['adapter'].clients(rooms, (_err: any, clients: any) => {
      // tslint:disable-next-line: no-string-literal
      nsp['to'](room).emit('online', {
        clients,
        action: '加入',
        target: '参加者',
        message: `用户(${id})已加入.`,
      });
    });

    await next();

    // tslint:disable-next-line: no-string-literal
    nsp['adapter'].clients(rooms, (_err: any, clients: any) => {
      // tslint:disable-next-line: no-string-literal
      nsp['to'](room).emit('online', {
        clients,
        action: '离开',
        target: '参加者',
        message: `用户(${id})已离开.`,
      });
    });
  };
}
