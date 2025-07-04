const express = require('express');
const router = express.Router();

const Message = require('../models/message');
const sequenceGenerator = require('../sequenceGenerator');

router.get('/', (req, res) => {
  Message.find()
    .populate('sender')
    .then(messages => {
      res.status(200).json({
        message: 'Messages fetched successfully!',
        messages: messages
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching messages failed.',
        error: error
      });
    });
});

router.post('/', (req, res) => {
  const maxMessageId = sequenceGenerator.nextId('messages');

  const message = new Message({
    id: maxMessageId,
    subject: req.body.subject,
    msgText: req.body.msgText,
    sender: req.body.sender
  });

  message.save()
    .then(createdMessage => {
      res.status(201).json({
        message: 'Message added successfully',
        messageObj: createdMessage
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Creating message failed.',
        error: error
      });
    });
});

router.put('/:id', (req, res) => {
  Message.findOne({ id: req.params.id })
    .then(message => {
      message.subject = req.body.subject;
      message.msgText = req.body.msgText;
      message.sender = req.body.sender;

      Message.updateOne({ id: req.params.id }, message)
        .then(result => {
          res.status(204).json({ message: 'Message updated successfully' });
        })
        .catch(error => {
          res.status(500).json({
            message: 'Updating message failed.',
            error: error
          });
        });
    });
});

router.delete('/:id', (req, res) => {
  Message.findOne({ id: req.params.id })
    .then(message => {
      Message.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({ message: 'Message deleted successfully' });
        })
        .catch(error => {
          res.status(500).json({
            message: 'Deleting message failed.',
            error: error
          });
        });
    });
});

module.exports = router;
