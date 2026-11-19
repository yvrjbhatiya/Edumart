
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // WARNING: This deletes ALL users.
    // Uncomment only if you really want to remove everyone.
    // await User.deleteMany({});
    // console.log("All existing users deleted");

    const email = "admin@edumart.com";
    const password = "Admin@123456";

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name: "EduMart Admin",
      email,
      password: hashedPassword,
      isVerified: true,
      isAdmin: true
    });

    await admin.save();

    console.log("Admin created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();
