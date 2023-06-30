import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';

import {registerValidation, loginValidation, postCreateValidation} from './validations.js';
import {UserController , PostController} from './controllers/index.js';
import {handleValidationErrors , checkAuth} from './utils/index.js';

mongoose.connect('mongodb+srv://admin:admin123@cluster0.enhkmrq.mongodb.net/blog?retryWrites=true&w=majority')
		.then(() => console.log('DB OK'))
		.catch((err) => console.log('DB ERROR', err));

const app = express();
const PORT = 4444;

const storage = multer.diskStorage({
	destination: (_, __, call) => {
		call(null, 'uploads');
	}, filename: (_, file, call) => {
		call(null, file.originalname);
	},
});

const upload = multer({storage});

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(PORT, (err) => {
	if (err) {
		return console.log(err)
	}

	console.log(`Server started on ${PORT} port!`);
});