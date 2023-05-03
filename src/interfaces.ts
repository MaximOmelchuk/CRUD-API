import { IncomingMessage, ServerResponse } from "http";

export interface IRequestUser {
  username: string;
  age: number;
  hobbies: string[];
}

export interface IUser extends IRequestUser {
  id: string;
}

export interface IGetHandlerArgs {
  request: IncomingMessage;
  response: ServerResponse<IncomingMessage>;
  url: string | undefined;
}

export interface IUsersObject {
  _allUsers: IUser[];
  getAllUsers: () => IUser[];
  getOneUser: (id: string) => IUser | undefined;
  createNewUser: (user: IUser) => void;
}
