import models from '../../models'
import { Request } from 'express'
import { v4 as uuid } from 'uuid'
import { Transaction } from 'sequelize'
import db from '../../models/_instance'

const { Project } = models

interface createProject {
  title: string
  description: string
  thumbnailImg: string
  mainTechnology: string
  technologies: string[]
  demoLink: string
  repoLink: string
}

class ProjectService {
  /**
   *
   * @param req Request
   */
   public static async getAllProject(req: Request) {
    const data = await Project.findAll({
      
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
    try {
      const newData = {
        ...formData,
        id: uuid(),
        technologies: JSON.stringify(formData.technologies),
        slug: formData.title.split(' ').join('-')
      }
      const data = await Project.create(newData, { transaction: txn })
  
      await txn.commit()

      return {
        message: 'Berhasil menambahkan data',
        data,
      }
    } catch (error) {
      txn.rollback()
      return {
        message: 'Gagal menambahkan data',
        data: null,
      }
    }
  }

  /**
   *
   * @param req Request
   */
   public static async findById(id: string) {
    const data = await Project.findByPk(id)

    if (data?.technologies) {
      data.technologies = JSON.parse(data.technologies)
    }

    return {
      message: `Data sudah diterima`,
      data,
    }
  }
}

export default ProjectService