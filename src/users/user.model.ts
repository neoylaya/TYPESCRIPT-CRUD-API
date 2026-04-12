// src/users/user.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import type { Sequelize } from 'sequelize';

<<<<<<< HEAD

=======
>>>>>>> 151959f40d49d087b4f00462d27705431722ef55
// Define the attributes interface
export interface UserAttributes {
  id: number;
  email: string;
  passwordHash: string;
  title: string;
  firstName: string;
  lastName: string;
  role: string;
<<<<<<< HEAD
  createdAt: Date;   
  updatedAt: Date;  
=======
  createdAt: Date;   // ✅ ADD THIS
  updatedAt: Date;   // ✅ ADD THIS
>>>>>>> 151959f40d49d087b4f00462d27705431722ef55
}

// Define optional attributes for creation
export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the Sequelize model class
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {

  public id!: number;
  public email!: string;
  public passwordHash!: string;
  public title!: string;
  public firstName!: string;
  public lastName!: string;
  public role!: string;
<<<<<<< HEAD
  public readonly createdAt!: Date;  
  public readonly updatedAt!: Date;   
=======
  public readonly createdAt!: Date;   // ✅ ADD THIS
  public readonly updatedAt!: Date;   // ✅ ADD THIS
>>>>>>> 151959f40d49d087b4f00462d27705431722ef55
}

// Export the model initializer function
export default function (sequelize: Sequelize): typeof User {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
<<<<<<< HEAD
      timestamps: true,  
=======
      timestamps: true,  // ✅ Ensure this is true (default)
>>>>>>> 151959f40d49d087b4f00462d27705431722ef55
      defaultScope: {
        attributes: { exclude: ['passwordHash'] },
      },
      scopes: {
        withHash: {
          attributes: { include: ['passwordHash'] },
        },
      },
    }
  );

  return User;
<<<<<<< HEAD
  
}
=======
}
>>>>>>> 151959f40d49d087b4f00462d27705431722ef55
