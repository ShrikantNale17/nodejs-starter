/**
 * A mongoose schema plugin uses mongoose-delete npm package to soft delete documents
 */

const softDelete = (schema) => {
  schema.plugin(require("mongoose-delete"), {
    overrideMethods: ['count', 'countDocuments', 'find']
  });
};

module.exports = softDelete;
