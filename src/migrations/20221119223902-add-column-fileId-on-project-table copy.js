module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Projects', 'fileId', {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null,
      }),
    ])
  },

  down(queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn('Projects', 'fileId')])
  },
}
