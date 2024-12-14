import { DataTypes } from 'sequelize'

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('Scales', {
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
      title: {
        type: DataTypes.STRING,
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
    await queryInterface.addIndex('Scales', ['TypeId'])
  },
  
  async down(queryInterface) {
    await queryInterface.dropTable('Scales')
  }
}