import { Service } from 'egg';
import { Op } from 'sequelize';
import * as _ from 'lodash';
import { IQueryBuilderData } from '../types/index';

/**
 * User Service
 */
export default class User extends Service {
  private database: any;
  constructor(ctx: any) {
    super(ctx);
    this.database = ctx.model.Users;
  }

  /**
   * 避免 N + 1 的问题
   * @param {Array|number} ids 唯一主键
   */
  public fetch(ids: any) {
    const { ctx } = this;
    const users = this.database.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      include: {
        model: ctx.model.Oauths,
      },
    }).then((us: { map: (arg0: (u: any) => any) => void; }) => us.map(u => u.toJSON()));
    return users;
  }

  /**
   * 用户列表
   * @param {object} 基础条件
   */
  public async fetchAll(params: IQueryBuilderData) {
    const { ctx } = this;
    const limit = params && params.limit || 10;
    const offset = params && params.offset || 1;
    const orderBy = params && params.orderBy || 'id';
    const orderType = params && params.orderType || 'DESC';

    const result = await this.database.findAll({
      limit,
      offset: limit * (offset - 1),
      order: [
        [ orderBy, orderType ],
      ],
      include: {
        model: ctx.model.Oauths,
      },
    });
    return result.map((v: { toJSON: () => void; }) => v.toJSON());
  }

  /**
   * 用户登录
   * @param {string} phone  手机号
   * @param {string} password 密码
   * @memberof User
   */
  public async fetchByNamePassword(phone: string, password: string) {
    const { ctx } = this;
    const uuid = ctx.helper.uuidv1();
    const user = await this.database.findOne({
      where: {
        phone,
        password,
      },
    });

    if (!user) return null;
    const result = JSON.stringify(user);
    await ctx.service.redis.set(uuid, result, 3600 * 24);
    return uuid;
  }

  /**
   * 用户注册
   * @param {object} data 注册信息
   * @memberof User
   */
  async register(data: IRegisterData) {
    const { ctx } = this;
    const { code, name, phone, password } = data;
    const r_code = await ctx.service.redis.get(phone);
    if (Number(code) === Number(r_code)) {
      return await this.database.create({ name, phone, password });
    }
  }

  /**
   * GitHub 注册
   * @param {object} data 用户信息
   * @memberof User
   */
  public async githubRegister(data: any) {
    const { login: name, node_id: oauth_id, avatar_url: avatar, oauth_type } = data;
    const user = await this.database.create({ name, avatar });

    if (user) {
      const { id } = user;
      const oauth = {
        user_id: id,
        oauth_id,
        oauth_type,
      };
      return await this.ctx.service.oauth.create(oauth);
    }
  }
}

interface IRegisterData {
  code: string;
  name: string;
  phone: string;
  password: string;
}
