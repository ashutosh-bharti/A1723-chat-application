const db = require('../../models');
const Authenticate = db.Authenticate;
const ChatList = db.ChatList;
const Group = db.Group;
const Member = db.Member;
const Message = db.Message;
const User = db.User;
const UserChat = db.UserChat;

// authenticate user credentials
const authenticateUser = (req, res, next) => {
    const data = req.body;
    Authenticate.findOne({
        where: { username: data.email, password: data.password }
    })
    .then((findedUser) => {
        if (findedUser === null) {
            console.log("null");
            res.status(400).send({message: 'Not found'});
        }
        else {
            res.send({id:findedUser.userId});
        }
    })
    .catch((err) => {
        console.log("Error while authenticate : ", err);
        next(err);
    });
}

// register user details
const registerUser = (req, res, next) => {
    const data = req.body;
    Authenticate.findOne({
        where: { username: data.email }
    })
    .then((findedUser) => {
        console.log(findedUser);
        if(findedUser === null){
            Authenticate.create({
                username: data.email,
                password: data.password,
                User: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email
                }
            },
            {
                include: [Authenticate.authUser]
            })
            .then((newUser) => {
                console.log(newUser.toJSON());
                res.send(newUser.User.toJSON());
            })
            .catch((err) => {
                console.log("Error while create user : ", err);
                next(err);
            });
        }
        else {
            console.log('username already registered');
            res.send({ message: 'username already registered' });
        }
    })
    .catch((err) => {
        console.log("Error while find user : ", err);
        next(err);
    });
}

// get user details
const getUser = (req, res, next) => {
    User.findByPk(req.params.id)
    .then((findedUser) => {
        if (findedUser === null) {
            res.status(400).send({ message: 'Not found' });
        }
        else {
            res.send(findedUser.toJSON());
        }
    })
    .catch((err) => {
        console.log("Error while find user : ", err);
        next(err);
    });
}

// update user details (query 1 for password update & 2 for user details update)
const updateUser = (req, res, next) => {
    const data = req.body;
    if(data.query === 1){
        Authenticate.findOne({
            where: {
                username: data.email,
                password: data.oldPassword,
                id: req.params.id
            }
        })
            .then((findedUser) => {
                if (findedUser === null) {
                    console.log("null");
                    res.status(400).send({ message: 'Not found' });
                }
                else{
                    Authenticate.update({
                        password: data.newPassword
                    },
                    {
                        where: {
                            id: findedUser.id
                        }
                    })
                        .then((updatedUser) => {
                            if (updatedUser[0] === 0) {
                                res.status(400).send({ message: 'Not found' });
                            }
                            else {
                                res.send({ id: req.params.id });
                            }
                        })
                        .catch((err) => {
                            console.log("Error while update authenticate : ", err);
                            next(err);
                        });
                }
            })
            .catch((err) => {
                console.log("Error while authenticate : ", err);
                next(err);
            });
    }
    else {
        User.update({
            firstName: data.firstName,
            lastName: data.lastName
        },
        {
            where: {
                id: req.params.id
            }
        })
        .then((updatedUser) => {
            if (updatedUser[0] === 0) {
                res.status(400).send({ message: 'Not found' });
            }
            else {
                res.send({ id: req.params.id });
            }
        })
        .catch((err) => {
            console.log("Error while update user : ", err);
            next(err);
        });
    }
}

// delete user details
const deleteUser = (req, res, next) => {
    User.destroy({
        where: {
            id: req.params.id
        },
        force: true
    })
    .then(() => {
        console.log('deleted');
        res.send({id: req.params.id});
    })
    .catch((err)  => {
        console.log("Error while delete user : ", err);
        next(err);
    });
}

