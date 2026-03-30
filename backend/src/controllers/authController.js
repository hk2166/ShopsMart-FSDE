import { authService } from "../services/authService.js";

export const authController = {
  // POST /api/auth/login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  // GET /api/auth/me
  async getCurrentUser(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/register (for creating first admin)
  async register(req, res, next) {
    try {
      const { email, password, name, role } = req.body;

      if (!email || !password || !name) {
        return res
          .status(400)
          .json({ error: "Email, password, and name required" });
      }

      const admin = await authService.createAdmin({
        email,
        password,
        name,
        role,
      });
      res.status(201).json(admin);
    } catch (error) {
      next(error);
    }
  },
};
