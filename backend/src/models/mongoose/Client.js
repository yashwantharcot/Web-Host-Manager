const { Schema } = require('mongoose');

const ClientSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  company_name: { type: String, required: true },
  contact_name: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  notes: { type: String },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = (mongoose) => mongoose.model('Client', ClientSchema);
