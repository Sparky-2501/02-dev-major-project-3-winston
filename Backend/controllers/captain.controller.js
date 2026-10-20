const captainModel = require("../models/captain.model");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blacklist.model");
const captainService = require("../services/captain.service");

module.exports.registerCaptain = async (req, res, next) => { 
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

const isCaptainExists = await captainService.findCaptainByEmail(email);
    if (isCaptainExists) {
        return res.status(400).json({ message: "Captain already exists" });
    }

    const hashedPassword = await captainService.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
         email: email,
          hashedPassword
});
const token = await captainService.generateToken(captain);

}


module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select("+hashedPassword");

    if (!captain) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    //-----------------------------------------//
    const isMatch = await captainService.comparePassword(password, captain.hashedPassword);

    const token = await captainService.generateToken(captain);
    res.json({ token });
}

module.exports.getCaptainProfile = async (req,res,next) => {
    res.status(200).json({ captain: req.captain });
}

module.exports.logoutCaptain = async (req,res,next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    await blackListTokenModel.create(token);

    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
}