import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import sequelizeConfigs from '../config';
import { Author } from './Author';
import { AuthorBook } from './AuthorBook';
import { Book } from './Book';
import { BookReservation } from './BookReservation';
import { User } from './User';

const env: string = process.env.NODE_ENV || 'development';
const sequelizeOptions = (sequelizeConfigs as any)[env] as SequelizeOptions;
const sequelize = new Sequelize(sequelizeOptions);

sequelize.addModels([AuthorBook, Book, Author, User, BookReservation]);

const db = {
  sequelize,
  Sequelize,
};

export default db;
