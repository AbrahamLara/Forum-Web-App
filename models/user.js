module.exports = function(sequelize,DataTypes){
    var User = sequelize.define('users',{
        name: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        email: {
            type: Sequelize.TEXT,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    },{
        classMethods: {
            associate: function(models){
                
            }
        }
    });

    return User;
};