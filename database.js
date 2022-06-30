import { DataTypes, Sequelize } from "sequelize";
import { newUserEntity } from "./user/user.entity.js";
import { newOrderEntity } from "./order/order.entity.js";
import { newTokenEntity } from "./token/token.entity.js";
import { newItemEntity } from "./item/item.entity.js";
import {newOrderHistoryEntity} from "./order_history/order_history.entity.js";

const sequelize = new Sequelize('delivery', 'root', 'root', {
    host: 'localhost',
    port: '3346',
    dialect: 'mysql'
});

const User = newUserEntity(sequelize)
const Order = newOrderEntity(sequelize)
const Token = newTokenEntity(sequelize)

const Profile = sequelize.define(
"Profile",
{
    name: {
        type: DataTypes.STRING,
    },
    post: {
        type: DataTypes.INTEGER,
    }
},
{
    tableName: "profiles",
    underscored: true,
    timestamps: true,
})

const City = sequelize.define(
    "City",
    {
        name: {
            type: DataTypes.STRING,
        },
        post: {
            type: DataTypes.INTEGER,
        }
    },
    {
        tableName: "cities",
        underscored: true,
        timestamps: true,
    }
)

const UserProfile = sequelize.define(
    "UserProfile",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id',
            },
            onUpdate: "Cascade",
            onDelete: "Cascade",
        },
        profileId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'profiles',
                key: 'id',
            },
            onUpdate: "Cascade",
            onDelete: "Cascade",
        }
    },
    {
        tableName: "users_profiles",
        underscored: true,
        timestamps: true,
    }
)

const Item = newItemEntity(sequelize)
const OrderHistory = newOrderHistoryEntity(sequelize)

User.hasMany(Token)
Token.belongsTo(User)
User.hasMany(Order, { as: "orders" })
Order.belongsTo(User, {
    foreignKey: "userId",
    as: "buyer"
})
User.hasMany(Order, {
    as: 'ownerOrders',
    foreignKey: 'ownerId'
})
Order.belongsTo(User, {
    foreignKey: 'ownerId',
    as: 'owner'
})
Order.belongsTo(City, { as: "city" })
City.hasMany(Order)
User.belongsToMany(Profile, { through: UserProfile })
Profile.belongsToMany(User, { through: UserProfile })
Item.hasMany(Order)
Order.belongsTo(Item)
User.hasMany(Item)
Item.belongsTo(User)

export const database = {
    sequelize,
    User,
    City,
    Token,
    UserProfile,
    Profile,
    Order,
    Item,
    OrderHistory,
}
