module.exports = (app) => {
    const user = require('../controller/user.controller');
    const {authJwt} = require("../middleware");

    app.get('/api/users', [authJwt.verifyToken], user.findAll);
    app.post('/api/addUser', [authJwt.verifyToken], user.create);
    app.post('/api/updateUser/:id', [authJwt.verifyToken], user.update);
    app.post('/api/deleteUser/:id', [authJwt.verifyToken], user.delete);
    app.get('/api/user/:id', [authJwt.verifyToken], user.findById);
    app.get('/api/user/name/:name', [authJwt.verifyToken], user.findUsersByName);
};