'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return Promise.resolve([
            Sequelize.query("INSERT INTO `app_version` (`ver_id`, `ver_code`, `ver_platform`, `ver_status`, `created_by`, `created_date`, `updated_by`, `updated_date`) SELECT null, `ver_code`, 'ios', `ver_status`, `created_by`, `created_date`, `updated_by`, `updated_date` FROM `app_version` WHERE `ver_platform` = 'android';"),
        ])
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return Promise.resolve([
            Sequelize.query("DELETE FROM 'app_version' WHERE 'ver_platform' = 'ios';"),
        ]);
    }
}