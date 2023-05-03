import { validate } from "uuid";
import { IGetHandlerArgs } from "../interfaces";
import usersObject from "../usersObject";

const deleteHandler = ({ request, response, url }: IGetHandlerArgs) => {
  if (url?.startsWith("/users/")) {
    const requestId = url.replace(/^\/users\//, "");
    if (!validate(requestId)) {
      response.statusCode = 400;
      return response.end("ID is not valid");
    }
    const user = usersObject.getOneUser(requestId);
    if (!user) {
      response.statusCode = 404;
      return response.end("User with this ID does not exist");
    }
    usersObject.deleteUser(requestId);
    response.statusCode = 204;
    return response.end();
  }
};

export default deleteHandler;
