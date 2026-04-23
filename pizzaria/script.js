const rooms={
Kitchen:["Storage","Arcade"],
Storage:["Kitchen","Dining","Staff"],
Staff:["Storage","Bath"],
Arcade:["Kitchen","Dining","Delivery"],
Dining:["Storage","Arcade","Bath","Oven"],
Bath:["Staff","Dining","Exit"],
Delivery:["Arcade","Oven"],
Oven:["Dining","Delivery","Exit"],
Exit:["Bath","Oven"]
};

const pos={
Kitchen:[12,16],
Storage:[12,50],
Staff:[12,84],
Arcade:[45,16],
Dining:[45,50],
Bath:[45,84],
Delivery:[82,16],
Oven:[82,50],
Exit:[82,84]
};

const allRooms=["Kitchen","Storage","Staff","Arcade","Dining","Bath","Delivery","Oven"];

let player="Dining";
let killer="Storage";
let hearts=3;
let keys=[];
let got=[];

const startBtn=document.getElementById("startBtn");
const startScreen=document.getElementById("startScreen");
const hud=document.getElementById("hud");
const gameWrap=document.getElementById("gameWrap");
const messageBox=document.getElementById("messageBox");
const endScreen=document.getElementById("endScreen");

const playerToken=document.getElementById("playerToken");
const killerToken=document.getElementById("killerToken");

const keyCount=document.getElementById("keyCount");
const heartsText=document.getElementById("hearts");
const playerRoom=document.getElementById("playerRoom");
const killerRoom=document.getElementById("killerRoom");
const exitState=document.getElementById("exitState");
const dangerText=document.getElementById("dangerText");
const dangerBar=document.getElementById("dangerBar");
const messageText=document.getElementById("messageText");

document.querySelectorAll(".room").forEach(btn=>{
btn.onclick=()=>move(btn.dataset.room);
});

startBtn.onclick=startGame;

function startGame(){
keys=shuffle([...allRooms]).slice(0,5);
got=[];
player="Dining";
killer="Storage";
hearts=3;

startScreen.classList.add("hidden");
hud.classList.remove("hidden");
gameWrap.classList.remove("hidden");
messageBox.classList.remove("hidden");

update();
}

function move(room){
if(!rooms[player].includes(room)) return;

player=room;

if(keys.includes(player)&&!got.includes(player)){
got.push(player);
msg("You found a key!");
}

if(player==="Exit"&&got.length<5){
msg("Exit locked.");
}

moveKiller();

if(player===killer){
hit();
}

if(player==="Exit"&&got.length===5){
win();
return;
}

update();
}

function moveKiller(){
let next=rooms[killer];
killer=next[Math.floor(Math.random()*next.length)];
}

function hit(){
hearts--;
flash();

if(hearts<=0){
lose();
return;
}

player="Dining";
msg("Caught! Back to Dining.");
}

function win(){
hud.classList.add("hidden");
gameWrap.classList.add("hidden");
messageBox.classList.add("hidden");
endScreen.classList.remove("hidden");

document.getElementById("endTitle").textContent="You Escaped!";
document.getElementById("endText").textContent="You beat Level 2!";
}

function lose(){
hud.classList.add("hidden");
gameWrap.classList.add("hidden");
messageBox.classList.add("hidden");
endScreen.classList.remove("hidden");

document.getElementById("endTitle").textContent="Game Over";
document.getElementById("endText").textContent="The killer rabbit got you.";
}

function update(){
place(playerToken,player);
place(killerToken,killer);

keyCount.textContent=got.length;
heartsText.textContent="❤️ ".repeat(hearts);
playerRoom.textContent=player;
killerRoom.textContent=killer;
exitState.textContent=got.length===5?"OPEN":"Locked";

let d=dist(player,killer);

dangerText.textContent=d<=1?"High":d===2?"Medium":"Low";
dangerBar.style.width=d<=1?"90%":d===2?"55%":"20%";
}

function place(el,room){
el.style.top=pos[room][0]+"%";
el.style.left=pos[room][1]+"%";
}

function dist(a,b){
if(a===b)return 0;
if(rooms[a].includes(b))return 1;
return 2;
}

function msg(t){
messageText.textContent=t;
}

function flash(){
const f=document.getElementById("flashOverlay");
f.classList.add("flash");
setTimeout(()=>f.classList.remove("flash"),300);
}

function shuffle(a){
for(let i=a.length-1;i>0;i--){
let j=Math.floor(Math.random()*(i+1));
[a[i],a[j]]=[a[j],a[i]];
}
return a;
}
