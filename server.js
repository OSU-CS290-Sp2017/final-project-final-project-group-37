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
var bodyParser = require('body-parser');

var ratingsData = require('./ratings.json');
var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());

//home page
app.get('/', function(req, res, next) {
	var pageArguments = {
		personPage: false
	};
	
	res.render('home',pageArguments);
	
});

//page with list of people
app.get('/people', function(req, res, next) {
	
	var pageArguments = {
		user: ratingsData,
		
		//checks if you're on a page with ratings already so modal does not request name
		personPage: false
	};

	res.render('peoplelist',pageArguments);
	
});


//throw up page with ratings based on name of rater
app.get('/ratings/:person', function(req, res, next) {
	console.log(req.params);
	var person = req.params.person;
	var rating = ratingsData[person];
	if(rating)
	{
		var pageArguments = {
			name: rating.name,
			ratings: rating.ratings,
			title: rating.ratings.title,
			score: rating.ratings.score,
			pageTitle: "Ratings of " + rating.name,
			personPage: true
		};
	
		res.render('ratings',pageArguments);
	}	
	else
	{
		next();
	}
});

app.post('/',function(req, res, next) {
	console.log(req.body.user);
	if(req.body && req.body.title && req.body.score)
	{
		
		for(var i in ratingsData)
		{
			if(req.body.user === JSON.stringify(ratingsData[i]))
			{
				req.body.name = ratingsData[i].name;
				req.body.user = JSON.stringify(ratingsData[i]);
			}
		}
		console.log(req.body.user);
		//create sub-object and push onto the ratings object
		var userRating = {
			title: req.body.title,
			score: req.body.score
		};
		
		if(ratingsData[req.body.user])
		{
			var ratingsObj = ratingsData[req.body.user].ratings;
		}
		else
		{
			var ratingsObj = [];
		}
		ratingsObj.push(userRating);
		console.log(ratingsObj);
		
		var rating = {
			user: obj = {
				name: req.body.name,
				ratings: ratingsObj
			}
		};
		
			//convoluted method of adding things to JSON
			
			//make sure the rating object is a string
			var ratingString = JSON.stringify(rating);
			
			//change 'user' in json to actual username for url
			ratingString = ratingString.replace(ratingString.substring(2,6),req.body.user.toString());
			
			//remove extra brackets from the string so it can be added to json
			ratingString = ratingString.slice(1,-1);
			
			//extra cleaning up
			ratingsData = JSON.stringify(ratingsData);
			ratingsData = ratingsData.slice(0,-1);
			ratingsData = ratingsData + "," + ratingString + "}";
			ratingsData = JSON.parse(ratingsData);
			
			//writes to ratings.json. returns 500 error if there's a failure.
			fs.writeFile('./ratings.json',JSON.stringify(ratingsData), function(err) {
				if(err)
				{
					console.log('error after writefile');
					res.status(500).send("Unable to save rating.");
				}
				else
				{
					//successfully written
					console.log("Success");
					res.status(200).send();
				}
			});
				
	}
	else
	{
		console.log('error in last else');
		res.status(400).send("Something missing from entry");
	}
});

//serve public directories
app.use(express.static(path.join(__dirname, 'public')));

//404 if page DNE
app.get('*', function (req, res) {
  res.status(404).render('404');
});

app.listen(port, function () {
  console.log("Listening on PORT: ", port);
});