const UserModel = require("./../models/user");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mailService");
const tokenService = require("./tokenService");
const UserDTO = require("./../dtos/UserDTO");
const ApplicationError = require("./../errors/application-error");

class UserService {
    async register(email, password) {
        const candidate = await UserModel.findOne({email});
        if(candidate) {
            throw ApplicationError.BadRequestError(`User <${email}> already registered !`, []);
        }
        const hashedPassword = await bcrypt.hash(password, 8);
        const activationLink = uuid.v4();
        
        const user = await UserModel.create({email, password:hashedPassword, activationLink});
        await mailService.sendActivationMail(email, `${process.env.API_URL}/user/activate/${activationLink}`);
        const userDTO = new UserDTO(user); // write here fields: id, email, isActivated
        const tokens = tokenService.generateTokens({...userDTO});
        await tokenService.saveToken(userDTO.id, tokens.refreshToken);

        return { ...tokens, user:userDTO };
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink});
        if(!user) {
            throw ApplicationError.BadRequestError("Not correct link in activation !");
        }
        user.isActivated = true;
        await user.save();
    }
    
    async login(email, password) {
        const user = await UserModel.findOne({email});
        if(!user) {
            throw ApplicationError.BadRequestError("User not authorized. Register, please");
        }
        const arePasswordsEqual = await bcrypt.compare(password, user.password);
        if(!arePasswordsEqual) {
            throw ApplicationError.BadRequestError("Incorrect password");
        }
        const userDTO = new UserDTO(user);
        const tokens = tokenService.generateTokens({...userDTO});
        await tokenService.saveToken(userDTO.id, tokens.refreshToken);
        return {...tokens, userDTO};
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApplicationError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if(!userData || !tokenFromDb) {
            throw ApplicationError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDTO(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user:userDto};
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }
}

module.exports = new UserService();
