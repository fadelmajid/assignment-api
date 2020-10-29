'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('movie_log',
            {
                movie_log_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                url: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                type: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                request: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                response: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                created_date: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            })
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('movie_log');
    }
}