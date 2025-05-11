import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;
    if (!image || !title || !caption || !rating) {
      return res.status(400).json({ message: "Please provide all fields " });
    }
    //uploaded the image to cloudinary

    const uploadResponce = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponce.secure_url;

    //save to database \\

    const newbook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });
    await newbook.save();

    res.status(201).json(newbook);
  } catch (error) {
    console.log("Error creating book ", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/", protectRoute, async (res, req) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage..");

    const totalBooks = await Book.countDocuments();

    res.send({
      books,
      currentpage: page,
      totalBooks,
      TotalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error in get all books  route ", error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", protectRoute, async (res, req) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "unauthorized" });

    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (deleteerror) {
        console.log("Error deleting image from cloudinary ", deleteerror);
      }
    }
    await book.deleteOne();
    res.json({ message: "Error deleting successfully..." });
  } catch (error) {
    console.log("Error deleting book ", error);
    res.statusCode(500).json({ message: "Internal server error" });
  }
});
router.get("/user", protectRoute, async (res, req) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(books);
  } catch (error) {
    console.log("Get user books error ", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
