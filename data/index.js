const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');

const instances = new Map();

class ModelsLoader {
  constructor({ host, port, user, password, name }) {
    const sequelize = new Sequelize(name, user, password, {
      host,
      port,
      dialect: 'postgres',
      logging: console.log,
      dialectOptions: {
        charset: 'utf8mb4',
      },
      define: {
        syncOnAssociation: true,
      },
    });

    this.db = {
      sequelize,
      Sequelize,
    };
  }

  static getInstance(dbConfig) {
    const { host, port, user, password, name } = dbConfig;
    const dbConnectionKey = `${host}${port}${user}${password}${name}`;

    if (!instances.has(dbConnectionKey)) {
      const dbInstance = new ModelsLoader({ host, port, user, password, name });
      dbInstance.init();
      instances.set(dbConnectionKey, dbInstance);
    }

    return instances.get(dbConnectionKey);
  }

  init() {
    const db = this.db;
    const modelsLocationFolder = path.join(`${__dirname}`,  'model');
    const folderList = this.getFileList(modelsLocationFolder);
    folderList.forEach(folder => {
      const fileName = path.join(modelsLocationFolder, folder);
      const fileList = this.getFileList(fileName);
      fileList.forEach(file => {
        const model = db.sequelize.import(path.join(fileName, file));
        db[model.name] = model;
      });
    });

    Object.keys(db).forEach((modelName) => {
      if ('associate' in db[modelName]) db[modelName].associate(db);
    });
    return db;
  }

  getFileList(dir) {
    return fs.readdirSync(dir).filter((file) => (file.indexOf('.') !== 0) && (file !== 'index.js'));
  }
}

module.exports = ModelsLoader;
