const router = require("express").Router();

// Bring in the User Registration function
const {
  setGroup,
  checkRole,
  validateUserGroupNToken,
  serializeUser
} = require("../utils/Auth");

// Set Group For a user
router.post("/set-group", async (req, res) => {
  await userRegister(req.body, "user", res);
});

// Admin Registration Route
router.post("/register-admin", async (req, res) => {
  await userRegister(req.body, "admin", res);
});

// Super Admin Registration Route
router.post("/register-super-admin", async (req, res) => {
  await userRegister(req.body, "superadmin", res);
});

// Users Login Route
router.post("/login-user", async (req, res) => {
  await userLogin(req.body, "user", res);
});

// Admin Login Route
router.post("/login-admin", async (req, res) => {
  await userLogin(req.body, "admin", res);
});

// Super Admin Login Route
router.post("/login-super-admin", async (req, res) => {
  await userLogin(req.body, "superadmin", res);
});

// Profile Route
router.get("/profile", validateUserGroupNToken, async (req, res) => {
  return res.json(serializeUser(req.user));
});

// Users Protected Route
router.get(
  "/user-protectd",
  validateUserGroupNToken,
  checkRole(["user"]),
  async (req, res) => {
    return res.json("Hello User");
  }
);

// Admin Protected Route
router.get(
  "/admin-protectd",
  validateUserGroupNToken,
  checkRole(["admin"]),
  async (req, res) => {
    return res.json("Hello Admin");
  }
);

// Super Admin Protected Route
router.get(
  "/super-admin-protectd",
  validateUserGroupNToken,
  checkRole(["superadmin"]),
  async (req, res) => {
    return res.json("Hello Super Admin");
  }
);

// Super Admin Protected Route
router.get(
  "/super-admin-and-admin-protectd",
  validateUserGroupNToken,
  checkRole(["superadmin", "admin"]),
  async (req, res) => {
    return res.json("Super admin and Admin");
  }
);

module.exports = router;
