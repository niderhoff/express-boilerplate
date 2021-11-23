const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name must be provided.'],
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        flag: {
            type: Boolean,
            default: false,
        },
        price: {
            type: Number,
            required: false,
        },
        rating: {
            type: Number,
            required: false,
        },
        variant: {
            type: String,
            enum: {
                values: ['Variant_A', 'Variant_B'],
                message: '{VALUE} is not supported.',
            },
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide user.'],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
