import { validate } from "uuid";
import { IGetHandlerArgs } from "../interfaces";
import usersObject from "../usersObject";

const getHandler = ({ request, response, url }: IGetHandlerArgs) => {
  if (url === "/users") {
    response.statusCode = 200;
    return response.end(JSON.stringify(usersObject.getAllUsers()));
  } else if (url?.startsWith("/users/")) {
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
    response.statusCode = 200;
    return response.end(JSON.stringify(user));
  }
};

export default getHandler;
