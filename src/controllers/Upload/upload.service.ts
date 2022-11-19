import fs from "fs"
import models from "../../models"
import { Request } from "express"
import { v4 as uuid } from "uuid"
import { Transaction } from "sequelize"
import db from "../../models/_instance"
import { getFileType } from "../../helpers/File"
import createDirNotExist from "../../utils/Directory"
import ResponseError from "../../modules/Response/ResponseError"

const { File } = models

class UploadService {
  /**
   *
   * @param formData
   */
  public static async createUploadFile(formData: {
    filename: string
    mimetype: string
  }) {
    const txn = await db.sequelize.transaction()
    let { type, baseDir } = getFileType(formData.mimetype)

    if (type === "image" || type === "video" || type === "pdf") {
      const filename = `${formData.filename}`

      createDirNotExist(`./public/uploads/${baseDir}`)

      fs.rename(
        `public/uploads/tmp/${formData.filename}`,
        `public/uploads/${baseDir}/${filename}`,
        (err) => {}
      )

      const newFormData = {
        filename,
        type,
        path: `/uploads/${baseDir}/${filename}`,
      }

      const data = await File.create(newFormData, { transaction: txn })

      await txn.commit()

      return {
        message: 'Berhasil menambahkan data',
        data,
      }
    }

    throw new ResponseError.BadRequest('Tipe file tidak dapat diproses')
  }
}

export default UploadService
