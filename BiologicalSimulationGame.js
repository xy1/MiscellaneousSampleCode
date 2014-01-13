<html>
<style>
.main {
	background-color: #000000;
	color: #FFFFFF;
	padding: 30px;
	font-family: "Courier",sans-serif;
	font-size: 16pt;
}
canvas {
	cursor: crosshair;
}
.titlebox {
	color: red;
}
.box {
	border-color: #FFFFFF;
	border-width: 0px;
	border-style: dashed;
	padding: 2px;
}
.controlpanel {
	font-size: 80%;
}
.buttonstyle {
	text-decoration: none;
	background-color: #333333;
	color: red;
	padding: 7px;
	font-family: "Courier",sans-serif;
	font-size: 100%;
	border-color: red;
	border-width: 1px;
	border-style: solid;
}
</style>
<script type=text/javascript>
function PlaySound(which) {  // 0 is wounding sound and 1 is killing sound
	s = new Array (
		'Beep_12%20-%20JewelBeat.mp3',
		'Beep_20%20-%20JewelBeat.mp3',
		'Beep_04%20-%20JewelBeat.mp3'
	);
	if (which == 0) { r = 0; }
	else { r = 2; }
	document.getElementById("sound").innerHTML = "<embed src=http://www.jewelbeat.com/free/free-sound-effects/buttons/" + s[r] +
		" autostart=true hidden=true loop=false></embed>";
}
</script>
</head>

<body class=main>
<div class=titlebox>PATHOGENS</div>
<br/>
<div id=scoreboard_label class=box>Pathogens: <span id=scoreboard></span>
&nbsp;
Phages: <span id=phagecount></span>
&nbsp;
Host Strength: <span id=chewedscore></span>
</div>

<div id=controlpanel class=controlpanel style='position:absolute; left:685px; top: 150px;'>
<input type=button value='Instructions' onclick="ShowLoading('<br/><br/> &bull; Kill all pathogens to save host. <br/><br/> &bull; Kill pathogens with phages.<br/><br/> &bull; Kill pathogens with death beam.<br/><br/> &bull; Use your beam to guide them; <br/> &nbsp; move mouse to position.<br/><br/> &bull; Use your phageduct as a barrier; <br/> &nbsp; click to position. <br/><br/> ', 9);" class='buttonstyle'>
<br/><br/>
<input type=button value='Restart' onclick='RestartGame();' class='buttonstyle'>
<br/><br/>
<input type=button value='Redesign Phageduct' onclick='ShowLoading("Redesigning...", 1);InitializeWall();' class='buttonstyle'>
<br/><br/>
<input type=button value='Release Phage' onclick='ReleasePhage();' class='buttonstyle'>
<br/><br/>
<input type=button id=highbeamon name=highbeamon value='Activate Death Beam' onclick='ToggleHighBeam(1)' class='buttonstyle'>
<input type=button id=highbeamoff name=highbeamoff value='Deactivate Death Beam' onclick='ToggleHighBeam(0);' class='buttonstyle' style='display: none;'>
<br/><br/>
<input type=button id=enlargebeam name=enlargebeam value='Enlarge Beam' onclick='ToggleBeamSize(1)' class='buttonstyle'>
<input type=button id=shrinkbeam name=shrinkbeam value='Shrink Beam' onclick='ToggleBeamSize(0);' class='buttonstyle' style='display: none;'>
<br/><br/>
<input type=button id=inctemp name=inctemp value='Increase Temperature' onclick='ToggleTemp(0.5)' class='buttonstyle'>
<input type=button id=dectemp name=dectemp value='Decrease Temperature' onclick='ToggleTemp(1);' class='buttonstyle' style='display: none;'>

</div>

<script type=text/javascript>

function ToggleTemp(setting) {
	TEMPERATURE = setting;
	if (setting == 0.5) {
		document.getElementById("inctemp").style.display = "none";
		document.getElementById("dectemp").style.display = "block";
	}
	else {
		document.getElementById("inctemp").style.display = "block";
		document.getElementById("dectemp").style.display = "none";
	}
}

