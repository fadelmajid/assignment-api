'use strict';
//doc : http://sequelize.readthedocs.io/en/latest/docs/models-definition


module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.addColumn('task', 'is_deleted', {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        })
    },
    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.removeColumn('task', 'is_deleted')
    }
}