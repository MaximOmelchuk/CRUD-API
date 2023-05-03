import { IUsersObject } from "./interfaces";

const usersObject: IUsersObject = {
  _allUsers: [],
  getAllUsers() {
    return this._allUsers;
  },
  getOneUser(id) {
    return this._allUsers.find((user) => user.id === id);
  },
  createNewUser(user) {
    this._allUsers.push(user);
  },
  updateUser(user) {
    this._allUsers.push(user);
  },
  deleteUser(id) {
    this._allUsers = this._allUsers.filter((user) => user.id !== id);
  },
};

export default usersObject;
