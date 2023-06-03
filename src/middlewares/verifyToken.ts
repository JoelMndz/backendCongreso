import jwt from 'jsonwebtoken';

import { SECRET } from '../config';
import { NextFunction, Request, Response } from 'express';
import { handleError } from '../error';


export const verificarToken = async(req:Request, res:Response, next:NextFunction)=>{
    try {
      const token = req.headers['token'] as string;

      if(!token){
        const error:any = new Error('No ha enviado el token');
        error.status = 401;
        return handleError(res,error);
      }

      const decode:any = jwt.verify(token!, SECRET!);
      
      req.query.userId = decode.id;
      next();
    } catch (error:any) {
      return handleError(res,new Error('Token inválido o expirado!'));
    }
}