module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define('comments', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userToken: {
      type: DataTypes.STRING,
      allowNull: false
    },
    commentText: {
      type: DataTypes.STRING,
      allowNull: false
    },
    assessment: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  });

  return Comments;
};

