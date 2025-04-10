const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    role: { type: String, enum: ["therapist", "patient"], required: true },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    patientProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient"
    },
    therapistProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist"
    },
    token: {
      type: String
    },
  },
  {
    timestamps: true,
    toObject: {
      transform: (_doc, user) => {
        delete user.hashedPassword;
        return user;
      },
    },
  }
);

userSchema.methods.initializeUserProfile = async function() {
  if (this.role === 'patient') {
    const Patient = require('../models/patient');
    const patient = await Patient.create({
      userAccount: this._id,
      owner: this._id,
      fullName: this.email.split('@')[0],
    });
    this.patientProfile = patient._id;
    await this.save();
  }

  if (this.role === 'therapist') {
    const Therapist = require('../models/therapist');
    const therapist = await Therapist.create({
      userAccount: this._id,
      owner: this._id,
      fullName: this.email.split('@')[0],
    });
    this.therapistProfile = therapist._id;
    await this.save();
  }
};

module.exports = mongoose.model("User", userSchema);
