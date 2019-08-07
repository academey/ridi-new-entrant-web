import moment = require('moment');

export const mockBookId = 1;
export const mockUserId = 2;
export const mockBookReservationId = 3;
export const mockAuthorId = 4;
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
  duration: 3,
  unit: 'm',
};

export const mockBookReservation = {
  id: mockBookReservationId,
  ...mockBookReservationParam,
};

export const mockBookReservationCreateParam = {
  userId: mockUserId,
  bookId: mockBookId,
  endAt: expect.any(moment),
};

export const mockDelayedBookReservation = {
  id: mockBookReservationId,
  userId: mockUserId,
  bookReservationId: mockBookReservationId,
  endAt: moment().add(-3, 'days'),
  get: () => {
    return mockPenaltyEndAt;
  },
};

export const mockLateReturnedBookReservation = {
  id : mockBookReservationId,
  userId: mockUserId,
  bookReservationId: mockBookReservationId,
  endAt: moment().add(-3, 'days'),
  deletedAt: moment(),
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
