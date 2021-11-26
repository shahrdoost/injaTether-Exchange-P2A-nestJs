import * as mongoose from 'mongoose';

export const CommentSchema = new mongoose.Schema({
  id: { type: Number, default: 0 },
  user_id: {
    type: Number,
    required: true,
  },
  ticket_id: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    default: null,
  },
  created_at: { type: Date, default: null },
});

CommentSchema.pre('save', function(next) {

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
