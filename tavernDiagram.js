'use strict'

var tavernDiagram = {
	targetCanvas: null,
	sectorWidth: null,
	sectorAngleOffset: 0,
	sectorValueArray: [],
	sectorAngleLeftLimitArray: [],
	sectorAngleRightLimitArray: [],
	
	init: function (options) {
		this.targetCanvas = document.getElementById(options.targetId);
		this.sectorWidth = options.sectorWidth || this.targetCanvas.width && this.targetCanvas.width / 10;
		this.sectorAngleOffset = options.offset || 0;
		this.sectorValueArray = options.initValueArray || [];	
	},

	draw: function () {
		var context = this.targetCanvas.getContext('2d');
		context.clearRect(0, 0, this.targetCanvas.width, this.targetCanvas.height);
		this.calculateSectors();
		for( var i = 0; i < this.sectorValueArray.length; i++ ) {
			this.drawSector(i);
		}
		this.drawCenterCircle();
	},

	drawSector: function (i) {
		var context = this.targetCanvas.getContext('2d');
		context.beginPath()
		context.moveTo(this.getX0(), this.getY0());
		context.fillStyle = Color.random(); 
		context.arc(this.getX0(), this.getY0(), this.getMaxRadius(), this.sectorAngleLeftLimitArray[i].toRad(), this.sectorAngleRightLimitArray[i].toRad(), true); 
		context.lineTo(this.getX0(),this.getY0());
		context.fill();
	},

	drawCenterCircle: function () {
		var context = this.targetCanvas.getContext('2d');
		context.beginPath()
		context.moveTo(this.getX0(), this.getY0());
		context.fillStyle = 'white'; 
		context.arc(this.getX0(), this.getY0(), this.getMinRadius(), 0, 2*Math.PI, true); 
		context.fill()
	},

	getX0: function () {
		return this.targetCanvas.width / 2;
	},

	getY0: function () {
		return this.targetCanvas.height / 2;
	},

	getMaxRadius: function () {
		return Math.min(this.getX0(), this.getY0())
	},

	getMinRadius: function () {
		return this.getMaxRadius() - this.sectorWidth;
	},

	addSector: function (value, forceDraw = false) {
		value = parseInt(value) || null;
		if(!value) return;
		this.sectorValueArray.push(value);
		if(forceDraw) this.draw();
	},

	calculateSectors: function () {
		var currentOffset = this.sectorAngleOffset;
		this.sectorAngleLeftLimitArray = [];
		this.sectorAngleRightLimitArray = [];
		for( var i = 0; i < this.sectorValueArray.length; i++ ) {
			var sectorAngle = this.getAngleBySectorNumber(i);
			this.sectorAngleLeftLimitArray[i] = sectorAngle + currentOffset;
			this.sectorAngleRightLimitArray[i] = this.sectorAngleLeftLimitArray[i] - sectorAngle;
			currentOffset = this.sectorAngleLeftLimitArray[i];
		}
	},


	getAngleBySectorNumber: function (sectorNumber) {
		var value = this.sectorValueArray[sectorNumber] || null;
		var totalValue = 0;
		this.sectorValueArray.forEach((el) => {totalValue += el})
		var angle = 360 * value / totalValue;
		return angle;
	}
}

Number.prototype.toRad = function () { return this * (Math.PI / 180); };
Number.prototype.toDeg = function () { return this * (180 / Math.PI); };

var Color = {
	random: function() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
}