import express from "express";
const router = express.Router();
import { loginStudent_get,loginStudent_post } from "../controllers/studentConroller.js";


router.get('/login',loginStudent_get);
router.post('/login',loginStudent_post);

export default router;