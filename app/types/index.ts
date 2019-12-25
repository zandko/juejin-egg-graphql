export interface IQueryBuilderData {
  orderBy: string;
  orderType: string;
  limit: number;
  offset: number;
}

export interface IOauthData {
  user_id: number;
  oauth_id: string;
  oauth_type: string;
}

export interface IApipayData {
  body?: string;
  subject: string;
  total_amount: string;
}