function ToggleBeamSize(setting) {
	if (setting == 1) {
		YOUR_RADIUS = 12;
		document.getElementById("enlargebeam").style.display = "none";
		document.getElementById("shrinkbeam").style.display = "block";
	}
	else {
		YOUR_RADIUS = 7;
		document.getElementById("enlargebeam").style.display = "block";
		document.getElementById("shrinkbeam").style.display = "none";
	}
}

function ToggleHighBeam(setting) {
	DESTROY_MODE = setting;
	if (setting == 1) {
		document.getElementById("highbeamon").style.display = "none";
		document.getElementById("highbeamoff").style.display = "block";
	}
	else {
		document.getElementById("highbeamon").style.display = "block";
		document.getElementById("highbeamoff").style.display = "none";
	}
}
function InitializeWall() {  // generate xy-coordinate offsets for wall lines to draw (to give an more organic appearance)
	for (i = 0; i < NUM_WALL_LINES; i++) {
		wx[i] = Math.round(Math.random() * 20);  // 20 is width of wall
		wy[i] = Math.round(Math.random() * 200);  // 200 is height of wall
		wo[i] = Math.round(Math.random() * 25);  // offsets for xy coordinates of Bezier control point in quadratic curves
		wc1[i] = Math.round(Math.random() * 25) + 0;
		wc2[i] = Math.round(Math.random() * 25) + 75;
		wc3[i] = Math.round(Math.random() * 50) + 0;
	}
}

function InitializeArray() {
	NUM_CIRCLES = 50;
	NUM_BIOPHAGES = 0;
	eaten = 0;
	NUM_CHEWED = 0;
	for (i = 0; i < NUM_CIRCLES; i++) {
		ax[i] = Math.sin(Math.random()) * 685;
		ay[i] = Math.sin(Math.random()) * 485;
		ar[i] = Math.pow(1.5, Math.random() * 3) + 3;
		ari[i] = Math.round(Math.random() * (ar[i] - 1)) + 1;
		// base speed on size
		as1[i] = 9 - ar[i];
		as2[i] = 9 - ar[i];
		if (which_image == 0) {
			// inner circle rgb
			ac1[i] = Math.round(Math.random() * 255) + 0;
			ac2[i] = Math.round(Math.random() * 0) + 25;
			ac3[i] = Math.round(Math.random() * 0) + 25;
			// outer circle rgb
			aci1[i] = Math.round(Math.random() * 255) +  0;
			aci2[i] = Math.round(Math.random() * 25) + 25;
			aci3[i] = Math.round(Math.random() * 25) + 25;
		}
		at[i] = 0;
		ah[i] = Math.random();
		ak[i] = 0;
		// immunity to phages
		if (ah[i] < 0.05) {
			ak[i] = 1;
			var tmpo = Math.round(Math.random() * 50);
			aci1[i] = 175 + tmpo;
			aci2[i] = 100 + tmpo;
			aci3[i] = 0;
		}
	}
}

