const express = require('express');
const logger = require('../logger');
const store = require('../bookmarkStore');

const bookmarkRouter = express.Router();
const bodyParser = express.json();

bookmarkRouter
	.route('/')
	.get((req, res) => res.json(store.bookmarks))
	.post(bodyParser, (req, res)=> {
		const infoLog = {
			label: 'POST',
			timestamp: req._startTime,
			message: `User requested POST of bookmark. ATTEMPTING TO ADD BODY: ${JSON.stringify(req.body)}`
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
		const infoLog = {
			label: 'DELETE',
			timestamp: req._startTime,
			message: `A user requested DELETE of bookmark. ID: '${markId}'`
		}
		const success = store.removeBookmark(markId);

		if (!success) {
			infoLog.message = `${infoLog.message}\nDELETION OF '${markId}' ID FAILED.`
			logger.info(infoLog);
			return res.status(400).json({message: 'Invalid bookmark id.'});
		}

		infoLog.message = `${infoLog.message}\nDELETION OF '${markId}' SUCCESSFUL.`
		logger.info(infoLog);
		res.status(204).end();
	});

module.exports = bookmarkRouter;
