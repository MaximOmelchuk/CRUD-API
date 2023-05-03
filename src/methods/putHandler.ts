import { IGetHandlerArgs, IRequestUser } from "../interfaces";
import usersObject from "../usersObject";
import { checkIsReceivedUserValid, checkIsUserWithIdExist } from "../utils";

const putHandler = (props: IGetHandlerArgs) => {
  const { request, response, url } = props;
  if (url?.startsWith("/users/")) {
    const user = checkIsUserWithIdExist(props);
    if (!user) return;
    const chunkArr: Uint8Array[] = [];
    request.on("data", (chunk) => {
      chunkArr.push(chunk);
    });
    request.on("end", () => {
      const fullResponseUserData = Buffer.concat(chunkArr).toString();
      const requestData: IRequestUser = JSON.parse(fullResponseUserData);
      const isValid = checkIsReceivedUserValid(requestData);
      if (isValid) {
        usersObject.updateUser(user.id, requestData);
        response.statusCode = 200;
        return response.end(JSON.stringify(usersObject.getOneUser(user.id)));
      } else {
        response.statusCode = 400;
        return response.end("User should contain all required fields");
      }
    });
  }
};

export default putHandler;
