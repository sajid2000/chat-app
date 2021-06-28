// external imports
const path = require('path');
const { unlink } = require('fs');
const bcrypt = require('bcrypt');
// internal imports
const User = require('../models/People');

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.render('users', { users });
    } catch (error) {
        next(error);
    }
};

const addUser = async (req, res) => {
    let newUser;

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if (req.files && req.files.length > 0) {
        newUser = new User({
            ...req.body,
            avatar: req.files[0].filename,
            password: hashedPassword,
        });
    } else {
        newUser = new User({
            ...req.body,
            password: hashedPassword,
        });
    }

    try {
        await newUser.save();

        res.status(200).json({ message: 'User was added successfully!' });
    } catch (error) {
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Unknown error occured!',
                },
            },
        });
    }
};

const removeUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete({ _id: req.params.id });

        // remove user avatar if any
        if (user.avatar) {
            unlink(path.resolve(`public/uploads/avatars/${user.avatar}`), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }

        res.status(200).json({
            message: 'User was removed successfully!',
        });
    } catch (error) {
        res.status(500).json({
            errors: {
                common: {
                    msg: 'Could not delete the user',
                },
            },
        });
    }
};

module.exports = { getUsers, addUser, removeUser };
