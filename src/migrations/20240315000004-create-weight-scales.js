import { DataTypes } from 'sequelize'

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('WeightScales', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      ProductId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        defaultValue: null
      },
      ScaleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Scales',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    })

    // Add indexes for better query performance
    await queryInterface.addIndex('WeightScales', ['ProductId'])
    await queryInterface.addIndex('WeightScales', ['ScaleId'])
  },

  async down(queryInterface) {
    await queryInterface.dropTable('WeightScales')
  }
}