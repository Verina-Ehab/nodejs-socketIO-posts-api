import express from 'express'
import {Server} from "socket.io";
import connectDB from './DB/connection.js';
import Post from './DB/models/post.model.js';
const app = express()
const port = 3000

connectDB()

app.get('/', (req, res) => res.send('Hello World!'))
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const io = new Server(server, {
  cors: "*",
});

io.on("connection", (socket) => {

  // 2.Add Post
  socket.on("addPost", async (data) => {
    console.log(data);
    await Post.insertMany(data);  //client might send an array of posts. await ensures that the data is saved before proceeding.
    let posts = await Post.find(); //(update UI) Retrieves all posts from the database after the new post has been added.

    io.emit("displayPosts", posts); 
    //Emits a displayPosts-> (UI) on displayPosts display posts (using for loop to append new posts)
  });

  // 1.On UI connect emite load
  // triggered when a client initially connects or refreshes.
  socket.on("load", async () => {
    let posts = await Post.find();
    io.emit("displayPosts", posts);
  });

  socket.on("Delete", async (id) => {
    await Post.findByIdAndDelete(id);

    let posts = await Post.find();
    io.emit("displayPosts", posts);
  });

  socket.on("search", async ({ title }) => {
    try {
      // search using title
      const results = await Post.find({ title: new RegExp(title, "i") }); //creates a regular expression for case-insensitive matching.
      socket.emit("displaySearchResults", results);
    } catch (error) {
      console.error("Error searching posts:", error);
      socket.emit("displaySearchResults", []);
    }
  });
});




/* 

io.on('connection', (socket) => {
  console.log(socket.id);
  console.log("socket connecteds");
  socket.on("chatInput",(msg)=>{
    console.log(msg, "from server");
    socket.emit('replay', msg);
  });

  socket.on("disconnect",()=>{
    console.log("user disconnected");
    
  });

socket.on("Typeing", ()=>{
socket.broadcast.emit('usertypeing')
});

socket.on("stopTypeing", ()=>{
  socket.broadcast.emit('notyping')
})


}); */



