import { IGetHandlerArgs } from "../interfaces";
import usersObject from "../usersObject";
import { checkIsUserWithIdExist, nonExistEndpointHandler } from "../utils";

const getHandler = (props: IGetHandlerArgs) => {
  const { request, response, url, users } = props;
  if (users) {
    usersObject.setAllUsers(users);
  }

  if (url === "/api/users") {
    response.statusCode = 200;
    return response.end(JSON.stringify(usersObject.getAllUsers()));
  }
  if (url?.startsWith("/api/users/")) {
    const user = checkIsUserWithIdExist(props);
    if (!user) return;
    response.statusCode = 200;
    return response.end(JSON.stringify(user));
  }
  return nonExistEndpointHandler(response);
};

export default getHandler;
