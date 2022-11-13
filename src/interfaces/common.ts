import { Op } from 'sequelize'

export interface StringObject {
  [key: string]: string
}

export interface IFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  destination: string
  filename: string
  path: string
  size: number
  // buffer: Buffer
}
export interface IFiles {
  [key: string]: IFile
}

export interface IModuleCreate {
  id?: string
  title: string
  index: number
}

export interface IMultipleIdWithCompany {
  id: {
    [Op.in]: string[]
  }
  CompanyId?: string
}
