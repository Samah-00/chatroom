const { Sequelize, DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Message extends Model {}
    Message.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            text: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            timestamp: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
            },
            lastUpdated: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Message",
            timestamps: true,
            updatedAt: "lastUpdated",
        }
    );
    return Message;
}
