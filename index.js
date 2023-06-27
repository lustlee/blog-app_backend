import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://admin:admin123@cluster0.enhkmrq.mongodb.net/?retryWrites=true&w=majority')
		.then(() => console.log('DB OK'))
		.catch((err) => console.log('DB ERROR', err));

const app = express();
const PORT = 4444;

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello World');
});

// app.post('/auth/login', (req, res) => {
// });

app.post('/auth/register', (req, res) => {

});

app.listen(PORT, (err) => {
	if (err) {
		return console.log(err)
	}

	console.log(`Server started on ${PORT} port!`);
});

