const db = require('../models');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = app => {
	// A GET route for scraping the echojs website
	app.get('/', (req, res) => {
		// First, we grab the body of the html with request
		const scrapedArticles = [];
		axios
			.get('https://www.theguardian.com/world/series/eyewitness')
			.then(response => {
				// Then, we load that into cheerio and save it to $ for a shorthand selector
				const $ = cheerio.load(response.data);

				// Now, we grab every h2 within an article tag, and do the following:
				$('.fc-container__inner').each(function(i, element) {
					// Save an empty result object
					let result = {};
					// Add the text and href of every link, and save them as properties of the result object
					result.title = $(this)
						.children('.fc-container__body')
						.children('.fc-slice-wrapper')
						.children('ul')
						.children('li')
						.children('.fc-item')
						.children('.fc-item__container')
						.children('a')
						.text();
					result.link = $(this)
						.children('.fc-container__header')
						.children('a')
						.attr('href');
					result.desc = $(this)
						.children('.fc-container__body')
						.children('.fc-slice-wrapper')
						.children('ul')
						.children('li')
						.children('.fc-item')
						.children('.fc-item__container')
						.children('.fc-item__content')
						.children('.fc-item__standfirst')
						.text();
					result.pubDate = $(this)
						.children('.fc-container__header')
						.children('a')
						.children('time')
						.text();
					result.photo = $(this)
						.children('.fc-container__body')
						.children('.fc-slice-wrapper')
						.children('ul')
						.children('li')
						.children('.fc-item')
						.children('.fc-item__container')
						.children('.fc-item__media-wrapper')
						.children('.fc-item__image-container')
						.children('picture')
						.children('source')
						.attr('srcset');

					scrapedArticles.push(result);
					db.Article
						.create(result)
						.then(dbArticle => {
							// If we were able to successfully scrape and save an Article, send a message to the client
							// res.redirect('/');
							// scrapedArticles.push(dbArticle);
						})
						.catch(err => {
							// If an error occurred, send it to the client
							res.json(err);
						});
				}); // close .each function
				console.log(scrapedArticles);
			})
			.then(() => {
				console.log(scrapedArticles);
				const hbsObject = {
					articles: scrapedArticles
				};
				res.render('articles', hbsObject);
			}); // close axios
	}); //close app.get

	app.get('/clear', (req, res) => {
		// Grab every document in the Articles collection
		db.Article
			.remove({})
			.then(dbArticle => {
				// If we were able to successfully find Articles, send them back to the client
				res.redirect('/');
			})
			.catch(err => {
				// If an error occurred, send it to the client
				res.json(err);
			});
	});

	// 	// Route for getting all Articles from the db
	// 	app.get('/articles', (req, res) => {
	// 		// Grab every document in the Articles collection
	// 		db.Article
	// 			.find({})
	// 			.then(dbArticle => {
	// 				// If we were able to successfully find Articles, send them back to the client
	// 				res.json(dbArticle);
	// 			})
	// 			.catch(err => {
	// 				// If an error occurred, send it to the client
	// 				res.json(err);
	// 			});
	// 	});

	// 	// Route for grabbing a specific Article by id, populate it with it's note
	// 	app.get('/articles/:id', (req, res) => {
	// 		// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
	// 		db.Article
	// 			.findOne({ _id: req.params.id })
	// 			// ..and populate all of the notes associated with it
	// 			.populate('note')
	// 			.then(dbArticle => {
	// 				// If we were able to successfully find an Article with the given id, send it back to the client
	// 				res.json(dbArticle);
	// 			})
	// 			.catch(err => {
	// 				// If an error occurred, send it to the client
	// 				res.json(err);
	// 			});
	// 	});

	// 	// Route for saving/updating an Article's associated Note
	// 	app.post('/articles/:id', (req, res) => {
	// 		// Create a new note and pass the req.body to the entry
	// 		db.Note
	// 			.create(req.body)
	// 			.then(dbNote => {
	// 				// If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
	// 				// { new: true } tells the query that we want it to return the updated User -- it returns the original by default
	// 				// Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query

	// 				return db.Article.findOneAndUpdate(
	// 					{ _id: req.params.id },
	// 					{ note: dbNote._id },
	// 					{ new: true }
	// 				);
	// 			})
	// 			.then(dbArticle => {
	// 				// If we were able to successfully update an Article, send it back to the client
	// 				res.json(dbArticle);
	// 			})
	// 			.catch(err => {
	// 				// If an error occurred, send it to the client
	// 				res.json(err);
	// 			});
	// 	});
};
