const mongoose = require("mongoose");

/**
 * Mechanic — a car-repair shop plotted on the map. Geo data lives in two
 * places that are always kept in sync by the hooks below:
 *   - `coordinate` { latitude, longitude }  — convenient for the client/UI
 *   - `location`   GeoJSON Point [lng, lat]  — powers $geoNear / $near queries
 * `image` mirrors `images[0]` so older card/hero code that reads a single image
 * keeps working without changes.
 */
const mechanicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Mechanic name is required"],
      trim: true,
    },

    image: {
      type: String,
      default: null,
    },

    // Up to 4 gallery photos. `image` mirrors images[0] so existing
    // card/hero rendering keeps working without changes.
    images: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    isOpen: {
      type: Boolean,
      default: true,
    },

    address: {
      type: String,
      trim: true,
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    services: [{ type: String, trim: true }],

    priceList: [
      {
        service: { type: String, trim: true },
        price: { type: String, trim: true },
      },
    ],

    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        author: { type: String, trim: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        text: { type: String, trim: true, default: "" },
        date: { type: Date, default: Date.now },
      },
    ],

    hours: [
      {
        day: String,
        time: String,
      },
    ],

    coordinate: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },

    // GeoJSON mirror of `coordinate`, kept in sync by the hooks below.
    // Powers $geoNear / $near queries — note the [lng, lat] order.
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: undefined },
    },
  },
  { timestamps: true, collection: "mechanics" }
);

// Geospatial index so $near / $geoNear work.
mechanicSchema.index({ location: "2dsphere" });

/** Keep `image` and `location` in sync with `images` / `coordinate`. */
function syncDerivedFields(doc) {
  if (Array.isArray(doc.images) && doc.images.length > 0) {
    doc.image = doc.images[0];
  }
  if (
    doc.coordinate &&
    typeof doc.coordinate.latitude === "number" &&
    typeof doc.coordinate.longitude === "number"
  ) {
    doc.location = {
      type: "Point",
      coordinates: [doc.coordinate.longitude, doc.coordinate.latitude],
    };
  }
}

// Mongoose 9 middleware is sync/promise-based — no `next` callback.
mechanicSchema.pre("save", function () {
  syncDerivedFields(this);
});

// Mirror the same logic for update-by-query operations used by the controller.
mechanicSchema.pre(["findOneAndUpdate", "updateOne", "updateMany"], function () {
  const update = this.getUpdate() || {};
  const set = update.$set || update;

  if (Array.isArray(set.images) && set.images.length > 0) {
    set.image = set.images[0];
  }
  if (
    set.coordinate &&
    typeof set.coordinate.latitude === "number" &&
    typeof set.coordinate.longitude === "number"
  ) {
    set.location = {
      type: "Point",
      coordinates: [set.coordinate.longitude, set.coordinate.latitude],
    };
  }

  if (update.$set) update.$set = set;
  this.setUpdate(update);
});

module.exports = mongoose.model("Mechanic", mechanicSchema);
