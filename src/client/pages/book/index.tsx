import React, {Component} from 'react';
import { request } from '../../api/index';

class Book extends Component {
    public componentDidMount(): void {
        request().then((result) => {
            console.log(result);
        });
    }

    public render() {
        return (
            <div>
                Book
            </div>
        );
    }
}

export default Book;
