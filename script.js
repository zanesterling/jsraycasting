var fps = 60;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var lines = [];
var rects = [];
var rays = 600;
var depths = [];
var colors = [];

var speed = 3;
var pangle = 0;
var px = canvas.width/2;
var py = canvas.height/2;
var visionCone = Math.PI / 2;

var mouseX = 0;
var mouseY = 0;
var wDown = false;
var aDown = false;
var sDown = false;
var dDown = false;
var qDown = false;
var eDown = false;

var debugGraphics = false;

var s = [];

setup();

setInterval(run, 1000 / fps);

function setup() {
	for (var i=0; i<20; i++)
		addRect(randomRect());
	
	for (var i=0; i<rays; i++) {
		depths.push(1000000);
		s.push("");
	}

	canvas.tabIndex = 0;
	canvas.focus();
}

function run() {
	update();
	draw();
}

function update() {
	if(wDown) {
		px += Math.cos(pangle) * speed;
		py += Math.sin(pangle) * speed;
	}

	if(sDown) {
		px -= Math.cos(pangle) * speed;
		py -= Math.sin(pangle) * speed;
	}

	if(eDown) {
		px -= Math.sin(pangle) * speed;
		py += Math.cos(pangle) * speed;
	}

	if(qDown) {
		px += Math.sin(pangle) * speed;
		py -= Math.cos(pangle) * speed;
	}

	if (aDown)
		pangle -= 0.03;
	if (dDown)
		pangle += 0.03;
}

function draw() {
	clearCanvas();

	if (debugGraphics) {

		ctx.strokeStyle = "rgb(0,0,0)";
		for (var i=0; i<lines.length; i++)
			drawLine(lines[i]);

		drawVisionLines();

	} else {

		castRays();

		//scale color with depth
		for (var i=0; i<rays; i++) {
			var c;
			if (depths[i] > 0)
				c = Math.floor(220 - 220 / 75000 * Math.pow(depths[i], 2));
			else
				c = 0;

			var r = colors[i] == 0 ? c : 0;
			var g = colors[i] == 1 ? c : 0;
			var b = colors[i] == 2 ? c : 0;

			s[i] = "rgb("+r+","+g+","+b+")";
			ctx.fillStyle = s[i];
			ctx.fillRect(i*2+1,1, 2,800);
		}
	}

	drawBorder();
}

function castRays() {
	for (var i=0; i<rays; i++)
		depths[i] = 10000000;

	var theta = pangle - visionCone / 2;

	for (var i=0; i<rays; i++) {
		var q = [px, py];
		var s = [700 * Math.cos(theta),
				 700 * Math.sin(theta)];

	 	for (var j=0; j<lines.length; j++) {
			var p = lines[j][0];
			var r = pointSum(lines[j][1], negative(p));

			var t = crossProduct(pointSum(q, negative(p)), s) /
					crossProduct(r, s);
			var u = crossProduct(pointSum(q, negative(p)), r) /
					crossProduct(r, s);

			if (0 <= t && t <= 1 &&	0 <= u && u <= 1) {
				var point = pointSum(p, [t*r[0], t*r[1]]);
				x = Math.sqrt((point[0] - px) * (point[0] - px) +
							  (point[1] - py) * (point[1] - py));

				if (x < depths[i]) {
					depths[i] = x;
					colors[i] = lines[j][2];
				}
			}
		}

		theta += visionCone / rays;
	}
}

function pointQuotient(point1, point2) {
	return [point1[0] / point2[0],
			point1[1] / point2[1]];
}

function pointSum(point1, point2) {
	return [point1[0] + point2[0],
			point1[1] + point2[1]];
}

function negative(point) {
	return [-point[0], -point[1]];
}

function crossProduct(point1, point2) {
	return point1[0] * point2[1] - point1[1] * point2[0];
}

function drawVisionLines() {
	ctx.strokeStyle = "rgb(255,0,0)"
	ctx.beginPath();
	ctx.moveTo(px, py);
	ctx.lineTo(px + 700 * Math.cos(pangle + visionCone/2),
			   py + 700 * Math.sin(pangle + visionCone/2));
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(px, py);
	ctx.lineTo(px + 700 * Math.cos(pangle - visionCone/2),
			   py + 700 * Math.sin(pangle - visionCone/2));
	ctx.stroke();
}

function mouseMove() {
	mouseX = event.clientX;
	mouseY = event.clientY;
}

function keyDown() {
	if (event.keyCode == 87) {
		wDown = true;
	} else if (event.keyCode == 65) {
		aDown = true;
	} else if (event.keyCode == 83) {
		sDown = true;
	} else if (event.keyCode == 68) {
		dDown = true;
	} else if (event.keyCode == 81) {
		qDown = true;
	} else if (event.keyCode == 69) {
		eDown = true;
	}

	if (event.keyCode == 80)
		debugGraphics = !debugGraphics;
}

function keyUp() {
	if (event.keyCode == 87) {
		wDown = false;
	} else if (event.keyCode == 65) {
		aDown = false;
	} else if (event.keyCode == 83) {
		sDown = false;
	} else if (event.keyCode == 68) {
		dDown = false;
	} else if (event.keyCode == 74) {
		jDown = false;
	} else if (event.keyCode == 75) {
		kDown = false;
	} else if (event.keyCode == 81) {
		qDown = false;
	} else if (event.keyCode == 69) {
		eDown = false;
	}
}

function addRect(rect) {
	rects.push(rect);
	lines.push([rect[0], rect[1], Math.floor(3 * Math.random())]);
	lines.push([rect[1], rect[2], Math.floor(3 * Math.random())]);
	lines.push([rect[2], rect[3], Math.floor(3 * Math.random())]);
	lines.push([rect[3], rect[0], Math.floor(3 * Math.random())]);
}
