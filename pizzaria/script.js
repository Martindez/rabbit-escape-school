function update(){
place(playerToken,player);
place(killerToken,killer);

keyCount.textContent=got.length;
heartsText.textContent="❤️ ".repeat(hearts).trim();
playerRoom.textContent=player;
killerRoom.textContent=killer;
exitState.textContent=got.length===5?"OPEN":"Locked";

let d=dist(player,killer);
dangerText.textContent=d<=1?"High":d===2?"Medium":"Low";
dangerBar.style.width=d<=1?"90%":d===2?"55%":"20%";

document.querySelectorAll(".room").forEach(btn=>{
const room=btn.dataset.room;

btn.classList.remove(
"connected",
"locked",
"current",
"killer-room",
"key-room",
"exit-open",
"room-cleared"
);

if(room===player){
btn.classList.add("current");
btn.disabled=true;
}else if(rooms[player].includes(room)){
btn.classList.add("connected");
btn.disabled=false;
}else{
btn.classList.add("locked");
btn.disabled=true;
}

if(room===killer){
btn.classList.add("killer-room");
}

if(keys.includes(room) && !got.includes(room)){
btn.classList.add("key-room");
}

if(got.includes(room)){
btn.classList.add("room-cleared");
}

if(room==="Exit" && got.length===5){
btn.classList.add("exit-open");
}
});
}
