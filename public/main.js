const socket = io();

const inboxPeople = document.querySelector(".inbox__people");
const inputField = document.querySelector(".message_form__input");
const messageForm = document.querySelector(".message_form");
const messageBox = document.querySelector(".messages__history");
const fallBack = document.querySelector(".fallback");

let userName = "";

const addNewMessage = ({ user, message }) => {
  const time = new Date();

  const formatedTime = time.toLocaleString("en-US", {
    hour: 'numeric',
    minute: "numeric"
  });

  const receiveMsg = `<div class="card border-0 shadow mt-2">
    <div class="incoming__message">
      <div class="received__message">
        <p class="text-end p-3 text-dark">${message}</p>
        <div class="message__info text-end">
          <span class="text-end message__author p-3 text-secondary"><small>From: ${user}</small></span>|
          <span class="text-end time_date time_date p-3 text-secondary"><small>${formatedTime}</small></span>
        </div>
      </div>
    <div>
  </div>
  `;

  const myMsg = `<div class="card border-0 shadow mt-2">
    <div class="outgoing__message">
      <div class="sent__message">
        <p class="text-start text-dark p-3">${message}</p>
        <div class="message__info">
          <span class="text-start time_date p-3 text-secondary"><small>${formatedTime}</small></span>
        </div>
      </div>
    </div>
  </div>
  `;

  messageBox.innerHTML += user === userName ? myMsg : receiveMsg;
  
};


messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!inputField.value) {
    return;
  }

  socket.emit("chat message", {
    message: inputField.value,
    nick: userName
  });

  inputField.value = "";
});

inputField.addEventListener("keyup", () => {
  socket.emit("typing", {
    isTyping: inputField.value.length > 0,
    nick: userName
  });
})

socket.on("chat message", function(data) {
  addNewMessage({
    user: data.nick,
    message: data.message
  });
});

const newUserConnected = (user) => {
  userName = user || `User${Math.floor(Math.random() * 1000000)}`;
  socket.emit("new user", userName);
  addToUsersBox(userName);
}

const addToUsersBox = (userName) => {
  if (!!document.querySelector(`.${userName}-userlist`)) {
    return;
  }

  const userBox = `
    <div class="chat_ib ${userName}-userlist">
      <p class="p-3">${userName}</p>
    </div>
  `;

  inboxPeople.innerHTML += userBox;
}

newUserConnected();

socket.on("new user", function(data) {
  data.map((user) => addToUsersBox(user));
});

socket.on("user disconnected", function (userName) {
  document.querySelector(`.${userName}-userlist`).remove();
});

socket.on("typing", function(data) {
  const { isTyping, nick } = data;

  if (!isTyping) {
    fallBack.innerHTML = "";
    return;
  }

  fallBack.innerHTML = `<p class="p-3 text-secondary"><small>${nick} is typing...</small></p>`

});