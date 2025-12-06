import express from 'express';
import { fetchAllUsers } from '#controllers/users.controller.js';

const userRouter = express.Router();

userRouter.get('/', fetchAllUsers);
userRouter.get('/:id', (req, res) => res.send('GET /users/:id'));
userRouter.put('/:id', (req, res) => res.send('PUT /users/:id'));
userRouter.delete('/:id', (req, res) => res.send('DELETE /users/:id'));

export default userRouter;