import React, { Component } from 'react';

import { requestBooks } from 'client/api';
import { Book } from 'database/models/Book';
import { IApiResponse } from 'server/utils/result';

interface IBookPageState {
  books: string[];
}

class BookPage extends Component<{}, IBookPageState> {
  public state: IBookPageState = {
    books: [],
  };

  public componentDidMount(): void {
    requestBooks().then((response: IApiResponse) => {
      const book: Book = response.data.book;
      console.log(book);
      // this.setState({
      //   books: responseBooks.data.books,
      // });
    });
  }

  public getBooks = () => {
    console.log('this.state.books is ', this.state.books);
    return this.state.books.map((book: any) => {
      return <div key={'test'}>{book.name}</div>;
    });
  }

  public render() {
    return (
      <div>
        Book
        {this.getBooks()}
        phpst{' '}
      </div>
    );
  }
}

export default BookPage;
