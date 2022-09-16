const userService = require("./../service/userService");
const {validationResult} = require("express-validator");
const ApplicationError = require("./../errors/application-error.js");

class UserController {

    async register(request, responce, next) {
        try {
            const errors = validationResult(request);
            if(!errors.isEmpty()) {
                return next(ApplicationError.BadRequestError("Validation error", errors.array()));
            }
            const {email, password} = request.body;
            const userData = await userService.register(email, password);
            // Cookies are used for storing refresh-token
            responce.cookie(
                "refreshToken",
                userData.refreshToken,
                { maxAge: 30*24*60*60*1000, httpOnly: true } // set cookie lifecicle period
            );
            return responce.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async login(request, responce, next) {
        try {
            const {email, password} = request.body;
            const userData = await userService.login(email, password);
            responce.cookie("refreshToken", userData.refreshToken, { maxAge: 30*24*3600000, httpOnly: true });
            return responce.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async logout(request, responce, next) {
        try {
            const {refreshToken} = request.cookies;
            const token = await userService.logout(refreshToken);
            responce.clearCookie("refreshToken");
            return responce.json({refreshToken, message: "User logout"});
        } catch (error) {
            next(error);
        }
    }

    async activateLink(request, responce, next) {
        try {
            const activationLink = request.params.link;
            await userService.activate(activationLink);
            responce.redirect(process.env.CLIENT_URL);
        } catch (error) {
            next(error);
        }
    }

    async refresh(request, responce, next) {
        try {
            const {refreshToken} = request.cookies;
            const userData = await userService.refresh(refreshToken);
            responce.cookie("refreshToken", userData.refreshToken, {maxAge: 30*24*3600000, httpOnly:true});
            return responce.json(userData);
        } catch (error) {
            next(error);
        }
    }

    async getUsers(request, responce, next) {
        try {
            const users = await userService.getAllUsers();
            responce.json(users);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();
