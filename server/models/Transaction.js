const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  packageId: {
    type: Number, // Corresponds to pkg.id in your frontend packages array
    required: true,
  },
  packageTitle: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'VND',
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  // You might want to add more fields later, e.g., payment gateway transaction ID, status
});

module.exports = mongoose.model('Transaction', transactionSchema);
