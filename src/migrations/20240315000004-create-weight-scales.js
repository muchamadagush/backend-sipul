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
      TypeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Types',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      ProductId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.addIndex('WeightScales', ['TypeId'])
    await queryInterface.addIndex('WeightScales', ['ProductId'])
    await queryInterface.addIndex('WeightScales', ['ScaleId'])
  },

  async down(queryInterface) {
    await queryInterface.dropTable('WeightScales')
  }
}