import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: [true, "Please enter a username"] },
    email: { type: String, required: [true, "Please enter an email"], unique: true },
    contact: { type: String },
    password: { type: String, required: [true, "Please enter a password"], minlength: 6 },
    role: { type: String, enum: ["user", "admin", "delivery"], default: "user" },
    profilePhoto: { type: String },

    // ✅ Security question for reset
    securityQuestion: { type: String },
    securityAnswer: { type: String }, // will be hashed

    // ✅ Multiple addresses
    addresses: [
      {
        type: { type: String, enum: ["Home", "Office", "Other"], default: "Home" },
        addressLine: { type: String, required: true },
        city: String,
        state: String,
        pincode: String,
        phone: String,
      },
    ],

    // ✅ Saved payment methods
    paymentMethods: [
      {
        type: { type: String, enum: ["Card", "UPI"], required: true },
        cardNumber: String,
        expiry: String,
        upiId: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

// Hash password & securityAnswer before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this.isModified("securityAnswer")) {
    const salt = await bcrypt.genSalt(10);
    this.securityAnswer = await bcrypt.hash(this.securityAnswer, salt);
  }
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Compare security answer
userSchema.methods.matchAnswer = async function (enteredAnswer) {
  return await bcrypt.compare(enteredAnswer, this.securityAnswer);
};

// JWT token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const User = mongoose.model("User", userSchema);
export default User;
