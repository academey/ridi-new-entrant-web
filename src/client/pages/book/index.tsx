import React, {Component} from 'react';
import {APIResponseInterface, Book, requestBooks} from '../../api/index';

class BookPage extends Component {
    public state = {
        books: [],
    };

    public componentDidMount(): void {

        requestBooks().then((responseBooks: APIResponseInterface<Book>) => {
            this.setState({
                books: responseBooks.data.books,
            });
        });
    }

    public getBooks = () => {
        console.log('this.state.books is ', this.state.books);
        return this.state.books.map((book: Book) => {
            return <div key={'test'}>{book.name}</div>;
        });

    }

    public render() {
        return (
            <div>
                Book
                {this.getBooks()}
            </div>
        );
    }
}

export default BookPage;
