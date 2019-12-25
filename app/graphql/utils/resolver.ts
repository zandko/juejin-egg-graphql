export default {
  Query: {
    async githubURL(_root: any, {}, { connector }) {
      return await connector.utils.githubURL();
    },
  },

  Mutation: {
    async sendSms(_root: any, { PhoneNumbers }, { connector }) {
      return await connector.utils.sendSms(PhoneNumbers);
    },
    async singleUpload(_root: any, { file }, { connector }) {
      return await connector.utils.singleUpload(await file);
    },
    async sendMail(_root: any, { data }, { connector }) {
      const mail = await connector.utils.sendMail(data);
      return mail.response;
    },
  },
};
