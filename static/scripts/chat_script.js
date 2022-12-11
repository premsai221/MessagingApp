const socket = io('http://localhost:5999', { transports: ['websocket', 'polling', 'flashsocket'], withCredentials: true });

const username = String(document.querySelector("#greeting").textContent).trim().slice(6);
const chat_box = document.querySelector(".chat-box");
const dropdown = document.querySelector(".dropdown");
const options = document.querySelectorAll(".dropdown-option");
const three_dots = document.querySelector(".three-dots>img");
const modal = document.getElementById("myModal");
const modalCloser = document.querySelector(".close-modal");
const addFrndBut = document.querySelector(".friend-add-button");
const nameInput = document.querySelector("#friend-input");
const sidebar = document.querySelector(".sidebar-users");
const sendButton = document.querySelector(".send-img");
const textInput = document.querySelector(".input-box");
const nameBar = document.querySelector(".name-bar");
const chatLoad = document.querySelector(".chat-loading");

function msgTemplate(from, to, msg, timeSent) {
    this.from = from;
    this.to = to;
    this.msg = msg;
    this.timeSent = timeSent;
}

const friends = sidebar.querySelectorAll(".user-card");

if (friends[0])
var onTop = friends[0].id;
var curReceiver = "";
var lastSelected;

friends.forEach(userCard => {
    userCard.addEventListener("click", () => {
        if (lastSelected)
        {
            lastSelected.style.backgroundColor = null;
            lastSelected.style.borderRadius = null;
        }
        chatLoad.style.display = "block";
        lastSelected = userCard;
        userCard.style.backgroundColor = "#ff3a5bb8";
        userCard.style.borderRadius = "12px";
        const imgDiv = userCard.querySelector(".new-msg-icon");
        imgDiv.style.display = "none";
        curReceiver = userCard.id;
        nameBar.textContent = curReceiver;
        socket.emit("get-msgs", curReceiver);
    })
})

window.addEventListener("click" , (e) => {
    if (e.target !== three_dots)
    {
        var outside = 1;
        options.forEach((option) => {
            if (option === e.target)
            {
                outside = 0;
            }
        })
        if (outside && !dropdown.classList.contains("dropdown-block"))
        {
            dropdown.classList.toggle("dropdown-block");
        }
    }
    else
    {
        dropdown.classList.toggle("dropdown-block");
    }
})

options[0].addEventListener("click", ()=>{
    dropdown.classList.toggle("dropdown-block");
    modal.style.display = "block";
})

modalCloser.addEventListener("click", () => {
    modal.style.display = "none";
})

addFrndBut.addEventListener("click", () => {
    const username = nameInput.value;
    if (username)
    {
        socket.emit("new-friend", username)
        modal.style.display = "none";
    }
})

sendButton.addEventListener("click", ()=>{
    var msg = String(textInput.value);

    textInput.value = "";
    if (msg)
    {   
        msg = msg.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
        console.log(msg);
        msgObj = new msgTemplate(username, curReceiver, msg, new Date());
        if (socket.emit("send-msg", msgObj))
        {
            if (onTop !== curReceiver)
            {
                onTop = curReceiver;
                let onTopElem = sidebar.querySelector("#" + onTop);
                sidebar.insertBefore(onTopElem ,sidebar.firstChild)
            }
            const time = msgObj.timeSent.toISOString().replace("T", " ").slice(0, 19);
            chat_box.innerHTML += "<div class=\"sent-msg\"><pre class=\"pre-format\">" + msgObj.msg + "</pre><div class=\"time-text\">" + time + "</div></div>";
            chat_box.scrollTop = chat_box.scrollHeight - chat_box.clientHeight;
        }
    }
})

socket.on("add-friend", (name) => {
    const userDiv = document.createElement("div");
    userDiv.id = name;
    userDiv.classList.add("user-card")
    var userCardHTML = "<img src=\"images/user.png\" alt=\"user profile pic\" height=\"45px\"><div class=\"username-text\">" 
    + name + 
    "</div><div class=\"new-msg-icon\"><img src=\"images/noti.png\" alt=\"\" height=\"15px\"></div>";
    userDiv.innerHTML = userCardHTML;
    sidebar.insertBefore(userDiv ,sidebar.firstChild)
    const userCard = sidebar.querySelector("#"+name);
    userCard.addEventListener("click", () => {
        if (lastSelected)
        {
            lastSelected.style.backgroundColor = "#ff99aa";
            lastSelected.style.borderRadius = null;
        }
        chatLoad.style.display = "block";
        lastSelected = userCard;
        userCard.style.backgroundColor = "#ff3a5bb8";
        userCard.style.borderRadius = "12px";
        const imgDiv = userCard.querySelector(".new-msg-icon");
        imgDiv.style.display = "none";
        curReceiver = userCard.id;
        nameBar.textContent = curReceiver;
        socket.emit("get-msgs", curReceiver);
    })
    onTop = name;
})

socket.on("user-msgs", (msgObj)=>{
    if (curReceiver === msgObj.user)
    {
        var msgHtml = "";
        msgObj.msgs.forEach(msg => {
            const time = msg.timeSent.replace("T", " ").slice(0, 19);
            if (msg.from === username)
            {
                msgHtml += "<div class=\"sent-msg\"><pre class=\"pre-format\">" + msg.msg + "</pre><div class=\"time-text\">" + time + "</div></div>";
            }
            else {
                msgHtml += "<div class=\"rec-msg\"><pre class=\"pre-format\">" + msg.msg + "</pre><div class=\"time-text\">" + time + "</div></div>";
            }
        })
        chat_box.innerHTML = msgHtml;
        chat_box.scrollTop = chat_box.scrollHeight - chat_box.clientHeight;
        if (curReceiver === msgObj.user)
        {
            chatLoad.style.display = "none";
        }
    }
})

socket.on("new-msg", (msgObj) => {
    if (curReceiver === msgObj.from)
    {
        const time = msgObj.timeSent.replace("T", " ").slice(0, 19);
        chat_box.innerHTML += "<div class=\"rec-msg\">" + msgObj.msg + "<div class=\"time-text\">" + time + "</div></div>";
        chat_box.scrollTop = chat_box.scrollHeight - chat_box.clientHeight;
    }
    else {
        const sender = sidebar.querySelector("#"+msgObj.from);
        const imgDiv = sender.querySelector(".new-msg-icon");
        imgDiv.style.display = "block";
        sidebar.insertBefore(sender ,sidebar.firstChild)
        onTop = msgObj.from;
    }
})

// socket.on("disconnect", )