// create group details
const createGroup = (req, res, next) => {
    const data = req.body;

    Group.create({
        name: data.name,
        owner: data.userId,
        groupCode: `uSG`
    })
    .then((newGroup) => {
        newGroup.groupCode = `uS${data.userId}G${newGroup.id}`;
        newGroup.save();
        Member.create({
            userId: data.userId,
            groupId: newGroup.id,
            isAdmin: true
        })
        .then((newMember) => {
            ChatList.create({
                userId: newMember.userId,
                list: `g${newGroup.id}`
            })
            .then((newChatList) => {
                    res.send({newGroup: newGroup.toJSON(), newMember: newMember.toJSON(), newChatList: newChatList.toJSON()});
            })
            .catch((err) => {
                console.log("Error while create chatList : ", err);
                next(err);
            });
        })
        .catch((err) => {
            console.log("Error while add member : ", err);
            next(err);
        });
    })
    .catch((err) => {
        console.log("Error while create group : ", err);
        next(err);
    });
}

// get group details
const getGroup = (req, res, next) => {
    Group.findByPk(req.params.id, {
        attributes: { exclude: ['UserId'] }
    })
        .then((findedGroup) => {
            if (findedGroup === null) {
                res.status(400).send({ message: 'Not found' });
            }
            else {
                res.send(findedGroup.toJSON());
            }
        })
        .catch((err) => {
            console.log("Error while find group : ", err);
            next(err);
        });
}

// update group details
const updateGroup = (req, res, next) => {
    Group.update({
        name: req.body.name
    },
    {
        where: {
            id: req.params.id
        }
    })
        .then((updatedGroup) => {
            if (updatedGroup[0] === 0) {
                res.status(400).send({ message: 'Not found' });
            }
            else {
                res.send({ id: req.params.id });
            }
        })
        .catch((err) => {
            console.log("Error while update group : ", err);
            next(err);
        });
}

// delete group details
const deleteGroup = (req, res, next) => {
    const groupId = req.params.id;
    Group.destroy({
        where: {
            id: groupId
        },
        force: true
    })
        .then(() => {
            console.log('Group deleted');
            return ChatList.destroy({
                where: {
                    list: `g${groupId}`
                },
                force: true
            });
        })
        .then(() => {
            console.log('ChatList deleted');
            return Message.destroy({
                where: {
                    messageFor: `g${groupId}`
                },
                force: true
            });
        })
        .then(() => {
            console.log('Messages deleted');
            res.send({ id: groupId });
        })
        .catch((err) => {
            console.log("Error while delete group : ", err);
            next(err);
        });
}

// get groups of one user
const getGroups = (req, res, next) => {
    const userId = req.params.id;
    Member.findAll({
        raw: true,
        where: { userId: userId },
        attributes: ['groupId']
    })
        .then((findedGroups) => {
            if (findedGroups.length === 0) {
                res.status(400).send({ message: 'Not found' });
            }
            else {
                res.json(findedGroups);
            }
        })
        .catch((err) => {
            console.log("Error while find groups : ", err);
            next(err);
        });
}

// add member to group
const addMembers = (req, res, next) => {
    Group.findOne({
        where: {
            groupCode: req.body.groupCode
        },
        attributes: ['id']
    })
    .then((findedGroup) => {
        if (findedGroup === null) {
            res.status(400).send({ message: 'Not found' });
        }
        else {
            Member.create({
                userId: req.body.userId,
                groupId: findedGroup.id,
                isAdmin: false
            })
            .then((newMember) => {
                return ChatList.create({
                    userId: req.body.userId,
                    list: `g${newMember.groupId}`,
                    isChatable: true
                })
            })
            .then((newChatList) => {
                res.send(newChatList.toJSON());
            })
            .catch((err) => {
                console.log("Error while find member : ", err);
                next(err);
            });
        }
    })
    .catch((err) => {
        console.log("Error while find group : ", err);
        next(err);
    });
}

// get members of a group
const getMembers = (req, res, next) => {
    Member.findAll({
        raw: true,
        nest: true,
        where: { 
            groupId: req.params.id 
        },
        include: User
    })
        .then((findedMembers) => {
            if (findedMembers.length === 0) {
                res.status(400).send({ message: 'Not found' });
            }
            else {
                res.json(findedMembers);
            }
        })
        .catch((err) => {
            console.log("Error while find member : ", err);
            next(err);
        });
}

