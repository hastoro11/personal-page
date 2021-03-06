const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const nodemailer = require('nodemailer');
const Email = require('email-templates');

const transporter = nodemailer.createTransport({
	host: 'server91.web-hosting.com',
	port: 587,
	secure: false,
	auth: {
		user: 'send@sornyei.com',
		pass: 'vol159NO'
	}
});

const email = new Email({
	message: {
		from: 'send@sornyei.com'
	},
	send: true,
	transport: transporter,
	views: {
		options: {
			extension: 'hbs'
		}
	}
});

const app = express();
app.use(express.static('build'));
app.use(bodyParser.json());
app.use(cors());

app.post('/contact', async (req, res, next) => {
	const resp = await axios.get(
		`https://www.google.com/recaptcha/api/siteverify?secret=6Lcx62EUAAAAAO610LZT7IXkFcvgnJqnrXqxOLmA&response=${
			req.body.token
		}`
	);
	if (!resp.data.success) {
		return res.sendStatus(403);
	}

	const emailThankyou = await email
		.send({
			template: 'thankyou',
			message: {
				to: req.body.email
			},
			locals: {
				name: req.body.name,
				email: req.body.email
			}
		})
		.catch(err => console.log(err));
	const emailContact = await email
		.send({
			template: 'contact',
			message: {
				to: 'info@sornyei.com'
			},
			locals: {
				name: req.body.name,
				email: req.body.email,
				message: req.body.message
			}
		})
		.catch(err => console.log(err));
	res.send(resp.data);
});

app.get('*', (req, res, next) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(4040, () => {
	console.log('Server listening on port 4000');
});
