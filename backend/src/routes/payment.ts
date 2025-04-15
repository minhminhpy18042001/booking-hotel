import express, { Request, Response } from "express";

import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
const router =express.Router();
import Payment from "../models/payment";
import {VNPay,ignoreLogger,ProductCode,VnpLocale,dateFormat} from "vnpay";
import User from "../models/user";
router.get("/",verifyToken as any,async (req:Request,res:Response)=>{
    try {
        const payments = await Payment.find({userId:req.userId}).sort({createdAt:-1});
        res.status(200).json(payments);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Something went wrong"});
    }
});
router.get("/create-payment-vnpay/:amount",verifyToken as any,async (req:Request,res:Response)=>{
    const amount=Number(req.params.amount);
    try {
        
        const vnpay = new VNPay({
            tmnCode:'IV6TBUMV', //process.env.VNPAY_TMN_CODE as string,
            secureSecret:'T66WBLFATD173J7K0TTPHH1AY1VPONOR', //process.env.VNPAY_SECURE_SECRET as string,
            vnpayHost: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html', //process.env.VNPAY_HOST as string,
            testMode: true,
            loggerFn: ignoreLogger,
        });
        const payment = await Payment.create({
            amount,
            userId:req.userId,
        });
        const tomorrow =new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const vnpayResponse =vnpay.buildPaymentUrl({
            vnp_Amount:amount,
            vnp_IpAddr:req.ip || "127.0.0.1",
            vnp_TxnRef:payment._id.toString(),
            vnp_OrderInfo:"Payment for hotel fee",
            vnp_OrderType:ProductCode.Other,
            vnp_ReturnUrl:'http://localhost:5173/check-payment',
            vnp_Locale:VnpLocale.VN,
            vnp_CreateDate:dateFormat(new Date()),
            vnp_ExpireDate:dateFormat(tomorrow),

        }); 
        await payment.save();
        res.status(200).json(vnpayResponse);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Something went wrong"});
    }
})
router.get("/check-payment-vnpay", verifyToken as any, async (req: Request, res: Response): Promise<any> => {
  const { vnp_ResponseCode, vnp_TxnRef } = req.query;
  const paymentStatus = vnp_ResponseCode === "00" ? "completed" : "failed";

  if (vnp_ResponseCode === "00") {
    const payment = await Payment.findOne({
      _id: vnp_TxnRef,
      userId: req.userId,
    });
    if (payment && payment.paymentStatus === "completed") {
      return res.status(200).json({ message: "Payment already processed",data: vnp_ResponseCode });
    }
    // Update user credit
    const user = await User.findOneAndUpdate(
      {
        _id: req.userId
      },
      {
        $inc: { credit: payment?.amount },
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.save();
    // Update payment status in the database
    await Payment.findOneAndUpdate(
      {
        _id: vnp_TxnRef,
        userId: req.userId,
      },
      {
  
        $set: { 'paymentStatus': "completed" },
        paymentDate: new Date(),
      },
      { new: true }
    );
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Payment success", data: vnp_ResponseCode });
  }
  else {
    res.status(400).json({ message: "Payment failed", data: vnp_ResponseCode });
  }
});
export default router;