import {Router} from 'express';
import { UserController } from '../controllers';
import { verificarToken } from '../middlewares';
import { allowAdiministrator } from '../middlewares/alllowAdministrator';

export const RouterUser = Router();

RouterUser.post('/register-participant', UserController.registerParticipant);
RouterUser.post('/login', UserController.login);
RouterUser.get('/login-with-token', verificarToken, UserController.loginWithToken)
RouterUser.get('/get-all-registers', allowAdiministrator, UserController.getAllRegisters)
RouterUser.put('/update-status-register', allowAdiministrator, UserController.updateStatusRegister)
RouterUser.put('/check-attendance', UserController.checkAttendance)
RouterUser.put('/check-attendance-identity', UserController.checkAttendanceIdentity)
RouterUser.post('/register-administrator', UserController.registerAdministrator);
RouterUser.get('/get-all-registers-by-participant', verificarToken, UserController.getAllRegistersByParticipant)
RouterUser.post('/register-verifier', allowAdiministrator, UserController.registerVerifier);

/**
 * @swagger
 * components:
 *  schemas:
 *    RequestRegisterParticipant:
 *      type: Object
 *      properties:
 *        name: string
 *        lastname: string
 *        email: string
 *        participantType: string
 *        phone: string
 *        cedula: string
 *        address: string
 *        company: string
 *        password: string
 *        inscriptions: string[]
 *        typePayment: string
 *        voucherBase64: string
 *      required:
 *        - name
 *        - lastname
 *        - email
 *        - participantType
 *        - phone
 *        - cedula
 *        - address
 *        - company
 *        - password
 *        - inscriptions
 *        - typePayment
 *        - voucherBase64
 *      example:
 *        name: "Luis Joel"
 *        lastname: "Perez Loor"
 *        phone: "0983334657"
 *        email: "luisjo3lml@gmail.com"
 *        participantType: "medico_rural"
 *        cedula: "1312386962"
 *        address: "manta"
 *        company: "AbiDev"
 *        password: "12345678"
 *        inscriptions: ["638cb9c5959e03572e1e7309","838cb9c5959e03572e1e7380"]
 *        typePayment: "transfer"
 *        voucherBase64: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAA...
 * 
 *    RequestLogin:
 *      type: object
 *      properties:
 *        email: string
 *        password: string
 *      required:
 *        - email
 *        - password
 *      example:
 *        email: "example@gmail.com"
 *        password: "12345678"
 *    RequestUpdateStatusRegister:
 *      type: object
 *      properties:
 *        registerId: string
 *        status: string
 *      required:
 *        - registerId
 *        - status
 *      example:
 *        status: "paid"
 *        registerId: "KUHiuhiUHIuhuyh"
 *        
 *    Error:
 *      type: Object
 *      properties:
 *        message:
 *          type: string
 *        status: 
 *          type: number
 *      example:
 *        message: 'El email ya está registrado!'
 *        errors: []
 *        status: 400
*    ErrorAttendance:
 *      type: Object
 *      properties:
 *        message:
 *          type: string
 *        status: 
 *          type: number
 *      example:
 *        message: 'El usuario no se encuentra registrado en el curso!'
 *        errors: []
 *        status: 400

 *    RequestRegisterAdministrator:
 *      type: Object
 *      properties:
 *        name: string
 *        lastname: string
 *        email: string
 *        phone: string
 *        cedula: string
 *        address: string
 *        company: string
 *        password: string
 *      required:
 *        - name
 *        - lastname
 *        - email
 *        - phone
 *        - cedula
 *        - address
 *        - company
 *        - password
 *      example:
 *        name: "Luis Joel"
 *        lastname: "Perez Loor"
 *        phone: "0983334657"
 *        email: "luisjo3lml@gmail.com"
 *        cedula: "1312386962"
 *        address: "manta"
 *        company: "AbiDev"
 *        password: "12345678"
 *    RequestCheckAttendance:
 *      type: object
 *      properties:
 *        courseId:
 *          type: string
 *        userId:
 *          type: string
 *      required:
 *        - courseId
 *        - userId
 *      example:
 *        courseId: KuhiuHIUBibiuJIJbi
 *        userId: KuhiuHIUBibiuJIJbi
 *    RequestCheckAttendanceIdentity:
 *      type: object
 *      properties:
 *        cedula:
 *          type: string
 *        userId:
 *          type: string
 *      required:
 *        - cedula
 *        - userId
 *      example:
 *        cedula: 1311460909
 *        userId: KuhiuHIUBibiuJIJbi
 */

