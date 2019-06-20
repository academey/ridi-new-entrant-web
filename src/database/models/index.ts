import { Sequelize } from 'sequelize-typescript';
import sequelizeConfigs from '../config/sequelize_config';
import { Author } from './Author';
import { AuthorBook } from './AuthorBook';
import { Book } from './Book';
import { BookReservation } from './BookReservation';
import { User } from './User';

const env: string = process.env.NODE_ENV || 'development';
const sequelizeOptions = sequelizeConfigs[env];
const sequelize = new Sequelize(sequelizeOptions);

sequelize.addModels([AuthorBook, Book, Author, User, BookReservation]);

const db = {
  sequelize,
  Sequelize,
};

export default db;
