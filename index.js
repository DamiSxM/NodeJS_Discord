const discord = require("discord.js");
const apiai = require('apiai');
const database = require('mongodb');

const url = "mongodb://localhost:27017/BostyBot";
 
const bot = new discord.Client();
const ai = apiai("ee2faac3f0f44d16a43df40a88729b68");

let messageUser;
let responseBot;

bot.on('message', (message) => {
	if (message.author.id != bot.user.id)
	{
		console.log("\n");
		console.log(message.author.username+' : '+message.content);
		messageUser = message;

		var request = ai.textRequest(message.content, {sessionId: message.author.id});
		request.on('response', function(response) {

			responseBot = response['result']['fulfillment']['speech'];
			action(response['result']['action'],response['result']['parameters']);

			//if (reaction) message.channel.send(response['result']['fulfillment']['speech']);
			console.log('intention : '+response['result']['metadata']['intentName']);
		});
		request.on('error', function(error) {
		    console.log(error);
		});
		request.end();
	}
});

bot.on('ready', function(){
	console.log("Bot activé...");
});

function action(action, parameters){
	console.log('action : '+action);
	switch (action) {
		case 'addCustomer': AddCustomer(parameters['given-name'], parameters['last-name']);
		break;
		case 'ListCustomers': ListCustomers();
		break;
		case 'DeleteCustomer': 
		break;
		default: messageUser.channel.send(responseBot);
		break;
	}
}

function AddCustomer(firstN, lastN){
	if (firstN != "" && lastN != "")
	{
		database.connect(url, function(err, db) {
			if (err) throw err;

			var myobj = { firstName: firstN, lastName: lastN };

			db.collection("customers").insertOne(myobj, function(err, res) {
				if (err) throw err;
				console.log("1 record inserted : "+firstN+' '+lastN);
				db.close();

				messageUser.channel.send(responseBot);

			});
		});
	}
}

function ListCustomers(){
	database.connect(url, function(err, db) {
		if (err) throw err;
		  db.collection("customers").find({}).toArray(function(err, result) {
		  	if (err) throw err;

		  	messageUser.channel.send(responseBot);
		  	result.forEach(function(item, index) {
		  		messageUser.channel.send(item['firstName']+' '+item['lastName']);
		  	});

		  	db.close();
		  });
	});
}

function DeleteCustomer(firstN, lastN){
	database.connect(url, function(err, db) {
		if (err) throw err;

		var myquery = { firstName: firstN, lastName : lastN};

		db.collection("customers").deleteOne(myquery, function(err, obj) {
			if (err) throw err;
			console.log("1 document deleted");
			db.close();
			messageUser.channel.send(responseBot);
		});
	});
}

bot.login('MzM5Mzg3OTg5Nzk0NzUwNDY0.DFjP4g.k4boZzJenMs-p7vtsqZiq8_u8JA');