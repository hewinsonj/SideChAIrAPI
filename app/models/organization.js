const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
// ORGANIZATION CAN BE USED AS A PLACE OF WORK FOR PATIENTS AND THERAPISTS
  name: { type: String, required: true },
  type: { type: String, enum: ['clinic', 'practice', 'team', 'private'], default: 'practice' },
  license: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  memberLimit: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now }
}, {
  toObject: {
    transform: (_doc, obj) => {
      return obj;
    }
  }
});

organizationSchema.pre('save', function(next) {
  if (!this.owner) {
    this.owner = this._id; // Ensure owner is set to the document's ID if not provided
  }
  next();
});

module.exports = mongoose.model('Organization', organizationSchema);
