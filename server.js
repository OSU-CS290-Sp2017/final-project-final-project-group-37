/*
** CS 290 Final Assignment by Quinton Osborn
**
** RateStuff
**
** Enter a name, title, and rating for anything!
*/
var path = require('path');
var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');

var ratings = require('./ratings.json');
var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//home page
app.get('/', function(req, res, next) {
	var pageArguments = {
		
	};
	
	res.render('home',pageArguments);
	
});

//page with list of people
app.get('/people', function(req, res, next) {
	
	var pageArguments = {
		user: ratings
	};

	res.render('peoplelist',pageArguments);
	
});


//throw up page with ratings based on name of rater
app.get('/ratings/:person', function(req, res, next) {
	console.log(req.params);
	var person = req.params.person;
	var rating = ratings[person];
	
	if(rating)
	{
		var pageArguments = {
			name: rating.name,
			ratings: rating.ratings,
			title: rating.ratings.title,
			score: rating.ratings.score,
			pageTitle: "Ratings of " + rating.name
		};
	
		res.render('ratings',pageArguments);
	}	
	else
	{
		next();
	}
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function (req, res) {
  res.status(404).render('404');
});

app.listen(port, function () {
  console.log("Listening on PORT: ", port);
});