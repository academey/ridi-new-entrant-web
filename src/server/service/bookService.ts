import { Book } from 'database/models/Book';
import { BookReservation } from 'database/models/BookReservation';

interface ICreateParams {
  name: string;
  desc: string;
}
const create = (params: ICreateParams): Promise<Book> => {
  return Book.create(params);
};

const findAll = (): Promise<Book[]> => {
  return Book.findAll({
    include: [BookReservation],
    order: [['id', 'DESC']],
  });
};

const findById = (id: number): Promise<Book> => {
  return Book.findByPk(id);
};

const destroyById = (id: number): Promise<number> => {
  return Book.destroy({
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
