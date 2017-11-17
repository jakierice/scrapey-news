$(document).ready(function() {
	console.log('ready!');
	$('.button--save-button').click(function() {
		var articleId = $(this).attr('data-id');

		var articleInfo = {
			url: $('#' + articleId + 'link').attr('data-link'),
			title: $('#' + articleId + 'title').attr('data-title'),
			description: $('#' + articleId + 'desc').attr('data-desc'),
			publishDate: $('#' + articleId + 'pubDate').attr('data-pubDate')
		};

		//Run a POST request to change the note, using what's entered in the inputs
		$.ajax({
			method: 'POST',
			url: '/article',
			data: articleInfo
		})
			// With that done
			.done(function(data) {
				if (data.code === 11000) {
					console.log('That article has already been saved');
				} else {
					console.log('Successfully saved article titled ' + data.title);
				}
			});
	});
});
