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
		// if ()
	})
	.delete((req,res)=>{

	});

module.exports = bookmarkRouter;
