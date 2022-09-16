const jsonwebtoken = require("jsonwebtoken");
const Token = require("./../models/token.js");

class TokenService {

    generateTokens(payload) {
        const accessToken = jsonwebtoken.sign(
            payload,
            process.env.JWT_ACCESS_KEY,
            { expiresIn:"20m" } // create access-token with life period = 20 min
        );
        const refreshToken = jsonwebtoken.sign(
            payload,
            process.env.JWT_REFRESH_KEY,
            { expiresIn:"30d" } // create refresh-token with life period = 30 days
        );
        return { accessToken, refreshToken }
    }

    async saveToken(userId, refreshedToken) {
        const tokenData = await Token.findOne({user: userId});
        if(tokenData) {
            tokenData.refreshToken = refreshedToken;
            return tokenData.save();
        }
        const createdToken = await Token.create({user:userId, refreshToken:refreshedToken});
        return createdToken;
    }

    async removeToken(refreshToken) {
        const tokenData = await Token.deleteOne({refreshToken});
        return tokenData;
    }

    validateAccessToken(token) {
        try {
            const userData = jsonwebtoken.verify(token, process.env.JWT_ACCESS_KEY);
            return userData;
        } catch (error) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jsonwebtoken.verify(token, process.env.JWT_REFRESH_KEY);
            return userData;
        } catch (error) {
            return null;
        }
    }

    async findToken(refreshToken) {
        const tokenData = await Token.findOne({refreshToken});
        return tokenData;
    }

}
module.exports = new TokenService();
