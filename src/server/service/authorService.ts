import { Author } from 'database/models/Author';

interface ICreateParams {
  name: string;
  desc: string;
}
const create = (params: ICreateParams): Promise<Author> => {
  return Author.create(params);
};

const findAll = (): Promise<Author[]> => {
  return Author.findAll({
    order: [['id', 'DESC']],
  });
};

const findById = (id: number): Promise<Author> => {
  return Author.findByPk(id);
};

const destroyById = (id: number): Promise<number> => {
  return Author.destroy({
    where: {
      id,
    },
  });
};

export default {
  create,
  findAll,
  findById,
  destroyById,
};
