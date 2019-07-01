import { Book } from 'database/models/Book';
import { User } from 'database/models/User';
import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
} from 'reactstrap';
import styled from 'styled-components';

interface IBookListParams {
  user: User;
  books: Book[];
  borrowStart: (bookId: number) => void;
  returnStart: (bookId: number) => void;
}
const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const BookList: React.FC<IBookListParams> = ({
  user,
  books,
  borrowStart,
  returnStart,
}: IBookListParams) => {
  const bookCards = books.map((book: Book) => {
    let borrowOrReturnButton;
    if (!book.bookReservation) {
      borrowOrReturnButton = (
        <Button
          color="primary"
          onClick={() => {
            borrowStart(book.id);
          }}
        >
          대여하기
        </Button>
      );
    } else if (user && book.bookReservation.userId === user.id) {
      borrowOrReturnButton = (
        <Button
          color="info"
          onClick={() => {
            returnStart(book.id);
          }}
        >
          반납하기
        </Button>
      );
    } else {
      borrowOrReturnButton = <div>누군가가 이미 빌려감</div>;
    }

    return (
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
          {borrowOrReturnButton}
        </CardBody>
      </Card>
    );
  });

  return <Wrapper>{bookCards}</Wrapper>;
};

export default BookList;
