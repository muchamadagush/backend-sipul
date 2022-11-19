import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface ProjectAttributes {
  id: string,
  title: string,
  slug: string,
  description: string,
  mainTechnology: string,
  technologies?: string | null,
  demoLink: string,
  repoLink: string,
  createdAt?: Date | null,
  updatedAt?: Date | null,
  fileId: string,
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id'> { }

export interface ProjectInstance
  extends Model<ProjectAttributes, ProjectCreationAttributes>,
  ProjectAttributes { }

const Project = db.sequelize.define<ProjectInstance>(
  'Projects',
  {
    ...SequelizeAttributes.Projects,
  },
  { paranoid: true }
)

// Project.associate = (models) => {
//   //
// }

export default Project
