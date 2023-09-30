import * as fs from 'fs'
import { Express } from 'express'
import { isEmpty } from 'lodash'

export function removeFileReqFiles(
  files:
    | {
        [fieldname: string]: Express.Multer.File[]
      }
    | Express.Multer.File[]
) {
  if (files && Object.keys(files).length > 0) {
    const entryFiles = Object.entries(files)
    for (let i = 0; i < entryFiles.length; i += 1) {
      const [key, value] = entryFiles[i]
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i += 1) {
          const file = value[i]
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path)
          }
        }
      } else if (fs.existsSync(value.path)) {
        fs.unlinkSync(value.path)
      }
    }
  }
}

export function removeFile(pathFile: string) {
  if (!isEmpty(pathFile)) {
    if (fs.existsSync(pathFile.replace(/^\/+/g, ''))) {
      fs.unlinkSync(pathFile.replace(/^\/+/g, ''))
    }
  }
}
