import {Router} from 'express';
import { UserController } from '../controllers';
import { verificarToken } from '../middlewares';
import { allowAdiministrator } from '../middlewares/alllowAdministrator';
import { allowVerifierOrAdmin } from '../middlewares/allowVerifierOrAdmin';

export const RouterUser = Router();

RouterUser.post('/register-participant', UserController.registerParticipant);
RouterUser.post('/login', UserController.login);
RouterUser.get('/login-with-token', verificarToken, UserController.loginWithToken)
RouterUser.get('/get-all-registers', allowAdiministrator, UserController.getAllRegisters)
RouterUser.put('/update-status-register', allowAdiministrator, UserController.updateStatusRegister)
RouterUser.put('/check-attendance',allowVerifierOrAdmin,  UserController.checkAttendance)
RouterUser.put('/check-attendance-identity',allowVerifierOrAdmin, UserController.checkAttendanceIdentity)
RouterUser.post('/register-administrator', UserController.registerAdministrator);
RouterUser.get('/get-all-registers-by-participant', verificarToken, UserController.getAllRegistersByParticipant)
RouterUser.post('/register-verifier', allowAdiministrator, UserController.registerVerifier);
RouterUser.put('/update-user', verificarToken, UserController.updatetUser)
RouterUser.put('/update-user-verifier/:id', allowAdiministrator, UserController.updateVerifierForAdmin)
RouterUser.put('/send-code-change-password', UserController.sendCodeChangePassword);
RouterUser.get('/get-register-by-id/:id', verificarToken, UserController.getRegisterById)
RouterUser.put('/change-password', UserController.changePassword)

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
 *    ErrorUpdate:
 *      type: Object
 *      properties:
 *        message:
 *          type: string
 *        status: 
 *          type: number
 *      example:
 *        message: 'No se puedo actualizar la informacion'
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
 *        registerId:
 *          type: string
 *        inscriptionId:
 *          type: string
 *      required:
 *        - registerId
 *        - inscriptionId
 *      example:
 *        registerId: KuhiuHIUBibiuJIJbi
 *        inscriptionId: KuhiuHIUBibiuJIJbi
 *    RequestCheckAttendanceIdentity:
 *      type: object
 *      properties:
 *        cedula:
 *          type: string
 *        courseId:
 *          type: string
 *      required:
 *        - cedula
 *        - courseId
 *      example:
 *        cedula: 1311460909
 *        courseId: KuhiuHIUBibiuJIJbi
 *    RequestUpdateUser:
 *      type: object
 *      properties:
 *        name: string
 *        lastname: string
 *        email: string
 *        address: string
 *        company: string
 *        phone: string
 *        cedula: string
 *      required:
 *        - name
 *        - lastname
 *        - email
 *        - address
 *        - company
 *        - phone
 *        - cedula
 *      example:
 *        name: "Dayanara Yamileth"
 *        lastname: "Burgasi Rovayo"
 *        email: "dburgasi06@gmail.com"
 *        address: "manta"
 *        company: "Tecopesca"
 *        phone: "0999232263"
 *        cedula: "1311460909"
 *    RequestUpdateUserVerifier:
 *      type: object
 *      properties:
 *        name: string
 *        lastname: string
 *        email: string
 *        address: string
 *        company: string
 *        phone: string
 *        cedula: string
 *      required:
 *        - name
 *        - lastname
 *        - email
 *        - address
 *        - company
 *        - phone
 *        - cedula
 *      example:
 *        name: "Dayanara Yamileth"
 *        lastname: "Burgasi Rovayo"
 *        email: "dburgasi06@gmail.com"
 *        address: "manta"
 *        company: "Tecopesca"
 *        phone: "0999232263"
 *        cedula: "1311460909"
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
 * components:
 *   schemas:
 *     RequestVerifier:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         lastname:
 *           type: number
 *         email:
 *          type: string
 *         phone:
 *          type: string
 *         cedula:
 *          type: string
 *         address:
 *          type: string
 *         company:
 *          type: string
 *         password:
 *          type: string
 *         role:
 *          type: string
 *       required:
 *         - name
 *         - lastname
 *         - email
 *         - phone
 *         - cedula
 *         - company
 *       example:
 *         name: 'Tommy'
 *         lastname: 'Verifier'
 *         email: 'tomyrivera1021@gmail.com'
 *         phone: '0960741444'
 *         cedula: '1316556743'
 *         address: 'manta'
 *         company: 'TomDev'
 * 
 *     ErrorRegisterVerigier:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         status:
 *           type: number
 *       example:
 *         message: 'No se pudo registrar el usuario'
 *         status: 400
 */