function AdjustCircles(X, Y) {
	for (i = 0; i < NUM_CIRCLES; i++) {
		if (ax[i] > 0 || ay[i] > 0) {

			// run away from pointer
			dist_exponent = (Math.random() * 10);
			dist = Math.pow(1.7, dist_exponent);
			if ( Math.abs(X - ax[i]) < dist && Math.abs(Y - ay[i]) < dist) {
				if (ax[i] < X) { ax[i] = ax[i] - (as1[i] * TEMPERATURE); }
				else if (ax[i] > X) { ax[i] = ax[i] + (as1[i] * TEMPERATURE); }
				if (ay[i] < Y) { ay[i] = ay[i] - (as1[i] * TEMPERATURE); }
				else if (ay[i] > Y) { ay[i] = ay[i] + (as1[i] * TEMPERATURE); }
			}
	
			// hover randomly
			r = Math.round(Math.random() * 4) + 0;
			if (r < ah[i]) {
				direction = Math.round(Math.random() * 4) + 0;
				if (direction == 0) { ax[i] = ax[i] + ((as2[i] + as2[i]) * TEMPERATURE); }
				else if (direction == 1) { ax[i] = ax[i] - (as2[i] * TEMPERATURE); }
				else if (direction == 2) { ay[i] = ay[i] + (as2[i] * TEMPERATURE); }
				else if (direction == 3) { ay[i] = ay[i] - (as2[i] * TEMPERATURE); }
			}

			// keep on respective side of wall
			if (ay[i] >= wallY && ay[i] <= wallY + 200) {
				if (ax[i] >= wallX && ax[i] <= wallX + 10) { ax[i] = wallX - 5; }
				else if (ax[i] >= wallX + 11 && ax[i] <= wallX + 20) { ax[i] = wallX + 25; }
			}

			// keep on screen
			if (ax[i] < 25) { ax[i] = 25; }
			else if (ax[i] > 570) { ax[i] = 570; }
			if (ay[i] < 25) {
				tmpx = parseInt(ax[i]);
				tmpy = parseInt(ay[i]);
				if (tmpx >= 4 && tmpy >= 4 && tmpx <= 596 && tmpy <= 21) {
					ay[i] = 25;
				}
				if (ay[i] < 5) { ay[i] = 5; }
			}
			else if (ay[i] > 415) { ay[i] = 415; }

			// occasionally try to avoid neighbors
			r = Math.random();
			if (r < AVOID_RATE * TEMPERATURE && at[i] == 0) {
				for (j = 0; j < NUM_CIRCLES; j++) {
					if ( ( ax[j] > 0 || ay[j] > 0 ) && ax[i] == ax[j] && ay[i] == ay[j] ) {  // if found a live neighbor on same spot
						// randomly adjust original cell
						ax[i] = ax[i] + Math.round(Math.random() * 10) - 5;
						ay[i] = ay[i] + Math.round(Math.random() * 10) - 5;
					}
				}
			}

			// occasionally create chewed section
			r = Math.random();
			if (r < 0.0005) {
				NUM_CHEWED++;
				chewedX[NUM_CHEWED] = ax[i];
				chewedY[NUM_CHEWED] = ay[i];
				chewedR[NUM_CHEWED] = Math.pow(2.1, Math.random() * 4) + Math.round(Math.random() * 5);
				chewedC[NUM_CHEWED] = Math.round(Math.random() * 50);
				if (NUM_CHEWED > MAX_CHEWED) {
					EndGame();
					InitializeArray();
				}
			}

		}
	}
}

function RefreshScore() {
	document.getElementById("scoreboard").innerHTML = ( (NUM_CIRCLES - NUM_BIOPHAGES) - eaten);
	document.getElementById("phagecount").innerHTML = ( NUM_BIOPHAGES );
	document.getElementById("chewedscore").innerHTML = ( 1000 - NUM_CHEWED );
}

function SpawnBiophage() {
	NUM_BIOPHAGES++;
	SpawnCircle(1);
}

function CheckSpawning() {
	r = Math.random();
	var num_alive = 0;
	for (i = 0; i < NUM_CIRCLES; i++) {
		if (at[i] == 0 && ( ax[i] > 0 || ay[i] > 0 ) ) { num_alive++; }
	}
	if (r < (SPAWN_RATE * num_alive * TEMPERATURE) && NUM_CIRCLES < MAX_CIRCLES) {
		SpawnCircle(0);
		RefreshScore();
	}
}

