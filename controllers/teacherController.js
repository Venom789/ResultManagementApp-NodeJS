import userModel from '../models/user.js';
import resultModel from "../models/result.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//Register controller
const teacher_reg_get = async(req,res)=>{
    res.render("teacher/register",{message : req.flash('message')});
}

const teacher_registration = async (req, res)=>{
    const {name, email, password, password_confirmation} = req.body
    console.log(req.body);
    const user = await userModel.findOne({email:email})
    if(user){
        req.flash('message','Email Already Exist');
        res.render("teacher/register",{message : req.flash('message')});
        //res.status(400).send({'status': "failed", 'message' :"Email Already Exist"})
    }else{
        if(name && email && password && password_confirmation){
            if(password === password_confirmation){
                try{
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(password,salt)
                    const userData = new userModel({
                        name:name,
                        email:email,
                        password:hashPassword,
                    })
                    await userData.save()
                    const saved_user = await userModel.findOne({email:email})
                    
                    //Generate JWT Token
                    const token = jwt.sign({userID:saved_user._id},
                        process.env.JWT_SECRET_KEY, {expiresIn: '3d'})

                        res.cookie('jwt',token,{httpOnly:true, maxAge: 3*24*3600*1000})
                    
                   req.flash('message','Registration Successful Click On Login');
                   res.render("teacher/register",{message : req.flash('message')});
                    
                }catch(error){
                    req.flash('message','Something went wrong unable to register');
                    res.render("teacher/register",{message : req.flash('message')});
                }
            }else{
                req.flash('message','Password does not match');
                res.render("teacher/register",{message : req.flash('message')});
            }

        }else{
            req.flash('message','All fields are required');
            res.render("teacher/register",{message : req.flash('message')});
        }
    }
};


//login controller
const teacher_login_get = async(req,res)=>{
    res.render("teacher/login",{message : req.flash('message')});
}

const teacher_login = async (req,res) =>{
        try{
            const {email,password} = req.body
            if(email && password){
                const user = await userModel.findOne({email:email})
                if(user != null){
                    const isMatch = await bcrypt.compare(password, user.password)
                    if((user.email === email) && isMatch){
                        //Generate JWT Token
                        const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '3d'})
                        res.cookie('jwt',token,{httpOnly:true, maxAge: 3*24*3600*1000})

                       // res.send({"status":"success", "message":"Login Success", "token": token})                       
                       res.redirect("/api/teacher/dashboard");
                    }else{
                        req.flash('message','Email or Password is not Valid');
                        //res.send({"status":"failed", "message":"Email or Password is not Valid"})
                        res.render("teacher/login",{message : req.flash('message')});
                    }
                }else{
                    req.flash('message', "You are not a registered user")
                    //res.send({"status":"failed","message":"You are not a registered user"})
                    res.render("teacher/login",{message : req.flash('message')});
                }
            }else{
                req.flash('message', "All fields are required")
                //res.send({"status":"failed","message":"All fields are required"})
                res.render("teacher/login",{message : req.flash('message')});
            }
        }catch(error){
            req.flash('message','Oops...try again');
            res.render("teacher/login",{message : req.flash('message')});
        }
};


// const teacher_get_dashboard = async(req,res)=>{
//     const result = await resultModel.find();
//     res.render("teacher/dashboard",{student : result, message : req.flash('message')});
// }

//get dashboard
const teacher_get_dashboard = async(req,res)=>{

    var page = 1;
    if(req.query.page){
        page = req.query.page;
    }
    const limit = 4;


    const result = await resultModel.find()
    .limit(limit*1)
    .skip((page - 1)*limit)
    .exec();

    const count = await resultModel.find().countDocuments();
    res.render("teacher/dashboard",{
        student : result, 
        message : req.flash('message'),
        totalPages : Math.ceil(count/limit)
    });
}

//controller for adding result
const teacher_get_addResult = async(req,res)=>{
    res.render("teacher/addResult",{message : req.flash('message')});
}

const teacher_post_addResult = async (req, res) => {
    const {Roll_No} = req.body;
    const roll = await resultModel.findOne({Roll_No : Roll_No})
    if(!roll){
        try {
            const result = await resultModel.create(req.body);
            req.flash('message','New Result Added');
            res.render("teacher/addResult",{message : req.flash('message')});

        } catch {
            req.flash('message','Oops...try again');
            res.render("teacher/addResult",{message : req.flash('message')});
        }
        
    }else{
        req.flash('message','Roll No Already Exist');
        res.render("teacher/addResult",{message : req.flash('message')});
    }
};

//controller edit/update result
const teacher_get_editResult = async(req,res)=>{
    const std = await resultModel.findById(req.params.id)
    res.render('teacher/editResult',{std:std})
}

const teacher_post_editResult = async(req,res)=>{
    const std = await resultModel.findByIdAndUpdate(req.params.id,req.body);
    const result = await resultModel.find();
    req.flash('message','Result Updated Successfully');
    res.redirect('/api/teacher/dashboard')

}

//controller for deleting result
const teacher_get_deleteResult = async(req,res)=>{
    await resultModel.findByIdAndDelete(req.params.id)
    res.redirect('/api/teacher/dashboard');
}


//logout controller
const logout = async(req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}

// export default controllers;
export{
    teacher_registration,
    teacher_login,
    teacher_login_get,
    teacher_reg_get,
    teacher_get_dashboard,
    teacher_get_addResult,
    teacher_post_addResult,
    teacher_get_editResult,
    teacher_post_editResult,
    teacher_get_deleteResult,
    logout
    
}