/**
 * @swagger
 * /api/user/register-verifier:
 *   post:
 *     summary: Registro de nuevos verificadores
 *     tags:
 *       - Usuario
 *     parameters:
 *      - in: header
 *        name: token
 *        description: Token de autenticación
 *        required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestVerifier'
 *     responses:
 *       '200':
 *         description: Devuelve un objeto de tipo Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestVerifier'
 *       '400':
 *         description: Devuelve un objeto de tipo Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorRegisterVerigier'
 */

/**
 * @swagger
 * /api/user/check-attendance:
 *  put:
 *    summary: Registro de Asistencia , es necesario el token (Autorizado para Verificador y Administrador)
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
 *    summary: Registro de Asistencia por cedula es necesario el token (Autorizado para Verificador y Administrador)
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


/**
 * @swagger
 * /api/user/update-user:
 *  put:
 *    summary: Actualizacion de los datos por parte del usuario participante 
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
 *            $ref: '#/components/schemas/RequestUpdateUser'   
 *    responses:
 *      200:
 *        description: Devuelve el usuario actualizado 
 *      400:
 *        description: Devuelve un objeto de tipo Error  
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorUpdate'                  
 */

/**
 * @swagger
 * /api/user/update-user-verifier/{id}:
 *  put:
 *    summary: Actualizacion de los datos por parte del admin , es necesario el token del mismo
 *    tags: [Usuario]
 *    parameters:
 *      - in: path
 *        name: id
 *        description: id del usuario
 *        required: true
 *        schema:
 *          type: string
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
 *            $ref: '#/components/schemas/RequestUpdateUserVerifier'   
 *    responses:
 *      200:
 *        description: Devuelve el usuario verificador actualizado 
 *      400:
 *        description: Devuelve un objeto de tipo Error  
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorUpdate'                  
 */

/**
 * @swagger
 * /api/user/get-register-by-id/:id:
 *  get:
 *    summary: Obtener un registro por id
 *    tags: [Usuario]
 *    parameters:
 *      - in: header
 *        name: token
 *        description: Token de autenticación
 *        required: true
 *        schema:
 *          type: string
 *      - in: param
 *        name: id
 *        description: El id del registro
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Devuelve el registro
 *      400:
 *        description: Devuelve un objeto de tipo Error  
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'                  
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RequestSendCodeChangePassword:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *       required:
 *         - email
 *       example:
 *         email: example@gmail.com
 * 
 *     ErrorSendCodeChangePassword:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         status:
 *           type: number
 *       example:
 *         message: 'No se pudo enviar el código de verificación'
 *         status: 400
 */

/**
 * @swagger
 * /api/user/send-code-change-password:
 *   put:
 *     summary: Envia código para cambiar la contraseña
 *     tags:
 *       - Usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestSendCodeChangePassword'
 *     responses:
 *       '200':
 *         description: Devuelve un objeto de tipo Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestSendCodeChangePassword'
 *       '400':
 *         description: Devuelve un objeto de tipo Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorSendCodeChangePassword'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RequestChangePassword:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         codeChangePassword:
 *           type: number
 *         newPassword:
 *           type: string
 *       required:
 *         - email
 *         - codeChangePassword
 *         - newPassword
 *       example:
 *         email: example@gmail.com
 *         codeChangePassword: 656397
 *         newPassword: Password123@!
 * 
 *     ErrorChangePassword:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         status:
 *           type: number
 *       example:
 *         message: 'No se pudo cambiar la contraseña'
 *         status: 400
 */

/**
 * @swagger
 * /api/user/change-password:
 *   put:
 *     summary: Cambia la contraseña
 *     tags:
 *       - Usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestChangePassword'
 *     responses:
 *       '200':
 *         description: Devuelve un objeto de tipo Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestChangePassword'
 *       '400':
 *         description: Devuelve un objeto de tipo Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorChangePassword'
 */