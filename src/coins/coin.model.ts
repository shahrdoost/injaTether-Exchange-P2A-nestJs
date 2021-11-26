import * as mongoose from 'mongoose';
import { UserSchema } from '../users/user.schema';

export const CoinSchema = new mongoose.Schema({
  id: { type: Number, default: 0 },
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  persianName: {
    type: String,
    required: true,
  },
  sign: {
    type: String,
    required: true,
  },
  wallet: {
    type: String,
    required: true,
  },
  walletTwo: {
    type: String,
  },
  buyPrice: {
    type: Number,
    required: true,
  },
  sellPrice: {
    type: Number,
    required: true,
  },
  minBuy: {
    type: Number,
    required: true,
  },
  maxBuy: {
    type: Number,
    required: true,
  },
  minSell: {
    type: Number,
    required: true,
  },
  maxSell: {
    type: Number,
    required: true,
  },
  sos: {
    type: Number,
    default: 0,
  },
  active: {
    type: Number,
    required: true,
  },
});

CoinSchema.pre('save', async function(next) {

  if (this.isNew) {
    // @ts-ignore
    await this.constructor.find({}).then(async (result) => {
      // tslint:disable-next-line:no-console
      console.log(result);
      const count = this.id = result.length + 1;
      const objid = await mongoose.Types.ObjectId();

      // @ts-ignore
      // tslint:disable-next-line:only-arrow-functions no-shadowed-variable no-empty
      await this.constructor.findOneAndUpdate({ _id: objid }, { id: count }, function(err, result) {
      });
    });
  }
  next();

});
