import * as mongoose from 'mongoose';



export const ExchangeSchema = new mongoose.Schema({
  id: { type: Number, default: 0 },
  exchange: {
    type: String,
    required: true,
  },
  sign: {
    type: String,
    required: true,
  },
  buy: {
    type: Number,
    required: true,
  },
  sell: {
    type: Number,
    required: true,
  },
  updated_at: { type: Date, default: null },
});

ExchangeSchema.pre('save', function(next) {

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
