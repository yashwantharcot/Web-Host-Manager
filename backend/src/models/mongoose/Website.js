const { Schema } = require('mongoose');

const WebsiteSchema = new Schema({
  client_id: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  domain: { type: String },
  hosting_provider: { type: String },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  notes: { type: String },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = (mongoose) => mongoose.model('Website', WebsiteSchema);
