import { Request, Response, Router } from 'express';
import UserService from '../../services/userService';
import wrap from 'express-async-handler';
import verifyToken from '../../middlewares/auth';
import verifyRole from '../../middlewares/admin';

const route = Router();

const ALLOWED_ROLES = ['admin']

export default (app: Router) => {
  app.use('/users', route);

  route.post(
    '/register',
    wrap(async (req: Request, res: Response) => {
      const { username, password, role } = req.body;
      const newUser = await UserService.register(username, password, role);
      res.json(newUser).status(200);
    }),
  );

  route.post(
    '/login',
    wrap(async (req: Request, res: Response) => {
      const { username, password } = req.body;
      const user = await UserService.login(username, password);
      res.json(user).status(200);
    }),
  );

  route.get(
    '/admin',
    (req,res,next) => verifyRole(req,res,next,ALLOWED_ROLES),
    wrap(async (req: Request, res: Response) => {
      res.json({msg:"Hello Admin"}).status(200);
    }),
  );


  route.get(
    '/info',
    verifyToken,
    wrap(async (req: Request, res: Response) => {
      const { username } = req.params;
      const user = await UserService.getUser(username);
      res.json(user).status(200);
    }),
  );
};
