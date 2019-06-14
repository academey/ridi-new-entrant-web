import {Column, CreatedAt, ForeignKey, Model, Table, UpdatedAt} from 'sequelize-typescript';

import {Author} from './Author';
import {Book} from './Book';

@Table
export class BookReservation extends Model<BookReservation> {
  @ForeignKey(() => Author)
  @Column
  public userId!: number;

  @ForeignKey(() => Book)
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
