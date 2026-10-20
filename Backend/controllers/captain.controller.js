const captainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");

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