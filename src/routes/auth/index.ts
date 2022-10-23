// @ts-ignore
import bcrypt from "bcryptjs";
// @ts-ignore
import jwt from "jsonwebtoken";
import express, {Request, Response} from 'express';
import {body} from "express-validator";
import {warningLog, errorLog} from "../../utils";

const router = express.Router();

router.use(function timeLog(req, res, next) {
    warningLog(`Time: ${Date.now()}`, )
    next();
});

/**
 * @route POST /auth
 * @group Auth - Operations about auth
 * @param {string} email.body.required
 * @param {string} password.body.required
 * @returns {UserModel.model} 201
 * @returns {Error}  400 - All input is required
 * @returns {Error}  403 - Wrong credentials
 */
router.post('/',
    body('email').isEmail().normalizeEmail(),
    body('password').not().isEmpty().trim(),
    async function(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).send("All input is required");
        }

        warningLog(email)
        const user: {id: string, password: string, token: string, email: string} = await new Promise((resolve) => {
            resolve({id: '0', password: '1', token: '2', email: '3'})
        });

        bcrypt.compare(password, user.password, (err: string, isValid: boolean) => {
            if(err){
                errorLog(err)
            }

            if (!isValid) {
                return res.status(403).send("Wrong credentials");
            }

            // Create token
            const token = jwt.sign(
                { user_id: user.id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            // save user token
            user.token = token;

            warningLog(`user ${user.email} was authorized` )
            warningLog(`token ${token}` )
            // return authorized user
            res.status(201).json(user);
        });
    } catch (err) {
        errorLog(err);
    }
});


export {
    router as authRouter
};
