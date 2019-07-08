import { IStoreState } from 'client/store';
import {
  actionCreators,
  BOOK_CHECK_AVAILABLE_TO_BORROW_SUCCEEDED,
} from 'client/store/book';
import { Book } from 'database/models/Book';
import { User } from 'database/models/User';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import BookCards from './components/BookCards';

interface IBookPageProps {
  user: User;
  book: Book;
  books: Book[];
  availableToBorrow: boolean;
  reservationPenaltyEndAt: string;
  getListDataStart: () => void;
  checkAvailableToBorrowStart: () => void;
  borrowStart: (bookId: number, borrowDuration: string) => void;
  returnStart: (bookId: number) => void;
}
interface IBookPageState {
  books: string[];
}

class BookPage extends Component<IBookPageProps, IBookPageState> {
  public componentDidMount(): void {
    const { getListDataStart, checkAvailableToBorrowStart } = this.props;

    checkAvailableToBorrowStart();
    getListDataStart();
  }

  public render() {
    const {
      user,
      books,
      borrowStart,
      returnStart,
      availableToBorrow,
      reservationPenaltyEndAt,
    } = this.props;
    return (
      <div>
        <h1>대여할 책 리스트</h1>
        <BookCards
          user={user}
          books={books}
          borrowStart={borrowStart}
          returnStart={returnStart}
          availableToBorrow={availableToBorrow}
          reservationPenaltyEndAt={reservationPenaltyEndAt}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ book, auth }: IStoreState) => ({
  user: auth.get('user'),
  books: book.get('listData'),
  availableToBorrow: book.get('availableToBorrow'),
  checkAvailableToBorrowLoading: book.get('checkAvailableToBorrowLoading'),
  reservationPenaltyEndAt: book.get('reservationPenaltyEndAt'),
});

const mapDispatchProps = (dispatch: Dispatch) => ({
  getListDataStart: () => dispatch(actionCreators.getListDataStart()),
  borrowStart: (bookId: number, borrowDuration: string) =>
    dispatch(actionCreators.borrowStart(bookId, borrowDuration)),
  returnStart: (bookId: number) => dispatch(actionCreators.returnStart(bookId)),
  checkAvailableToBorrowStart: () =>
    dispatch(actionCreators.checkAvailableToBorrowStart()),
});

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(BookPage);
