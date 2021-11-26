import * as mongoose from 'mongoose';

export const TicketSchema = new mongoose.Schema({
  id: { type: Number, default: 0 },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  user_id: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
  created_at: { type: Date, default: null },
  updated_at: { type: Date, default: null },
});

TicketSchema.pre('save',  function(next) {

  if (this.isNew) {
    // @ts-ignore
    this.constructor.find({}).then( (result) => {
      const count =  this.id = result.length + 1;
      const objid =  mongoose.Types.ObjectId();

      // @ts-ignore
      // tslint:disable-next-line:only-arrow-functions no-shadowed-variable
      this.constructor.findOneAndUpdate({ _id : objid}, {id: count }, function(err, result) {
        // tslint:disable-next-line:no-console
        console.log(err);
        next();
      });
    });
  }

});
