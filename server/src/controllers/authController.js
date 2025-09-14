import { generateToken } from '../lib/utils.js';
import User from '../models/User.js';

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
  } catch (error) {
    console.log('Error in signup controller', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
