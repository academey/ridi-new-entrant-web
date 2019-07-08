import {
  AllowNull,
  Column,
  CreatedAt,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { Author } from './Author';
import { BookReservation } from './BookReservation';

@Table({
  tableName: 'reservation_penalty',
  paranoid: true,
})
export class ReservationPenalty extends Model<ReservationPenalty> {
  @ForeignKey(() => Author)
  @AllowNull(false)
  @Column
  public userId!: number;

  @ForeignKey(() => BookReservation)
  @AllowNull(false)
  @Column
  public bookReservationId!: number;

  @CreatedAt
  @Column
  public endAt!: Date;

  @CreatedAt
  @Column
  public createdAt!: Date;

  @UpdatedAt
  @Column
  public updatedAt!: Date;
}
