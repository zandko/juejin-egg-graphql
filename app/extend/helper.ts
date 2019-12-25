import { Context } from 'egg';
import * as uuidv1 from 'uuid/v1';
import * as _ from 'lodash';
import * as dayjs from 'dayjs';

export default {
  uuidv1,
  _,
  dayjs,

  /**
   * socket.io 数据格式
   * @param action
   * @param payload
   * @param metadata
   */
  parseMsg(action: string, payload = {}, metadata = {}) {
    const meta = Object.assign({}, {
      timestamp: Date.now(),
    }, metadata);

    return {
      meta,
      data: {
        action,
        payload,
      },
    };
  },
  /**
   *  短信验证码
   */
  smsCode() {
    return Math.random().toFixed(6).slice(-6);
  },
  /**
   * 字符串转对象
   * @param {string} str  JSON字符串
   * @param {object} defaultRusult 默认值
   */
  JSONParse(str: string, defaultRusult: any = {}) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return defaultRusult;
    }
  },

  /**
   * 成功
   * @param {context} ctx 上下文
   * @param {object} data 数据
   * @param {number} code 状态码
   */
  success(ctx: Context, data: any, code?: number) {
    const timestamp = (0 | Date.now() / 1000).toString();
    ctx.body = {
      timestamp,
      code,
      data,
    };
    ctx.status = code || 200;
  },

  /**
   * 失败
   * @param {context} ctx     上下文
   * @param {number} code     状态码
   * @param {string} message  错误信息
   */
  fail(ctx: Context, code: number, message: any) {
    const timestamp = (0 | Date.now() / 1000).toString();
    ctx.body = {
      timestamp,
      code,
      message,
    };
    ctx.status = code;
  },

  /**
   * 找不到
   * @param {context} ctx 上下文
   * @param {string} msg  错误信息
   */
  notFound(ctx: Context, msg?: string) {
    msg = msg || 'not found';
    ctx.throw(ctx.NOT_FOUND_CODE, msg);
  },
};
