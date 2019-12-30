import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import * as fs from 'fs';
import * as path from 'path';

const read = (filename: string) => {
  return fs.readFileSync(path.resolve(__dirname, filename), 'ascii');
};

export default (appInfo: EggAppInfo) => {
  const config = {
    env: 'prod', // 推荐云函数的 egg 运行环境变量修改为 prod
    rundir: '/tmp',
    logger: {
      dir: '/tmp',
    },
  } as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1575514608445_7750';

  config.oauth = {
    match: '/graphql',
  };

  // add your config here
  config.middleware = [ 'error', 'auth', 'graphql' ];

  // graphql
  config.graphql = {
    router: '/graphql',
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
    // 是否加载开发者工具 graphiql, 默认开启。路由同 router 字段。使用浏览器打开该可见。
    graphiql: true,
    // 是否添加默认的 `Query`、`Mutation` 以及 `Subscription` 定义，默认关闭
    // 开启后可通过 `extend` 的方式将 `Query`、`Mutation` 以及 `Subscription` 定义到各自的文件夹中
    defaultTypeDefsEnabled: false,
    apolloServerOptions: {
      tracing: true, // when set to true, collect and expose trace data in the Apollo Tracing format
      debug: true, // a boolean that will print additional debug logging if execution errors occur
      formatError: (error: any) => {
        return new Error(error.message);
      },
      formatResponse(data: any, _all: any) {
        delete data.extensions; // 当加上 tracing: true 返回到前端的会有extensions对象的值 对前端来说这数据没有用 所有可以删除
        return data;
      },
    },
  };

  config.sequelize = {
    dialect: 'mysql',
    host: '47.100.194.4',
    port: 3306,
    database: 'lovelp',
    username: 'root',
    password: 'root',
    timezone: '+08:00',
    define: {
      freezeTableName: false,
      underscored: true,
      timestamps: false,
    },
  };

  config.redis = {
    client: {
      port: 6379,          // Redis port
      host: '47.100.194.4',   // Redis host
      password: '123456',
      db: 0,
    },
  };

  config.io = {
    init: { }, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: [ 'auth' ],
        packetMiddleware: [],
      },
      '/example': {
        connectionMiddleware: [ 'auth' ],
        packetMiddleware: [],
      },
    },
    redis: {
      host: '47.100.194.4',
      port: 6379,
      auth_pass: '123456',
      db: 0,
    },
  };

  // cors
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  // csrf
  config.security = {
    csrf: {
      ignore: () => true,
    },
  };

  config.bodyParser = {
    enable: true,
    jsonLimit: '10mb',
  };

  config.github = {
    login_url: 'https://github.com/login/oauth/authorize',
    // github Client ID
    client_id: '52a36545d74a3dbb7e82',
    // github Client Secret
    client_secret: '0631d5af073d397f3223ea31c8f7ed3f361753f4',
    // 此参数表示只获取用户信息
    scope: [ 'user' ],
  };

  config.aliyun = {
    accessKeyId: 'LTAIwPm6KYRHsSZZ',
    accessKeySecret: 'Cx5ct1FNRb6kxjaIIUQrr6SYbJVkMJ',
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25',
    sendSms: {
      RegionId: 'cn-hangzhou',
      SignName: 'sns服务',
      TemplateCode: 'SMS_135033928',
    },
  };

  config.qiniu = {
    AccessKey: 'FgXzSBikhWJdaPbOLF3A8iUmMS6vkVzAYV3uY81v',
    SecretKey: 'vb3rgr4AxEQXYnoEQBLhsjoBuKhJwMlb_TYeTLBx',
    Bucket: 'egg-lottery',
    Domain: 'q1lzhixqp.bkt.clouddn.com',
  };

  config.alipay = {
    appId: '2016091700531963',
    privateKey: read('./keys/app_priv_key.pem'),
    alipayPublicKey : read('./keys/alipay_public_key.pem'),
    gateway: 'https://openapi.alipaydev.com/gateway.do',
    return_url: 'http://127.0.0.1:7001/alipay/alipayReturn',
    notify_url: 'http://requestbin.net/r/13ip1wr1',
  };

  config.mail = {
    host: 'smtp.163.com',
    port: 465,
    auth: {
      user: 'push_over@163.com',
      pass: 'guodamiao0',
    },
  };

  config.view = {
    mapping: {
      '.html': 'ejs',
    },
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
