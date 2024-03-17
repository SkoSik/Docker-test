module.exports = (sequelize, Sequelize) => {
    var UserCategory = sequelize.define(
        'user_category', // определяем имя таблицы
        {
            id: {
                type: Sequelize.INTEGER(10),
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.INTEGER(10),
                allowNull: false
            },
            category_id: {
                type: Sequelize.INTEGER(10),
                allowNull: false
            }
        });

    // Определяем связи таблицы user_category с другими таблицами
    UserCategory.associate = (models) =>  {
        // Определение связи один-ко-многим с таблицей user. Это определение связи с одной стороны.
        // Связь также определена со второй стороны (со стороны таблицы user): в файле user.model.js
        UserCategory.belongsTo(models.user, {
            foreignKey: 'user_id'
        });

        // Определение связи один-ко-многим с таблицей category. Это определение связи с одной стороны.
        // Связь также определена со второй стороны (со стороны таблицы category): в файле category.model.js
        UserCategory.belongsTo(models.category, {
            foreignKey: 'category_id'
        });

        // Определение связи один-ко-многим с таблицей spending. Это определение связи с одной стороны.
        // Связь также определена со второй стороны (со стороны таблицы spending): в файле spending.model.js
        UserCategory.hasMany(models.spending, {
            foreignKey: 'user_category_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
            sourceKey: 'id'
        });
    };
    return UserCategory;
};