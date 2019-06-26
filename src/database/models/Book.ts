import {
  AllowNull,
  BelongsToMany,
  Column,
  CreatedAt,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { Author } from './Author';
import { AuthorBook } from './AuthorBook';
import { BookReservation } from './BookReservation';

@Table
export class Book extends Model<Book> {
  @AllowNull(false)
  @Column
  public name!: string;

  @AllowNull(false)
  @Column
  public desc!: string;

  @CreatedAt
  @Column
  public createdAt!: Date;

  @UpdatedAt
  @Column
  public updatedAt!: Date;

  @BelongsToMany(() => Author, () => AuthorBook)
  public authors?: Author[];

  @HasOne(() => BookReservation, 'bookId')
  public bookReservation?: BookReservation;
}
