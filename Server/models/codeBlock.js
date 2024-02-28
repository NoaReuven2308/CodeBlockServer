const mongoose = require('mongoose');
const Joi = require('joi');

/**
 * CodeBlock Schema:
 * Defines the structure of a code block document in MongoDB.
 */
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

/**
 * CodeBlock Model:
 * Represents the MongoDB collection for code blocks.
 */
const CodeBlock = mongoose.model('CodeBlock', codeBlockSchema);

/**
 * Validate CodeBlock Function:
 * Validates the properties of a code block object using Joi schema.
 * @param {Object} codeBlock - The code block object to be validated
 * @returns {Object} - Joi validation result object
 */
function validateCodeBlock(codeBlock) {
  const schema = Joi.object({
    title: Joi.string().min(1).max(50).required(),
    code: Joi.string().optional().default('Empty Code'),
  });

  return schema.validate(codeBlock);
}

// Exporting CodeBlock model and validation function
exports.CodeBlock = CodeBlock;
exports.validate = validateCodeBlock;
