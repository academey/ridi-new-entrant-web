import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { IStoreState } from 'client/store';
import { actionCreators } from 'client/store/book';
import { Book } from 'database/models/Book';

interface IBookPageProps {
  book: Book;
  books: Book[];
  getListDataStart: any;
}
interface IBookPageState {
  books: string[];
}

class BookPage extends Component<IBookPageProps, IBookPageState> {
  public componentDidMount(): void {
    const { getListDataStart } = this.props;
    getListDataStart();
  }

  public getBooks = () => {
    return this.props.books.map((book: Book) => {
      return <div key={book.id}>{book.name}</div>;
    });
  }

  public render() {
    return (
      <div>
        Book List
        {this.getBooks()}
      </div>
    );
  }
}

const mapStateToProps = ({ book }: IStoreState) => ({
  books: book.listData,
});

const mapDispatchProps = (dispatch: Dispatch) => ({
  getListDataStart: () => dispatch(actionCreators.getListDataStart()),
});

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(BookPage);
