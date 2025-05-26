import dotenv from "dotenv";
dotenv.config();
import express,{Request,Response} from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
import verifyRole from "../middleware/verifyRole";
var nodemailer = require('nodemailer');
import bcrypt from "bcryptjs"
import cloudinary from "cloudinary";
import multer from "multer";
const router =express.Router();
const storage =multer.memoryStorage();
const upload =multer({
    storage:storage,
    limits:{
        fileSize:5*1024*1024,
    }
})
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
router.get("/:userId",verifyToken as any,async(req:Request,res: Response): Promise<any>=>{
    try {
        const userId =req.params.userId;
        const user =await User.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        res.json(user);
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
            res.status(500).send({ message: "Something went wrong" })
        }
})
router.post("/forgot-password",async(req:Request,res: Response):Promise<any> =>{
    try {
        const {email} = req.body;
        const user =User.findOne({email:email})
        .then(user=>{
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
            const token = jwt.sign({ userId: user._id }, "jwt_secret_key", { expiresIn: "1d" })

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.GOOGLE_USER,
                    pass: process.env.GOOGLE_PASS as string,
                }
            });

            var mailOptions = {
                from: process.env.GOOGLE_USER,
                to: email,
                subject: 'Reset your password',
                text: `${process.env.FRONTEND_URL}/reset-password/${user._id}/${token}`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    return res.status(200);
                }
            });
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" })
    }
})
router.post("/reset-password/:userId/:token",async(req:Request,res: Response):Promise<any> =>{
    try {
        const{userId,token}=req.params
        const password =req.body.password;
        jwt.verify(token,"jwt_secret_key",(err,decoded)=>{
            if(err){
                return res.status(401).json({message:"Invalid token"})
            }
            bcrypt.hash(password,8)
            .then(hash=>{
                User.findOneAndUpdate({_id:userId},{password:hash})
                .then(user=>{res.status(200).send({ message: "Update password success" })})
                .catch(err=>res.status(500).send({ message: "Something went wrong" }))
            })
            .catch(err=>res.status(500).send({ message: "Something went wrong" }))
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" })
    }
})
router.put("/change-password", verifyToken as any, async (req: Request, res: Response): Promise<any> => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
});
router.put("/update-profile", verifyToken as any, async (req: Request, res: Response): Promise<any> => {
    try {
        const { firstName, lastName, phone } = req.body;
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.firstName = firstName;
        user.lastName = lastName;
        user.phone = phone;
        await user.save();
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
});
router.put("/update-avatar", verifyToken as any, upload.single("avatar"), async (req: Request, res: Response): Promise<any> => {
    try {
        const imageFile = req.file as Express.Multer.File;
        const imageUrls = await uploadImages([imageFile]);
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.avatar = imageUrls[0];
        await user.save();
        res.status(200).json({ message: "Avatar updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong" });
    }
});
async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
    });

    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}
export default router;