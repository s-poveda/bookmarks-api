const express = require('express');
const logger = require('../logger');
const store = require('../bookmarkStore');
const validateBearerToken = require('../validateBearerToken');

const bookmarkRouter = express.Router();
const bodyParser = express.json();

bookmarkRouter.use(['/','/:id'], (req, res, next)=>{
	if (req.method === 'GET') return next();
	validateBearerToken(req, res, next);
});

bookmarkRouter
	.route('/')
	.get((req, res) => res.json(store.bookmarks))
	.post(bodyParser, (req, res)=> {

		// each log message begins with this base message. Each conditional customizes the base message
		// label is used to keep track of http verb
		// timestamp comes from the request start time
		const infoLog = {
			label: req.method,
			timestamp: req._startTime,
			message: `User requested ${req.method} of bookmark. ATTEMPTING TO ADD BODY:\n${JSON.stringify(req.body)}`
		}
		const { title, desc, rating, url } = req.body;

		if (!title){
			 let message = 'Invalid title. Must supply a title.'
			 infoLog.message = `${infoLog.message}\n${message}`
			 logger.info(infoLog);
			 return res.status(400).json({ message });
		}

		if (!rating || isNaN(parseFloat(rating)) ) {
			let message = 'Invalid rating. Must be a number.'
			infoLog.message = `${infoLog.message}\n${message}`
			logger.info(infoLog);
			return res.status(400).json({ message });
		}

		if (!url || !url.toLowerCase().startsWith('https') ) {
			let message = 'Invalid url. Must contain http protocol.'
			infoLog.message = `${infoLog.message}\n${message}`
			logger.info(infoLog);
			return res.status(400).json({ message });
		}

		// TODO: chekc for <script>
		const addedBookmark = store.addBookmark({ title, desc, rating, url });
		infoLog.message = `${infoLog.message}\nPOST ABOVE SUCCESSFUL.`;
		logger.info(infoLog);

		//addBookmark returns the object that was added to the store
		res.status(201).json(addedBookmark);
	});

bookmarkRouter
	.route('/:id')
	.get((req,res)=>{
		const markId = req.params.id;
		const bookmark = store.bookmarks.find( book => book.id === markId);
		if (!bookmark) return res.status(400).json({message: 'Invalid bookmark id.'});
		res.json(bookmark);
	})
	.delete((req,res)=>{

		const markId = req.params.id;
		// each log message begins with this base message. Each conditional customizes the base message
		// label is used to keep track of http verb
		// timestamp comes from the request start time
		const infoLog = {
			label: req.method,
			timestamp: req._startTime,
			message: `A user requested ${req.method} of bookmark. ID: '${markId}'`
		}

		// removeBookmark returns true on success. false on fail
		const success = store.removeBookmark(markId);

		if (!success) {
			infoLog.message = `${infoLog.message}\nDELETION OF '${markId}' ID FAILED.`
			logger.info(infoLog);
			return res.status(400).json({message: 'Invalid bookmark id.'});
		}

		infoLog.message = `${infoLog.message}\nDELETION OF '${markId}' ID SUCCESSFUL.`
		logger.info(infoLog);
		res.status(204).end();
	});

module.exports = bookmarkRouter;
