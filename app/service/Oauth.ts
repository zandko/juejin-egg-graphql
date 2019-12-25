import { Service } from 'egg';
import { IOauthData } from '../types/index';

/**
 * Oauth Service
 */
export default class Oauth extends Service {
  private database: any;
  constructor(ctx: any) {
    super(ctx);
    this.database = ctx.model.Oauths;
  }

  /**
   * 添加第三方信息
   * @param {IOauthData} data 第三方信息
   * @memberof Oauth
   */
  public async create(data: IOauthData) {
    const { user_id, oauth_id, oauth_type } = data;
    return await this.database.create({
      user_id, oauth_id, oauth_type,
    });
  }

  /**
   * 查询第三方信息
   * @param {number} oauth_id 第三方唯一标识
   */
  public async findById(oauth_id: string) {
    return await this.database.findOne({
      where: {
        oauth_id,
      },
    });
  }
}
