// external imports
const path = require('path');
const http = require('http');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const moment = require('moment');
const cookieParser = require('cookie-parser');

// internal imports
const { errorHandler, notFoundHandler } = require('./middlewares/common/errorHandler');
// routers
const loginRouter = require('./router/loginRouter');
const userRouter = require('./router/userRouter');
const inboxRouter = require('./router/inboxRouter');

const app = express();
const server = http.createServer(app);

dotenv.config();
// socket creation
const io = require('socket.io')(server);
global.io = io;

// io.on('connection', function (socket) {
//     console.log('Socket.io connected');
// });

// set moment as app locals
app.locals.moment = moment;

// database connection
mongoose
    .connect(process.env.MONGO_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Database connection successfull.'))
    .catch((err) => console.log(err));

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse cookie
app.use(cookieParser(process.env.COOKIE_SECRET));

// set static folder
app.use(express.static(path.resolve('public')));

// set view engine
app.set('view engine', 'ejs');

// routing setup
app.use('/', loginRouter);
app.use('/users', userRouter);
app.use('/inbox', inboxRouter);

// 404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);

server.listen(process.env.PORT, () => {
    console.log(`app listening to port ${process.env.PORT}`);
});
