const app = require("express")();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);
// what above we also can write as belowe
// const io = require("socket.io")(http);

const dataObj = {
	candy: "it's a sweet product which was maden with sugar",
	honey: "it's a sweet product which was maden by bees",
	beeQueen: "18 days",
	bee: "21 days",
};

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/chat-bot.html");
});

io.on("connection", (socket) => {
	console.log("user connected");
	// console.log(socket);
	socket.on("chat message", (msg) => {
		//will send to everyone including the sender
		io.emit("chat message", msg);
	});

	socket.on("show", (msg) => {
		for (let item in dataObj) {
			io.emit("show", item);
			if (msg === item) {
				io.emit(item, dataObj[item]);
			}
		}
	});

	// send to everyone except for a certain emitting socket
	socket.broadcast.emit("chat message", "user join");
	// send event to everyone
	// io.emit("chat message", {
	// 	someProperty: "some property",
	// 	otherProperty: "other value",
	// });
	socket.on("disconnect", () => {
		console.log("user disconnected");
		io.emit("chat message", "see you next time");
		socket.broadcast.emit("chat message", "user left");
	});
});

io.on("show", (socket) => {});

http.listen(3000, () => console.log("Listening on port 3000"));
