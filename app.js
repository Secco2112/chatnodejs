var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path    = require("path");
 
var clients = {};


 
app.get('/', function(req, res){
	res.send('server is running');
});

app.get('/chat', function(req, res){
	 res.sendFile(path.join(__dirname+'/views/index.html'));
});
 
//SocketIO vem aqui

io.on("connection", function (client) {
  client.on("join", function(name){
    console.log("Joined: " + name);
    clients[client.id] = name;
    client.emit("update", "You have connected to the server.");
    client.broadcast.emit("update", name + " has joined the server.")
  });
 
  client.on("send", function(msg){
    console.log("Message: " + msg);
    client.broadcast.emit("chat", clients[client.id], msg);
  });
 
  client.on("disconnect", function(){
    console.log("Disconnect");
    io.emit("update", clients[client.id] + " has left the server.");
    delete clients[client.id];
  });
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery')));
app.use(express.static(path.join(__dirname, 'node_modules/socket.io-client')));

 
http.listen(3000, function(){
	console.log('listening on port 3000');
});