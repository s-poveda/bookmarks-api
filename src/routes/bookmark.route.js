const express = require('express');
const logger = require('../logger');
const store = require('../bookmarkStore');

const bookmarkRouter = express.Router();
const bodyParser = express.json();

bookmarkRouter
	.route('/')
	.get((req, res) => res.json(store.bookmarks))
	.post(bodyParser, (req, res)=> {
		const { title, desc, rating, url } = req.body;
		if (!title) return res.status(400).json({ message : 'Invalid title. Must supply a title.'});
		if (!rating || isNaN(parseFloat(rating)) ) return res.status(400).json({ message : 'Invalid rating. Must be a number.'});
		if (!url || !url.toLowerCase().startsWith('https') ) return res.status(400).json({ message : 'Invalid url. Must contain http protocol.'});

		// TODO: chekc for <script>
		const toBeAdded = { title, desc, rating, url };

		//addBookmark returns the object that was added to the store
		res.status(201).json(store.addBookmark(toBeAdded));
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
			message: `A user requested deletion of bookmark. ID: '${markId}'`,
			timestamp: req._startTime,
			label: 'DELETE'
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
