const express = require('express');
const { check } = require('express-validator');


const usersController = require('../controllers/users-controller');

const router = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              username:
 *                  type: string
 *                  description: nombre de usuario
 *              email:
 *                  type: string
 *                  description: mail del usuario
 *              password: 
 *                  type: string
 *                  description: clave del usuario
 *              restaurants:
 *                  type: array
 *                  items: 
 *                      $ref: '#/components/schemas/Restaurant'
 *          required:
 *          - username
 *          - email
 *          - password
 *          example:
 *              username: Maria_UP
 *              email: maria@up.com.ar
 *              password: maria*123
 * 
 *      Restaurant:
 *          type: object
 *          properties:
 *              title:
 *                  type: string
 *                  description: nombre del restaurant
 *              description: 
 *                  type: string
 *                  description: comentario/review del usuario
 *              address:
 *                  type: string
 *                  description: direccion del restaurant
 *              creator:
 *                  type: object
 *                  $ref: '#/components/schemas/User'
 *                  
 *      
 */

// get all users 
/**
 * @swagger
 * /api/v1/users:
 *  get:
 *      summary: lista todos los usuarios
 *      tags: [User]
 *      responses:
 *          200: 
 *              description: OK
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items: 
 *                              $ref: '#/components/schemas/User'
 *              
 *          500: 
 *              description: Internal Server Error
 */
router.get('/', usersController.getAllUsers);

//create user
/**
 * @swagger
 * /api/v1/users:
 *  post:
 *      summary: crea un nuevo usuario
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/User'
 *      responses: 
 *          201:
 *              description: Created
 *          422:
 *              description: Unprocessable Entity
 *          500:
 *              description: Internal Server Error
 * 
 * 
 */

router.post('/',
[
    check('username').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 6})
],
usersController.signup);

//login user
/**
 * @swagger
 * /api/v1/users/account:
 *  post:
 *      summary: ingresa a un usuario existente
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: mail del usuario
 *                          password:
 *                              type: string
 *                              description: clave del usuario
 *      responses: 
 *          200:
 *              description: OK
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Internal Server Error
 * 
 * 
 */

router.post('/account',usersController.login);

module.exports = router;