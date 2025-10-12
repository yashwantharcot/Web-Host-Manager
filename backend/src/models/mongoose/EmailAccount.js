const { Schema } = require('mongoose');

const EmailAccountSchema = new Schema({
  website_id: { type: Schema.Types.ObjectId, ref: 'Website', required: true },
  email: { type: String, required: true },
  type: { type: String, enum: ['pop3', 'imap', 'smtp'], default: 'imap' },
  server: { type: String },
  port: { type: Number },
  username: { type: String },
  password: { type: String },
  quota: { type: Number },
  used_space: { type: Number },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  notes: { type: String },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = (mongoose) => mongoose.model('EmailAccount', EmailAccountSchema);
