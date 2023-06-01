import { Router } from "express";
import { CourseController } from "../controllers";

export const RouterCourse = Router();

RouterCourse.post('/crete-course', CourseController.createCourse);

/**
 * /**
 * @swagger
 * components:
 *   schemas:
 *     RequestCreateCourse:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         photoBase64:
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
 *         certificateTemplateBase64: 
 *           type: string
 *       required:
 *         - title
 *         - description
 *         - photoBase64
 *         - price
 *         - type
 *         - startDate
 *         - endDate
 *       example:
 *         title: Curso de React
 *         description: Curso de React para principiantes
 *         photoBase64: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAA...
 *         price: 100
 *         type: workshop
 *         startDate: "2021-05-01T00:00:00.000Z"
 *         endDate: "2021-05-01T00:00:00.000Z"
 *         certificateTemplateBase64: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAA...
 *    
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         status:
 *           type: number
 *         example:
 *           message: 'Curso registrado!'
 *           errors: []
 *           status: 400
 */

/**
 * @swagger
 * tags:
 *   - name: Course
 *     description: Endpoints para el manejo de cursos
 */

/**
 * @swagger
 * /api/course/create-course:
 *   post:
 *     summary: Crear un curso
 *     tags: [Course]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestCreateCourse'
 *     responses:
 *       '200':
 *         description: Crear un curso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestCreateCourse'
 *       '400':
 *         description: Devuelve un objeto de tipo Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

RouterCourse.get('/get-courses', CourseController.getAllCourses);

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
 *         photoBase64:
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
 *         certificateTemplateBase64: 
 *           type: string
 *       required:
 *         - title
 *         - description
 *         - photoBase64
 *         - price
 *         - type
 *         - startDate
 *         - endDate
 *       example:
 *         title: Curso de React
 *         description: Curso de React para principiantes
 *         photoBase64: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAA...
 *         price: 100
 *         type: workshop
 *         startDate: "2021-05-01T00:00:00.000Z"
 *         endDate: "2021-05-01T00:00:00.000Z"
 *         certificateTemplateBase64: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAA...
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
 *   - name: Course
 *     description: Endpoints para el manejo de cursos
 */

/**
 * @swagger
 * /api/course/get-courses:
 *   get:
 *     summary: Obtener todos los cursos
 *     tags:
 *       - Course
 *     responses:
 *       '200':
 *         description: Devuelve todos los cursos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestGetAllCourses'
 *       '400':
 *         description: Devuelve un objeto de tipo Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

RouterCourse.get('/get-course/:id', CourseController.getCourseById);
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
 *   - name: Course
 *     description: Endpoints para el manejo de cursos
 */

/**
 * @swagger
 * /api/course/get-course/{id}:
 *   get:
 *     summary: Obtener un curso por id
 *     tags:
 *       - Course
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id del curso
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Devuelve el curso con el id ingresado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestGetCourseById'
 *       '400':
 *         description: Devuelve un objeto de tipo Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

RouterCourse.put('/update-course/:id', CourseController.updateCourse);

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
 *         photoBase64:
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
 *         certificateTemplateBase64:
 *           type: string
 *       required:
 *         - title
 *         - description
 *         - photoBase64
 *         - price
 *         - type
 *         - startDate
 *         - endDate
 *       example:
 *         title: Curso de React
 *         description: Curso de React para principiantes
 *         photoBase64: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAA...
 *         price: 100
 *         type: workshop
 *         startDate: "2021-05-01T00:00:00.000Z"
 *         endDate: "2021-05-01T00:00:00.000Z"
 *         certificateTemplateBase64: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAA...
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
 *   - name: Course
 *     description: Endpoints para el manejo de cursos
 */

/**
 * @swagger
 * /api/course/update-course/{id}:
 *   put:
 *     summary: Actualizar un curso por id
 *     tags:
 *       - Course
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
 *       '200':
 *         description: Devuelve el curso con el id ingresado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestUpdateCourse'
 *       '400':
 *         description: Devuelve un objeto de tipo Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

RouterCourse.delete('/delete-course/:id', CourseController.deleteCourse);
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
 *   - name: Course
 *     description: Endpoints para el manejo de cursos
 */

/**
 * @swagger
 * /api/course/delete-course/{id}:
 *   delete:
 *     summary: Eliminar un curso por id
 *     tags:
 *       - Course
 *     parameters:
 *       - name: id
 *         in: path
 *         description: id del curso
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Devuelve el curso con el id ingresado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestDeleteCourse'
 *       '400':
 *         description: Devuelve un objeto de tipo Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */