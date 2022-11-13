import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import ExpressErrorSequelize from './middlewares/ExpressErrorSequelize'

dotenv.config();

const app: Application = express();
const port = process.env.PORT;

app.use('/', ExpressErrorSequelize)

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});