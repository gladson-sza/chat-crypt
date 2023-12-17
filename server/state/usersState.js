const UsersState = {
  users: [],
  setUsers: (newUsers) => this.users = newUsers
};

function activateUser(id, name, room) {
  const user = { id, name, room };
  UsersState.setUsers([
    ...UsersState.users.filter(user => user.id !== id),
    user
  ]);
  return user;
};

function userLeavesApp(id) {
  UsersState.setUsers(
    UsersState.users.filter(user => user.id !== id)
  );
};

function getUser(id) {
  return UsersState.users.find(user => user.id === id)
};

function getUsersInRoom(room) {
  return UsersState.users.filter(user => user.room === room)
};

function getAllActiveRooms() {
  return Array.from(new Set(UsersState.users.map(user => user.room)))
};

module.exports = { activateUser, userLeavesApp, getUser, getUsersInRoom, getAllActiveRooms }