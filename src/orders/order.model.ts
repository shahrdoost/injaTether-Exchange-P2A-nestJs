import * as mongoose from 'mongoose';
import { UserSchema } from '../users/user.schema';
import { type } from 'os';

export const OrderSchema = new mongoose.Schema({
  id: { type: Number, default: 0 },
  user_id: { type: Number },
  card_id: { type: Number },
  type: { type: String},
  currency: { type: String },
  price: { type: Number },
  value: { type: Number},
  network: { type: String},
  cost: { type: Number, default: null  },
  wallet: {type: String},
  status: { type: Number, default: null},
  tx_id: {type: String, default: null},
  created_at: { type: Date, default: null },
  updated_at: { type: Date, default: null },
  pay_status: {type: Boolean, default: false},
  pay_token: {type: String, default: null},
});

// export interface Order extends mongoose.Document {
//  id: Number;
//  title: string;
//  description: string;
//  price: number;
// }

OrderSchema.pre('save', async function(next) {

  if (this.isNew) {
    // @ts-ignore
    await this.constructor.find({}).then(async (result) => {
      // tslint:disable-next-line:no-console
      console.log(result);
      const count = this.id = result.length + 1;
      const objid = await mongoose.Types.ObjectId();

      // @ts-ignore
      // tslint:disable-next-line:only-arrow-functions no-shadowed-variable
      await this.constructor.findOneAndUpdate({ _id: objid }, { id: count }, function(err, result) {
      });
    });
  }
  next();

});
