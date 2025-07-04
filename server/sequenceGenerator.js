const Sequence = require('./models/sequence');

let maxDocumentId;
let maxMessageId;
let maxContactId;

const SequenceGenerator = {
  async nextId(collectionType) {
    try {
      const sequence = await Sequence.findOne();

      if (!sequence) {
        throw new Error('No sequence found in database.');
      }

      switch (collectionType) {
        case 'documents':
          maxDocumentId = sequence.maxDocumentId + 1;
          sequence.maxDocumentId = maxDocumentId;
          break;
        case 'messages':
          maxMessageId = sequence.maxMessageId + 1;
          sequence.maxMessageId = maxMessageId;
          break;
        case 'contacts':
          maxContactId = sequence.maxContactId + 1;
          sequence.maxContactId = maxContactId;
          break;
        default:
          throw new Error('Invalid collection type.');
      }

      await sequence.save();
      return collectionType === 'documents'
        ? maxDocumentId.toString()
        : collectionType === 'messages'
        ? maxMessageId.toString()
        : maxContactId.toString();
    } catch (error) {
      console.error('Error generating sequence:', error);
      throw error;
    }
  }
};

module.exports = SequenceGenerator;
