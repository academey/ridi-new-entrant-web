import moment = require('moment');

export const mockBookId = 1;
export const mockUserId = 2;
export const mockBookReservationId = 3;
export const mockAuthorId = 4;
export const mockReservationPenaltyId = 5;
export const mockAnotherPersonUserId = 6;
export const mockEndAt = '2019-09-08';

export const mockBookParam = { name: 'book', desc: 'book description' };
export const mockBook = {
  id: mockBookId,
  ...mockBookParam,
};
export const mockBookList = [mockBook, mockBook, mockBook];

export const mockBookReservationParam = {
  userId: mockUserId,
  bookId: mockBookId,
  endAt: mockEndAt,
};
export const mockDelayedBookReservationParam = {
  userId: mockUserId,
  bookReservationId: mockBookReservationId,
  endAt: moment().add(-3, 'days'),
};

export const mockBookReservation = {
  id: mockBookReservationId,
  ...mockBookReservationParam,
};

export const mockAnotherPersonBorrowedBookReservation = {
  ...mockBookReservation,
  userId: mockAnotherPersonUserId,
};

export const mockDelayedBookReservation = {
  id: mockBookReservationId,
  ...mockDelayedBookReservationParam,
};

export const mockAuthorParam = { name: 'author', desc: 'author description' };
export const mockAuthor = {
  id: mockAuthorId,
  ...mockAuthorParam,
};
export const mockAuthorList = [mockBook, mockBook, mockBook];

export const mockReservationPenalty = {
  id: mockReservationPenaltyId,
  userId: mockUserId,
  bookReservationId: mockBookReservationId,
  endAt: mockEndAt,
};

export const mockUserParam  = {
  email: 'mock@email.com',
  password: 'mockpassword',
};

export const mockUser = {
  id: mockUserId,
  ...mockUserParam,
};

export const mockTransactionOptions = {
  transaction: {},
};
