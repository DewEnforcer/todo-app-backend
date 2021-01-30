module.exports = function (handler) {
    return async function (req, res, next) {
        try {
            await handler(req, res);
        } catch (error) {
            console.log("ASYNC ERROR");
            //next(error); //add when error module is implemented
        }
    }
}