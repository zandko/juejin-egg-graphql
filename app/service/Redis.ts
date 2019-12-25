import { Service } from 'egg';

/**
 * Redis Service
 */
export default class Redis extends Service {
  /**
   * 设置
   * @param {string} key
   * @param {object} value
   * @param {date} seconds
   * @memberof RedisService
   */
  public async set(key: string, value: any, seconds: any) {
    const { redis } = this.app;
    value = JSON.stringify(value);
    if (!seconds) await redis.set(key, value);
    else await redis.set(key, value, 'EX', seconds);
  }

  /**
   * 获取
   * @param {string} key
   */
  public async get(key: string) {
    const { ctx, app } = this;
    const { redis } = app;
    const data = await redis.get(key);
    if (!data) return;
    const result = ctx.helper.JSONParse(data);
    return result;
  }

  /**
   * 插入到列表头部
   * @param key
   * @param value
   */
  public async lpush(key: string, value: any) {
    const { redis } = this.app;
    await redis.lpush(key, JSON.stringify(value));
  }

  /**
   * 移出并获取列表的最后一个元素
   * @param key
   * @param timeout 阻塞时间  0 永久
   */
  public async brpop(key: string) {
    const { ctx, app } = this;
    const data: any = await app.redis.brpop(key, '1');
    if (!data) return;
    return ctx.helper.JSONParse(data[1]);
  }

  /**
   * 清空
   */
  public async flushall() {
    const { redis } = this.app;
    redis.flushall();
    return;
  }
}
