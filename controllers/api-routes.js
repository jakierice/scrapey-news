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
				}); // close .each function
			})
			.then(() => {
				// console.log(scrapedArticles);
				const hbsObject = {
					articles: scrapedArticles
				};
				res.render('articles', hbsObject);
			}); // close axios
	}); //close app.get

	app.post('/article', (req, res) => {
		// console.log(req.body);

		db.Article
			.create(req.body)
			.then(dbArticle => {
				// console.log(dbArticle);
				res.send(dbArticle);
			})
			.catch(err => {
				// console.log(err);
				res.send(err);
			});
	});
};
