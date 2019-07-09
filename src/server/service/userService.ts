import { User } from 'database/models/User';

const create = (email: string, password: string): Promise<User> => {
  return User.create({ email, password });
};

const findById = (id: number): Promise<User> => {
  return User.findByPk(id);
};

const findByEmail = (email: string): Promise<User> => {
  return User.findOne({ where: { email } });
};

export default {
  create,
  findById,
  findByEmail,
};
