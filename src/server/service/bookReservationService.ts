import { BookReservation } from 'database/models/BookReservation';
import { Moment } from 'moment';
import { Op, TruncateOptions } from 'sequelize';

interface ICreateParams {
  userId: number;
  bookId: number;
  endAt: Moment;
}
const create = (params: ICreateParams): Promise<BookReservation> => {
  return BookReservation.create(params);
};

const findOnePrevThanTime = (
  userId: number,
  time: Moment,
): Promise<BookReservation> => {
  return BookReservation.findOne({
    where: {
      userId,
      endAt: {
        [Op.lt]: time, // endAt < time Query
      },
    },
    order: [['end_at', 'DESC']],
  });
};

const findByBookId = (bookId: number): Promise<BookReservation> => {
  return BookReservation.findOne({
    where: {
      bookId,
    },
  });
};

const destroyById = (userId: number, bookId: number, options: TruncateOptions = null): Promise<number> => {
  return BookReservation.destroy({
    where: {
      userId,
      bookId,
    },
    ...options,
  });
};

export default {
  create,
  findOnePrevThanTime,
  findByBookId,
  destroyById,
};
