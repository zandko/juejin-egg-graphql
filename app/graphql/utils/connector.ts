import { Context } from 'egg';

export default class UtilsConnector {
  ctx: Context;
  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  /**
   * 发送短信
   * @param {string} PhoneNumbers 手机号
   * @memberof UtilsConnector
   */
  public async sendSms(PhoneNumbers: string) {
    const { ctx } = this;
    return await ctx.service.utils.sendSms(PhoneNumbers);
  }

  /**
   * 获取GitHub 登录地址
   */
  public githubURL() {
    const { login_url, client_id, scope } = this.ctx.app.config.github;
    return `${login_url}?client_id=${client_id}&scope=${scope}&state=${Date.now()}`;
  }

  /**
   * @summary Qiniu上传
   * @description
   * @router post /uploader
   * @request formData file file
   */
  public async singleUpload(file: any) {
    const { ctx } = this;
    // const { createReadStream } = file
    // console.log(file.createReadStream)
    // console.log(createReadStream);
    // await ctx.service.utils.uploader(file.stream, 'jpg');

    return await ctx.service.utils.processUpload(file);
    // return 'ss'
  }

  public async sendMail(data: IMailData) {
    const { ctx } = this;
    return await ctx.service.utils.sendMail(data);
  }
}

interface IMailData {
  to: string;
  subject: string;
  html: string;
}
