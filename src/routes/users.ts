import * as express from 'express';
import { User, createUser, comparePassword, getUserByEmail, getUserById } from '../models/user';
import * as passport from 'passport';

let LocalStrategy = require('passport-local').Strategy;
let router = express.Router();


router.post('/register', function (req, res) {

    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let cfm_pwd = req.body.cfm_pwd;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Please enter a valid email').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('cfm_pwd', 'Confirm Password is required').notEmpty();
    req.checkBody('cfm_pwd', 'Confirm Password Must Matches With Password').equals(password);

    let errors = req.validationErrors();
    if (errors) {
        // res.send({errors: errors});
        res.send({ status: 500, msg: "Invaid request" })
    }
    else {
        let user = new User({
            name: name,
            email: email,
            password: password
        });

        getUserByEmail(email, function (err, response) {
            if (err) if (err) throw err;
            if (!response) {
                createUser(user, function (err, user) {
                    if (err) throw err;
                    else {
                        console.log(user)
                        res.status(200);
                        res.send({ status: 200, msg: "User created!!!" })
                    };
                });
            } else {
                res.status(500);
                res.send({ status: 500, msg: "Email already exists.." })
            }
        });
        // req.flash('success_message','You have registered, Now please login');
    }
});





passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
    function (req, email, password, done) {
        console.log("--------------Check---------------------")
        getUserByEmail(email, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, req.flash('error_message', 'No email is found'));
            }
            comparePassword(password, user.password, function (err, isMatch) {
                if (err) { return done(err); }
                if (isMatch) {
                    return done(null, user);
                }
                else {
                    return done(null, false);
                }
            });
        });
    }
));

passport.serializeUser(function (user :any, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    getUserById(id, function (err, user) {
        done(err, user);
    });
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/users/login', failureFlash: true
}),
    function (req, res) {
        console.log("Inside");
        res.status(200);
        res.send({status:200,msg:'You are now Logged in!!'})
  
    }
);
router.get('/login', passport.authenticate('local', {
    failureRedirect: '/users/login', failureFlash: true
}),
    function (req, res) {
        console.log("Inside");
        res.status(200);
        res.send({status:200,msg:'You are now Logged in!!'})
  
    }
);

router.get('/logout', function(req, res){
    req.logout()
    // req.flash('success_message', 'You are logged out');
    res.status(200);
    res.send({status:200,msg: 'You are logged out'});
    
});

export default router;