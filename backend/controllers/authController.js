import User from "../models/userModel.js";

// Signup
export const signup = async (req, res) => {
  try {
    const { username, email, password, contact, role, securityQuestion, securityAnswer } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      username,
      email,
      password,
      contact,
      role: role || "user",
      securityQuestion,
      securityAnswer,
    });

    const token = user.generateAuthToken();
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        contact: user.contact,
        role: user.role,
        securityQuestion: user.securityQuestion,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        contact: user.contact,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot password → get security question
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ question: user.securityQuestion });
};

// Reset password
export const resetPassword = async (req, res) => {
  const { email, answer, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await user.matchAnswer(answer);
  if (!isMatch) return res.status(400).json({ message: "Incorrect security answer" });

  user.password = newPassword;
  await user.save();
  res.json({ message: "Password reset successful" });
};
