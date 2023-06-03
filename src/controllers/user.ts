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
};
