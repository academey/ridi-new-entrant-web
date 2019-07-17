import models from 'database/models';
import { BookReservation } from 'database/models/BookReservation';
import { Moment } from 'moment';
import { Op, TruncateOptions } from 'sequelize';

const PENALTY_LATIO = 2;
const sequelize = models.Sequelize;

interface ICreateParams {
  userId: number;
  bookId: number;
  endAt: Moment;
}
const create = (params: ICreateParams): Promise<BookReservation> => {
  return BookReservation.create(params);
};

const findByBookId = (bookId: number): Promise<BookReservation> => {
  return BookReservation.findOne({
    where: {
      bookId,
    },
  });
};

const findByBookIdAndUserId = (bookId: number, userId: number): Promise<BookReservation> => {
  return BookReservation.findOne({
    where: {
      bookId,
      userId,
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

const findLateReturnedOne = (userId: number): Promise<BookReservation> => {
  return BookReservation.findOne({
    attributes: {
      include: [
        [sequelize.fn('ADDTIME',
          sequelize.col('deleted_at'),
          sequelize.literal(`TIMEDIFF(deleted_at, end_at) * ${PENALTY_LATIO}`),
        ), 'penalty_end_at']],
    },
    paranoid: false,
    where: sequelize.and(sequelize.where(
      sequelize.fn('ADDTIME',
        sequelize.col('deleted_at'),
        sequelize.literal(`TIMEDIFF(deleted_at, end_at) * ${PENALTY_LATIO}`),
      ), '>', sequelize.fn('NOW')),
      {
        deletedAt: {
          [Op.ne]: null,
        },
      },
      {
        userId,
      },
    ),
    order: [
      [
        sequelize.fn('ADDTIME',
        sequelize.col('deleted_at'),
        sequelize.literal(`TIMEDIFF(deleted_at, end_at) * ${PENALTY_LATIO}`),
        ), 'DESC',
      ],
    ],
  });
};

const findDelayedOne = (userId: number): Promise<BookReservation> => {
  return BookReservation.findOne({
    attributes: {
      include: [
        [sequelize.fn('ADDTIME',
          sequelize.fn('NOW'),
          sequelize.literal(`TIMEDIFF(NOW(), end_at) * ${PENALTY_LATIO}`),
        ), 'penalty_end_at']],
    },
    where: {
      endAt: {
        [Op.lt]: new Date(),
      },
      userId,
    },
    order: [
      ['end_at', 'ASC'],
    ],
  });
};

export default {
  create,
  findByBookId,
  findByBookIdAndUserId,
  destroyById,
  findLateReturnedOne,
  findDelayedOne,
};
