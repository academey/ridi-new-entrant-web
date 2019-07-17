import moment = require('moment');

export const mockBookId = 1;
export const mockUserId = 2;
export const mockBookReservationId = 3;
export const mockAuthorId = 4;
export const mockEndAt = '2019-09-08';
export const mockPenaltyEndAt = '2019-09-18';
export const mockLaterPenaltyEndAt = '2019-09-21';

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

export const mockLateReturnedBookReservationParam = {
  userId: mockUserId,
  bookReservationId: mockBookReservationId,
  endAt: moment().add(-3, 'days'),
  deletedAt: moment(),
};

export const mockBookReservation = {
  id: mockBookReservationId,
  ...mockBookReservationParam,
};

export const mockDelayedBookReservation = {
  ...mockDelayedBookReservationParam,
  id: mockBookReservationId,
  get: () => {
    return mockPenaltyEndAt;
  },
};

export const mockLateReturnedBookReservation = {
  ...mockLateReturnedBookReservationParam,
  id : mockBookReservationId,
  get: () => {
    return mockLaterPenaltyEndAt;
  },
};

export const mockAuthorParam = { name: 'author', desc: 'author description' };
export const mockAuthor = {
  id: mockAuthorId,
  ...mockAuthorParam,
};
export const mockAuthorList = [mockBook, mockBook, mockBook];

export const mockUserParam  = {
  email: 'mock@email.com',
  password: 'mockpassword',
};

export const mockUser = {
  id: mockUserId,
  ...mockUserParam,
};
