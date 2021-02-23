var express = require('express');
var router = express.Router();
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const {
    addMembers,
    authenticateUser,
    createChatList,
    createGroup,
    createMessage,
    createUserChat,
    deleteChatList,
    deleteGroup,
    deleteMessage,
    deleteUser,
    deleteUserChat,
    getChatList,
    getGroup,
    getGroups,
    getMembers,
    getMessage,
    getUser,
    getUserChat,
    registerUser,
    removeMembers,
    updateChatList,
    updateGroup,
    updateMembers,
    updateMessage,
    updateUser,
    updateUserChat
} = require('../utils/db.handler');
const {
    getRoomUsers,
    getCurrentUser,
    updateUserRoom,
    userJoin,
    userLeave
} = require('../utils/users');

server.listen(4000);

const botId = 1;

// socket.io start //

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ userId, room}) => {
        const user = userJoin(socket.id, userId, room);

        // console.log('joinRoom', user, socket.id, userId, room, updated_at);
        
        socket.join(user.room);

        // Welcome current user
        socket.emit('botMessage', { result: { room: user.room, userId: botId, messageId: 1} }); //'Welcome to Chat!'

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                'botMessage',
                { result: { room: user.room, userId: botId, messageId: 2 } } //`${user.username} joined the group`
            );

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
    });

    // Listen for chatMessage
    socket.on('chatMessage', data => {
        const user = getCurrentUser(socket.id);

        // console.log('chatMessage', user, data);

        io.to(user.room).emit(
            'message',
            { result: data }
        );

        // save message to database

    });

    socket.on('changeRoom', ({ userId, room}) => {
        const user = updateUserRoom(socket.id, room);
        if(user !== null){
            socket.join(user.room);

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
        else{
            user = userJoin(socket.id, userId, room);

            socket.join(user.room);

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
        // get message of that chatList

    });

    // Runs when client leave
    socket.on('leaveRoom', ({ userId, room }) => {
        const user = userLeave(socket.id);

        // console.log('leaveRoom', user, userId, room, updated_at);

        if (user) {
            io.to(user.room).emit(
                'botMessage',
                { result: { room: user.room, userId: botId, message: 3 } } //`${user.username} left the group`
            );

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        
        // console.log('disconnect', user);

        if (user !== null) {
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

// socket.io end //

// router start //

// User routes
router.post('/users/new', registerUser);
router.post('/users', authenticateUser);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// group routes
router.post('/groups/new', createGroup);
router.get('/groups/:id', getGroup);
router.put('/groups/:id', updateGroup);
router.delete('/groups/:id', deleteGroup);

// member routes
router.post('/groups/members/new', addMembers);
router.get('/groups/:id/members', getMembers);
router.put('/groups/:id/members', updateMembers);
router.delete('/groups/:id/members', removeMembers);

// user chats routes
router.post('/chats/new', createUserChat);
router.get('/chats/:id', getUserChat);       // all messages of user
router.put('/chats/:id', updateUserChat);
router.delete('/chats/:id', deleteUserChat); // message delete by user

// message routes
router.post('/chats/messages/new', createMessage);
router.get('/chats/messages/:id', getMessage);       // message details
router.put('/chats/messages/:id', updateMessage);
router.delete('/chats/messages/:id', deleteMessage); // message delete by owner

// chatList routes
router.post('/chats/list/new', createChatList);
router.get('/chats/list/:id', getChatList);
router.put('/chats/list/:id', updateChatList);
router.delete('/chats/list/:id', deleteChatList);

// router end //

module.exports = router;