var urlBase = 'http://group17.codes/api';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	var login = document.getElementById("userLogin").value;
	var password = document.getElementById("userPassword").value;
	var hash = md5( password ); 
	
	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "\nUser/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName; //I was lazy and didn't swap the first/last to user/pass throughout

				saveCookie();
	
				window.location.href = "contacts.html";
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + "; expires=" + date.toUTCString() + ";";
	console.log(document.cookie);
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
		console.log("User not logged in, redirected to index.html");
	}
	else
	{
		console.log(document.cookie);
		// console.log( "Logged in as " + firstName + " " + lastName);
		// console.log("id:" + userId);
		// just for now.
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	window.location.href = "index.html";
}


function doRegistration() //This bad boi will be pertinent to the register.html
{
    var firstName = document.getElementById("regFirstName").value;
    var lastName = document.getElementById("regLastName").value;
    var email = document.getElementById("regEmail").value;
    var userLogin = document.getElementById("regUserLogin").value;
    var password = document.getElementById("regPassword").value;
    var hash = md5(password); 
	document.getElementById("registrationResult").innerHTML = "";
	
    var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "email" : "' +
        email + '", "userLogin" : "' + userLogin + '", "password" : "' + hash + '"}';

	var url = urlBase + '/Register.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var jsonObject = JSON.parse( xhr.responseText );
				errorMessage = jsonObject.error;
				
				console.log(errorMessage);

				var statusString = "";
				if (errorMessage === "")
					statusString = "User has been added";
				else
					statusString = errorMessage;

				document.getElementById("registrationResult").innerHTML = statusString;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registrationResult").innerHTML = err.message;
	}
	
}



function addContact()
{
	var newContact = document.getElementById("contactText").value;
	document.getElementById("contactAddResult").innerHTML = "";
	
	var jsonPayload = '{"contact" : "' + newContact + '", "contactId" : ' + contactId + '}';
	var url = urlBase + '/addUser.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

function deleteContact() {

    if (confirm("Are you sure you want to delete this contact?")) {

        //Aw frick I gotta see the table to determine how we're selecting this beast to delete. To be continued.
        var contact = document.getElementById("contactText").value;

        document.getElementById("contactDeleteResult").innerHTML = "";

        var jsonPayload = '{"contactId" : ' + contactId + '}';
        var url = urlBase + '/addUser.' + extension;

        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    document.getElementById("contactDeleteResult").innerHTML = "Contact has been removed.";
                }
            };
            xhr.send(jsonPayload);
        }
        catch (err) {
            document.getElementById("contactDeleteResult").innerHTML = err.message;
        }
    }
    
}
function searchContacts()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	var contactList = "";
	
	var jsonPayload = '{"search" : "' + srch + '","contactId" : ' + contactId + '}';
	var url = urlBase + '/searchContacts.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );
				
				for( var i=0; i<jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}
