export function success(data, message) {
    return {
        data,
        message,
        status: 'success',
    };
}

export function fail(data, message) {
    return {
        data,
        message,
        status: 'fail',
    };
}
