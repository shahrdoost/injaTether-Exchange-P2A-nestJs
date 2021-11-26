import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema({
  id: { type: Number, default: 0 },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: null,
  },
  name_status: {
    type: Number,
    default: null,
  },
  last_name: {
    type: String,
    default: null,
  },
  last_name_status: {
    type: Number,
    default: null,
  },
  phone_status: {
    type: Number,
    default: null,
  },
  homeNumber: {
    type: String,
    default: null,
  },
  homeNumber_status: {
    type: Number,
    default: null,
  },
  birthDate: {
    type: String,
    default: null,
  },
  birthDate_status: {
    type: Number,
    default: null,
  },
  nationalId: {
    type: String,
    default: null,
  },
  nationalId_status: {
    type: Number,
    default: null,
  },
  city: {
    type: String,
    default: null,
  },
  city_status: {
    type: Number,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  address_status: {
    type: Number,
    default: null,
  },
  introducer: {
    type: String,
    default: null,
  },
  nationalId_image: {
    type: String,
    default: null,
  },
  nationalId_image_status: {
    type: Number,
    default: null,
  },
  selfi_image: {
    type: String,
    default: null,
  },
  selfi_image_status: {
    type: Number,
    default: null,
  },
  status: {
    type: String,
    default: null,
  },
  token_email: {
    type: String,
    default: null,
  },
  token_sms: {
    type: String,
    default: null,
  },
  email_status: {
    type: Number,
    default: null,
  },
  role: {
    type: String,
    default: null,
  },
});

UserSchema.pre('save',  function(next) {

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
      });
    });
  }

  const user =  this;

  // Make sure not to rehash the password if it is already hashed
  if (!user.isModified('password')) { return next(); }

  // Generate a salt and use it to hash the user's password
  bcrypt.genSalt(10,  (err, salt) => {

    if (err) { return next(err); }

    // @ts-ignore
    // tslint:disable-next-line:no-shadowed-variable
    bcrypt.hash(user.password, salt, async (err, hash) => {

      if (err) { return next(err); }
      // @ts-ignore
      user.password =  hash;
      next();

    });

  });

});

UserSchema.methods.checkPassword =  function(attempt, callback) {

  const user =  this;

  // @ts-ignore
  bcrypt.compare(attempt, user.password, async (err, isMatch) => {
    if (err) { return callback(err); }
    callback(null, isMatch);
  });

};
