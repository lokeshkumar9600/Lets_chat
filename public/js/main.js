const chatform = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const socket = io();
//get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
// console.log($("#msg"))

var typing=false;
var timeout=undefined;
//join chat room
socket.emit("joinChatRoom", { username, room });

socket.on('display', (data)=>{
  if(data.typing==true && data.user === username){
    $('.typing').text(`typing.....`)
}else if(data.typing==true){
  $('.typing').text(`${data.user} is typing...`)
}
  else
    $('.typing').text("")
})


//message to server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

chatform.addEventListener("submit", (e) => {
  e.preventDefault(); //this helps in preventing the default function ie.submitting to a file

  //get message text
  const msg = e.target.elements.msg.value;
  //emitting the message to server
  socket.emit("chatMessage", msg);

  //to clear and focus on the input field
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.user}<span>  ${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
// 


$('#msg').keypress((e)=>{
  console.log('...')
  if(e.which!=13){
      typing=true
      socket.emit('typing', {user:username, typing:true})
      clearTimeout(timeout)
      timeout=setTimeout(typingTimeout, 1500)
  }else{
      clearTimeout(timeout)
      typingTimeout()
      // sendMessage()
  }

  })

function typingTimeout(){
  typing=false
  socket.emit('typing', {user:username, typing:false})
}



