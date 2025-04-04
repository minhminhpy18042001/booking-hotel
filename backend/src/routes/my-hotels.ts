import express,{Request,Response} from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { HotelType, Room } from "../shared/types";
import verifyRole from "../middleware/verifyRole";
const router =express.Router();

const storage =multer.memoryStorage();
const upload =multer({
    storage:storage,
    limits:{
        fileSize:5*1024*1024,
    }
})
router.post(
  "/",
  verifyToken as any,
  verifyRole(['owner']),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      const imageUrls = await uploadImages(imageFiles);

      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;
      newHotel.statusHotel = "pending";
      const hotel = new Hotel(newHotel);
      await hotel.save();

      res.status(201).send(hotel);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);
router.get("/", verifyToken as any,verifyRole(['owner']), async (req: Request, res: Response) => {

  try {
    const hotel = await Hotel.find({ userId: req.userId })
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" })
  }
});
router.put("/:hotelId",verifyToken as any,verifyRole(['owner']),upload.array("imageFiles"),async (req: Request, res: Response): Promise<any> =>{
  try {
    const updateHotel:HotelType =req.body;
    updateHotel.lastUpdated= new Date();
    const hotel =await Hotel.findOneAndUpdate({
      _id:req.params.hotelId,
      userId: req.userId,
    },updateHotel,{new:true});
    if(!hotel){
      return res.status(404).json({message:"Hotel not found"});
    }
    const files =req.files as Express.Multer.File[];
    const updatedImageUrls= await uploadImages(files);
    hotel.imageUrls=[...updatedImageUrls,...(updateHotel.imageUrls || []),];
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});
router.put(
  "/:hotelId/addRoom",
  verifyToken as any,
  verifyRole(['owner']),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("roomSize").notEmpty().withMessage("Room Size is required"),
    body("pricePerNight").notEmpty().withMessage("Price is required"),
    body("typeBed").notEmpty().withMessage("Type bed is required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response): Promise<any> => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newRoom: Room = req.body;
      const imageUrls = await uploadImages(imageFiles);
      newRoom.imageUrls = imageUrls;

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        {
          $push: { rooms: newRoom }
        }
      );
      if(!hotel){
        return res.status(404).json({message:"Hotel not found"});
      }

      res.status(201).json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);
router.put("/:hotelId/:roomId",verifyToken as any,verifyRole(['owner']),upload.array("imageFiles"),async (req: Request, res: Response): Promise<any> =>{
  try {
    const updateRoom:Room =req.body
    const files =req.files as Express.Multer.File[];
    const updatedImageUrls= await uploadImages(files);
    updateRoom.imageUrls=[...updatedImageUrls,...(updateRoom.imageUrls || []),];
    const hotel = await Hotel.findOneAndUpdate(
      {
        _id: req.params.hotelId,
        userId: req.userId,
        "rooms._id": req.params.roomId
      },
      {

        $set: { 'rooms.$': updateRoom },
        lastUpdated: new Date(),
      }, 
      {new:true}
    );
    if(!hotel){
      return res.status(404).json({message:"Hotel not found"});
    }
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});
router.get("/:id", verifyToken as any,verifyRole(['owner']), async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});
router.put("/:hotelId/special-prices/allroom", verifyToken as any, verifyRole(['owner']), async (req: Request, res: Response): Promise<any> => {
  try {
    const date = new Date(req.body.date);
    const price = req.body.price;
    const { hotelId } = req.params;
    const hotel = await Hotel.findOneAndUpdate(
      {
        _id: hotelId,
        userId: req.userId,
      },
      {
        $push: { 'rooms.$[].specialPrices': { date, price } },
        lastUpdated: new Date(),
      },
      { new: true }
    );
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});
router.put("/:hotelId/:roomId/special-price",verifyToken as any,verifyRole(['owner']),async (req: Request, res: Response): Promise<any> =>{
  try {
    const date = new Date(req.body.date);
    const price = req.body.price;
    const { hotelId, roomId } = req.params;
    const hotel = await Hotel.findOneAndUpdate(
      {
        _id: hotelId,
        userId: req.userId,
        "rooms._id": roomId
      },
      {
        $push: { 'rooms.$.specialPrices': { date,price } },
        lastUpdated: new Date(),
      },
      { new: true }
    );
    if(!hotel){
      return res.status(404).json({message:"Hotel not found"});
    }
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
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

export default router