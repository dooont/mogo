import dotenv from 'dotenv';
import mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';

dotenv.config();

mongoose.connect(process.env.DSN);
// mongoose.connect(process.env.PORT ?? 3000);
console.log(process.env.DSN);

export const RestaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  cuisine: String,
  price: String
});

export const UserSchema = new mongoose.Schema({
  username: {type: String, required: true}, 
  password: {type: String, required: true},
});

UserSchema.plugin(mongooseSlugPlugin, {tmpl: '<%=username%>'});

mongoose.model('Restaurant', RestaurantSchema);
const User = mongoose.model('User', UserSchema);

export {User}