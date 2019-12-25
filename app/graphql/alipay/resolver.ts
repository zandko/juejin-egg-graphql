export default {
  Mutation: {
    pay(_root: any, { data }, { connector }) {
      return connector.alipay.pay(data);
    },
  },
};
