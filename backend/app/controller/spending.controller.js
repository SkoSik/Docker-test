var db = require('../config/db.config.js');
const { Op } = require('sequelize');

var UserCategory = db.user_category;
var Spending = db.spending;
var Category = db.category;
var globalFunctions = require('../config/global.functions.js');

exports.findSpendingById = (req, res) => {
    Spending.findAll({
        where: {
            id: req.params.id
        }
    })
        .then(objects => {
            globalFunctions.sendResult(res, objects);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
};

exports.findSpendingForUser = (req, res) => {
    Spending.findAll({
        include: [
            {
                model: UserCategory,
                required: true, // INNER JOIN 
                where: {
                    user_id: req.params.user_id
                } 
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

exports.createSpending = (req, res) => {
    var spendings = req.body.spendings;
    var data = [];

    console.log(spendings);

    if (Array.isArray(spendings)) {
        for (let i = 0; i < spendings.length; i++) {
            data.push(spendings[i].user_category_id);
            data.push(spendings[i].cost);
            data.push(spendings[i].description);
            data.push(spendings[i].spending_date);
        }    
        
        var placeholders = spendings.map(() => '(?,?,?,?)').join(',');
    } else {
        data.push(spendings.user_category_id);
        data.push(spendings.cost);
        data.push(spendings.description);
        data.push(spendings.spending_date);
           
        var placeholders = '(?,?,?,?)';
    }

    db.sequelize.query(
        `INSERT INTO spending(user_category_id, cost, description, spending_date) VALUES ` + placeholders,
        {
            type: db.sequelize.QueryTypes.INSERT,
            replacements: data
        })
        .then(object => {
            globalFunctions.sendResult(res, object);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        });
};

exports.deleteUserSpending = (req, res) => {
    Spending.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        globalFunctions.sendResult(res, 'Запись удалена');
    }).catch(err => {
        globalFunctions.sendError(res, err);
    });
};

exports.updateUserSpending = (req, res) => {
    Spending.update(
        {
            cost: req.body.cost,
            description: req.body.description,
            spending_date: req.body.spending_date,
            user_category_id: req.body.user_category_id
        },
        {
            where: {
                id: req.params.id
            }
        }
    ).then(() => {
        globalFunctions.sendResult(res, 'Запись удалена');
    }).catch(err => {
        globalFunctions.sendError(res, err);
    });
};

exports.userSpendingForPeriod = (req, res) => {
    Spending.findAll({
        include: [
            {
                model: UserCategory,
                required: true, // INNER JOIN
                where: {
                    user_id: req.params.user_id
                }
            }
        ],
        where: {
            spending_date: {
                [Op.and]: {
                    [Op.gte]: req.params.begin_date,
                    [Op.lte]: req.params.end_date
                }
            }
        }
    }).then(objects => {
        globalFunctions.sendResult(res, objects);
    }).catch(err => {
        globalFunctions.sendError(res, err);
    })
};

exports.findSpendingByCategory = (req, res) => {
    db.sequelize.query(
        `SELECT category.name, IFNULL(SUM(spending.cost), 0) as amount FROM category
        INNER JOIN user_category ON user_category.category_id=category.id
        LEFT JOIN spending ON spending.user_category_id=user_category.id
        WHERE user_category.user_id=? AND spending.spending_date>=? AND spending.spending_date<=?
        GROUP BY category.name`,
        {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: [req.params.user_id, req.params.begin_date, req.params.end_date] // подстановка параметров
        })
        .then(objects => {
            globalFunctions.sendResult(res, objects);
        })
        .catch(err => {
            globalFunctions.sendError(res, err);
        })
};

// Получение расходов с разделением по категориям (получаем данные расходов по категориям)
exports.findDataSpendingByCategory = (req, res) => {
    Category.findAll({
        include: [
            {
                model: UserCategory,
                required: true, // INNER JOIN
                where: {
                    user_id: req.params.user_id
                },
                include: [
                    {
                        model: Spending,
                        required: true,
                        where: {
                            spending_date: {
                                [Op.and]: {
                                    [Op.gte]: req.params.begin_date,
                                    [Op.lte]: req.params.end_date
                                }
                            }
                        }
                    }
                ]
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