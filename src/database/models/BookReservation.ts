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
import { Book } from './Book';

@Table({
  tableName: 'book_reservation',
  paranoid: true,
})
export class BookReservation extends Model<BookReservation> {
  @ForeignKey(() => Author)
  @AllowNull(false)
  @Column
  public userId!: number;

  @ForeignKey(() => Book)
  @AllowNull(false)
  @Column
  public bookId!: number;

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
