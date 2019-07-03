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
  tableName: 'author_book',
})
export class AuthorBook extends Model<AuthorBook> {
  @ForeignKey(() => Author)
  @AllowNull(false)
  @Column
  public authorId!: number;

  @ForeignKey(() => Book)
  @AllowNull(false)
  @Column
  public bookId!: number;

  @CreatedAt
  @Column
  public createdAt!: Date;

  @UpdatedAt
  @Column
  public updatedAt!: Date;
}
