module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Projects', 'technologies', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      }),
    ])
  },

  down(queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn('Projects', 'technologies')])
  },
}
