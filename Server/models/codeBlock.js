const mongoose = require('mongoose');
const Joi = require('joi');

const codeBlockSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
  },
  
});

const CodeBlock = mongoose.model('CodeBlock', codeBlockSchema);

function validateCodeBlock(codeBlock) {
    const schema = Joi.object({
      title: Joi.string().min(1).max(50).required(),
      code: Joi.string().optional().default('Empty Code'),
    });
  
    return schema.validate(codeBlock);
}

exports.CodeBlock = CodeBlock; 
exports.validate = validateCodeBlock;
