module.exports = (app) => {

    const user_category = require('../controller/user_category.controller');
    
    app.get('/api/categoriesForUser/userId=:user_id', user_category.findCategoriesForUser);
    app.get('/api/categoriesNotUser/userId=:user_id', user_category.findCategoriesNotUser);
    app.post('/api/addCategories', user_category.createCategories);
    app.post('/api/deleteCategoryForUser/userCategoryId=:user_category_id', user_category.deleteCategoryForUser);
};