import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';

// var checkUserAuth = async (req, res, next) =>{
//     let token
//     const {authorization} = req.headers
//     if(authorization && authorization.startWith('Bearer')){
//         try {
//             //get token from header
//             token = authorization.split(' ')[1]

//             //verify token
//             const {userID} = jwt.verify(token, process.env.JWT_SECRET_KEY)

//             //Get user from token
//             req.user = await userModel.findById(userID).select('-password')
//             res.locals.user = req.user
//             next()
//         } catch (error) {
//             res.locals.user = null;
//             console.log(error)
//             req.flash('message','Unauthorized User');
//             res.redirect("/api/teacher/login");
            
//             //res.status(401).send({"status":"failed", "message":"Unauthorized User"})
            
//         }
//     }
//     if(!token){
//         res.locals.user = null;
//         req.flash('message','Unauthorized User No Token');
//         res.redirect("/api/teacher/login");
//         //res.status(401).send({"status":"failed", "message":"Unauthorize User No Token"})
//     }
// }

//check current user

const checkUserAuth = (req,res,next)=>{
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET_KEY, async(err,decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null;
                req.flash('message','Unauthorized User Please Login');
                res.render("index",{message : req.flash('message')});
            }else{
                console.log(decodedToken);
                let user = await userModel.findById(decodedToken.userID);
                res.locals.user = user;
                next();
            }

        })
    }else{
        res.locals.user=null;
        req.flash('message','Unauthorized User Please Login');
        res.render("index",{message : req.flash('message')});
        
    }
}

export default checkUserAuth