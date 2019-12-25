// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAlipay from '../../../app/controller/alipay';
import ExportHome from '../../../app/controller/home';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    alipay: ExportAlipay;
    home: ExportHome;
    user: ExportUser;
  }
}
