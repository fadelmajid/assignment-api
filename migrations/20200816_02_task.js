'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('task',
            {
                task_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                user_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                description: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                location: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                time: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                status: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                start_at: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                end_at: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                created_date: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                updated_date: {
                    type: Sequelize.DATE,
                    allowNull: true
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            })
            .then(function () {
                return [
                    queryInterface.addIndex('task', ['user_id'])
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('task');
    }
}