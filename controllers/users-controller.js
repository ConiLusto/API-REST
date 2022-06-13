const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getAllUsers = async (req, res, next) => {
    let users;
    try{
        users = await User.find({},'-password');
    }catch(err){
        const error = new HttpError('Fetching users failed.', 500);
        return next(error);
    }
    res.status(200).json({users: users.map(user => user.toObject({ getters: true }))});
}

const signup = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors);
        return next( new HttpError('Invalid inputs passed.', 422));
    }

    const {username, email, password } = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({ email: email });
    }catch(err){
        const error = new HttpError('Signing up failed.',500);
        return next(error);
    }

    if(existingUser){
        const error = new HttpError('User already exists.', 422);
        return next(error);
    }
    
    
    const createdUser = new User({
        username,
        email,
        password,
        restaurants: []
    });

    try{
        await createdUser.save(); 
        } catch(err){
            const error = new HttpError('Signing up failed.', 500);
            return next(error);
        }
    
    
        res.status(201).json({user: createdUser.toObject({ getters: true })}); 

}

const login = async (req, res, next) => {
    const{ email, password } = req.body;

    let existingUser;

    try{
        existingUser = await User.findOne({ email: email });
    }catch(err){
        const error = new HttpError('Logging in failed.',500);
        return next(error);
    }

    if(!existingUser || existingUser.password != password){
        const error = new HttpError('Invalid credentials.',401);
        return next(error);
    }
    
    res.status(200).json({message:'Logged in!'});

}

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;