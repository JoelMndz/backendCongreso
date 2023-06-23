import jwt from 'jsonwebtoken';

import { SECRET } from '../config';
import { NextFunction, Request, Response } from 'express';
import { handleError } from '../error';
import { UserModel } from '../models';
import { ROLES } from '../constants';


export const allowVerifierOrAdmin = async(req:Request, res:Response, next:NextFunction)=>{
    try {
      const token = req.headers['token'] as string;

      if(!token){
        const error:any = new Error('No ha enviado el token');
        error.status = 401;
        return handleError(res,error);
      }

      const decode:any = jwt.verify(token!, SECRET!);
      
      const user = await UserModel.findById(decode.id)
      if (user?.role !== ROLES.VERIFIER && user?.role !== ROLES.ADMINISTRATOR) throw new Error("Usuario no autorizado, solo está autorizado el verificador o el administrador");
      req.query.userId = decode.id;
      next();
    } catch (error:any) {
      return handleError(res,new Error(error?.message ?? 'Token inválido o expirado!'));
    }
}