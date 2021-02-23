const users = [];

// Join user to chat
const userJoin = (id, userId, room) => {
  const user = { id, userId, room };
  users.push(user);
  return user;
}

// Update room of user
const updateUserRoom = (id, room) => {
  const index = users.findIndex(user => user.id === id);
  if(index !== -1){
    users[index].room = room;
    return users[index]; 
  }
  return null;
}

// Get current user
const getCurrentUser = (id) => {
  return users.find(user => user.id === id);
}

// User leaves chat
const userLeave = (id) => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
      const leftUser = users[index];
      users.splice(index, 1);
      return leftUser;
  }
  return null;
}

// Get room users
const getRoomUsers = (room) => {
  return users.filter(user => user.room === room);
}

module.exports = {
  getRoomUsers,
  getCurrentUser,
  updateUserRoom,
  userJoin,
  userLeave
};