
function redisKey(url) {
    return url.toString().substring(1).replace('/','_');
};

export { redisKey };





