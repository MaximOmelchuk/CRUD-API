import { IUser } from "../interfaces";
import { v4 } from "uuid";
import { IGetHandlerArgs, IRequestUser } from "../interfaces";
import usersObject from "../usersObject";
import { checkIsReceivedUserValid } from "../utils";

const postHandler = ({ request, response, url }: IGetHandlerArgs) => {
  if (url === "/users") {
    let chunkArr: Uint8Array[] = [];
    request.on("data", (chunk) => {
      chunkArr.push(chunk);
    });
    request.on("end", () => {
      const fullResponseUserData = Buffer.concat(chunkArr).toString();
      const responseData: IRequestUser = JSON.parse(fullResponseUserData);
      const isValid = checkIsReceivedUserValid(responseData);
      if (isValid) {
        const userData: IUser = { id: v4(), ...responseData };
        usersObject.createNewUser(userData);
        response.statusCode = 201;
        return response.end(JSON.stringify(userData));
      } else {
        response.statusCode = 400;
        return response.end("User should contain all required fields");
      }
    });
  }
};

export default postHandler;
