const { Schema, model } = require("mongoose");

const RecruiterSchema = new Schema(
  {
    userDetailId: {
      type: String,
      required: true
    },
    companyName: {
        type: String,
        required: true
    },  
    preferredIndustry: {
        type: String,
        required: true
    },  
    whatsappNumber: {
      type: String,
      required: true
    },
  },
);

module.exports = model("company",RecruiterSchema);