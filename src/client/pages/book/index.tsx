import React, {Component} from 'react';
import {APIResponseInterface, Book, requestBooks} from '../../api/index';

interface IBookPageState {
    books: string[];
}

class BookPage extends Component<{}, IBookPageState> {
    public state: IBookPageState = {
        books: [],
    };

    public componentDidMount(): void {

        requestBooks().then((responseBooks) => {
            console.log('responseBooks is ', responseBooks);
            // this.setState({
            //     books: responseBooks.data.books,
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
            </div>
        );
    }
}

export default BookPage;
