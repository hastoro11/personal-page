import React, { Component } from 'react';
import Recaptcha from 'react-recaptcha';
import axios from 'axios';
import validator from 'validator';

class App extends Component {
	state = {
		name: '',
		email: '',
		message: '',
		token: '',
		error: false,
		success: false,
		fieldErrors: {}
	};

	validate = () => {
		const { name, email, message } = this.state;
		const fieldErrors = {};

		fieldErrors.email = validator.isEmpty(email) || !validator.isEmail(email);
		fieldErrors.name = validator.isEmpty(name);
		fieldErrors.message = validator.isEmpty(message);

		return fieldErrors;
	};
	onSubmit = e => {
		e.preventDefault();
		const fieldErrors = this.validate();
		if (!(fieldErrors.email || fieldErrors.name || fieldErrors.message)) {
			this.executeCaptcha();
		} else {
			this.setState({ fieldErrors });
		}
	};
	onChangeHandler = e => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};
	verifyCallback = async token => {
		const resp = await axios.post('http://localhost:4000/contact', {
			...this.state,
			token
		});
		if (!resp.status === 200) {
			this.setState({ error: true });
		} else {
			this.setState({
				name: '',
				email: '',
				message: '',
				token: '',
				error: false,
				success: true,
				fieldErrors: {}
			});
		}
	};
	executeCaptcha = () => {
		this.recaptcha.execute();
	};

	render() {
		const { name, email, message, error, success, fieldErrors } = this.state;
		return (
			<section className="contact padding-top-90 padding-bottom-90 primary_bg" id="contact">
				<div className="container">
					<div className="sec_title">
						<h2>Contact</h2>
					</div>

					<div className="row">
						<div className="col-md-10 col-md-offset-1">
							<div
								className="row text-center info animated animated_scroll fadeInUp"
								style={{ animationDelay: '0.3s' }}>
								<div className="col-sm-4">
									<div className="content">
										<span className="fa fa-phone" />
										<div>
											<h4>Call Me</h4>
											<p>+36 20 410 5987</p>
										</div>
									</div>
								</div>

								<div className="col-sm-4">
									<div className="content">
										<span className="fa fa-envelope" />
										<div>
											<h4>Mail Me</h4>
											<p>
												<a href="mailto:your@example.com">info(at)sornyei.com</a>
											</p>
										</div>
									</div>
								</div>

								<div className="col-sm-4">
									<div className="content">
										<span className="fa fa-map-marker" />
										<div>
											<h4>Find Me</h4>
											<p>Sopron, Frankenburg u. 2/h, HU</p>
										</div>
									</div>
								</div>
							</div>
							{/* <!--.row--> */}

							<div
								className="contact_form animated animated_scroll fadeInUp"
								style={{ animationDelay: '0.4s' }}>
								<form>
									<input
										placeholder="Name"
										name="name"
										type="text"
										className={fieldErrors.name ? 'form-control errorForm' : 'form-control'}
										value={name}
										onChange={this.onChangeHandler}
									/>
									<input
										placeholder="E-mail"
										name="email"
										type="email"
										value={email}
										className={fieldErrors.email ? 'form-control errorForm' : 'form-control'}
										onChange={this.onChangeHandler}
									/>
									<textarea
										placeholder="Message"
										name="message"
										className={fieldErrors.message ? 'form-control errorForm' : 'form-control'}
										value={message}
										onChange={this.onChangeHandler}
									/>
									<button className="submit btn" onClick={this.onSubmit}>
										send message
									</button>
									<Recaptcha
										ref={ref => (this.recaptcha = ref)}
										sitekey="6LeWyGEUAAAAAMcfhbhMA6AxyCVoFLb6xX-JG9UJ"
										size="invisible"
										render="explicit"
										onloadCallback={() => console.log('done')}
										verifyCallback={this.verifyCallback}
									/>
									{/* <!--Contact form message--> */}
									<div className="msg_success" style={success ? { display: 'block' } : {}}>
										<p>Your message has been sent. Thank you!</p>
									</div>
									<div className="msg_error" style={error ? { display: 'block' } : {}}>
										<p>Sorry your message can not be sent.</p>
									</div>
									{/* <!--End contact form message--> */}
								</form>
							</div>
						</div>
						{/* <!--.col-md-10--> */}
					</div>
					{/* <!--.row--> */}
				</div>
				{/* <!--.container-->     */}
			</section>
		);
	}
}

export default App;
