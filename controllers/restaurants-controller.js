const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Restaurant = require('../models/restaurant');
const User = require('../models/user');


//declaracion de las funciones de los middlewares

const getAllRestaurants = async (req,res,next) => { //devuelve todos los restaurants 
    let restaurants;
    try{
        restaurants = await Restaurant.find({});
    }catch(err){
        const error = new HttpError('Fetching restaurants failed.', 500);
        return next(error);
    }
    res.json({restaurants: restaurants.map(restaurant => restaurant.toObject({ getters: true }))});
};

const getRestaurantById = async (req,res,next) => { //devuelve un restaurant por su restaurant Id
    const restaurantId = req.params.rid; // pid: 'p1'

    let restaurant;
    try{
        restaurant = await Restaurant.findById(restaurantId);
    }catch(err){
        const error = new HttpError('Something went wrong, could not find a restaurant', 500);
        return next(error); //sirve para parar el codigo si hay un error
    }
    

    if(!restaurant){
        const error = new HttpError('could not find a restaurant for the provided Id',404);
        return next(error);
    }
    res.status(200).json({ restaurant: restaurant.toObject({ getters: true}) });
};

const getRestaurantsByUserId = async (req,res,next) => { //devuelve todos los restaurants que creo un usuario por su userId
    const userId = req.params.uid; 
    let restaurants;

    try{
        restaurants = await Restaurant.find({ creator: userId });
    }catch(err){
        const error = new HttpError('Fetching restaurants failed.', 500);
        return next(error);
    }
    
    
    if(!restaurants || restaurants.length === 0){
        return next(
            new HttpError('could not find restaurants for the provided user Id',404)
        );
    }
    res.status(200).json({restaurants: restaurants.map(restaurant => restaurant.toObject({ getters:true }))});
}

const createRestaurant = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalid inputs passed.', 422);
    }

    const {title, description, address, creator} = req.body; 
    const createdRestaurant = new Restaurant({
        title,
        description,
        address,
        creator
    });

    let user;

    try{
        user = await User.findById(creator);
    }catch(err){
        const error = new HttpError('Creating restaurant failed.', 500);
        return next(error);
    }

    if(!user){
        const error = new HttpError('Could not find user for provided Id',404);
        return next(error);
    }
    console.log(user);

    try{
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdRestaurant.save({session: sess});
    user.restaurants.push(createdRestaurant); 
    await user.save({session: sess});
    await sess.commitTransaction(); //solo si todo es exitoso -> se crea el restaurant. 
    } catch(err){
        const error = new HttpError('Creating restaurant failed.', 500);
        return next(error);
    }


    res.status(201).json({restaurant: createdRestaurant}); 
};

const updateRestaurantById = async (req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError('Invalid inputs passed.', 422));
    }
    
    const {title, description} = req.body; 
    const restaurantId = req.params.rid;

    let restaurant;
    try{
        restaurant = await Restaurant.findById(restaurantId);
    }catch(err){
        const error = new HttpError('Something went wrong, could not update restaurant', 500);
        return next(error);
    }

    restaurant.title = title;
    restaurant.description = description;

    try{
        await restaurant.save();
    }catch(err){
        const error = new HttpError('Something went wrong, could not update restaurant', 500);
        return next(error);
    }

    res.status(200).json({ restaurant: restaurant.toObject({ getters: true }) });
};

const deleteRestaurant = async (req,res,next) =>{
    const restaurantId = req.params.rid;
    
    let restaurant;
    try {
        restaurant = await Restaurant.findById(restaurantId).populate('creator'); //populate me permite acceder a la info completa de un documento de otra collection
    }catch(err){
        const error = new HttpError('Something went wrong, could not delete restaurant', 500);
        return next(error);
    }

    if(!restaurant){
        const error = new HttpError('Could not find restaurant for this id.', 404);
        return next(error);
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await restaurant.remove({session: sess});
        restaurant.creator.restaurants.pull(restaurant);
        await restaurant.creator.save({session: sess});
        await sess.commitTransaction();
    }catch(err){
        const error = new HttpError('Something went wrong, could not delete restaurant', 500);
        return next(error);
    }
    res.status(200).json({message: 'Deleted restaurant.'});
};


exports.getRestaurantById = getRestaurantById; //variable que tiene un puntero hacia las funciones definidas arriba
exports.getRestaurantsByUserId = getRestaurantsByUserId; 
exports.createRestaurant = createRestaurant;
exports.getAllRestaurants = getAllRestaurants;
exports.updateRestaurantById = updateRestaurantById;
exports.deleteRestaurant = deleteRestaurant;