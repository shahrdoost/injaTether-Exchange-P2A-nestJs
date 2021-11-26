import * as mongoose from 'mongoose';

export const SubCoinSchema = new mongoose.Schema({
  id: { type: Number, default: 0 },
  crypto_id: {
    type: Number,
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
  active: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    default: null,
  },
  sign: {
    type: String,
    default: null,
  },
});

SubCoinSchema.pre('save', function(next) {

  if (this.isNew) {
    // @ts-ignore
    this.constructor.find({}).then((result) => {
      const count = this.id = result.length + 1;
      const objid = mongoose.Types.ObjectId();

      // @ts-ignore
      // tslint:disable-next-line:only-arrow-functions no-shadowed-variable
      this.constructor.findOneAndUpdate({ _id: objid }, { id: count }, function(err, result) {
        // tslint:disable-next-line:no-console
        console.log(err);
        next();
      });
    });
  }

});
