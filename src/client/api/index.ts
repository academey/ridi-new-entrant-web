import requesreeue from '../utils/request';

import {success} from '../utils/mockResponseBody';

const URL = 'http://localhost:8080';
const requestScope = `${URL}/api/author`;

export async function request() {
    const requestURL = requestScope;

    const agencies = await requesreeue(requestURL, { method: 'GET' });

    const data = success({ agencies }, '요청 성공.');
    return data;
}
