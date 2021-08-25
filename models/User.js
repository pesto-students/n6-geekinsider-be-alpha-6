const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: "userCandidate",
      enum: ["userRecruiter", "userCandidate"]
    },
    cognitoUsername: {
      type: String,
      required: true
    },
    whatsappNumber: {
      type: String
    },
    userDetailId: {
      type: String
    }
  },
);

module.exports = model("user", UserSchema);