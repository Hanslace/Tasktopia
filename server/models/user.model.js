import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['freelancer', 'client'], required: true },
    date: { type: Date, default: Date.now }
  },
  {
    timestamps: true, // createdAt, updatedAt
    });
  
    const User = mongoose.model('User', UserSchema);
    export default User;