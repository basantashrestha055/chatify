import { sendWelcomeEmail } from '../emails/emailHandlers.js';
import cloudinary from '../lib/cloudinary.js';
import { ENV } from '../lib/env.js';
import { generateToken } from '../lib/utils.js';
import User from '../models/User.js';
import 'dotenv/config';

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = await User.create({
      fullName,
      email,
      password,
    });

    if (!newUser) {
      return res.status(500).json({ message: 'Error creating user' });
    }

    generateToken(newUser._id, res);

    res.status(201).json(newUser);

    try {
      await sendWelcomeEmail(newUser.email, newUser.fullName, ENV.CLIENT_URL);
    } catch (error) {
      console.error('Failed to send welcome email', error);
    }
  } catch (error) {
    console.log('Error in signup controller', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await user.matchPassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    generateToken(user._id, res);

    res.status(200).json(user);
  } catch (error) {
    console.log('Error in login controller', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const logout = async (_, res) => {
  res.clearCookie('jwt', {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'strict',
    secure: ENV.NODE_ENV === 'development' ? false : true,
  });
  res.status(200).json({ message: 'Logout successful' });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) {
      return res.status(400).json({ message: 'Profile picture is required' });
    }

    const userId = req.user._id;

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      {
        new: true,
      }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {}
};
