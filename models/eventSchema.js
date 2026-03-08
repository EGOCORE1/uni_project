const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: 200,
    },

    location: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
      index: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    registeredCount: {
      type: Number,
      default: 0,
    },

    supervisors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["upcoming", "finished"],
      default: "upcoming",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
Index لتحسين البحث عن الفعاليات القادمة
*/
eventSchema.index({ status: 1, eventDate: 1 });

/*
Virtual field لحساب المقاعد المتبقية
*/
eventSchema.virtual("remainingSeats").get(function () {
  return this.capacity - this.registeredCount;
});

module.exports = mongoose.model("Event", eventSchema);