import {
  AllowNull,
  BelongsToMany,
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { AuthorBook } from './AuthorBook';
import { Book } from './Book';

@Table
export class Author extends Model<Author> {
  @AllowNull(false)
  @Column
  public name!: string;

  @AllowNull(false)
  @Column
  public desc!: number;

  @CreatedAt
  @Column
  public createdAt!: Date;

  @UpdatedAt
  @Column
  public updatedAt!: Date;

  @BelongsToMany(() => Book, () => AuthorBook)
  public books?: Book[];
}
