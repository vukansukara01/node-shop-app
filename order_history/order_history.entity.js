import { DataTypes } from "sequelize";

export const newOrderHistoryEntity = (sequelize) => {
    return sequelize.define(
        "OrderHistory",
        {
            price: {
                type: DataTypes.DECIMAL(10, 2),
            },
            userFirstName: {
              type: DataTypes.STRING
            },
            userLastName: {
                type: DataTypes.STRING
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
            ownerFirstName: {
                type: DataTypes.STRING
            },
            ownerLastName: {
                type: DataTypes.STRING
            },
            itemId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'items',
                    key: 'id',
                },
                onUpdate: "Cascade",
                onDelete: "Cascade",
            },
            itemName: {
                type: DataTypes.STRING
            },
            itemPrice: {
                type: DataTypes.DECIMAL(10, 2),
            }
        },
        {
            tableName: "order_history",
            underscored: true,
            timestamps: true,
        }
    )
}