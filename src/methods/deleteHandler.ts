import { nonExistEndpointHandler } from "./../utils";
import { IGetHandlerArgs } from "../interfaces";
import usersObject from "../usersObject";
import { checkIsUserWithIdExist } from "../utils";

const deleteHandler = (props: IGetHandlerArgs) => {
  const { request, response, url } = props;
  if (url?.startsWith("api/users/")) {
    const user = checkIsUserWithIdExist(props);
    if (!user) return;
    usersObject.deleteUser(user.id);
    response.statusCode = 204;
    return response.end();
  }
  return nonExistEndpointHandler(response);
};

export default deleteHandler;
