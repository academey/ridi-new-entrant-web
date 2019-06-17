import {Column, CreatedAt, ForeignKey, Model, Table, UpdatedAt} from 'sequelize-typescript';
import {Author} from './Author';
import {Book} from './Book';

@Table
export class AuthorBook extends Model<AuthorBook> {

  @ForeignKey(() => Author)
  @Column
  public authorId!: number;

  @ForeignKey(() => Book)
  @Column
  public bookId!: number;

  @CreatedAt
  @Column
  public createdAt!: Date;

  @UpdatedAt
  @Column
  public updatedAt!: Date;
}