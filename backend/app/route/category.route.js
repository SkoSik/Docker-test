module.exports = (app) => {

    const category = require('../controller/category.controller');
    
    app.get('/api/listCategories', category.findAll);
    app.post('/api/addCategory', category.create);
    app.post('/api/updateCategory/:id', category.update);
    app.post('/api/deleteCategory/:id', category.delete);
    app.get('/api/category/:id', category.findById);
};