import { Context } from 'egg';
import * as Dataloader from 'dataloader';
import { IQueryBuilderData } from '../../types/index';

export default class UserConnector {
  loader: any;
  ctx: Context;
  constructor(ctx: Context) {
    this.ctx = ctx;
    this.loader = new Dataloader(this.fetch.bind(this));
  }

  fetch(ids: any) {
    const users = this.ctx.service.user.fetch(ids);
    return users;
  }

  fetchByIds(ids: any) {
    const { loader } = this;
    return loader.loadMany(ids);
  }

  fetchById(id: number) {
    const { loader } = this;
    return loader.load(id);
  }

  async fetchAll(params: IQueryBuilderData) {
    const { ctx } = this;
    return await ctx.service.user.fetchAll(params);
  }

  async fetchByNamePassword(phone: string, password: string) {
    const { ctx } = this;
    return await ctx.service.user.fetchByNamePassword(phone, password);
  }

  async register(data: any) {
    const { ctx } = this;
    return await ctx.service.user.register(data);
  }
}
