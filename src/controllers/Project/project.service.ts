import models from '../../models'
import { Request } from 'express'
import { v4 as uuid } from 'uuid'
import { Transaction } from 'sequelize'
import db from '../../models/_instance'
import ResponseError from '../../modules/Response/ResponseError'

const { Project, File } = models

interface createProject {
  title: string
  description: string
  mainTechnology: string
  technologies: string[]
  demoLink: string
  repoLink: string
  fileId: string
}

class ProjectService {
  /**
   *
   * @param req Request
   */
  public static async getAllProject(req: Request) {
    const data = await Project.findAll({
      include: {
        model: File,
        as: 'thumbnailImg',
      },
    })

    const count = await Project.count()

    return {
      message: `${count} data sudah diterima`,
      count,
      data,
    }
  }

  /**
   *
   * @param req Request
   */
  public static async createProject(formData: createProject) {
    const txn = await db.sequelize.transaction()
    const newData = {
      ...formData,
      id: uuid(),
      technologies: JSON.stringify(formData.technologies),
      slug: formData.title.split(' ').join('-').toLowerCase(),
    }
    const data = await Project.create(newData, { transaction: txn })

    await txn.commit()

    data.technologies = JSON.parse(data.technologies)

    return {
      message: 'Berhasil menambahkan data',
      data,
    }
  }

  /**
   *
   * @param req Request
   */
  public static async findById(id: string) {
    const data = await Project.findByPk(id)

    if (!data) {
      throw new ResponseError.NotFound('Data tidak ditemukan')
    }

    if (data?.technologies) {
      data.technologies = JSON.parse(data.technologies)
    }

    return {
      message: `Data sudah diterima`,
      data,
    }
  }

  /**
   *
   * @param id string
   * @param isForce boolean
   */
  public static async deleteProject(id: string, isForce: boolean) {
    const txn = await db.sequelize.transaction()

    await Project.destroy({
      where: { id },
      force: isForce,
      transaction: txn
    })

    await txn.commit()
  }
}

export default ProjectService