function SpawnCircle(celltype) {
	NUM_CIRCLES++;
	i = NUM_CIRCLES - 1;
	at[i] = celltype;
	if (celltype == 0) {  // pathogen
		// "sweep" through data looking for a random live pathogen to spawn
		var FOUND = 0;
		var rand_starting_inc = Math.round(Math.random() * 3) + 3;
		for (var increment = rand_starting_inc; increment >= 1; increment--) {
			for (j = 0; j < NUM_CIRCLES; j = j + increment) {
				if (at[j] == 0 && ( ax[j] > 0 || ay[j] > 0 ) ) {
					// spawn at its location
					ax[i] = ax[j];
					ay[i] = ay[j];
					// inherit characteristics
					ar[i] = ar[j];
					ari[i] = ari[j];
					as1[i] = as1[j];
					as2[i] = as2[j];
					ah[i] = ah[j];
					ak[i] = ak[j];
					ac1[i] = ac1[j];
					ac2[i] = ac2[j];
					ac3[i] = ac3[j];
					aci1[i] = aci1[j];
					aci2[i] = aci2[j];
					aci3[i] = aci3[j];
					FOUND = 1;
					break;
				}
			}
			if (FOUND == 1) { break; }
		}
	}
	else if (celltype == 1) {
		ar[i] = Math.pow(1.5, Math.random() * 3) + 2;
		ar[i] = ar[i] * 3;  // make phages a little larger
		ari[i] = Math.round(Math.random() * (ar[i] - 1)) + 1;
		as1[i] = Math.pow(1.5, Math.random() * 2) + 0;
		as2[i] = Math.pow(1.5, Math.random() * 2) + 1;
		var x = wallX;
		var y = wallY;
		ax[i] = x + 15;
		ay[i] = y + 15;
		ac1[i] = 100;
		ac2[i] = 255;
		ac3[i] = 200;
		aci1[i] = 50;
		aci2[i] = 225;
		aci3[i] = 150;
		ah[i] = Math.random();
	}
}

function KillCell(num) {
	ax[num] = 0;
	ay[num] = 0;
	if (at[num] == 0) { eaten++; }
	//YOUR_RADIUS = 10 + Math.round(eaten / 100);
	PlaySound(1);
	RefreshScore();
}

function CheckBiophageCollisions() {
	killed_any = 0;
	for (i = 0; i < NUM_CIRCLES; i++) {
		if (at[i] == 1 && ( ax[i] > 0 || ay[i] > 0) ) {  // if it's a live biophage
			// check to see if given biophage has collided with any pathogens
			for (j = 0; j < NUM_CIRCLES; j++) {
				if (at[j] == 0 && ak[j] == 0 && ( ax[j] > 0 || ay[j] > 0 ) ) {  // if a live pathogen
					if (ax[j] > ax[i] - ar[i] && ax[j] < ax[i] + ar[i] && ay[j] > ay[i] - ar[i] && ay[j] < ay[i] + ar[i]) {
						KillCell(j);
						killed_any++;
					}
				}
			}
		}
	}
	return killed_any;
}

function CheckIfAnyLeft() {
	any_left = 0;
	for (i = 0; i < NUM_CIRCLES; i++) {
		if (ax[i] > 0 || ay[i] > 0) {
			if (at[i] == 0) { any_left = 1; }
		}
	}
	if (any_left == 0) {
		EndGame();
		return false;
	}
}

function CheckCollisions(X, Y, rad) {
	killed_any = 0;
	for (i = 0; i < NUM_CIRCLES; i++) {
		if (ax[i] > 0 || ay[i] > 0) {
			if (ax[i] > X - rad && ax[i] < X + rad && ay[i] > Y - rad && ay[i] < Y + rad) {
				ar[i] = ar[i] - 1;  // collision makes smaller (and faster)
				as1[i] = as1[i] + 1;
				as2[i] = as2[i] + 1;
				PlaySound(0);
				if (ar[i] <= 2) {
					KillCell(i);
					killed_any++;
				}
			}
		}
	}
	return killed_any;
}

