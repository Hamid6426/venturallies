import { DataTypes } from 'sequelize';

const Career = sequelize.define('Career', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  // Add more fields as needed
}, {
  tableName: 'careers',  // your actual table name
  timestamps: false,   // or true if you have timestamps columns
});

export default Career;
