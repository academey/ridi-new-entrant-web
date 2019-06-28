export const mockBookId = 1;
export const mockUserId = 2;
export const mockBookReservationId = 3;
export const mockAuthorId = 4;
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
export const mockBookReservation = {
  id: mockBookReservationId,
  ...mockBookReservationParam,
};

export const mockAuthorParam = { name: 'author', desc: 'author description' };
export const mockAuthor = {
  id: mockAuthorId,
  ...mockAuthorParam,
};
export const mockAuthorList = [mockBook, mockBook, mockBook];

export const whereQuery = (query: object) => ({
  where: query,
});