function RestartGame() {

	InitializeWall();
	InitializeArray();

	ShowLoading("Loading...", 3);

	StartTime = new Date();
	start_hours = StartTime.getHours();
	start_minutes = StartTime.getMinutes();
	start_seconds = StartTime.getSeconds();
}

function EndGame() {
	EndTime = new Date();
	end_hours = EndTime.getHours();
	end_minutes = EndTime.getMinutes();
	end_seconds = EndTime.getSeconds();
	diff_hours = end_hours - start_hours;
	diff_minutes = end_minutes - start_minutes;
	diff_seconds = end_seconds - start_seconds;
	if (diff_hours > 0) { diff_minutes = diff_minutes + (diff_hours * 60); }
	if (diff_minutes > 0) { diff_seconds = diff_seconds + (diff_minutes * 60); }

	ShowLoading( (NUM_CIRCLES - NUM_BIOPHAGES) + ' pathogens destroyed in ' + diff_seconds + ' seconds', 3);

	StartTime = new Date();
	start_hours = StartTime.getHours();
	start_minutes = StartTime.getMinutes();
	start_seconds = StartTime.getSeconds();
}

function LoadImageInitially() {
	var ctx = document.getElementById('canvas').getContext('2d');
	var img = new Image();
	img.onload = function(){
		ctx.drawImage(img,0,0);
	}
	img.src = images[which_image];
}

