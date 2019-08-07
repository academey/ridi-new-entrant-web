import { Book } from 'database/models/Book';
import { User } from 'database/models/User';
import moment from 'moment';
import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Input,
} from 'reactstrap';
import styled from 'styled-components';

interface IBookCardProps {
  user: User;
  book: Book;
  borrowStart: (bookId: number, duration: string) => void;
  returnStart: (bookId: number) => void;
  availableToBorrow: boolean;
  reservationPenaltyEndAt: string;
}

interface IBookCardState {
  duration: string;
}

const DelayedReservationLabel = styled.div`
  color: red;
  font-weight: bold;
`;

const NotDelayedReservationLabel = styled.div`
  color: green;
`;

class BookCard extends React.Component<IBookCardProps, IBookCardState> {
  public state = {
    duration: '1',
  };

  public getBorrowOrReturnContent = () => {
    const {
      user,
      book,
      borrowStart,
      returnStart,
      availableToBorrow,
      reservationPenaltyEndAt,
    } = this.props;
    const { duration } = this.state;
    const isUserReserveThisBook =
      user && book.bookReservation && book.bookReservation.userId === user.id;
    // TODO: 리팩토링 & 서버로 로직 넘기기 필요
    if (isUserReserveThisBook) {
      const endAt = moment(book.bookReservation.endAt);
      const diff = moment().diff(endAt, 'seconds');

      let returnContent;
      if (diff > 0) {
        returnContent = (
          <DelayedReservationLabel>
            {diff}초 만큼 연체했다 빨리 반납해라
          </DelayedReservationLabel>
        );
      } else {
        returnContent = (
          <NotDelayedReservationLabel>
            {diff} 만큼 남았다
          </NotDelayedReservationLabel>
        );
      }
      return (
        <div>
          {returnContent}
          반납만료 시간 : {endAt.toString()}
          <Button
            color="info"
            onClick={() => {
              returnStart(book.id);
            }}
          >
            반납하기
          </Button>
        </div>
      );
    } else if (!book.bookReservation && (!user || availableToBorrow)) {
      return (
        <div>
          <CardText>대여 시간</CardText>
          <Input
            onChange={(e) => {
              this.setState({
                duration: e.currentTarget.value,
              });
            }}
            value={duration}
            type="select"
          >
            <option key="1" value={'1'}>
              1분
            </option>
            <option key="2" value={'2'}>
              2분
            </option>
            <option key="3" value={'3'}>
              3분
            </option>
          </Input>
          <Button
            color="primary"
            onClick={() => {
              borrowStart(book.id, duration);
            }}
          >
            대여하기
          </Button>
        </div>
      );
    } else if (!book.bookReservation && !availableToBorrow) {
      return (
        <DelayedReservationLabel>
          당신은 {reservationPenaltyEndAt} 까지 못 빌려요
        </DelayedReservationLabel>
      );
    } else {
      return <div>누군가가 이미 빌려감</div>;
    }
  };

  public render() {
    const { book } = this.props;

    return (
      <Card style={{ width: 200, margin: 10 }}>
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
          {this.getBorrowOrReturnContent()}
        </CardBody>
      </Card>
    );
  }
}

export default BookCard;
