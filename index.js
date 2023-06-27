import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {validationResult} from "express-validator";
import {registerValidation} from './validations/auth.js';
import UserModel from './models/Users.js';

mongoose.connect('mongodb+srv://admin:admin123@cluster0.enhkmrq.mongodb.net/blog?retryWrites=true&w=majority')
		.then(() => console.log('DB OK'))
		.catch((err) => console.log('DB ERROR', err));

const app = express();
const PORT = 4444;

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.post('/auth/register', registerValidation, async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		const password = req.body.password;
		const salt = await bcrypt.genSalt(5);
		const hash = await bcrypt.hash(password, salt);

		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		});

		const user = await doc.save();

		const token = jwt.sign({
			_id: user._id,
		}, 'secret123', {expiresIn: '30d',});

		const {passwordHash, ...userData} = user._doc;

		res.json({
			...userData,
			token
		});


	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: 'Не удалось зарегестрироваться'
		});
	}
});

app.listen(PORT, (err) => {
	if (err) {
		return console.log(err)
	}

	console.log(`Server started on ${PORT} port!`);
});