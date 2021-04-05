const { Op } = require("sequelize");
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
            res.status(400).send({message: 'User not found!'});
        }
        else if (findedUser.isLogin === true) {
            res.status(400).send({ message: 'You are already logged in!' });
        }
        else {
            findedUser.isLogin = true;
            findedUser.save();
            res.send({id: findedUser.userId});
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
        if(findedUser === null){
            Authenticate.create({
                username: data.email,
                password: data.password,
                isLogin: true,
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
    .then(async (newGroup) => {
        newGroup.groupCode = `uS${data.userId}G${newGroup.id}`;
        newGroup.save();
        await Member.create({
            userId: data.userId,
            groupId: newGroup.id,
            isAdmin: true
        })
        .catch((err) => {
            console.log("Error while add member : ", err);
            next(err);
        });

        const list = `g${newGroup.id}`;

        // create userchat welcome message
        let newUserChat = await UserChat.create({
            userId: data.userId,
            messageId: 1,
            list: list
        })
        .catch((err) => {
            console.log("Error while create UserChat : ", err);
            next(err);
        });
        
        const findedMessage = await Message.findByPk(1, {
                attributes: ['id', 'text', 'owner', 'isEdited', 'messageFor']
            })
            .catch((err) => {
                console.log("Error while create chatList : ", err);
                next(err);
            });

        let newChatList = await ChatList.create({
                userId: data.userId,
                list: list,
                isChatable: true
            })
            .catch((err) => {
                console.log("Error while create chatList : ", err);
                next(err);
            });
            

        newUserChat = newUserChat.toJSON();
        newUserChat.Message = findedMessage.toJSON();

        newChatList = newChatList.toJSON();

        newChatList.name = newGroup.name;
        newChatList.owner = newGroup.owner;
        newChatList.groupCode = newGroup.groupCode;
        newChatList.Chat = newUserChat;

        res.send(newChatList);
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
    const userId_1 = req.query.user_1;
    const userId_2 = req.query.user_2;
    db.sequelize.query(
        'SELECT G.id, G.name FROM groups G INNER JOIN members M1 on G.id = M1.groupId INNER JOIN members M2 on M1.groupId = M2.groupId WHERE M1.userId = :user1 AND M2.userId = :user2',
        {
            nest: true,
            replacements: {
                user1: userId_1,
                user2: userId_2
            },
            type: db.sequelize.QueryTypes.SELECT
        }
    )
        .then((findedGroups) => {
            if (findedGroups.length === 0) {
                res.status(400).send({ message: 'Not found' });
            }
            else {
                console.log(findedGroups);
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
    const data = req.body;
    Group.findOne({
        where: {
            groupCode: data.groupCode
        },
        attributes: ['id', 'name', 'owner', 'groupCode']
    })
    .then(async (findedGroup) => {
        if (findedGroup === null) {
            res.status(400).send({ message: 'Not found' });
        }
        else {
            const [newMember, created] = await Member.findOrCreate({
                where: {
                    userId: data.userId,
                    groupId: findedGroup.id
                },
                defaults: {
                    userId: data.userId,
                    groupId: findedGroup.id,
                    isAdmin: false
                }
            })
            .catch((err) => {
                console.log("Error while find member : ", err);
                next(err);
            });
            if (created) {
                const list = `g${newMember.groupId}`;

                // create userchat welcome message
                let newUserChat = await UserChat.create({
                    userId: data.userId,
                    messageId: 1,
                    list: list
                })
                .catch((err) => {
                    console.log("Error while create UserChat : ", err);
                    next(err);
                });

                const findedMessage = await Message.findByPk(1, {
                        attributes: ['id', 'text', 'owner', 'isEdited', 'messageFor']
                    })
                    .catch((err) => {
                        console.log("Error while create chatList : ", err);
                        next(err);
                    });

                // create chatList
                let newChatList  = await ChatList.create({
                    userId: data.userId,
                    list: list,
                    isChatable: true
                })
                .catch((err) => {
                    console.log("Error while create ChatList : ", err);
                    next(err);
                });

                newUserChat = newUserChat.toJSON();
                newUserChat.Message = findedMessage.toJSON();

                newChatList = newChatList.toJSON();
                
                newChatList.name = findedGroup.name;
                newChatList.owner = findedGroup.owner;
                newChatList.groupCode = findedGroup.groupCode;
                newChatList.Chat = newUserChat;

                res.send({found: false, data: newChatList});
            }
            else {
                res.send({found: true, message: 'You are already joined the group.' });
            }
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
    console.log('removeMember', req.params.id, req.query);
    Member.destroy({
        where: {
            userId: req.query.userId,
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
                    userId: req.query.userId,
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
        .then(async (updatedMessage) => {
            if (updatedMessage[0] === 0) {
                res.status(400).send({ message: 'Not found' });
            }
            else {
                const findedMessage = await Message.findByPk(req.params.id);
                res.send({ Message: findedMessage });
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
                include: {
                    association: UserChat.userChatMessage,
                    attributes: ['id', 'text', 'owner', 'isEdited', 'messageFor', 'createdAt', 'updatedAt'],
                    include: {
                        association: Message.messageOwner,
                        attributes: ['firstName', 'lastName'],
                    }
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
        state: true
    },
    {
        where: {
            userId: data.userId,
            list: data.list,
            messageId: {
                [Op.lte]: req.params.id
            },
            state: {
                [Op.or]: {
                    [Op.eq]: false,
                    [Op.eq]: null
                }
            }
        }
    })
        .then((updatedUserChat) => {
            res.send({ id: req.params.id });
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
    const data = req.body;
    User.findOne({
        where: {
            email: data.email
        },
        attributes: ['id', 'firstName', 'lastName']
    })
    .then(async (findedUser) => {
        if (findedUser === null) {
            res.status(400).send({ message: 'Not found' });
        }
        else {
            const list = `u${findedUser.id}`;

            // create chatList
            let [newChatList, created] = await ChatList.findOrCreate({
                    where: {
                        userId: data.userId,
                        list: list
                    },
                    defaults: {
                        userId: data.userId,
                        list: list,
                        isChatable: true
                    }
                })
                .catch((err) => {
                    console.log("Error while create ChatList : ", err);
                    next(err);
                });

            if (created) {
                // create userchat welcome message
                let newUserChat = await UserChat.create({
                        userId: data.userId,
                        messageId: 2,
                        list: list
                    })
                    .catch((err) => {
                        console.log("Error while create UserChat : ", err);
                        next(err);
                    });

                const findedMessage = await Message.findByPk(2, {
                        attributes: ['id', 'text', 'owner', 'isEdited', 'messageFor']
                    })
                    .catch((err) => {
                        console.log("Error while create chatList : ", err);
                        next(err);
                    });

                newUserChat = newUserChat.toJSON();
                newUserChat.Message = findedMessage.toJSON();

                newChatList = newChatList.toJSON();

                newChatList.name = findedUser.firstName + " " + findedUser.lastName;
                newChatList.Chat = newUserChat;

                res.send({ found: false, data: newChatList });
            }
            else {
                res.send({ found: true, message: 'The person is already in your Chat List.' });
            }
        }
    })
    .catch((err) => {
        console.log("Error while find user : ", err);
        next(err);
    });
}

// get chatList
const getChatList = (req, res, next) => {
    const userId = req.params.id;
    ChatList.findAll({
        raw: true,
        where: {
            userId: userId
        }
    })
        .then(async (findedChatList) => {
            if (findedChatList.length === 0) {
                res.status(400).send({ message: 'Not found' });
            }
            else {
                for (var ele in findedChatList) {
                    const list = findedChatList[ele].list;
                    const id = list.substr(1);
                    if (findedChatList[ele].list[0] == 'u') {
                        const findedUser = await User.findByPk(id,
                        {
                            attributes: ['firstName', 'lastName']
                        })
                        .catch((err) => {
                            console.log("Error while find User : ", err);
                            next(err);
                        });
                        if(findedUser != null){
                            findedChatList[ele].name = findedUser.firstName + " " + findedUser.lastName;
                        }
                    }
                    else {
                        const findedGroup = await Group.findByPk(id,
                        {
                            attributes: ['name', 'owner', 'groupCode']
                        })
                        .catch((err) => {
                            console.log("Error while find Group : ", err);
                            next(err);
                        });
                        if (findedGroup != null) {
                            findedChatList[ele].name = findedGroup.name;
                            findedChatList[ele].owner = findedGroup.owner;
                            findedChatList[ele].groupCode = findedGroup.groupCode;
                        }
                    }

                    const findedUserChat = await UserChat.findOne({
                        raw: true,
                        nest: true,
                        where: {
                            list: list,
                            userId: userId
                        },
                        include: {
                            association: UserChat.userChatMessage,
                            attributes: ['id', 'text', 'owner', 'isEdited', 'messageFor']
                        },
                        order: [['createdAt', 'DESC']]
                    })
                    .catch((err) => {
                        console.log("Error while find UserChat : ", err);
                        next(err);
                    });

                    findedChatList[ele].Chat = findedUserChat;
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

// create Member Chat
const createMemberChat = async (data) => {
    const id = parseInt(data.list.substr(1));
    if (data.list[0] === 'u') {
        const list = `u${data.userId}`;
        await UserChat.create({
            userId: id,
            list: list,
            messageId: data.messageId
        });
        await ChatList.findOrCreate({
            where: {
                userId: id,
                list: list
            },
            defaults: {
                userId: id,
                list: list,
                isChatable: true
            }
        });
    }
    else {
        Member.findAll({
            raw: true,
            where: {
                groupId: id,
                userId: {
                    [Op.ne]: data.userId
                }
            },
            attributes: ['userId']
        })
            .then(async (findedMembers) => {
                if (findedMembers.length !== 0) {
                    for(var ele in findedMembers) {
                        findedMembers[ele].list = data.list;
                        findedMembers[ele].messageId = data.messageId;
                    }
                    await UserChat.bulkCreate(findedMembers);
                }
            })
    }
}

// user logout
const logout = async (id) => {
    await Authenticate.update({
        isLogin: false
    },
    {
        where: { id }
    });
}

module.exports = {
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
};