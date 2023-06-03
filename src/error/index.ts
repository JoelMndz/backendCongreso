import {Response} from 'express'

export const handleError = (res: Response, error: any)=>{  
  return res.status(error?.status ?? 400)
    .json({
      ...error,
      mensaje: error?.message ?? 'Error en el servidor',
    })
}