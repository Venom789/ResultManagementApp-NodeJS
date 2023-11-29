import express from "express";
const router = express.Router();
import {teacher_registration, teacher_login, teacher_login_get, 
    teacher_reg_get, teacher_get_dashboard, teacher_get_addResult, 
    teacher_post_addResult, teacher_get_editResult, teacher_post_editResult, 
    teacher_get_deleteResult, logout} from '../controllers/teacherController.js';
import checkUserAuth from "../middleware/auth-middleware.js";


//user routes
router.get('/register',teacher_reg_get);
router.post('/register',teacher_registration);

router.get('/login',teacher_login_get);
router.post('/login',teacher_login);

router.get('/dashboard',checkUserAuth, teacher_get_dashboard);

router.get('/addResult',checkUserAuth, teacher_get_addResult);
router.post('/addResult',checkUserAuth, teacher_post_addResult);

router.get('/editResult/:id',checkUserAuth, teacher_get_editResult);
router.post('/editResult/:id',checkUserAuth, teacher_post_editResult);

router.get('/delete/:id',checkUserAuth, teacher_get_deleteResult);

router.get('/logout',logout);

export default router