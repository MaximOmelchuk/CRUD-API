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
};

export default usersObject;