function DrawRefresh(X, Y) {
	var ctx = document.getElementById('canvas').getContext('2d');
	var img = new Image();
	img.onload = function() {
		//ctx.rotate(1);
		ctx.drawImage(img,0,0);

		// draw chewed sections
		for (i = 0; i < NUM_CHEWED; i++) {
			ctx.fillStyle="rgb(" + (50 + chewedC[i]) + "," + (75 + chewedC[i]) + "," + (100 + chewedC[i]) + ")";
			ctx.globalAlpha = 0.2;
			ctx.beginPath();
			ctx.arc(chewedX[i], chewedY[i], chewedR[i], 0, 2*Math.PI);
			ctx.closePath();
			ctx.fill();
		}
		ctx.globalAlpha = 1.0;  // reset

		// draw pointer
		if (DESTROY_MODE == 0) { var beam_color = "rgb(255,255,0)"; }  // yellow
		else { var beam_color = "rgb(150,200,255)"; }  // blueish-white
		ctx.globalAlpha = 0.4;
		ctx.fillStyle = beam_color;
		ctx.beginPath();
		ctx.arc(X,Y,YOUR_RADIUS,0,2*Math.PI);
		ctx.closePath();
		ctx.fill();

		// draw inner glow around pointer
		ctx.fillStyle = beam_color;
		ctx.globalAlpha = 0.3;
		ctx.beginPath();
		ctx.arc(X,Y,YOUR_RADIUS * 3,0,2*Math.PI);
		ctx.closePath();
		ctx.fill();

		// draw middle glow around pointer
		ctx.fillStyle = beam_color;
		ctx.globalAlpha = 0.2;
		ctx.beginPath();
		ctx.arc(X,Y,YOUR_RADIUS * 5,0,2*Math.PI);
		ctx.closePath();
		ctx.fill();

		// draw outer glow around pointer
		ctx.fillStyle = beam_color;
		ctx.globalAlpha = 0.1;
		ctx.beginPath();
		ctx.arc(X,Y,YOUR_RADIUS * 7,0,2*Math.PI);
		ctx.closePath();
		ctx.fill();

		ctx.globalAlpha = 1.0;  // reset

		// ability to destroy cells with mouse pointer
		if (DESTROY_MODE == 1) {
			c = CheckCollisions(X, Y, YOUR_RADIUS);
			if (c > 0) {
				r = CheckIfAnyLeft();
				if (r == false) {
					InitializeWall();
					InitializeArray();
				}
			}
		}

		if (NUM_BIOPHAGES > 0) {
			c = CheckBiophageCollisions();
			if (c > 0) {
				r = CheckIfAnyLeft();
				if (r == false) {
					InitializeWall();
					InitializeArray();
				}
			}
		}

		// draw circles
		for (i = 0; i < NUM_CIRCLES; i++) {
			if (ax[i] > 0 || ay[i] > 0) {
				// outer circle
				ctx.fillStyle="rgb(" + ac1[i] + "," + ac2[i] + "," + ac3[i] + ")";
				ctx.beginPath();
				ctx.arc(ax[i], ay[i], ar[i], 0, 2*Math.PI);
				ctx.closePath();
				ctx.fill();
				// inner circle
				if (ar[i] > ari[i]) {
					ctx.fillStyle="rgb(" + aci1[i] + "," + aci2[i] + "," + aci3[i] + ")";
					ctx.beginPath();
					ctx.arc(ax[i], ay[i], (ari[i]), 0, 2*Math.PI);
					ctx.closePath();
					ctx.fill();
				}
			}
		}

		var temperature_offset = 0;
		if (TEMPERATURE < 1) { temperature_offset = 22; }

		// draw wall
		ctx.lineWidth = 3;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.fillStyle="rgb(34,139,34)";
		ctx.beginPath(wx[0], wy[0]);
		for (i = 0; i < NUM_WALL_LINES; i++) {
			ctx.strokeStyle="rgb(" + (wc1[i] + temperature_offset) + "," +
				(wc2[i] + temperature_offset) + "," +
				(wc3[i] + temperature_offset) + ")";
			ctx.fillStyle="rgb(" + (wc1[i] + 0 + temperature_offset) + "," +
				(wc2[i] + 25 + temperature_offset) + "," +
				(wc3[i] + 15 + temperature_offset) + ")";
			ctx.quadraticCurveTo( wallX + wx[i] + wo[i], wallY + wy[i] + wo[i], wallX + wx[i], wallY + wy[i]);
			ctx.stroke();
			r = Math.random();
			if (r < 0.97) { ctx.fill(); }
			ctx.closePath();
			ctx.beginPath( wallX + wx[i], wallY + wy[i]);
			ctx.moveTo( wallX + wx[i], wallY + wy[i]);
		}
		ctx.quadraticCurveTo( wallX + wx[i] + wo[i], wallY + wy[i] + wo[i], wallX + wx[0], wallY + wy[0]);  // connect back to first point

		// draw border
		ctx.lineWidth = 6;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.strokeStyle="rgb(" + (Math.round(Math.random() * 10) + 29 + temperature_offset) + "," +
			(Math.round(Math.random() * 10) + 134 + temperature_offset) + "," +
			(Math.round(Math.random() * 10) + 29 + temperature_offset) + ")";
		var tmpoffset = Math.round(Math.random() * 6);
		var tmp = Math.round(Math.random() * 350);
		ctx.beginPath(15, 15);
		ctx.lineTo(15, 15);
		ctx.quadraticCurveTo( (100 + tmp), (12 + tmpoffset), 580, 15);
		ctx.quadraticCurveTo( (577 + tmpoffset), (50 + tmp), 580, 425);
		ctx.quadraticCurveTo( (100 + tmp), (422 + tmpoffset), 15, 425);
		ctx.quadraticCurveTo( (12 + tmpoffset), (50 + tmp), 15, 15);
		ctx.stroke();

	};
	img.src = images[which_image];
}

function GetMouseClick(event) {
	var x = event.clientX;
	var y = event.clientY;
	var canvas = document.getElementById("canvas");
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	wallX = x;
	wallY = y;
}

function ReleasePhage() {
	if (NUM_BIOPHAGES < MAX_BIOPHAGES) {
		SpawnBiophage();
	}
}

function TrackPosition(event) {
	var x = event.clientX;
	var y = event.clientY;
	var canvas = document.getElementById("canvas");
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	LastX = x;
	LastY = y;

	AdjustCircles(x, y);
	CheckSpawning();
	DrawRefresh(x, y);
}

