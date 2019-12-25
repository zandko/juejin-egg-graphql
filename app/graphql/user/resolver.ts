export default {
  Query: {
    async user(_root: any, { id }, { connector }) {
      return await connector.user.fetchById(id);
    },
    async users(_root: any, { params }, { connector }) {
      return await connector.user.fetchAll(params);
    },
    async login(_root: any, { data }, { connector }) {
      const { phone, password } = data;
      return await connector.user.fetchByNamePassword(phone, password);
    },
  },

  Mutation: {
    async register(_root: any, { data }, { connector }) {
      return await connector.user.register(data);
    },
  },
};
