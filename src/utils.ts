const checkIsReceivedUserValid = (body: any): boolean => {
  return (
    "username" in body &&
    typeof body.username === "string" &&
    "age" in body &&
    typeof body.age === "number" &&
    "hobbies" in body &&
    Array.isArray(body.hobbies) &&
    (body.hobbies.length === 0 ||
      body.hobbies.every((item: any) => typeof item === "string"))
  );
};

export default  checkIsReceivedUserValid;
