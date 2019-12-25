import { Service } from 'egg';
import * as Core from '@alicloud/pop-core';
import * as qiniu from 'qiniu';
import * as fs from 'fs';
import { join } from 'path';
import * as nodemailer from 'nodemailer';

/**
 * Utils Service
 */
export default class Utils extends Service {
  private uploadDir = 'app/public/uploads';  // 上传目录
  /**
   * 发送短信
   * @param {string} PhoneNumbers 手机号
   * @memberof Utils
   */
  public sendSms(PhoneNumbers: string) {
    const { ctx, app } = this;
    const { accessKeyId, accessKeySecret, endpoint, apiVersion, sendSms } = app.config.aliyun;
    const { RegionId, SignName, TemplateCode } = sendSms;

    const client = new Core({
      accessKeyId,
      accessKeySecret,
      endpoint,
      apiVersion,
    });

    const sendCode = ctx.helper.smsCode();

    const params = {
      RegionId,
      PhoneNumbers,
      SignName,
      TemplateCode,
      TemplateParam: JSON.stringify({ code: sendCode }),
    };

    const requestOption = {
      method: 'POST',
    };

    return new Promise(async (resolve, _reject) => {
      await client.request('SendSms', params, requestOption).then(async (result: any) => {
        await ctx.service.redis.set(PhoneNumbers, sendCode, 60);
        return resolve(result);
      }).catch((ex: any) => {
        resolve(ex.data);
      });
    });
  }

  /**
   * 上传图片
   * @param file 流
   */
  public async processUpload(file: any) {
    const { _ } = this.ctx.helper;
    const { stream, mimetype, encoding } = file;
    const suffix = _.split(mimetype, '/', 2)[1];
    const { path } = await this.storeUpload(stream, suffix);
    const result: any = await this.uploader(path, suffix);
    const { key } = result;
    return {
      filename: key,
      mimetype,
      encoding,
    };
  }

  /**
   * 保存图片
   * @param stream   流
   * @param filename 名称
   */
  private async storeUpload(stream: any, suffix: string) {
    const { ctx, uploadDir } = this;
    const { dayjs, uuidv1 } = ctx.helper;
    const id = uuidv1();
    const dirName = dayjs(Date.now()).format('YYYYMMDD');
    const filename = `${id}.${suffix}`;
    if (!fs.existsSync(join(uploadDir, dirName))) fs.mkdirSync(join(uploadDir, dirName));
    const path = join(uploadDir, dirName, filename);

    return new Promise<{ id: string, path: string }>((resolve, reject) =>
      stream.pipe(fs.createWriteStream(path))
        .on('finish', () => resolve({ id, path }))
        .on('error', reject),
    );
  }

  /**
   * 获取七牛云token
   */
  private getToken() {
    const { app } = this;
    const { AccessKey: accessKey, SecretKey: secretKey, Bucket } = app.config.qiniu;
    const putPolicy = new qiniu.rs.PutPolicy({ scope: Bucket });
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const uploadToken = putPolicy.uploadToken(mac);

    return uploadToken;
  }

  /**
   * 上传图片至七牛
   * @param {string} localFile  图片位置
   * @param {string} suffix     后缀
   */
  public uploader(localFile: string, suffix: string) {
    const { ctx, app } = this;
    const { Domain } = app.config.qiniu;
    const config: any = new qiniu.conf.Config();
    config.zone = qiniu.zone.Zone_z0;
    const formUploader = new qiniu.form_up.FormUploader(config);
    const token = this.getToken();
    const putExtra = new qiniu.form_up.PutExtra();
    const key = ctx.helper.uuidv1() + '.' + suffix;
    return new Promise(resolve => {
      formUploader.putFile(token, key, localFile, putExtra, (respErr: any, respBody: any, respInfo: any) => {
        if (respErr) {
          throw respErr;
        }
        if (respInfo.statusCode === 200) {
          const { hash, key } = respBody;
          const result = {
            hash,
            key: `${Domain}/${key}`,
          };
          resolve(result);
        }
      });
    });
  }

  /**
   * 发送邮件
   * @param data 参数
   */
  public async sendMail(data: IMailData) {
    const { to, subject, html } = data;
    const { host, port, auth } = this.app.config.mail;
    // 创建传输器对象
    const transporter = nodemailer.createTransport({ host, port, auth });

    try {
      // 使用定义的传输对象发送邮件
      return await transporter.sendMail({
        from: auth.user, // 发件人地址
        to, // 接收者名单
        subject, // 主题
        html, // html 正文
      });
    } catch (error) {
      throw error;
    }
  }
}

interface IMailData {
  to: string;
  subject: string;
  html: string;
}
