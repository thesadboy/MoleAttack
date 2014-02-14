(function($, window) {
	var MoleAttack = window.MoleAttack = function() {
		this.container = $('<div id="mole-attack"><div id="stage"></div></div>');
		this.stage = this.container.find('#stage');
		this.holes = [];
		this.leavel = 1;
		return this.init();
	};
	MoleAttack.prototype = {
		init: function() {
			$(document.body).append(this.container);
			this.holes.push(new Hole(this.stage, 90, 60, 135, this.hit));
			this.holes.push(new Hole(this.stage, 90, 200, 130, this.hit));
			this.holes.push(new Hole(this.stage, 90, 350, 140, this.hit));
			this.holes.push(new Hole(this.stage, 90, 500, 135, this.hit));
			this.holes.push(new Hole(this.stage, 90, 650, 130, this.hit));

			this.holes.push(new Hole(this.stage, 135, 80, 270, this.hit));
			this.holes.push(new Hole(this.stage, 135, 250, 260, this.hit));
			this.holes.push(new Hole(this.stage, 135, 430, 275, this.hit));
			this.holes.push(new Hole(this.stage, 135, 610, 260, this.hit));

			this.holes.push(new Hole(this.stage, 170, 120, 395, this.hit));
			this.holes.push(new Hole(this.stage, 170, 320, 400, this.hit));
			this.holes.push(new Hole(this.stage, 170, 520, 390, this.hit));
		},
		start: function() {
			var self = this;
			var hNum = this.holes.length;
			var max = this.leavel + 1 > hNum / 2 ? hNum / 2 : this.leavel + 1;
			var speed = 3000 / (this.leavel + 1);
			setInterval(function() {
				var mNum = Utils.random(1, max);
				var shown = [];
				while (mNum > 0) {
					var current = Utils.random(0, hNum - 1);
					if (shown.indexOf(current) < 0) {
						mNum--;
						shown.push(current);
						var hole = self.holes[current];
						hole.show();
						setTimeout(function() {
							hole.hide();
						}, speed);
					}
				}
			}, speed);
		},
		hit: function() {}
	};

	function Hole(parent, width, left, top, cb) {
		this.scale = 95 / 210; //height:width
		this.parent = parent;
		this.shown = '9.52631578947368%';
		this.hidden = '-56.14035087719298%';
		this.element = $('<div class="hole"><div class="hole-top"></div><div class="mouse-container"><div class="mouse-normal"></div><div class="mouse-hit"></div></div><div class="hole-bottom"></div></div>');
		this.nMouse = this.element.find('div.mouse-normal');
		this.hMouse = this.element.find('div.mouse-hit');
		this.cb = cb;
		this.width = width;
		this.left = left;
		this.top = top;
		this.isHit = false;
		return this.init();
	};
	Hole.prototype = {
		init: function() {
			var self = this;
			this.element.css({
				width: this.width,
				height: this.width * this.scale,
				left: this.left,
				top: this.top
			});
			this.reset();
			this.nMouse.on('click', function(e) {
				self.hit();
			});
			this.parent.append(this.element);
		},
		reset: function() {
			this.nMouse.css({
				bottom: this.hidden
			}).show();
			this.hMouse.css({
				bottom: this.hidden
			}).show();
		},
		show: function() {
			this.nMouse.animate({
				bottom: this.shown
			}, 100);
		},
		showHit: function() {
			this.hMouse.css({
				bottom: this.shown
			}).show();
		},
		hide: function() {
			var self = this;
			this.nMouse.animate({
				bottom: this.hidden
			}, 100, function() {
				self.reset();
			});
		},
		hideHit: function() {
			var self = this;
			this.hMouse.animate({
				bottom: this.hidden
			}, 100, function() {
				self.reset();
			});
		},
		hit: function() {
			var self = this;
			this.nMouse.hide();
			this.showHit();
			setTimeout(function() {
				self.hide();
				self.cb.call();
			}, 1000);
		}
	}
	var Utils = {
		random: function(under, over) {
			switch (arguments.length) {
				case 1:
					return parseInt(Math.random() * under + 1);
				case 2:
					return parseInt(Math.random() * (over - under + 1) + under);
				default:
					return 0;
			}
		}
	};
})(jQuery, window);

$(function() {
	var game = new MoleAttack();
	game.start();
});