function CheckTime() {
	AdjustCircles(LastX, LastY);
	CheckSpawning();
	RefreshScore();
	DrawRefresh(LastX, LastY);
}

function ShowLoading(msg, secs) {
	if (msg.length < 100) {  // not instructions
		var extra = 18 - (msg.length / 2);
		for (i = 0; i < extra; i++) {
			msg = "&nbsp;" + msg;
		}
		msg = "<br/><br/><br/><br/><br/><br/>" + msg;
	}
	document.getElementById("loading").style.display = "block";
	document.getElementById("loading").innerHTML = msg;
	document.getElementById('canvas').style.opacity = 0.2;
	setTimeout( function() { FinishLoading() }, 1000 * secs);
}

function FinishLoading() {
	document.getElementById("canvas").style.opacity = 1.0;
	document.getElementById("loading").style.display = "none";
}

function LoadScreen() {
	document.write("<div id=mainbox name=mainbox class=box>");
	document.write("<h3><Biophage/h3>");
	document.write("<canvas id=canvas width='601' height='444''><p>Sorry: Browser does not support Graphics Canvas</p></canvas>");
	document.write("</div>");
	document.write("<div id=sound></div>");
	document.write("<div id=sound2></div>");
	document.write("<div id=loading style='position:absolute;left:109px;top:175px;display:block'></div>");
}

eaten = 0;
NUM_CIRCLES = 90;
NUM_BIOPHAGES = 0;
MAX_CIRCLES = 500;
MAX_BIOPHAGES = 5;
SPAWN_RATE = 0.0002;
AVOID_RATE = 0.1;
YOUR_RADIUS = 7;
NUM_WALL_LINES = 17;
DESTROY_MODE = 0;
TEMPERATURE = 1;
beam_color = "";
LastX = 0;
LastY = 0;
wallX = 200;
wallY = 200;
which_image = 0;
NUM_CHEWED = 0;
MAX_CHEWED = 1000;

images = new Array (
	"http://blackgoldcompost.net/images/LeafBackground_227325_1800x1205_50.jpg"
);
NUM_IMAGES = 2;

// bacteria properties
ax = new Array();  // x coordinate
ay = new Array();  // y coordinate
ar = new Array();  // radius
ari = new Array();  // inner circle radius (appearance only)
as1 = new Array();  // evasion speed
as2 = new Array();  // hover speed
ac1 = new Array();  // outer circle color r
ac2 = new Array();  // outer circle color g
ac3 = new Array();  // outer circle color b
aci1 = new Array();  // inner circle color r
aci2 = new Array();  // inner circle color g
aci3 = new Array();  // inner circle color b
ah = new Array();  // hover probability
at = new Array(); // type (0 = pathogen, 1 = biophage)
ak = new Array(); // unkillable by phages

// wall properties
wx = new Array(); // x coordinate offsets for wall lines to draw
wy = new Array(); // y coordinate offsets for wall lines to draw
wo = new Array(); // xy coordinate offsets for Bezier control point in quadratic curve of wall line to draw
wc1 = new Array(); // r colors of wall lines to draw
wc2 = new Array(); // g colors of wall lines to draw
wc3 = new Array(); // b colors of wall lines to draw

// chewed section properties
chewedX = new Array();  // x coordinate
chewedY = new Array();  // y coordinate
chewedR = new Array();  // radius
chewedC = new Array();  // color offset

InitializeWall();
InitializeArray();
LoadScreen();
LoadImageInitially();

StartTime = new Date();
start_hours = StartTime.getHours();
start_minutes = StartTime.getMinutes();
start_seconds = StartTime.getSeconds();

canvas.addEventListener("click", GetMouseClick, false);
canvas.addEventListener("mousemove", TrackPosition, false);

setInterval( function() { CheckTime() }, 100);

ShowLoading("Loading...", 3);
PlaySound(1);

</script>