const gernerateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt:  new Date().getTime()
    }
}

const geneateLocationMessage = (username,url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    gernerateMessage,
    geneateLocationMessage
}