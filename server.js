const path = require('path');
const express = require('express');
const sequelize = require('./config/connection');
require('dotenv').config();
const session = require('express-session');
const sequelizeStore = require('connect-session-sequelize')(session.Store);
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const routes = require('./controllers');

const app = express();
const PORT = process.env.PORT || 3001;



const sess = {
    secret: process.env.SECRET,
    cookie: {
        maxAge: 4000,
    },
    resave: false,
    saveUninitialized: true,
    store: new sequelizeStore({
        db: sequelize,
    }),
};

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

const hbs = exphbs.create({ helpers });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(routes);

sequelize
    .sync({ force: false })
    .then(() => {
        app.listen(PORT, () => console.log(`Now listening on PORT ${PORT}`));
    }
);
