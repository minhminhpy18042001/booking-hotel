import mongoose from "mongoose";
import { PaymentType } from "../shared/types";

const paymentSchema = new mongoose.Schema<PaymentType>({
  amount: { type: Number, required: true },
  userId: { type: String, required: true },
  paymentMethod: { type: String,enum:['vnpay','credit'] ,default:'vnpay'},
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paymentDate: { type: Date, default: Date.now },
  paymentFor: { type: String, enum: ['hotel', 'room','refund','withdraw'], default: 'hotel' },
});
const Payment = mongoose.model<PaymentType>("Payment", paymentSchema);
export default Payment;