// Compatibility layer: expose a Sequelize-like API backed by Mongoose models
// This lets existing controllers (which call findAll/findOne/create/update/etc)
// work without rewriting every controller. It maps basic `where` filters and
// simple `include` usage (Client -> Website, Website -> Domain, Client -> Email)
// to mongoose queries.

const path = require('path');
const fs = require('fs');
const mongooseModels = require('./mongoose');

const db = {};

// Helper: convert a Sequelize-style `where` object to a mongoose filter.
function whereToFilter(where = {}) {
  if (!where) return {};
  const filter = {};

  // Handle Sequelize Operators (Symbols)
  const symbols = Object.getOwnPropertySymbols(where);
  for (const sym of symbols) {
    const desc = sym.toString();
    if (desc.includes('or')) {
      const conditions = where[sym];
      if (Array.isArray(conditions)) {
        filter['$or'] = conditions.map(whereToFilter);
      }
    } else if (desc.includes('and')) {
      const conditions = where[sym];
      if (Array.isArray(conditions)) {
        filter['$and'] = conditions.map(whereToFilter);
      }
    }
  }

  // Handle regular keys
  Object.keys(where).forEach(k => {
    const v = where[k];
    if ((/_id$/.test(k) || k === 'id') && typeof v === 'string') {
      try { filter[k === 'id' ? '_id' : k] = mongooseModels.mongoose.Types.ObjectId(v); } catch (e) { filter[k] = v; }
    } else {
      filter[k] = v;
    }
  });

  return filter;
}

// Small include handler used by controllers in this project: attach related
// documents (websites/domains/emails) for Client and Website queries.
async function handleIncludes(baseName, docs, includes) {
  if (!includes || includes.length === 0) return docs;

  // normalize to array
  const inc = Array.isArray(includes) ? includes : [includes];

  // convert single doc to array for uniform processing
  const docsArr = Array.isArray(docs) ? docs : (docs ? [docs] : []);
  if (docsArr.length === 0) return docs;

  const ids = docsArr.map(d => (d._id ? d._id.toString() : (d.id || null))).filter(Boolean);

  for (const item of inc) {
    const modelName = item.model && item.model.modelName ? item.model.modelName : (item.model && item.model.name) || item;
    if (!modelName) continue;

    if (baseName === 'Client' && modelName === 'Website') {
      const websites = await mongooseModels.Website.find({ client_id: { $in: ids }, is_active: true }).lean();
      docsArr.forEach(d => { d.websites = websites.filter(w => w.client_id && w.client_id.toString() === d._id.toString()); });
    }

    if (baseName === 'Website' && modelName === 'Domain') {
      const websiteIds = docsArr.map(d => d._id.toString());
      const domains = await mongooseModels.Domain.find({ website_id: { $in: websiteIds }, is_active: true }).lean();
      docsArr.forEach(d => { d.domains = domains.filter(dom => dom.website_id && dom.website_id.toString() === d._id.toString()); });
    }

    if (baseName === 'Client' && modelName === 'Email') {
      const emails = await mongooseModels.Email.find({ client_id: { $in: ids }, is_active: true }).lean();
      docsArr.forEach(d => { d.emails = emails.filter(e => e.client_id && e.client_id.toString() === d._id.toString()); });
    }
  }

  return Array.isArray(docs) ? docsArr : docsArr[0];
}

// Wrap a mongoose model to provide basic Sequelize-like static methods used
// by controllers: findAll, findOne, findByPk, create, update (static)
function wrapModel(name, mongooseModel) {
  return {
    modelName: mongooseModel.modelName || name,
    async findAll(options = {}) {
      const filter = whereToFilter(options.where || {});
      const q = mongooseModel.find(filter);
      if (options.attributes) q.select(options.attributes.join(' '));
      const docs = await q.exec();
      // attach included relations if requested
      return handleIncludes(name, docs, options.include);
    },

    async findOne(options = {}) {
      const filter = whereToFilter(options.where || {});
      const doc = await mongooseModel.findOne(filter).exec();
      if (!doc) return null;
      // add .update for parity with Sequelize instance.update
      doc.update = async function (data) { Object.assign(this, data); return this.save(); };
      // attach included relations if requested
      await handleIncludes(name, doc, options.include);
      return doc;
    },

    async findByPk(id, options = {}) {
      try {
        const doc = await mongooseModel.findById(id).exec();
        if (!doc) return null;
        doc.update = async function (data) { Object.assign(this, data); return this.save(); };
        await handleIncludes(name, doc, options.include);
        return doc;
      } catch (e) {
        return null;
      }
    },

    async create(data) {
      return mongooseModel.create(data);
    },

    // static update used as: Model.update({ is_active:false }, { where: { client_id: client.id } })
    async update(values, options = {}) {
      const where = whereToFilter((options && options.where) || {});
      if (Object.keys(where).length === 0) {
        // if no where provided, behave like updateMany on all
        return mongooseModel.updateMany({}, values).exec();
      }
      return mongooseModel.updateMany(where, values).exec();
    },

    // expose underlying mongoose model for advanced operations
    _mongoose: mongooseModel
  };
}

// Build adapters for all mongoose models in ./mongoose
Object.keys(mongooseModels).forEach(k => {
  // skip the mongoose instance export
  if (k === 'mongoose') return;
  db[k] = wrapModel(k, mongooseModels[k]);
});

// Also export the raw mongoose instance for direct use
db.mongoose = mongooseModels.mongoose;
db.connect = mongooseModels.connect;

module.exports = db;