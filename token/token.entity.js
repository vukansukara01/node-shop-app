import { DataTypes } from "sequelize";

export const newTokenEntity = (sequelize) => {
    return sequelize.define(
        'Token',
        {
            value: {
                type: DataTypes.STRING,
                allowNull: false
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            userId: {
                type: DataTypes.INTEGER,
            }
        },
        {
            tableName: "tokens",
            underscored: true,
            timestamps: true,
        }
    )
}