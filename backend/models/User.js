// // models/User.js
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   phone: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   friends: [{ type: String }],
//   profilePic: String,
//   // socketId: { type: String, default: null },
//   // isOnline: { type: Boolean, default: false },
//   // lastSeen: { type: Date, default: Date.now },
//   isOnline: { type: Boolean, default: false },
//   lastSeen: { type: Date, default: null },
//   socketId: { type: String, default: null },
// }, { timestamps: true });

// export default mongoose.model("User", userSchema);









// // models/User.js
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       match: [/^[A-Za-z\s]+$/, "Name should contain only characters"],
//     },

//     phone: { type: String, required: true, unique: true },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       match: [/.+@.+\..+/, "Email must contain @ and be valid"],
//     },

//     password: {
//       type: String,
//       required: true,
//       match: [
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
//         "Password must contain uppercase, lowercase, number, and special character",
//       ],
//     },

//     friends: [{ type: String }],
//     profilePic: String,
//     isOnline: { type: Boolean, default: false },
//     lastSeen: { type: Date, default: null },
//     socketId: { type: String, default: null },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("User", userSchema);







// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      match: [/^[A-Za-z\s]+$/, "Name should contain only characters"],
    },

    phone: { type: String, required: true, unique: true },

    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Email must be valid"],
    },

    password: {
      type: String,
      required: true, // ❗ removed regex validation
    },

    friends: [{ type: String }],
    profilePic: String,
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: null },
    socketId: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
