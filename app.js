const app = require("express")();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);
// what above we also can write as belowe
// const io = require("socket.io")(http);

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/chat-bot.html");
});

io.on("connection", (socket) => {
	console.log("user connected");

	socket.on("chat message", (msg) => {
		//will send to everyone including the sender
		io.emit("chat message", msg);
	});

	// send to everyone except for a certain emitting socket
	// don't work don't know why
	socket.broadcast.emit("hi");

	// send event to everyone
	// io.emit("chat message", {
	// 	someProperty: "some property",
	// 	otherProperty: "other value",
	// });
	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

http.listen(3000, () => console.log("Listening on port 3000"));
