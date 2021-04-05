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
    createMemberChat,
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
    logout,
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
    RemoveUserRoom,
    updateUserRoom,
    userJoin,
    userLeave
} = require('../utils/users');

server.listen(4000);

const botId = 1;

// socket.io start //

// Run when client connects
io.on('connection', socket => {

    // Listen for joinRoom
    socket.on('joinRoom', ({ userId, room, msgData}) => {

        updateUserRoom(socket.id, userId, room);

        socket.join(room);

        // create chat data
        const data = {
            Message: msgData,
            messageId: msgData.id,
            list: room,
            userId: userId,
            state: null
        };

        // Broadcast when a user connects
        socket.broadcast
            .to(room)
            .emit(
                'botMessage',
                { result: data }
            );
            
        // Send users and room info
        const users = getRoomUsers(room);
        io.to(room).emit('roomUsers', { room, users });

        // save message to database
        createMemberChat(data);

    });

    // Listen for registerRooms
    socket.on('registerRooms', ({ userId, rooms }) => {

        const prevRooms = userJoin(socket.id, userId, rooms);

        if(prevRooms === null) {

            // join all room to user
            rooms.forEach(room => {
                if (room[0] === 'g') {
                    socket.join(room);
        
                    // Send users and room info
                    const users = getRoomUsers(room);
                    io.to(room).emit('roomUsers', { room, users });
                }
            });
        }
        else {
            const changedRoom = rooms.filter(room => prevRooms.indexOf(room) === -1);
            // join all room to user
            changedRoom.forEach(room => {
                socket.join(room);

                // Send users and room info
                const users = getRoomUsers(room);
                io.to(room).emit('roomUsers', { room, users });
            });
        }

    });

    // Listen for activeUsers
    socket.on('activeUsers', ({room}) => {
        if (room[0] === 'g') {
            // Send users and room info
            const users = getRoomUsers(room);
            socket.emit('roomUsers', { room, users });
        }
        else {
            const id = parseInt(room.substr(1));
            const user = getCurrentUser(id);
            if (user) {
                // Send users and room info
                socket.emit('roomUsers', { room, users: [user.userId] });
            }
            else {
                socket.emit('roomUsers', { room, users: [] });
            }
        }
    });

    // Listen for chatMessage
    socket.on('chatMessage', data => {

        // save message to database
        createMemberChat(data);

        // broadcast message to room
        if (data.list[0] === 'g') {
            io.to(data.list).emit(
                'message',
                { result: data }
            );
        }
        else {
            const id = parseInt(data.list.substr(1));
            const user = getCurrentUser(id);
            if (user) {
                socket.to(user.id).emit(
                    'privateMessage',
                    { result: data }
                );
            }
            socket.emit(
                'message',
                { result: data }
            );
        }

    });

    // Runs when client leave
    socket.on('leaveRoom', ({ userId, room, msgData}) => {
        const flag = RemoveUserRoom(userId, room);

        // create chat data
        const data = {
            Message: msgData,
            messageId: msgData.id,
            list: room,
            userId: userId,
            state: null
        };

        if (flag) {

            socket.leave(room);

            io.to(room).emit(
                'botMessage',
                { result: data } //`${user.username} left the group`
            );

            // Send users and room info
            const users = getRoomUsers(room);
            io.to(room).emit('roomUsers', { room, users });

            // save message to database
            createMemberChat(data);
        }
    });

    // Runs when client logout
    socket.on('logout', () => {
        const user = userLeave(socket.id);

        if (user !== null) {
            // join all room to user
            user.rooms.forEach(room => {
                if (room[0] === 'g') {
                    socket.leave(room);
    
                    // Send users and room info
                    const users = getRoomUsers(room);
                    io.to(room).emit('roomUsers', { room, users });
                }
            });

            // logout
            logout(user.userId);
        }
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user !== null) {
            // join all room to user
            user.rooms.forEach(room => {
                // Send users and room info
                const users = getRoomUsers(room);
                io.to(room).emit('roomUsers', { room, users });
            });

            // logout
            logout(user.userId);
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
router.get('/groups/list', getGroups);  // all common list of group
router.get('/groups/:id', getGroup);  // group details
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