const db = require('../models');
const users = db.Users;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const checkLogin = await users.findOne({
                where: { username: username }
            });
            if (!checkLogin) throw { message: "User not Found" }
            if (checkLogin.isVerified == false) throw ({ message: 'Account is not verified' });
            const isValid = await bcrypt.compare(password, checkLogin.password);
            if (!isValid) throw { message: "wrong password" }
            const payload = { id: checkLogin.id, isAdmin: checkLogin.isAdmin }
            const token = jwt.sign(payload, process.env.KEY_JWT, { expiresIn: "3d" });
            res.status(200).send({
                message: "Login success",
                token
            });
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: "Internal server error."
            });
        }
    },
    keepLogin: async (req, res) => {
        try {
            const result = await users.findOne({
                where: {
                    id: req.user.id
                }
            });
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: "Internal server error."
            });
        }
    },
    forgetPassword: async (req, res) => {
        try {
            const isAccountExist = await user.findOne({ where: { email: req.body.email } });
            if (!isAccountExist) throw { message: "Email not found" }
            const { email } = req.body;
            const payload = { id: isAccountExist.id }
            const token = jwt.sign(payload, "minproBimo", { expiresIn: "3d" });
            const data = await fs.readFileSync("./index.html", "utf-8");
            const tempCompile = await handlebars.compile(data);
            const tempResult = tempCompile(data);
            await user.update(
                { isVerified: 1 },
                { where: { email: req.body.email } }
            );
            await transporter.sendMail({
                from: "aryobimoalvian@gmail.com",
                to: email,
                subject: "New Phone",
                html: tempResult,
            });
            res.status(200).send(token);
        } catch (error) {
            res.status(500).send({
                status: 500,
                message: "Internal server error."
            });
        }
    }
}