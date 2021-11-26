import * as mongoose from 'mongoose';
import { UserSchema } from '../users/user.schema';

export const CardSchema = new mongoose.Schema({
  id: { type: Number, default: 0 },
  user_id: {
    type: Number,
    required: true,
  },
  bank: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: String,
    required: true,
  },
  ibanNumber: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 0,
  },
  created_at: { type: Date, default: null },
  updated_at: { type: Date, default: null },
});

// export interface Order extends mongoose.Document {
//  id: Number;
//  title: string;
//  description: string;
//  price: number;
// }

CardSchema.pre('save', async function(next) {

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
