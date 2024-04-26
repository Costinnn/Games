let canvas = document.getElementById("canvas");

let context = canvas.getContext("2d");

var window_height = window.innerHeight;
var window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "green";

context.fillStyle = "red";
context.fillRect(100, 0, 100, 100);
context.fillRect(100, 500, 100, 200);

context.beginPath();
context.arc(200, 100, 50, 0, Math.PI * 2, false);
context.stroke();
context.closePath();
