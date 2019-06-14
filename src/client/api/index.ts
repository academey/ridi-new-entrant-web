import request from 'request-promise';

const URL = 'http://0.0.0.0:8080';

function getRequestURL(url: string) {
    return `${URL}/api/${url}`;
}

export async function requestBooks() {
    const data = await request({
        uri: getRequestURL('book/3'),
        headers: {
            'User-Agent': 'Request-Promise',
        },
        json: true,
    });
    console.log('data is ', data);

    return data.body;
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
