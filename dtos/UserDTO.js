class UserDTO { // Data transfer object - for passing data and generating of tokens
    email;
    id;
    isActivated;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
    }
}
module.exports = UserDTO;
