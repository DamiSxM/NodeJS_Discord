const discord = require("discord.js");
const apiai = require('apiai');
 
const bot = new discord.Client();
const ai = apiai("ee2faac3f0f44d16a43df40a88729b68");

bot.on('message', (message) => {


	if (message.author.id != bot.user.id)
	{
		console.log(message.author.username+' : '+message.content);

		var request = ai.textRequest(message.content, {sessionId: message.author.id});
		request.on('response', function(response) {

			action(response['result']['action'],response['result']['parameters']);
			message.channel.send(response['result']['fulfillment']['speech']);
			console.log('intentName : '+response['result']['metadata']['intentName']);

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
	console.log('parameters : '+parameters);
}

bot.login('MzM5Mzg3OTg5Nzk0NzUwNDY0.DFjP4g.k4boZzJenMs-p7vtsqZiq8_u8JA');