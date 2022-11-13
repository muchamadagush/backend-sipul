import models from '../../models'
import { Request } from 'express'

const { Project } = models

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
}

export default ProjectService