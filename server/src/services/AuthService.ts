import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { User, IUser } from "../repositories/User";
import { config } from "../config/env";

const JWT_SECRET = config.jwtSecret;

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  static async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await argon2.verify(hash, password);
  }

  static generateToken(userId: string): string {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
  }

  static async signup(email: string, password: string, name: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const passwordHash = await this.hashPassword(password);
    const user = new User({ email, passwordHash, name });
    await user.save();

    const token = this.generateToken((user._id as any).toString());
    return {
      user: { id: user._id, email: user.email, name: user.name },
      token,
    };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await this.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateToken((user._id as any).toString());
    return {
      user: { id: user._id, email: user.email, name: user.name },
      token,
    };
  }

  static async getUserById(userId: string) {
    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
