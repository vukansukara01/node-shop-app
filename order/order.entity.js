import { DataTypes } from "sequelize";

export const newOrderEntity = (sequelize) => {
    return sequelize.define(
        "Order",
        {
            price: {
                type: DataTypes.DECIMAL(10, 2),
            },
            userId: {
                type: DataTypes.INTEGER,
            },
            cityId: {
                type: DataTypes.INTEGER
            },
            address: {
                type: DataTypes.STRING
            },
            postcode: {
                type: DataTypes.STRING
            },
            status: {
              type: DataTypes.STRING
            },
            ownerId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: "Cascade",
                onDelete: "Cascade",
            },
            itemId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'items',
                    key: 'id',
                },
                onUpdate: "Cascade",
                onDelete: "Cascade",
            }
        },
        {
            tableName: "orders",
            underscored: true,
            timestamps: true,
        }
    )
}