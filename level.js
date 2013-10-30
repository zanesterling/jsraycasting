var tileWidth = 20;
var tileHeight = 20;
var worldWidth = 60;
var worldHeight = 40;

var WALL_ID = 0;

function setupLevel() {
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");

	var level = document.getElementById("level");
	ctx.drawImage(level, 0, 0);

	var world = ctx.getImageData(0, 0, worldWidth, worldHeight);
	console.log(world);

	/*for (var i=0; i<worldHeight; i++)
		for (var j=0; i<worldWidth; j++)
			if (world.data[i * worldHeight + j] == WALL_ID)
				addRect(newTile(j, i));*/

	addRect(newTile(31,20));
	addRect(newTile(31,21));
	addRect(newTile(32,20));
}

function newTile(x, y) {
	return newRect(x * tileWidth, y * tileHeight,
				   tileWidth, tileHeight);
}
