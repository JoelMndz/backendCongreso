import { Router } from "express";
import { CourseController } from "../controllers";

export const RouterCourse = Router();

RouterCourse.get("/crear-curso", CourseController.createCourse);

/**
 * @swagger
 * components:
 *  schemas:
 *   RequestCreateCourse:
 *    type: object
 *    properties:
 *     title:
 *       type: string
 *     description:
 *       type: string
 *     photoURL:
 *       type: string
 *     price:
 *       type: number
 *     type:
 *       type: string
 *       enum: ['workshop', 'congress']
 *     startDate:
 *       type: string
 *       format: date-time
 *     endDate:
 *       type: string
 *       format: date-time
 *     certificateTemplateURL:
 *       type: string
 *   required:
 *   - title
 *   - description
 *   - photoURL
 *   - price
 *   - type
 *   - startDate
 *   - endDate
 *   - certificateTemplateURL
 *   example:
 *    title: Curso de React
 *    description: Curso de React para principiantes
 *    photoURL: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.campusmvp.es%2Frecursos%2Fpost%2Fc"
 *    price: 100
 *    type: workshop
 *    startDate: "2021-05-01T00:00:00.000Z"
 *    endDate: "2021-05-01T00:00:00.000Z"
 *    certificateTemplateURL: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.campusmvp.es%2Frecursos%2Fpost%2Fc"
 *    
 *   Error:
 *    type: object
 *    properties:
 *     message:
 *       type: string
 *     status:
 *       type: number
 *     example:
 *      message: 'Curso registrado!'
 *      errors: []
 *      status: 400
 */

/**
 * @swagger
 * tags:
 *   name: Curso
 *   description: Endpoints para el manejo de cursos
 */

/**
 * @swagger
 * /api/course/crear-curso:
 *  post:
 *    summary: Crear un curso
 *    tags: [Curso]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RequestCreateCourse'
 *    responses:
 *      200:
 *        description: Devuelve el curso ingresado con el id
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RequestCreateCourse'
 *      400:
 *        description: Devuelve un objeto de tipo Error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */

RouterCourse.get("/obtener-cursos", CourseController.getAllCourses);

/**
 * @swagger
 * components:
 *   schemas:
 *     RequestGetAllCourses:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         photoURL:
 *           type: string
 *         price:
 *           type: number
 *         type:
 *           type: string
 *           enum: ['workshop', 'congress']
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         certificateTemplateURL:
 *           type: string
 *       required:
 *         - title
 *         - description
 *         - photoURL
 *         - price
 *         - type
 *         - startDate
 *         - endDate
 *         - certificateTemplateURL
 *       example:
 *         title: Curso de React
 *         description: Curso de React para principiantes
 *         photoURL: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.campusmvp.es%2Frecursos%2Fpost%2Fc"
 *         price: 100
 *         type: workshop
 *         startDate: "2021-05-01T00:00:00.000Z"
 *         endDate: "2021-05-01T00:00:00.000Z"
 *         certificateTemplateURL: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.campusmvp.es%2Frecursos%2Fpost%2Fc"
 * 
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         status:
 *           type: number
 *       example:
 *         message: 'Curso registrado!'
 *         errors: []
 *         status: 400
 */

/**
 * @swagger
 * tags:
 *   name: Curso
 *   description: Endpoints para el manejo de cursos
 */

/**
 * @swagger
 * /api/course/obtener-cursos:
 *   get:
 *     summary: Obtener todos los cursos
 *     tags: [Curso]
 *     responses:
 *       200:
 *         description: Devuelve todos los cursos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestGetAllCourses'
 *       400:
 *         description: Devuelve un objeto de tipo Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

RouterCourse.get("/obtener-curso/:id", CourseController.getCourseById);
/**
 * @swagger
 * components:
 *   schemas:
 *     RequestGetCourseById:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *       required:
 *         - id
 *       example:
 *         id: 60a0b0b0b0b0b0b0b0b0b0b0
 * 
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         status:
 *           type: number
 *       example:
 *         message: 'Curso registrado!'
 *         errors: []
 *         status: 400
 */

/**
 * @swagger
 * tags:
 *   name: Curso
 *   description: Endpoints para el manejo de cursos
 */

/**
 * @swagger
 * /api/course/obtener-curso/{id}:
 *   get:
 *     summary: Obtener un curso por id
 *     tags: [Curso]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id del curso
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Devuelve el curso con el id ingresado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestGetCourseById'
 *       400:
 *         description: Devuelve un objeto de tipo Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

RouterCourse.put("/actualizar-curso/:id", CourseController.updateCourse);
/**
 * @swagger
 * components:
 *   schemas:
 *     RequestUpdateCourse:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         photoURL:
 *           type: string
 *         price:
 *           type: number
 *         type:
 *           type: string
 *           enum: ['workshop', 'congress']
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         certificateTemplateURL:
 *           type: string
 *       required:
 *         - title
 *         - description
 *         - photoURL
 *         - price
 *         - type
 *         - startDate
 *         - endDate
 *         - certificateTemplateURL
 *       example:
 *         title: Curso de React
 *         description: Curso de React para principiantes
 *         photoURL: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.campusmvp.es%2Frecursos%2Fpost%2Fc"
 *         price: 100
 *         type: workshop
 *         startDate: "2021-05-01T00:00:00.000Z"
 *         endDate: "2021-05-01T00:00:00.000Z"
 *         certificateTemplateURL: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.campusmvp.es%2Frecursos%2Fpost%2Fc"
 * 
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         status:
 *           type: number
 *       example:
 *         message: 'Curso actualizado!'
 *         errors: []
 *         status: 400
 */

/**
 * @swagger
 * tags:
 *   name: Curso
 *   description: Endpoints para el manejo de cursos
 */

/**
 * @swagger
 * /api/course/actualizar-curso/{id}:
 *   put:
 *     summary: Actualizar un curso por id
 *     tags: [Curso]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id del curso
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestUpdateCourse'
 *     responses:
 *       200:
 *         description: Devuelve el curso con el id ingresado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestUpdateCourse'
 *       400:
 *         description: Devuelve un objeto de tipo Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

RouterCourse.delete("/eliminar-curso/:id", CourseController.deleteCourse);
/**
 * @swagger
 * components:
 *   schemas:
 *     RequestDeleteCourse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *       required:
 *         - id
 *       example:
 *         id: 60a0b0b0b0b0b0b0b0b0b0b0
 * 
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         status:
 *           type: number
 *       example:
 *         message: 'Curso eliminado!'
 *         errors: []
 *         status: 400
 */

/**
 * @swagger
 * tags:
 *   name: Curso
 *   description: Endpoints para el manejo de cursos
 */

/**
 * @swagger
 * /api/course/eliminar-curso/{id}:
 *   delete:
 *     summary: Eliminar un curso por id
 *     tags: [Curso]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id del curso
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Devuelve el curso con el id ingresado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestDeleteCourse'
 *       400:
 *         description: Devuelve un objeto de tipo Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */