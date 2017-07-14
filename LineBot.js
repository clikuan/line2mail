var https = require('https');
var fs = require('fs');
var line = require('@line/bot-sdk');
var sendmail = require('sendmail')();
var config = require('./Config');
var options = {
	key: fs.readFileSync(config.privkey),
	cert: fs.readFileSync(config.cert),
	ca: fs.readFileSync(config.ca)
}
https.createServer(options, function(req, res){
	if (req.method == 'POST') {
		var body = '';	
		req.on('data', function (data) {
			body += data;
		});
		req.on('end', function () {
			var receiveObj = JSON.parse(body);
			var client = new line.Client({
				channelAccessToken: config.channelAccessToken		
			});
			var date = new Date(receiveObj.events[0].timestamp).toLocaleString();
			if(receiveObj.events[0].message.type == 'text'){
				var mail = JSON.parse(JSON.stringify(config.mail));
				mail.subject = '[' + date + '] ' + mail.subject;
				mail.html = receiveObj.events[0].message.text;
				sendmail(mail, function(err, reply) {
						console.log(err && err.stack);
						console.dir(reply);
				});
			}
			else if(receiveObj.events[0].message.type == 'image' || receiveObj.events[0].message.type == 'file'){
				var stream = client.getMessageContent(receiveObj.events[0].message.id);
				var file = null;
				stream.on('data', function(data){
					if(file == null)
						file = data;
					else{
						file =  Buffer.concat([file,data]);
					}
				});
				stream.on('end', function(){
					var filename;
					if(receiveObj.events[0].message.type == 'image'){
						filename = 'image.jpg';
					}
					else{
						filename = receiveObj.events[0].message.fileName;
					}
					var mail = JSON.parse(JSON.stringify(config.mail));
					mail.subject = '[' + date + '] ' + mail.subject;
					mail.attachments = [{
							filename: filename,
							content: file
					}];
					sendmail(mail, function(err, reply) {
							console.log(err && err.stack);
							console.dir(reply);
					});
				});
			}
			/*var msg = {
				type: 'text',
				text: 'hello world'
			};
			client.replyMessage(receiveObj.events[0].replyToken, msg)*/
			
		});
	}
}).listen(config.port);





