import bcrypt from 'bcryptjs';
import { User } from './db.mjs';

// const User = mongoose.model('User');

const startAuthenticatedSession = (req, user) => {
  return new Promise((fulfill, reject) => {
    req.session.regenerate((err) => {
      if (!err) {
        req.session.user = user; 
        fulfill(user);
      } else {
        reject(error);
      }
    });
  });
};

const endAuthenticatedSession = req => {
  return new Promise((fulfill, reject) => {
    req.session.destroy(err => err ? reject(err) : fulfill(null));
  });
};

const register = (username, email, password) => {
  return new Promise(async (fulfill, reject) => {
    if(username.length < 8 || password.length < 8) {
      return reject({message: "USERNAME PASSWORD TOO SHORT"});
    }
    User.findOne({username}).then(existingUser => {
      if(existingUser) {
        return reject({message: "USERNAME ALREADY EXISTS"});
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const newUser = new User({ 
        username, email, password: hash
      });

      newUser.save().then(user => fulfill(user)).catch(err => reject({message: err.message}));
    });
  });
}

const login = (username, password) => {
    return new Promise(async (fulfill, reject) => {
      try {
        const user = await User.findOne({ username });
  
        if (!user) {

          return reject({ message: "USER NOT FOUND" });
        }

        if (!bcrypt.compareSync(password, user.password)) {

          return reject({ message: "PASSWORDS DO NOT MATCH" });
        }
        console.log('success!')
        fulfill(user);
        
      } catch (error) {

        reject(error);
      }
    });
};

export {
  endAuthenticatedSession, login, register, startAuthenticatedSession
};

