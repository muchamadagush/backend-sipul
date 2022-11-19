module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Projects', 'thumbnailImg')
    ])
  },

  down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('Projects', 'thumbnailImg', {
        type: Sequelize.TEXT
      }),
    ])
  },
}
