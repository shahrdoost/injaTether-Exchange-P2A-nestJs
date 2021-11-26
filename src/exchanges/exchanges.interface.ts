import * as mongoose from 'mongoose';
export interface Exchange extends mongoose.Document {
  exchange: string;
  buy: number;
  sell: number;
  sign: string;
}
