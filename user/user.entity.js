import { DataTypes } from "sequelize";

export const newUserEntity = (sequelize) => {
    return sequelize.define(
        "User",
        {
            email: {
                type: DataTypes.STRING(100),
                unique: true
            },
            firstName: {
                type: DataTypes.STRING
            },
            lastName: {
                type: DataTypes.STRING
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            verifiedAt: {
                type: DataTypes.DATE,
                allowNull: true,
                default: null,
            }
        },
        {
            tableName: "users",
            underscored: true,
            timestamps: true,
        }
    )
}