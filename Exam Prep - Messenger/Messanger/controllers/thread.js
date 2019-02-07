const Thread = require("../models/Thread");
const User = require("../models/User"); // because in thread we need users id
const Message = require("../models/Message");

module.exports = {
    findThread: async (req, res) => {
        try {
            //we need their ids to check
            const currentUser = await User.findOne({
                username: req.user.username // logged in user
            });

            const otherUser = await User.findOne({
                username: req.body.username // body because we fill a form (search bar) username because in index.hbs line 6 input name is username
            });

            let thread = await Thread.findOne({ // findOne because we search oly one
                users: { // users property from Thread.js
                    $all: [currentUser._id, otherUser._id] // find thread that contains both users
                }
            });

            // if there is not found thread we must create one
            // will create thread with users and date from Thread.js
            if (!thread) {
                await Thread.create({
                    users: [currentUser._id, otherUser._id]
                });
            }

            res.redirect(`/thread/${otherUser.username}`);
        } catch (err) {
            console.error();
        }
    },
    openThread: async (req, res) => {
        try {
            let otherUser = await User.findOne({ // otherUser username
                username: req.params.username
            });

            let thread = await Thread.findOne({
                users: {
                    $all: [req.user._id, otherUser._id] //thread contains logged in user and other
                }
            });

            const messages = await Message.find({ // after we found the thread find all messages
                thread: thread._id
            });

            messages.forEach(message => { // first is to who send the message second is me
                if (message.user.toString() !== req.user._id.toString()) { // because both are ObjectId => toString()
                    message.isMine = true; // for chatroom.hbs 
                }

                // if we send image link
                if (message.content.startsWith("http") && (message.content.endsWith(".jpg") || message.content.endsWith(".png"))) {
                    message.isImage = true;
                }
            });

            let otherIsBlocked = false;
            let iAmBlocked = false;

            if (otherUser.blockedUsers.includes(req.user.username)) { // blockedUsers from User.js contains user
                iAmBlocked = true; // if other user blocked me I cannot write her/him
            }

            if (req.user.blockedUsers.includes(req.params.username)) {
                otherIsBlocked = true;
            }

            res.render("threads/chatroom", { // will send data for chatroom.hbs to form the page
                username: req.params.username, // first username from chatroom.hbs, second from routes.js -> "/thread/:username",
                messages,
                id: thread._id, // our thread from chatroom.hbs line 20
                otherIsBlocked,
                iAmBlocked
            });

        } catch (err) {
            console.error();
        }
    },
    sendMessage: async (req, res) => {
        const content = req.body.message; // message from chatroom.hbs  textarea name="message" line 19
        const user = await User.findOne({ // because in Message.js user is ObjectId => we need id from db
            username: req.params.username // user with whom I am chatting
        });
        const thread = req.body.threadId; // threadId from chatroom.hbs input name="threadId" line 20

        try {
            await Message.create({
                content,
                user: user._id,
                thread
            });

            res.redirect(`/thread/${req.params.username}`);
        } catch (err) {
            console.error();
        }
    },
    removeThread: async (req, res) => {
        try {
            await Message.remove({ // delete all messages with this thread id
                thread: req.params.threadId
            });

            await Thread.findByIdAndRemove(req.params.threadId); // threadId from routes.js

            res.redirect("/");
        } catch (err) {
            console.error();
        }
    }
}