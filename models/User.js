const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 20,
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email.',
        ],
        unique: true,
        minlength: 3,
        maxlength: 20,
    },
    password: {
        type: String,
        required: true,
    },
});

// eslint-disable-next-line func-names
UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    // `this` will point to mongodb-document
    this.password = await bcrypt.hash(this.password, salt);
});

// eslint-disable-next-line func-names
UserSchema.methods.getName = function () {
    // `this` will point to mongodb-document
    return this.name;
};

// eslint-disable-next-line func-names
UserSchema.methods.createJWT = function () {
    return jwt.sign(
        // user id and name are encoded in the token
        // eslint-disable-next-line no-underscore-dangle
        { userId: this._id, name: this.name },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRATION,
        }
    );
};

// eslint-disable-next-line func-names
UserSchema.methods.checkPassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
