import { StringObject } from '../interfaces/common'

const {
  PORT,
  NODE_ENV,
  DEV_URL_SERVER,
  STAGING_URL_SERVER,
  PRODUCTION_URL_SERVER,
} = process.env

const BASE_URL: StringObject = {
  development: DEV_URL_SERVER || `http://localhost:${PORT || 8080}`,
  staging: STAGING_URL_SERVER as string,
  production: PRODUCTION_URL_SERVER as string,
}

const ENV = NODE_ENV || 'development'

export const BASE_URL_SERVER = BASE_URL[ENV]
