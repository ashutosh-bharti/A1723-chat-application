const users = [];

// Join user to chat
const userJoin = (id, userId, rooms) => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) {
    const user = { id, userId, rooms };
    users.push(user);
    return null;
  }
  else {
    const prevRooms = users[index].rooms;
    users[index].userId = userId;
    users[index].rooms = rooms;
    return prevRooms;
  }
}

// Update room of user
const updateUserRoom = (id, userId, room) => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1){
    if (!users[index].rooms.includes(room)) {
      users[index].rooms.push(room);
    }
  }
  else {
    const user = { id, userId, rooms: [room] };
    users.push(user);
  }
}

// Remove room of user
const RemoveUserRoom = (userId, room) => {
  const index = users.findIndex(user => user.userId === userId);
  if (index !== -1) {
    const roomIndex = users[index].rooms.findIndex(item => item === room);
    if (roomIndex !== -1) {
      users[index].rooms.splice(roomIndex, 1);
      return true;
    }
  }
  return false;
}

// Get current user
const getCurrentUser = (id) => {
  return users.find(user => user.userId === id);
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
  const roomUsers = users.filter(user => user.rooms.includes(room))
                          // .map(({id, userId}) => ({id, userId}));
  return roomUsers;
}

module.exports = {
  getRoomUsers,
  getCurrentUser,
  RemoveUserRoom,
  updateUserRoom,
  userJoin,
  userLeave
};