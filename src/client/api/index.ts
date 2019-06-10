import requesreeue from '../utils/request';

import {success} from '../utils/mockResponseBody';

const URL = 'http://localhost:8080';
const requestScope = `${URL}/api/book`;

export async function requestBooks(): Promise<APIResponseInterface<Book>> {
    const requestURL = requestScope;

    const books: Book[] = await requesreeue(requestURL, { method: 'GET' });

    const data = success({ books }, '요청 성공.');
    return data;
}

export interface APIResponseInterface<T> {
    data: T[];
    message: string;
    status: string;
}

export interface Book {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    desc: string;
}
