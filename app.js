const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const restaurantsRoutes = require('./routes/restaurants-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerSpec = require('./swagger-spec');



//settings
const app = express();
app.set('port', process.env.PORT || 5000);


//middlewares

app.use(bodyParser.json()); //parses any json body into normal js code (arrays, objects, etc) and adds it into the next line (the routes' one). Calls next() automatically to reach the following middleware
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/restaurants', restaurantsRoutes); //si manda un response, no llama a next
app.use('/api-doc',swaggerUI.serve,swaggerUI.setup(swaggerJsDoc(swaggerSpec))); //swagger


// si llega hasta aca quiere decir que se ingreso una ruta no valida
app.use((req,res,next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
}); 


//error handle middlerware
app.use((error, req, res, next) => {
    if(res.headerSent){ //chequea que no se haya mandado una response antes
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred'});
});


//conexion con mongodb
mongoose.connect('mongodb+srv://desarrollador:desarrollador@cluster0.kuegt27.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
    app.listen(app.get('port'),() => {
    console.log('server running on port: ', app.get('port'));
    });
})
.catch(err => {
    console.log(err);
});

//server running


