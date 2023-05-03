import { IUser } from "../interfaces";
import { v4, validate } from "uuid";
import { IGetHandlerArgs, IRequestUser } from "../interfaces";
import usersObject from "../usersObject";
import checkIsReceivedUserValid from "../utils";

const putHandler = ({ request, response, url }: IGetHandlerArgs) => {
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
    const chunkArr: Uint8Array[] = [];
    request.on("data", (chunk) => {
      chunkArr.push(chunk);
    });
    request.on("end", () => {
      const fullResponseUserData = Buffer.concat(chunkArr).toString();
      const requestData: IRequestUser = JSON.parse(fullResponseUserData);
      const isValid = checkIsReceivedUserValid(requestData);
      if (isValid) {
        usersObject.updateUser(requestId, requestData);
        response.statusCode = 200;
        return response.end(JSON.stringify(usersObject.getOneUser(requestId)));
      } else {
        response.statusCode = 400;
        return response.end("User should contain all required fields");
      }
    });
  }
};

export default putHandler;
