const ApplicationError = require("./../errors/application-error");

module.exports = function(err, request, responce, next) {
    console.log(err);
    if(err instanceof ApplicationError) {
        return responce.status(err.status).json({ message:err.message, errors:err.errors }); 
    }
    return responce.status(500).json({message: "Unpredictable error"});
}
