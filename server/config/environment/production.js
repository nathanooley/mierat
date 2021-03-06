'use strict';
/*eslint no-process-env:0*/

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP
  || process.env.ip
  || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT
  || process.env.PORT
  || 8080,

  sequelize: {
    uri: process.env.OPENSHIFT_MYSQL_DB_URL + process.env.OPENSHIFT_APP_NAME || process.env.CLEARDB_DATABASE_URL || process.env.JAWSDB_URL || 'mysql://root:root@localhost/crud',
    options: {
      logging: false,
      storage: 'dist.sqlite',
      define: {
        timestamps: false
      }
    }
  },
  // Seed database on startup
  seedDB: true
};
