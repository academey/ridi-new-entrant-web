import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { IStoreState } from 'client/store';
import { actionCreators } from 'client/store/book';
import { Book } from 'database/models/Book';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
} from 'reactstrap';
import styled from 'styled-components';

interface IBookPageProps {
  book: Book;
  books: Book[];
  getListDataStart: () => void;
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
    const Wrapper = styled.div`
      display: flex;
    `;
    const bookCards = this.props.books.map((book: Book) => (
      <Card key={book.id} style={{ width: 200, margin: 10 }}>
        <CardImg
          top={true}
          width="10px"
          src="https://misc.ridibooks.com/cover/2171000030/xxlarge"
          alt="Card image cap"
        />
        <CardBody>
          <CardTitle>{book.name}</CardTitle>
          <CardSubtitle>저자 쓰면 될듯</CardSubtitle>
          <CardText>{book.desc}</CardText>
          <Button>대여하기</Button>
          <Button>반납하기</Button>
        </CardBody>
      </Card>
    ));
    return <Wrapper>{bookCards}</Wrapper>;
  };

  public render() {
    return (
      <div>
        <h1>대여할 책 리스트</h1>
        {this.getBooks()}
      </div>
    );
  }
}

const mapStateToProps = ({ book }: IStoreState) => ({
  books: book.get('listData'),
});

const mapDispatchProps = (dispatch: Dispatch) => ({
  getListDataStart: () => dispatch(actionCreators.getListDataStart()),
});

export default connect(
  mapStateToProps,
  mapDispatchProps,
)(BookPage);
