const express = require('express');
const router = express.Router();

const Contact = require('../models/contact');
const sequenceGenerator = require('../sequenceGenerator');

router.get('/', (req, res) => {
  Contact.find()
    .populate('group')
    .then(contacts => {
      res.status(200).json({
        message: 'Contacts fetched successfully!',
        contacts: contacts
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching contacts failed.',
        error: error
      });
    });
});

router.post('/', (req, res) => {
  const maxContactId = sequenceGenerator.nextId('contacts');

  const contact = new Contact({
    id: maxContactId,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    imageUrl: req.body.imageUrl,
    group: req.body.group
  });

  contact.save()
    .then(createdContact => {
      res.status(201).json({
        message: 'Contact added successfully',
        contact: createdContact
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Creating contact failed.',
        error: error
      });
    });
});

router.put('/:id', (req, res) => {
  Contact.findOne({ id: req.params.id })
    .then(contact => {
      contact.name = req.body.name;
      contact.email = req.body.email;
      contact.phone = req.body.phone;
      contact.imageUrl = req.body.imageUrl;
      contact.group = req.body.group;

      Contact.updateOne({ id: req.params.id }, contact)
        .then(result => {
          res.status(204).json({ message: 'Contact updated successfully' });
        })
        .catch(error => {
          res.status(500).json({
            message: 'Updating contact failed.',
            error: error
          });
        });
    });
});

router.delete('/:id', (req, res) => {
  Contact.findOne({ id: req.params.id })
    .then(contact => {
      Contact.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({ message: 'Contact deleted successfully' });
        })
        .catch(error => {
          res.status(500).json({
            message: 'Deleting contact failed.',
            error: error
          });
        });
    });
});

module.exports = router;
