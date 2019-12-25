export default {
  Query: {
    hellos(_root: any, {}, { connector }) {
      return connector.hello.hellos();
    },
  },
};
