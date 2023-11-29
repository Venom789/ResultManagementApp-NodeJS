import resultModel from "../models/result.js";

//Student Login
const loginStudent_get = async(req,res)=>{
    res.render("student/loginStudent",{message : req.flash('message')});
}

//get single result
const loginStudent_post = async(req,res)=>{
    console.log(req.body);
    try {
        const {Roll_No, Name} = req.body
        if(Roll_No && Name){
            const individualResult = await resultModel.findOne({Roll_No : Roll_No});
            console.log(individualResult);
            if(Roll_No == individualResult.Roll_No && Name == individualResult.Name){
                res.render("student/viewResult",{showResult : individualResult});
            }else{
                req.flash('message','Details Do Not Match');
                res.render("student/loginStudent",{message : req.flash('message')});
            }
            
        }else{
            req.flash('message','Enter Valid Details');
            res.render("student/loginStudent",{message : req.flash('message')});
        }
        
    } catch (error) {
        res.status(500).json(error);
    }   
};



export{
    loginStudent_post,
    loginStudent_get
}