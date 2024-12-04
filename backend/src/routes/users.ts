import express,{Request,Response} from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import verifyRole from "../middleware/verifyRole";
const router =express.Router();
router.get("/me",verifyToken as any,async(req:Request,res: Response): Promise<any>=>{
    const userId =req.userId;
    try {
        const user =await User.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Something went wrong"})
    }
});
router.post("/register",[
    check("firstName","First Name is required").isString(),
    check("lastName","Last Name is required").isString(),
    check("email","Email is required").isEmail(),
    check("password","Password with 6 or more characters required").isLength({min:6})
], async(req:Request,res: Response): Promise<any>=>{
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({message:errors.array()})
    }

    try {
        let user= await User.findOne({
            email:req.body.email,
        });
        
        if (user) {
            return res.status(400).json({ message: "User already exists" });
          }

        user=new User(req.body);
        user.role ="user";
        await user.save(); 

        const token =jwt.sign(
            {userId:user.id,role:user.role},
            process.env.JWT_SECRET_KEY as string,
            {expiresIn:"1d"}    
        );

        res.cookie("auth_token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            maxAge:86400000
        });
        return res.status(200).send({message:"User registered OK"});

    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Something went wrong"})
    }
});
router.get("/getUsers",verifyToken as any,async(req:Request,res: Response): Promise<any>=>{
    try {
        const users =await User.find({ role: { $ne: 'admin' } }).select("-password");
        if(!users|| users.length === 0){
            return res.status(400).json({message:"User not found"});
        }
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"Something went wrong"})
    }
})
router.put("/updateRole/:userId/:role",
    verifyToken as any,verifyRole(['admin']),async(req:Request,res:Response):Promise<any>=>{
        try {
            const userId =req.params.userId;
            const role =req.params.role;
            console.log(userId,role)
            let user =await User.findOneAndUpdate(
                {_id:userId},
                {$set:{role:role}},
                { new: true } 
            )
            if(!user){
                return res.status(404).json({message:"User not found"});
              }
            await user.save();
            res.status(201).json(user);
        } catch (error) {
            console.log(error);
        res.status(500).send({message:"Something went wrong"})
        }
})
export default router;