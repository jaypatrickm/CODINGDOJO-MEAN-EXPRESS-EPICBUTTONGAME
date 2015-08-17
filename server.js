// require express
var express = require("express");

// path module
var path = require("path");

// create the express app
var app = express();

// require body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));

// static content
app.use(express.static(path.join(__dirname, "./static")));

// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// root route to render the index.ejs view
app.get('/', function(req, res) {
	res.render("index");
})

var server = app.listen(9000, function() {
	console.log("listening on port 9000");
})

var counter = 0;
// socket.io module
var io = require('socket.io').listen(server); // notice we pass the server object
io.sockets.on('connection', function(socket) {
	console.log('WE HAVE SOCKETS CONNECTED!');
	console.log(socket.id);
	socket.on("button_clicked", function(data) {
		counter = counter + data.count;
		console.log('You emitted the following information to the server: ' + data.count);
		io.emit("my_full_broadcast_event", {count: counter});
	})
	socket.on("reset", function(data) {
		counter = 0;
		io.emit("my_full_broadcast_event", {count: counter});
	})
    io.emit("my_full_broadcast_event", {count: counter});
})