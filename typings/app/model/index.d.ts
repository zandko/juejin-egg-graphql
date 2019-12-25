// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportSequelizeMeta = require('../../../app/model/SequelizeMeta');
import ExportOauths = require('../../../app/model/oauths');
import ExportUsers = require('../../../app/model/users');

declare module 'egg' {
  interface IModel {
    SequelizeMeta: ReturnType<typeof ExportSequelizeMeta>;
    Oauths: ReturnType<typeof ExportOauths>;
    Users: ReturnType<typeof ExportUsers>;
  }
}
