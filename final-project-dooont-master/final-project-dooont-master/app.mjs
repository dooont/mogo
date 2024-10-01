import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import sanitize from 'mongo-sanitize';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import * as auth from './auth.mjs';
import './config.mjs';
import { RestaurantSchema } from './db.mjs';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

mongoose.connect(process.env.DSN, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/home", (req, res) => {
    res.send("in home!");
});

app.get('/db', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.render('db', { restaurants });
    } catch (e) {
        console.log('error retrieving restaurants', e);
        res.status(500).send("womp womp, error occurred while fetching restaurants");
    }
});

app.post("/db/add", async (req, res) => {
    const { name, address, cuisine, price } = req.body;
    try {
        const savedRes = await (new Restaurant({ name, address, cuisine, price })).save();
        console.log(savedRes);

        res.redirect('/db');
    } catch (e) {
        console.log(e);
        res.status(500).send('error :( womp womp');
    }
});

app.get('/db/add', (req, res) => {
    res.render('db-add', { type: "add", name: ' ', address: ' ', cuisine: ' ', price: ' ', id: ' ' });
});

app.get('/db/edit/', async (req, res) => {
    const id = req.query.name;
    // console.log(id);
    let o_id = new ObjectId(id);
    const selected = await Restaurant.find({ _id: o_id })
    // console.log(selected);
    res.render('db-add', { type: "edit", name: selected[0].name, address: selected[0].address, cuisine: selected[0].cuisine, price: selected[0].price, id: selected[0]._id });
});

app.post("/db/edit", async (req, res) => {

    const { name, address, cuisine, price, id } = req.body;
    let o_id = new ObjectId(id);
    try {
        const updateRes = await Restaurant.updateOne({ _id: o_id },
            {
                $set: {
                    name: name,
                    address: address,
                    cuisine: cuisine,
                    price: price
                }
            });


        res.redirect('/db');
    } catch (e) {
        console.log(e);
        res.status(500).send('error :( womp womp');
    }
});

app.get('/db/delete/', async (req, res) => {
    const id = req.query.name;

    let o_id = new ObjectId(id);
    // console.log(id);
    await Restaurant.deleteOne({ _id: o_id });

    res.redirect('/db')
});

const authRequiredPaths = ['/article/add'];

const loginMessages = { "PASSWORDS DO NOT MATCH": 'Incorrect password', "USER NOT FOUND": 'User doesn\'t exist' };
const registrationMessages = { "USERNAME ALREADY EXISTS": "Username already exists", "USERNAME PASSWORD TOO SHORT": "Username or password is too short" };

app.use((req, res, next) => {
    if (authRequiredPaths.includes(req.path)) {
        if (!req.session.user) {
            res.redirect('/login');
        } else {
            next();
        }
    } else {
        next();
    }
});

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

app.use((req, res, next) => {
    console.log(req.path.toUpperCase());
    next();
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        const newUser = await auth.register(
            sanitize(req.body.username),
            sanitize(req.body.email),
            req.body.password
        );
        await auth.startAuthenticatedSession(req, newUser);
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.render('register', { message: registrationMessages[err.message] ?? 'Registration error' });
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login');
}


app.post('/login', async (req, res) => {
    try {
        const user = await auth.login(
            sanitize(req.body.username),
            req.body.password
        );

        await auth.startAuthenticatedSession(req, user);
        req.session.save(err => {
            if (err) {
                throw err;
            }
            // res.redirect('/');
            res.redirect('/dashboard');
        });
    } catch (err) {
        console.error('Login error:', err);
        const message = loginMessages[err.message] || 'Login unsuccessful';
        res.render('login', { message: message });
    }
});

app.get('/dashboard', isAuthenticated, async (req, res) => {
    res.render('dashboard');
});

app.post('/dashboard', isAuthenticated, async (req, res) => {
    const {name, address, cuisine, price} = req.body;
    try {
        // Create a new restaurant instance
        const newRestaurant = new Restaurant({ name, address, cuisine, price });

        // Save the restaurant to the database
        const savedRestaurant = await newRestaurant.save();

        // Send a response back to the client
        console.log('resturant added');
        res.render('dashboard');
        // res.json({ success: true, restaurant: savedRestaurant });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(process.env.PORT || 3000);
