module.exports = (sequelize, Sequelize) => {
    var Spending = sequelize.define(
        'spending', // определяем имя таблицы
        {
            id: {
                type: Sequelize.INTEGER(10),
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            cost: {
                type: Sequelize.DOUBLE,
                allowNull: false
            },
            description: {
                type: Sequelize.STRING(500),
                allowNull: false
            },
            spending_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            user_category_id: {
                type: Sequelize.INTEGER(10),
                allowNull: false
            }
        });

    // Определяем связи таблицы spending с другими таблицами
    Spending.associate = (models) =>  {
        // Определение связи один-ко-многим с таблицей user_category. Это определение связи с одной стороны.
        // Связь также определена со второй стороны (со стороны таблицы user_category): в файле user_category.model.js
        Spending.belongsTo(models.user_category, {
            foreignKey: 'user_category_id'
        });
    };
    return Spending;
};