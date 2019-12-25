import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },
  graphql: {
    enable: true,
    package: '@switchdog/egg-graphql',
  },
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  },
  io: {
    enable: true,
    package: 'egg-socket.io',
  },
};

export default plugin;
