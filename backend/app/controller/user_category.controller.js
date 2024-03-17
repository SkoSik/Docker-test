var db = require('../config/db.config.js');
var User = db.user;
var Category = db.category;
var UserCategory = db.user_category;
var globalFunctions = require('../config/global.functions.js');

exports.findCategoriesForUser = (req, res) => {
    UserCategory.findAll({
        include: [
            {
                model: User,
                required: true, // INNER JOIN
                where: {
                    id: req.params.user_id
                }
            },
            {
                model: Category,
                required: true, // INNER JOIN
            }
        ]
    })
        .then(objects => {
            globalFunctions.sendResult(res, objects);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
};

// Получение категорий, которые пользователь не выбрал
exports.findCategoriesNotUser = (req, res) => {
    db.sequelize.query(
        `SELECT * FROM category 
            WHERE NOT EXISTS ( 
                SELECT * FROM user_category 
                WHERE user_id = ? AND user_category.category_id = category.id
            )`,
        {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: [req.params.user_id] // подстановка параметров
        })
        .then(objects => {
            globalFunctions.sendResult(res, objects);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
};

// Добавление массива категорий
exports.createCategories = (req, res) => {
    var categories = req.body.categories;
    var data = [];
    for (var i = 0; i < categories.length; i++) {
        // сначала добавляем идентификатор категории
        data.push(categories[i]);
        // затем добавляем идентификатор пользователя
        data.push(req.body.user_id);

    }
    var placeholders = categories.map(() => '(?,?)').join(',');
    db.sequelize.query(
        `INSERT INTO user_category(category_id, user_id) VALUES ` + placeholders,
        {
            type: db.sequelize.QueryTypes.INSERT,
            replacements: data // подстановка параметров
        })
        .then(object => {
            globalFunctions.sendResult(res, object);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        });
};

// Удаление категории пользователя
exports.deleteCategoryForUser = (req, res) => {
    UserCategory.destroy({
        where: {
            id: req.params.user_category_id
        }
    }).then(() => {
        globalFunctions.sendResult(res, 'Запись удалена');
    }).catch(err => {
        globalFunctions.sendError(res, err);
    });
};