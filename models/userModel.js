const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt');



const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Please enter your fullname"],
      minlength: 3,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      required: [true, "Please enter your username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your Email"],
      unique: true,
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, "Please enter your Password"]
    },
    role: {
      type: String,
      enum: ["user", "doctor", "admin"],
      default: "user",
    },

    officeHours: [
      {
        day: {
          type: String,
          enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        },
        startTime: {
          type: String,
        },
        endTime: {
          type: String,
        },
      },
    ],

    specialty: {
      type: String,
      enum: ["Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", "Neurology", "Oncology", "Orthopedics", "Pediatrics", "Psychiatry", "Urology"]
    },
    image: {
      type: String,
    },
    bio: {
      type: String,
    },
    medicalRecords: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicalRecord',
    }],
    surveys: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Survey',
    }],

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true });



userSchema.methods.checkPassword = async function (candicatePassword, userPassword) {
  return await bcrypt.compare(candicatePassword, userPassword);
};
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      next()
    }
    this.password = await bcrypt.hash(this.password, 12)
  } catch (err) {
    console.log(err);
  }
});


userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 1000;
  next();
});



userSchema.methods.passwordChangedAfterTokenIssued = function (JWTexpirydate) {
  if (this.passwordChangedAt) {
    return JWTexpirydate < (parseInt(this.passwordChangedAt.getTime() / 1000, 10))
  }
  return false
}

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
}

module.exports = mongoose.model('User', userSchema);