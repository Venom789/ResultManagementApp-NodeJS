import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import cookieParser from 'cookie-parser';
import connectDB from './config/connectdb.js';
import teacherRoutes from './routes/teacherRoutes.js';
import studentRoutes from './routes/studentRoutes.js';


const app = express();
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

//Database Connection
connectDB(DATABASE_URL);

// Setting EJS as templating engine
app.set('view engine', 'ejs');

//express layouts
app.set('layout', 'layouts/layout');

// Built-in middleware for json
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser('asdqwe123zxc456'));
app.use(session({
    secret:'asdqwe123zxc456',
    cookie:{maxAge:60000},
    resave:true,
    saveUninitialized:true
}));
app.use(flash());

// Load Routes
app.use("/api/teacher",teacherRoutes);
app.use("/api/student",studentRoutes);

//home route
app.get('/',(req,res)=>{
    res.render('index',{message : req.flash('message')});
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});

app.listen(port, ()=>{
    console.log(`Server started at http://localhost:${port}`)
});