// update member of a group
const updateMembers = (req, res, next) => {
    Member.update({
        isAdmin: req.body.isAdmin
    },
        {
            where: {
                userId:req.body.userId,
                groupId: req.params.id
            }
        })
        .then((updatedMember) => {
            if (updatedMember[0] === 0) {
                res.status(400).send({ message: 'Not found' });
            }
            else {
                res.send({ id: req.params.id });
            }
        })
        .catch((err) => {
            console.log("Error while update member : ", err);
            next(err);
        });
}

// remove member from a group
const removeMembers = (req, res, next) => {
    Member.destroy({
        where: {
            userId: req.body.userId,
            groupId: req.params.id
        },
        force: true
    })
        .then(() => {
            console.log('deleted');
            return ChatList.update({
                isChatable: false
            },
            {
                where: {
                    userId: req.body.userId,
                    list: `g${req.params.id}`
                }
            });
        })
        .then((updateChatList) => {
            if (updateChatList[0] === 0) {
                res.status(400).send({ message: 'Not found' });
            }
            else{
                res.send({ id: req.body.userId });
            }
        })
        .catch((err) => {
            console.log("Error while remove member : ", err);
            next(err);
        });
}

// create a message
const createMessage = (req, res, next) => {
    const data = req.body;
    Message.create({
        text: data.text,
        owner: data.userId,
        messageFor: data.messageFor,
        isEdited: false
    })
        .then((newMessage) => {
            res.send(newMessage.toJSON());
        })
        .catch((err) => {
            console.log("Error while create group : ", err);
            next(err);
        });
}

// get a message details for socket.io
const getMessage = (req, res, next) => {
    UserChat.findAll({
        raw: true,
        nest: true,
        where: {
            messageId: req.params.id
        },
        include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }
    })
        .then((findedMessage) => {
            if (findedMessage.length === 0) {
                res.status(400).send({ message: 'Not found' });
            }
            else {
                res.json(findedMessage);
            }
        })
        .catch((err) => {
            console.log("Error while find message : ", err);
            next(err);
        });
}

// update message details
const updateMessage = (req, res, next) => {
    Message.update({
        text: req.body.text,
        isEdited: true
    },
    {
        where: {
            id: req.params.id
        }
    })
        .then((updatedMessage) => {
            if (updatedMessage[0] === 0) {
                res.status(400).send({ message: 'Not found' });
            }
            else {
                res.send({ id: req.params.id });
            }
        })
        .catch((err) => {
            console.log("Error while update message : ", err);
            next(err);
        });
}

// delete message
const deleteMessage = (req, res, next) => {
    Message.destroy({
        where: {
            id: req.params.id
        },
        force: true
    })
        .then(() => {
            console.log('deleted');
            res.send({ id: req.params.id });
        })
        .catch((err) => {
            console.log("Error while delete message : ", err);
            next(err);
        });
}

// create userChat
const createUserChat = (req, res, next) => {
    const data = req.body;
    UserChat.create({
        userId: data.userId,
        messageId: data.messageId,
        list: data.list
    })
        .then((newUserChat) => {
            res.send(newUserChat.toJSON());
        })
        .catch((err) => {
            console.log("Error while create userChat : ", err);
            next(err);
        });
}

// get userChat details
const getUserChat = (req, res, next) => {
    ChatList.findByPk(req.params.id,{
        attributes: ['userId', 'list']
    })
    .then((findedChatList) => {
        if (findedChatList === null) {
            res.status(400).send({ message: 'Not found' });
        }
        else {
            UserChat.findAll({
                raw: true,
                nest: true,
                where: {
                    userId: findedChatList.userId,
                    list: findedChatList.list
                },
                include:{
                    association: UserChat.userChatMessage,
                    attributes: ['id', 'text', 'owner', 'isEdited', 'messageFor', 'createdAt', 'updatedAt']
                }
            })
                .then((findedUserChat) => {
                    if (findedUserChat.length === 0) {
                        res.status(400).send({ message: 'Not found' });
                    }
                    else {
                        res.json(findedUserChat);
                    }
                })
                .catch((err) => {
                    console.log("Error while find userChat : ", err);
                    next(err);
                });
        }
    })
    .catch((err) => {
        console.log("Error while find chatList : ", err);
        next(err);
    });
}

