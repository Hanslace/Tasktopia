import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    issueDate: { type: Date, default: Date.now },
    dueDate: Date,
    status: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' }
  });
  
  const Invoice = mongoose.model('Invoice', InvoiceSchema);
    export default Invoice;