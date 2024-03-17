const spending = require("../controller/spending.controller");
module.exports = (app) => {

    const spending = require('../controller/spending.controller');

    app.get('/api/spendingByID/:id', spending.findSpendingById);
    app.get('/api/spendingForUser/userId=:user_id', spending.findSpendingForUser);
    app.post('/api/addUserSpending', spending.createSpending);
    app.post('/api/deleteUserSpending/:id', spending.deleteUserSpending);
    app.post('/api/updateUserSpending/:id', spending.updateUserSpending);
    app.get('/api/userSpendingForPeriod/userId=:user_id/beginDate=:begin_date/endDate=:end_date', spending.updateUserSpending);
    app.get('/api/spendingByCategory/userId=:user_id/beginDate=:begin_date/endDate=:end_date', spending.findSpendingByCategory);
    app.get('/api/dataSpendingByCategory/userId=:user_id/beginDate=:begin_date/endDate=:end_date', spending.findDataSpendingByCategory);
};