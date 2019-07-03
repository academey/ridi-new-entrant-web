import * as bcrypt from 'bcrypt';
import {
  AllowNull,
  Column,
  CreatedAt,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { BookReservation } from './BookReservation';

@Table({
  tableName: 'user',
})
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

  @HasMany(() => BookReservation, 'user_id')
  public bookReservation?: BookReservation;

  public toJSON(): User {
    const json: User = super.toJSON() as User;

    delete json.password;
    return json;
  }

  public authenticate(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
