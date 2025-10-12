const { Schema } = require('mongoose');

const DomainSchema = new Schema({
  website_id: { type: Schema.Types.ObjectId, ref: 'Website', required: true },
  name: { type: String, required: true },
  registrar: { type: String },
  registration_date: { type: Date },
  expiry_date: { type: Date },
  auto_renew: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'expired', 'pending', 'transferred'], default: 'active' },
  dns_records: { type: Schema.Types.Mixed },
  notes: { type: String },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = (mongoose) => mongoose.model('Domain', DomainSchema);
