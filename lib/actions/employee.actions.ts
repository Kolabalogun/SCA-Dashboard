import { ID, Query } from "node-appwrite";
import { users } from "../appwrite.config";

export const createEmployee = async (user: EmployeeUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      user.passowrd,
      user.firstName
    );

    console.log({ newUser });
  } catch (error: any) {
    if (error && error?.code === 409) {
      const document = await users.list([Query.equal("email", [user.email])]);

      return document?.users[0];
    }
  }
};
