const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');

const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();

// Setup handlebars engine
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Configure middleware
// Use morgan logger for logging requests
app.use(logger('dev'));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static('public'));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
// mongoose.connect("mongodb://localhost/webscrapingHW", {
//     useMongoClient: true
// });

// // Routes
// // =============================================================
require('./controllers/api-routes.js')(app);

// const routes = require('./controllers/api-routes');

// app.use('/', routes);

// // Start the server
// app.listen(PORT, function() {
//     console.log("App running on port " + PORT + "!");
// });

const db = process.env.MONGODB_URI || 'mongodb://localhost/scrapey-news';

mongoose.connect(db, error => {
	if (error) {
		return error;
	} else {
		console.log('Connection Success!');
	}
});

app.listen(PORT, function() {
	console.log('Listening on port:' + PORT);
});
