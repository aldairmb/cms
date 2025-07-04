const express = require('express');
const router = express.Router();

const Document = require('../models/document');
const sequenceGenerator = require('../sequenceGenerator');

router.get('/', (req, res) => {
  Document.find()
    .then(documents => {
      res.status(200).json({
        message: 'Documents fetched successfully!',
        documents: documents
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching documents failed.',
        error: error
      });
    });
});

router.post('/', (req, res) => {
  const maxDocumentId = sequenceGenerator.nextId('documents');

  const document = new Document({
    id: maxDocumentId,
    name: req.body.name,
    description: req.body.description,
    url: req.body.url
  });

  document.save()
    .then(createdDocument => {
      res.status(201).json({
        message: 'Document added successfully',
        document: createdDocument
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Creating document failed.',
        error: error
      });
    });
});

router.put('/:id', (req, res) => {
  Document.findOne({ id: req.params.id })
    .then(document => {
      document.name = req.body.name;
      document.description = req.body.description;
      document.url = req.body.url;

      Document.updateOne({ id: req.params.id }, document)
        .then(result => {
          res.status(204).json({ message: 'Document updated successfully' });
        })
        .catch(error => {
          res.status(500).json({
            message: 'Updating document failed.',
            error: error
          });
        });
    });
});

router.delete('/:id', (req, res) => {
  Document.findOne({ id: req.params.id })
    .then(document => {
      Document.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({ message: 'Document deleted successfully' });
        })
        .catch(error => {
          res.status(500).json({
            message: 'Deleting document failed.',
            error: error
          });
        });
    });
});

module.exports = router;
