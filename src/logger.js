const winston = require('winston');
const { NODE_ENV } = require('./config');

const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	transports: [
		new winston.transports.File({filename :'logs/info.log', level: 'info'}),
		new winston.transports.File({filename: 'logs/error.log', level: 'error'}),
		new winston.transports.File({filename : 'logs/combined.log'})
	]
});

if ( NODE_ENV !== 'production') {
	logger.add( new winston.transports.Console({
		format : winston.format.simple()
	}));
};

module.exports = logger;
