/* Client-side JS for final assignment
**
** Recieve, store, and remove information
**
** Alter HTML Elements
*/

var newRatingButton = document.getElementById('new-rating-button');
var cancelButton = document.getElementById('cancel-input');
var acceptButton = document.getElementById('accept-input');

/*Display modal to add new rating*/
var showNewRatingModal = function()
{
	console.log("Show modal clicked");
	var newRatingModalBackdrop = document.getElementById('new-rating-modal-backdrop');
	var newRatingModal = document.getElementById('new-rating-modal');
	
	newRatingModalBackdrop.classList.remove('hidden');
	newRatingModal.classList.remove('hidden');
}

/*Hide modal if cancelled or accepted, reset fields*/
var hideNewRatingModal = function()
{
	console.log("Cancel modal called");
	var newRatingModalBackdrop = document.getElementById('new-rating-modal-backdrop');
	var newRatingModal = document.getElementById('new-rating-modal');
	var nameInput = document.getElementById('name-input');
	var titleInput = document.getElementById('title-input');
	var scoreInput = document.getElementById('score-input');
	
	
	newRatingModalBackdrop.classList.add('hidden');
	newRatingModal.classList.add('hidden');
	nameInput.value = '';
	titleInput.value = '';
	scoreInput.value = '--';
}

/*
** Gets information from user to
** add new rating. Calls store
** function to add to database.
*/
var addNewRating = function()
{
	//If we're on the page that already has names (ratings page), give it the name from title
	//This works because name-input is added dynamically.
	if(document.getElementById('name-input')) 
	{
		var name = document.getElementById('name-input').value;
	}
	else
	{
		var name = document.getElementById('ratings-title').innerHTML;
		name = name.substring(11,name.length);
	}
	
	//put everything into cariables to pass to store function
	var score = document.getElementById('score-input').value;
	var title = document.getElementById('title-input').value;
	var user = nameToUser(name);
	
	//if anything isn't filled in, make them fill it in
	if(name === '' || score === '--' || title === '')
	{
		alert('Error. Some entry was left blank. Please make sure all fields are filled.');
	}
	else
	{
		storeData(user,name,title,score,function(err) {
			if(err)
			{
				alert('Couldn\'t store data. Error in request: ' + error);
			}
			else
			{}
			
		});
	
		hideNewRatingModal();
	}
}
/*
** Removes spaces from a name and
** puts it all to lowercase to make url key
**/
var nameToUser = function(name)
{
	var user = name;
	user = user.toString().split(' ').join('');
	user = user.toString().toLowerCase();
	return user;
}

/*
** Store data in ratings.json
** Return user to people page, effectively refreshing
**
*/
var storeData = function(user,name,title,score,callback)
{
	var userURL = "/";
	
	var postReq = new XMLHttpRequest();
	postReq.open('POST',userURL);
	postReq.setRequestHeader('Content-Type','application/json');
	
	//after request loads, check for error and send back new error if true
	postReq.addEventListener('load', function(event) {
		var err;
		if(event.target.status !== 200) {
			error = event.target.response;
		}
		callback(err);
	});
	
	
	//create post body object to send to server.js post call
	var postBody = {
		user: user,
		name: name,
		title: title,
		score: score
	};
	
	postReq.send(JSON.stringify(postBody));
	console.log("post request complete in index.js");
	
	//redirect to people page
	window.location.href = '/people';
}

/*
** This function alternates the colors of the ratings
** in order to improve readability.
**
*/
var alternateRatingsColors = function() {
	var parentNode = document.getElementsByClassName('rating-list')[0];
	var children = parentNode.children;
	for(var i = 1; i < children.length; i+=2)
	{
		children[i].children[0].classList.add('rating-odd');
	}
}

//check if we're on ratings page, then do this.
if(window.location.pathname.includes('/ratings/'))
{
	alternateRatingsColors();
}

newRatingButton.addEventListener('click',showNewRatingModal);
cancelButton.addEventListener('click',hideNewRatingModal);
acceptButton.addEventListener('click',addNewRating);