/**
 * @swagger
 * tags:
 *  name: Usuario
 *  descripcion: Usuario enpoints
 */

/**
 * @swagger
 * /api/user/register-participant:
 *  post:
 *    summary: Registro del participante
 *    tags: [Usuario]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RequestRegisterParticipant'    
 *    responses:
 *      200:
 *        description: Devuelve el usuario ingresado con el id
 *      400:
 *        description: Devuelve un objeto de tipo Error  
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'                  
 */


/**
 * @swagger
 * /api/user/login:
 *  post:
 *    summary: Login de los usuarios
 *    tags: [Usuario]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RequestLogin'    
 *    responses:
 *      200:
 *        description: Devuelve los datos del usuario y el token
 *      400:
 *        description: Devuelve un objeto de tipo Error  
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'                  
 */

/**
 * @swagger
 * /api/user/login-with-token:
 *  get:
 *    summary: Login por medio del token
 *    tags: [Usuario]
 *    parameters:
 *      - in: header
 *        name: token
 *        description: Token de autenticación
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Devuelve los datos del usuario y el token
 *      400:
 *        description: Devuelve un objeto de tipo Error  
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'                  
 */

/**
 * @swagger
 * /api/user/get-all-registers:
 *  get:
 *    summary: Obtener todos los registros o filtrarlos
 *    tags: [Usuario]
 *    parameters:
 *      - in: header
 *        name: token
 *        description: Token de autenticación
 *        required: true
 *        schema:
 *          type: string
 *      - in: query
 *        name: status
 *        description: Este campo es opcional pero puede filtrar por el status que puede ser paid,pending,reject
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Devuelve un array con los pagos segun el status (paid,pending,reject)
 *      400:
 *        description: Devuelve un objeto de tipo Error  
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'                  
 */

/**
 * @swagger
 * /api/user/update-status-register:
 *  put:
 *    summary: Obtener todos los registros o filtrados
 *    tags: [Usuario]
 *    parameters:
 *      - in: header
 *        name: token
 *        description: Token de autenticación
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RequestUpdateStatusRegister'   
 *    responses:
 *      200:
 *        description: Devuelve el registro actualizado
 *      400:
 *        description: Devuelve un objeto de tipo Error  
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'                  
 */

/**
 * @swagger
 * /api/user/register-administrator:
 *  post:
 *    summary: Registro del administrador
 *    tags: [Usuario]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RequestRegisterAdministrator'    
 *    responses:
 *      200:
 *        description: Devuelve el usuario ingresado con el id
 *      400:
 *        description: Devuelve un objeto de tipo Error  
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'                  
 */

/**
 * @swagger
 * /api/user/register-verifier:
 *   post:
 *     summary: Registro de nuevos administradores
 *     tags: [Usuario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestRegisterVerifier'
 *     responses:
 *       200:
 *         description: Devuelve el usuario ingresado con el ID
 *       400:
 *         description: Devuelve un objeto de tipo Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * /api/user/check-attendance:
 *  put:
 *    summary: Registro de Asistencia
 *    tags: [Usuario]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RequestCheckAttendance'   
 *    responses:
 *      200:
 *        description: Devuelve el registro actualizado
 *      400:
 *        description: Devuelve un objeto de tipo Error  
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorAttendance'                  
 */

/**
 * @swagger
 * /api/user/check-attendance-identity:
 *  put:
 *    summary: Registro de Asistencia por cedula
 *    tags: [Usuario]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RequestCheckAttendanceIdentity'   
 *    responses:
 *      200:
 *        description: Devuelve el registro actualizado
 *      400:
 *        description: Devuelve un objeto de tipo Error  
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorAttendance'                  
 */

/**
 * @swagger
 * /api/user/get-all-registers-by-participant:
 *  get:
 *    summary: Obtener todos los registros del participante, es necesario el token del participante
 *    tags: [Usuario]
 *    parameters:
 *      - in: header
 *        name: token
 *        description: Token de autenticación
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Devuelve un array con los registros con la informacion de inscripciones, asitencias, certificados, curso
 *      400:
 *        description: Devuelve un objeto de tipo Error  
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'                  
 */
