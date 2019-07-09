import { ReservationPenalty } from 'database/models/ReservationPenalty';
import { Moment } from 'moment';
import { Op } from 'sequelize';

interface ICreateParams {
  userId: number;
  bookReservationId: number;
  endAt: Moment;
}
const create = (params: ICreateParams): Promise<ReservationPenalty> => {
  return ReservationPenalty.create(params);
};

const findOneLaterThanTime = (
  userId: number,
  time: Moment,
): Promise<ReservationPenalty> => {
  return ReservationPenalty.findOne({
    where: {
      userId,
      endAt: {
        [Op.gt]: time, // endAt > time Query
      },
    },
    order: [['end_at', 'DESC']],
  });
};

export default {
  create,
  findOneLaterThanTime,
};
