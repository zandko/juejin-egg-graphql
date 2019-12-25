// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAlipay from '../../../app/service/Alipay';
import ExportOauth from '../../../app/service/Oauth';
import ExportRedis from '../../../app/service/Redis';
import ExportTest from '../../../app/service/Test';
import ExportUser from '../../../app/service/User';
import ExportUtils from '../../../app/service/Utils';

declare module 'egg' {
  interface IService {
    alipay: ExportAlipay;
    oauth: ExportOauth;
    redis: ExportRedis;
    test: ExportTest;
    user: ExportUser;
    utils: ExportUtils;
  }
}