// update userChat details
const updateUserChat = (req, res, next) => {
    const data = req.body;
    UserChat.update({
        state: data.state
    },
    {
        where: {
            userId: data.userId,
            messageId: req.params.id
        }
    })
        .then((updatedUserChat) => {
            if (updatedUserChat[0] === 0) {
                res.status(400).send({ message: 'Not found' });
            }
            else {
                res.send({ id: req.params.id });
            }
        })
        .catch((err) => {
            console.log("Error while update userChat : ", err);
            next(err);
        });
}

// delete userChat details
const deleteUserChat = (req, res, next) => {
    UserChat.destroy({
        where: {
            userId: req.body.userId,
            messageId: req.params.id
        },
        force: true
    })
        .then(() => {
            console.log('deleted');
            res.send({ id: req.params.id });
        })
        .catch((err) => {
            console.log("Error while delete chatList : ", err);
            next(err);
        });
}

// create chatList
const createChatList = (req, res, next) => {
    ChatList.create({
        userId: req.body.userId,
        list: req.body.list,
        isChatable: true
    })
        .then((newUserChat) => {
            res.send(newUserChat.toJSON());
        })
        .catch((err) => {
            console.log("Error while create chatList : ", err);
            next(err);
        });
}

// get chatList
const getChatList = (req, res, next) => {
    ChatList.findAll({
        raw: true,
        where: {
            userId: req.params.id
        }
    })
        .then(async (findedChatList) => {
            if (findedChatList.length === 0) {
                res.status(404).send({ message: 'Not found' });
            }
            else {
                for (var ele in findedChatList) {
                    const id = findedChatList[ele].list.substr(1);
                    if (findedChatList[ele].list.startsWith("u")) {
                        const findedUser = await User.findByPk(id,
                        {
                            attributes: ['firstName', 'lastName']
                        })
                        .catch((err) => {
                            console.log("Error while delete chatList : ", err);
                            next(err);
                        });
                        if(findedUser != null){
                            findedChatList[ele].name = findedUser.firstName + " " + findedUser.lastName;
                        }
                    }
                    else {
                        const findedGroup = await Group.findByPk(id,
                        {
                            attributes: ['name', 'owner']
                        })
                        .catch((err) => {
                            console.log("Error while delete chatList : ", err);
                            next(err);
                        });
                        if (findedGroup != null) {
                            findedChatList[ele].name = findedGroup.name;
                            findedChatList[ele].owner = findedGroup.owner;
                        }
                    }
                }
                res.json(findedChatList);
            }
        })
        .catch((err) => {
            console.log("Error while delete chatList : ", err);
            next(err);
        });
}

// update chatList
const updateChatList = (req, res, next) => {
    const data = req.body;
    ChatList.update({
        isChatable: data.isChatable
    },
        {
            where: {
                userId: req.params.id,
                list: data.list
            }
        })
        .then((updatedChatList) => {
            if (updatedChatList[0] === 0) {
                res.status(400).send({ message: 'Not found' });
            }
            else {
                res.send({ id: req.params.id });
            }
        })
        .catch((err) => {
            console.log("Error while update chatList : ", err);
            next(err);
        });
}

// delete chatList
const deleteChatList = (req, res, next) => {
    ChatList.findByPk(req.params.id)
    .then((findedChatList) => {
        if (findedChatList === null) {
            res.status(400).send({ message: 'Not found' });
        }
        else {
            UserChat.destroy({
                where: {
                    userId: findedChatList.userId,
                    list: findedChatList.list
                }
            })
            .then(() => {
                console.log('UserChat deleted')
                ChatList.destroy({
                    where: {
                        id: findedChatList.id
                    },
                    force: true
                })
                .then(() => {
                    console.log('ChatList deleted');
                    res.send({ id: req.params.id });
                })
                .catch((err) => {
                    console.log("Error while delete chatList : ", err);
                    next(err);
                });
            })
            .catch((err) => {
                console.log("Error while delete userChat : ", err);
                next(err);
            });
        }
    })
    .catch((err) => {
        console.log("Error while find chatList : ", err);
        next(err);
    });
}

module.exports = {
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
};