const mongoose = require('mongoose');
const { private } = require('../../../../src/models/plugins');

describe('private plugin', () => {
  let connection;

  beforeEach(() => {
    connection = mongoose.createConnection();
  });

  it('should replace _id with id', () => {
    const schema = mongoose.Schema();
    schema.plugin(private);
    const Model = connection.model('Model', schema);
    const doc = new Model();
    expect(doc.private()).not.toHaveProperty('_id');
    expect(doc.private()).toHaveProperty('id', doc._id.toString());
  });

  it('should remove __v', () => {
    const schema = mongoose.Schema();
    schema.plugin(private);
    const Model = connection.model('Model', schema);
    const doc = new Model();
    expect(doc.private()).not.toHaveProperty('__v');
  });

  it('should remove createdAt and updatedAt', () => {
    const schema = mongoose.Schema({}, { timestamps: true });
    schema.plugin(private);
    const Model = connection.model('Model', schema);
    const doc = new Model();
    expect(doc.private()).not.toHaveProperty('createdAt');
    expect(doc.private()).not.toHaveProperty('updatedAt');
  });

  it('should remove any path set as private', () => {
    const schema = mongoose.Schema({
      public: { type: String },
      private: { type: String, private: true },
    });
    schema.plugin(private);
    const Model = connection.model('Model', schema);
    const doc = new Model({ public: 'some public value', private: 'some private value' });
    expect(doc.private()).not.toHaveProperty('private');
    expect(doc.private()).toHaveProperty('public');
  });

  it('should remove any nested paths set as private', () => {
    const schema = mongoose.Schema({
      public: { type: String },
      nested: {
        private: { type: String, private: true },
      },
    });
    schema.plugin(private);
    const Model = connection.model('Model', schema);
    const doc = new Model({
      public: 'some public value',
      nested: {
        private: 'some nested private value',
      },
    });
    expect(doc.private()).not.toHaveProperty('nested.private');
    expect(doc.private()).toHaveProperty('public');
  });

  it('should also call the schema private transform function', () => {
    const schema = mongoose.Schema(
      {
        public: { type: String },
        private: { type: String },
      },
      {
        private: {
          transform: (doc, ret) => {
            // eslint-disable-next-line no-param-reassign
            delete ret.private;
          },
        },
      }
    );
    schema.plugin(private);
    const Model = connection.model('Model', schema);
    const doc = new Model({ public: 'some public value', private: 'some private value' });
    expect(doc.private()).not.toHaveProperty('private');
    expect(doc.private()).toHaveProperty('public');
  });
});
