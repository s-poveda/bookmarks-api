require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const bookmarkRouter = require('./routes/bookmark.route');

const app = express();

app.use(morgan((()=>(NODE_ENV === 'production') ? 'tiny' : 'common')()));
app.use(helmet());
app.use(cors());
app.use('/bookmark', bookmarkRouter);

//catch-all error handler
app.use((error, req, res, next)=>{
	let resp = null;
	if (NODE_ENV === 'production') {
		resp = { error: { message: 'server error' } };
	} else {
		resp = { message: error.message, error };
	}
	res.status(500).json(resp);
});

module.exports = app;
