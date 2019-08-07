import { Book } from 'database/models/Book';
import { User } from 'database/models/User';
import React from 'react';
import styled from 'styled-components';
import BookCard from './BookCard';

interface IBookCardsParams {
  user: User;
  books: Book[];
  borrowStart: (bookId: number, duration: string) => void;
  returnStart: (bookId: number) => void;
  availableToBorrow: boolean;
  reservationPenaltyEndAt: string;
}
const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const BookCards: React.FC<IBookCardsParams> = ({
  user,
  books,
  borrowStart,
  returnStart,
  availableToBorrow,
  reservationPenaltyEndAt,
}: IBookCardsParams) => {
  const bookCards = books.map((book: Book) => (
    <BookCard
      key={book.id}
      book={book}
      user={user}
      borrowStart={borrowStart}
      returnStart={returnStart}
      availableToBorrow={availableToBorrow}
      reservationPenaltyEndAt={reservationPenaltyEndAt}
    />
  ));

  return <Wrapper>{bookCards}</Wrapper>;
};

export default BookCards;
