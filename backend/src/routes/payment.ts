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
router.get("/create-payment-vnpay/:amount/:forBooking",verifyToken as any,async (req:Request,res:Response)=>{
    const amount=Number(req.params.amount);
    const forBooking = req.params.forBooking === 'true';
    try {
        const vnpay = new VNPay({
            tmnCode:'IV6TBUMV',
            secureSecret:'T66WBLFATD173J7K0TTPHH1AY1VPONOR',
            vnpayHost: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
            testMode: true,
            loggerFn: ignoreLogger,
        });
        const payment = await Payment.create({
            amount,
            userId:req.userId,
            paymentFor: forBooking ? 'room' : 'hotel',
        });
        const tomorrow =new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const vnpayResponse =vnpay.buildPaymentUrl({
            vnp_Amount:amount,
            vnp_IpAddr:req.ip || "127.0.0.1",
            vnp_TxnRef:payment._id.toString(),
            vnp_OrderInfo: forBooking ? "Payment for room booking" : "Payment for hotel fee",
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

  const payment = await Payment.findOne({
    _id: vnp_TxnRef,
    userId: req.userId,
  });
  if (!payment) {
    return res.status(404).json({ message: "Payment not found" });
  }

  if (vnp_ResponseCode === "00") {
    // Payment success
    if (payment.paymentStatus === "completed") {
      return res.status(200).json({ message: "Payment already processed", data: vnp_ResponseCode, paymentFor: payment.paymentFor });
    }
    if (payment.paymentFor === 'room') {
      // Update booking status to 'paymented' for this user and payment
      // Find the hotel containing the booking with status 'paymenting' for this user
      const hotel = await require('../models/hotel').default.findOneAndUpdate(
        {
          'bookings.userId': req.userId,
          'bookings.statusBooking': 'paymenting',
        },
        {
          $set: { 'bookings.$[elem].statusBooking': 'booked' }
        },
        {
          arrayFilters: [ { 'elem.userId': req.userId, 'elem.statusBooking': 'paymenting' } ],
          new: true
        }
      );
    } else {
      // Old case: credit top-up
      const user = await User.findOneAndUpdate(
        { _id: req.userId },
        { $inc: { credit: payment?.amount } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await user.save();
    }
    // Update payment status in the database
    await Payment.findOneAndUpdate(
      { _id: vnp_TxnRef, userId: req.userId },
      { $set: { 'paymentStatus': "completed" }, paymentDate: new Date() },
      { new: true }
    );
    return res.status(200).json({ message: "Payment success", data: vnp_ResponseCode, paymentFor: payment.paymentFor });
  } else {
    // Payment failed
    await Payment.findOneAndUpdate(
      { _id: vnp_TxnRef, userId: req.userId },
      { $set: { 'paymentStatus': "failed" }, paymentDate: new Date() },
      { new: true }
    );
    return res.status(400).json({ message: "Payment failed", data: vnp_ResponseCode, paymentFor: payment.paymentFor });
  }
});
export default router;