const express = require('express');
const { check } = require('express-validator');

const restaurantsController = require('../controllers/restaurants-controller');

const router = express.Router();

 /**
 * @swagger
 * /api/v1/restaurants:
 *  get:
 *      summary: lista todos los restaurants
 *      tags: [Restaurant]
 *      responses:
 *          200: 
 *              description: OK
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items: 
 *                              $ref: '#/components/schemas/Restaurant'    
 *          500: 
 *              description: Internal Server Error
 */
router.get('/', restaurantsController.getAllRestaurants);

 /**
  * @swagger
  * /api/v1/restaurants/{rid}:
  *     get:
  *       summary: devuelve un restaurant por su Id
  *       tags: [Restaurant]
  *       parameters:
  *         - in: path
  *           name: rid
  *           schema:
  *             type: string
  *           required: true
  *           description: id del restaurant
  *       responses: 
  *         200:
  *           description: OK
  *           content:
  *             application/json: 
  *               schema:
  *                 type: object  
  *                 $ref: '#/components/schemas/Restaurant'
  *         404:
  *           description: Not Found
  *         500:
  *           description: Internal Server Error
  *         
  */
router.get('/:rid', restaurantsController.getRestaurantById);

/**
 * @swagger
 * /api/v1/restaurants/user/{uid}:
 *     get:
 *       summary: devuelve los restaurants de un usuario
 *       tags: [Restaurant]
 *       parameters:
 *         - in: path
 *           name: uid
 *           schema:
 *             type: string
 *           required: true
 *           description: id del usuario
 *       responses:
 *         200:
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                  $ref: '#/components/schemas/Restaurant'
 *         404:
 *           description: Not Found
 *         500:
 *           description: Internal Server Error
 * 
 */

router.get('/user/:uid', restaurantsController.getRestaurantsByUserId);


/**
 * @swagger
 * /api/v1/restaurants:
 *  post:
 *      summary: crea un nuevo restaurant
 *      tags: [Restaurant]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                            type: string
 *                            description: nombre del restaurant
 *                          description: 
 *                            type: string
 *                            description: comentario/review del usuario
 *                          address:
 *                            type: string
 *                            description: direccion del restaurant
 *                          creator:
 *                            type: string
 *                            description: id del usuario creador
 *      responses: 
 *          201:
 *              description: Created
 *          422:
 *              description: Unprocessable Entity
 *          404:
 *              description: Not found
 *          500:
 *              description: Internal Server Error
 * 
 * 
 */
router.post(
  '/',
[
  check('title').not().isEmpty(),
  check('description').isLength({min: 5}),
  check('address').not().isEmpty()
],
 restaurantsController.createRestaurant); 


 /**
  * @swagger
  * /api/v1/restaurants/{rid}:
  *     patch:
  *       summary: actualiza un restaurant
  *       tags: [Restaurant]
  *       requestBody:
  *          required: true
  *          content:
  *              application/json:
  *                  schema:
  *                      type: object
  *                      properties:
  *                          title:
  *                            type: string
  *                            description: nombre del restaurant
  *                          description: 
  *                            type: string 
  *       parameters:
  *         - in: path
  *           name: rid
  * 
  *           schema:
  *             type: string
  *           required: true
  *           description: id del restaurant
  *       responses: 
  *         200:
  *           description: OK
  *           content:
  *             application/json: 
  *               schema:
  *                 type: object  
  *                 $ref: '#/components/schemas/Restaurant'
  *         422:
  *           description: Unprocessable Entity
  *         500:
  *           description: Internal Server Error
  *         
  */


router.patch('/:rid',
[
  check('title').not().isEmpty(),
  check('description').isLength({min: 5})
],
 restaurantsController.updateRestaurantById);

 /**
  * @swagger
  * /api/v1/restaurants/{rid}:
  *     delete:
  *       summary: elimina un restaurant
  *       tags: [Restaurant]
  *       parameters:
  *         - in: path
  *           name: rid
  *           schema:
  *             type: string
  *           required: true
  *           description: id del restaurant
  *       responses: 
  *         200:
  *           description: OK
  *         404:
  *           description: Not Found
  *         500:
  *           description: Internal Server Error
  *         
  */router.delete('/:rid', restaurantsController.deleteRestaurant);

module.exports = router; 

