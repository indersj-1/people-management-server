import * as express from 'express';
import * as path from 'path';
import * as cookeParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as expressValidator from 'express-validator';
import * as flash from 'connect-flash';
import * as session from 'express-session';
import * as passport from 'passport';
import * as mongo from "connect-mongo";
const LocalStrategy = require('passport-local').Strategy;
import * as mongoose from 'mongoose';
// const MongoStore = mongo(session);
const mongoUrl = "mongodb://localhost/almdb";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookeParser());     
app.use(flash());

app.use(session({
    secret: "ashdfjhasdlkjfhalksdjhflak",
    // store: new MongoStore({
    //     url: mongoUrl,
    //     autoReconnect: true
    // })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator());


// app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));


import login from './routes/login';
import users from './routes/users';

app.use('/', login);
app.use('/users', users);

// Connect to MongoDB
mongoose.connect(mongoUrl).then(() => {
    console.log("Mongo DB connected......")
},
).catch(err => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
});


export default app;