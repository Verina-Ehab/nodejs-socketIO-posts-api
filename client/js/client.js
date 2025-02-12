const socket = io("http://localhost:3000/");


socket.on("connect", () => {
  socket.emit("load");
});

/* 
const chatInput = document.getElementById("message");
const chatOutput = document.getElementById("content");



function sendMessage() {
    console.log(chatInput.value);
    socket.emit("chatInput", chatInput.value);
}

socket.on("replay",(value)=>{
    console.log(value);
    const item = document.createElement("li");
    item.textContent = value;
    chatOutput.append(item);
    window.scrollTo(0, document.body.scrollHeight);
});


chatInput.addEventListener("input",()=>{
    socket.emit("Typeing");
})

socket.on("usertypeing", () => {
  document.getElementById("typemsg").innerHTML = "Typeing...";
});





chatInput.addEventListener("keyup", () => {
  socket.emit("stopTypeing");
});


socket.on("notyping", () => {
    setTimeout(()=>{
        document.getElementById("typemsg").innerHTML = "";
    },1000)
}); */


const title = document.getElementById("title");
const desc = document.getElementById("desc");



function addPost() {
  const post = {
    title: title.value,
    desc: desc.value,
  };

  socket.emit("addPost", post);
}

socket.on("displayPosts", (data) => {
  display(data);
});

function display(data) {
  let cartona = ``;
  for (let i = 0; i < data.length; i++) {
    cartona += `
      <div class="card m-3 text-center" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">${data[i].title}</h5>
          <p class="card-text">${data[i].desc}</p>
          <button onclick="deleteItem('${data[i]._id}')" class="btn btn-danger" id="delete">delete</button>
        </div>
      </div>
    `;
  }
  document.getElementById("data").innerHTML = cartona;
}

function deleteItem(id) {
  socket.emit("Delete", id);
}

function searchPost() {
  if (!title.value.trim()) return;

  // Emit search event
  socket.emit("search", { title: title.value });

  // Display loading state
  document.getElementById("results").innerHTML = "Searching...";
}

// Listen for search results from the server
socket.on("displaySearchResults", (data) => {
  const resultsDiv = document.getElementById("results");
  if (data.length === 0) {
    resultsDiv.innerHTML = "No posts found.";
  } else {
    resultsDiv.innerHTML = data
      .map(
        (post) => `
          <div class="card m-3 text-center" style="width: 18rem;">
            <div class="card-body ">
              <h5 class="card-title">${post.title}</h5>
              <p class="card-text">${post.desc}</p>
            </div>
          </div>`
      )
      .join("");
  }
});