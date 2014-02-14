(function($, window) {
	var MoleAttack = window.MoleAttack = function() {
		this.container = $('<div id="mole-attack"><div id="stage"></div></div>');
		this.stage = this.container.find('#stage');
		this.holes = [];
		this.leavel = 0;
		this.score = 0;
		this.scorePerMouse = 100;
		this.timeLeft = 60;
		this.timer = null;
		this.mouseTimer = null;
		this.minMouseNum = 1;
		this.maxMouseNum = 4;
		return this.init();
	};
	MoleAttack.prototype = {
		init: function() {
			var self = this;
			$(document.body).append(this.container);
			// 第一排
			this.holes.push(new Hole(this.stage, 90, 60, 135, function() {
				self.hit();
			}));
			this.holes.push(new Hole(this.stage, 90, 200, 130, function() {
				self.hit();
			}));
			this.holes.push(new Hole(this.stage, 90, 350, 140, function() {
				self.hit();
			}));
			this.holes.push(new Hole(this.stage, 90, 500, 135, function() {
				self.hit();
			}));
			this.holes.push(new Hole(this.stage, 90, 650, 130, function() {
				self.hit();
			}));
			//第二排
			this.holes.push(new Hole(this.stage, 135, 80, 270, function() {
				self.hit();
			}));
			this.holes.push(new Hole(this.stage, 135, 250, 260, function() {
				self.hit();
			}));
			this.holes.push(new Hole(this.stage, 135, 430, 275, function() {
				self.hit();
			}));
			this.holes.push(new Hole(this.stage, 135, 610, 260, function() {
				self.hit();
			}));
			//第三排
			this.holes.push(new Hole(this.stage, 170, 120, 395, function() {
				self.hit();
			}));
			this.holes.push(new Hole(this.stage, 170, 320, 400, function() {
				self.hit();
			}));
			this.holes.push(new Hole(this.stage, 170, 520, 390, function() {
				self.hit();
			}));
		},
		start: function() {
			var self = this;
			var speed = this.getIntervalSpeed();
			var hideSpeed = this.getHideSpeed();
			this.mouseTimer = setInterval(function() {
				var mouseNum = Utils.random(self.minMouseNum, self.maxMouseNum);
				var shown = [];
				while (mouseNum > 0) {
					var current = Utils.random(0, self.holes.length - 1);
					if (shown.indexOf(current) < 0 && !self.holes[current].isShown) {
						mouseNum--;
						var hole = self.holes[current];
						hole.show();
						setTimeout(function() {
							hole.hide();
						}, hideSpeed);
					}
				}
			}, speed);
			//计时
			this.timer = setInterval(function() {
				self.timeLeft--;
				self.updateData();
				if (self.timeLeft <= 0) {
					self.gameOver();
				}
			}, 1000);
		},
		getIntervalSpeed: function() {
			var speed = 5000;
			speed = (speed - this.leavel * 500) >= 1000 ? (speed - this.leavel * 500) : speed / this.leavel;
			return speed;
		},
		getHideSpeed: function() {
			var speed = 3000;
			speed = (speed - this.leavel * 500) >= 1000 ? (speed - this.leavel * 500) : speed / this.leavel;
			return speed;
		},
		updateData: function() {
			console.log(this.timeLeft);
			console.log(this.score);
		},
		hit: function() {
			this.score += this.scorePerMouse;
			this.updateData();
			this.upgrade();
		},
		upgrade: function() {
			if (this.score >= (2400 + this.leavel * this.leavel * 100)) {
				//升级，清空准备进入下级游戏
				this.score = 0;
				this.leavel++;
				for (var i = 0, size = this.holes.length; i < size; i++) {
					this.holes[i].reset();
				}
				if (this.timer) clearInterval(this.timer);
				if (this.mouseTimer) clearInterval(this.mouseTimer);
				this.updateData();
				if (confirm('是否进行下一关游戏？')) {
					this.start();
				}
			}
		},
		gameOver: function() {
			for (var i = 0, size = this.holes.length; i < size; i++) {
				this.holes[i].reset();
			}
			if (this.timer) clearInterval(this.timer);
			if (this.mouseTimer) clearInterval(this.mouseTimer);
		}
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
		this.isShown = false;
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
			self.cb.call();
			setTimeout(function() {
				self.hide();
			}, 1000);
		}
	}
	var Utils = {
		random: function(min, max) {
			switch (arguments.length) {
				case 1:
					return parseInt(Math.random() * min + 1);
				case 2:
					return parseInt(Math.random() * (max - min + 1) + min);
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