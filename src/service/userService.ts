import User from "../model/User";
import { IUser } from "../interface/DTO/user/IUser";

const createUser = (data: IUser) => {
  const user = new User(data);
  return user.save();
};

const findUser = (email: string) => {
  return User.findOne({ email });
};

export default {
  createUser,
  findUser,
};
