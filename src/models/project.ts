import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface ProjectAttributes {
  id: string,
  title: string,
  slug: string,
  description: string,
  mainTechnology: string,
  thumbnailImg: string,
  demoLink: string,
  repoLink: string,
  createdAt: Date,
  updatedAt: Date,
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id'> { }

export interface ProjectInstance
  extends Model<ProjectAttributes, ProjectCreationAttributes>,
  ProjectAttributes { }

const Project = db.sequelize.define<ProjectInstance>(
  'Projects',
  {
    ...SequelizeAttributes.Blogs,
  },
  { paranoid: true }
)

Project.associate = (models: any) => {
}

export default Project
