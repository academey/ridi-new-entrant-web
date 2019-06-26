import { IStoreState } from 'client/store';
import { actionCreators } from 'client/store/book';
import { Book } from 'database/models/Book';
import { User } from 'database/models/User';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import BookList from './components/BookList';

interface IBookPageProps {
  user: User;
  book: Book;
  books: Book[];
  getListDataStart: () => void;
  borrowStart: (bookId: number) => void;
  returnStart: (bookId: number) => void;
}
interface IBookPageState {
  books: string[];
}

class BookPage extends Component<IBookPageProps, IBookPageState> {
  public componentDidMount(): void {
    const { getListDataStart } = this.props;

    getListDataStart();
  }

  public render() {
    const { user, books, borrowStart, returnStart } = this.props;
    return (
      <div>
        <h1>대여할 책 리스트</h1>
        <BookList
          user={user}
          books={books}
          borrowStart={borrowStart}
          returnStart={returnStart}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ book, auth }: IStoreState) => ({
  user: auth.get('user'),
  books: book.get('listData'),
});

const mapDispatchProps = (dispatch: Dispatch) => ({
  getListDataStart: () => dispatch(actionCreators.getListDataStart()),
  borrowStart: (bookId: number) => dispatch(actionCreators.borrowStart(bookId)),
  returnStart: (bookId: number) => dispatch(actionCreators.returnStart(bookId)),
});

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(BookPage);
