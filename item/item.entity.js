import { DataTypes } from "sequelize";

export const newItemEntity = (sequelize) => {
    return sequelize.define(
        "Item",
        {
            name: {
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.STRING,
            },
            price: {
                type: DataTypes.DECIMAL,
            },
            quantity: {
                type: DataTypes.INTEGER,
            },
            userId: {
                type: DataTypes.INTEGER,
            },
            reserved: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
        },
        {
            tableName: "items",
            underscored: true,
            timestamps: true,
        }
    )
}