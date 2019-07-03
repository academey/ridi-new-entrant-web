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

@Table({
  tableName: 'author',
})
export class Author extends Model<Author> {
  @AllowNull(false)
  @Column
  public name!: string;

  @AllowNull(false)
  @Column
  public desc!: string;

  @CreatedAt
  @Column
  public created_at!: Date;

  @UpdatedAt
  @Column
  public updated_at!: Date;

  @BelongsToMany(() => Book, () => AuthorBook)
  public books?: Book[];
}
