let express = require('express');
let app = express();
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let db = require('./app/config/db.config.js');

db.sequelize.sync({force: false});

app.listen(3000);

let cors = require('cors');
let corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true,
    optionSuccessStatus: 200 
};

app.use(cors(corsOptions));
let auth = require('./app/route/auth.route.js');
let user = require('./app/route/user.route.js');
let user_category = require('./app/route/user_category.route.js');
let category = require('./app/route/category.route.js');
let spending = require('./app/route/spending.route.js');

auth(app);
user(app);
category(app);
user_category(app);
spending(app);