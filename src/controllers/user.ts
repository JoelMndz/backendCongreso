import { Request, Response } from "express";
import { handleError } from "../error";
import { UserService } from "../services";

export const UserController = {
  registerParticipant: async (req: Request, res: Response) => {
    try {
      const data = await UserService.registerParticipant(req.body);
      return res.json(data);
    } catch (error: any) {
      handleError(res, error);
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const data = await UserService.login(req.body);
      return res.json(data);
    } catch (error: any) {
      handleError(res, error);
    }
  },

  loginWithToken: async (req: Request, res: Response) => {
    try {
      const data = await UserService.findById(req.query.userId as string);
      return res.json({user: data, token: req.headers.token});
    } catch (error: any) {
      handleError(res, error);
    }
  },

  getAllRegisters: async (req: Request, res: Response) => {
    try {
      const data = await UserService.getAllRegisters(req.query.status as string);
      return res.json(data);
    } catch (error: any) {
      handleError(res, error);
    }
  },

  updateStatusRegister: async (req: Request, res: Response) => {
    try {
      const data = await UserService.updateStatusRegister(req.body);
      return res.json(data);
    } catch (error: any) {
      handleError(res, error);
    }
  },

  registerAdministrator: async (req: Request, res: Response) => {
    try {
      const data = await UserService.registerAdmin(req.body);
      return res.json(data);
    } catch (error: any) {
      handleError(res, error);
    }
  },

  registerVerifier: async (req: Request, res: Response) => {
    try {
      const data = await UserService.registerVerifier(req.body);
      return res.json(data);
    } catch (error: any) {
      handleError(res, error);
    }
  },
  
  checkAttendance: async (req:Request,res: Response) => {
    try {
      const data = await UserService.checkAttendance(req.body);
      return res.json(data)
      
    } catch (error:any) {
      handleError(res,error)
    }
  },
  
  checkAttendanceIdentity: async (req:Request,res: Response) => {
    try {
      const data = await UserService.checkAttendanceIdentity(req.body);
      return res.json(data)
      
    } catch (error:any) {
      handleError(res,error)
    }
  },

  getAllRegistersByParticipant: async (req: Request, res: Response) => {
    try {
      const data = await UserService.getAllRegistersByParticipant(req.query.userId as string);
      return res.json(data);
    } catch (error: any) {
      handleError(res, error);
    }
  },
  updatetUser:async (req:Request,res:Response)=>{
    try {
      const data = await UserService.updatetUser(req.query.id as string,req.body);
      return res.json(data)
    } catch (error:any) {
      handleError(res, error);
    }
  },
  updateVerifierForAdmin:async (req:Request,res:Response)=>{
    try {
      const data = await UserService.updateVerifierForAdmin(req.query.id as string,req.body);
      return res.json(data)
    } catch (error:any) {
      handleError(res, error);
    }
  },

  sendCodeChangePassword: async (req: Request, res: Response) => {
    try {
      const data = await UserService.sendCodeChangePassword(req.body);
      return res.json(data);
    } catch (error: any) {
      handleError(res, error);
    }
  },

  getRegisterById: async (req: Request, res: Response) => {
    try {
      const data = await UserService.getRegisterById(req.params.id as string);
      return res.json(data);
    } catch (error: any) {
      handleError(res, error);
    }
  },

  changePassword: async (req: Request, res: Response) => {
    try {
      const data = await UserService.resetPassword(req.body);
      return res.json(data);
    } catch (error: any) {
      handleError(res, error);
    }
  },
};
