import {
  AllowNull,
  Column,
  CreatedAt,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { BookReservation } from './BookReservation';

@Table
export class User extends Model<User> {
  @AllowNull(false)
  @Column
  public email!: string;

  @AllowNull(false)
  @Column
  public password!: string;

  @CreatedAt
  @Column
  public createdAt!: Date;

  @UpdatedAt
  @Column
  public updatedAt!: Date;

  @HasOne(() => BookReservation, 'userId')
  public bookReservation?: BookReservation;
}
