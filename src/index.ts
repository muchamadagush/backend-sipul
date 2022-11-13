import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import ExpressErrorSequelize from './middlewares/ExpressErrorSequelize'
import ExpressErrorResponse from './middlewares/ExpressErrorResponse'
import createError from 'http-errors'
import indexRouter from './routes'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
const cors = require('cors')
const logger = require('morgan')

import winstonLogger, { winstonStream } from './config/winston'


dotenv.config();

const app: Application = express();
const port = process.env.PORT;

app.use(helmet())
app.use(cors())
app.use(logger('combined', { stream: winstonStream }))
app.use(bodyParser.json({ limit: '100mb', type: 'application/json' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(indexRouter)

app.use('/v1', ExpressErrorSequelize)
app.use('/v1', ExpressErrorResponse)

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404))
})

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // add this line to include winston logging
  winstonLogger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  )

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});