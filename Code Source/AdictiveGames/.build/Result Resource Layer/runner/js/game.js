window.addEventListener("load",function() {
var score = 0;
var timer;

var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
        .setup("quintus",{ maximize: true }).touch();

Q.input.touchControls({
	  controls:  [ ['up', ' ▲ ' ],
	               [ ],
	               [ ],
	               ['down', ' ▼ ' ]]
	});

timer = setInterval(function(){
	score++;
	$("#score").html("&nbsp;&nbsp;Score : "+score);
}, 700);

var SPRITE_BOX = 1;

Q.gravityY = 2000;

Q.Sprite.extend("Player",{

  init: function(p) {

    this._super(p,{
      sheet: "player",
      sprite: "player",
      collisionMask: SPRITE_BOX, 
      x: 40,
      y: 180,
      standingPoints: [ [ -16, 44], [ -23, 35 ], [-23,-48], [23,-48], [23, 35 ], [ 16, 44 ]],
      duckingPoints : [ [ -16, 44], [ -23, 35 ], [-23,-10], [23,-10], [23, 35 ], [ 16, 44 ]],
      speed: 200,
      jump: -700
    });

    this.p.points = this.p.standingPoints;

    this.add("2d, animation");
  },

  step: function(dt) {
    this.p.vx += (this.p.speed - this.p.vx)/4;

    if(this.p.y > 180) {
      this.p.y = 180;
      this.p.landed = 1;
      this.p.vy = 0;
    } else {
      this.p.landed = 0;
    }

    if(Q.inputs['up'] && this.p.landed > 0) {
      this.p.vy = this.p.jump;
    } 

    this.p.points = this.p.standingPoints;
    if(this.p.landed) {
      if(Q.inputs['down']) { 
        this.play("duck_right");
        this.p.points = this.p.duckingPoints;
      } else {
        this.play("walk_right");
      }
    } else {
      this.play("jump_right");
    }

    this.stage.viewport.centerOn(this.p.x+50, 160 );

  }
});

Q.Sprite.extend("Box",{
  init: function() {

    var levels = [ 220, 210, 100, 95, 105, 200 ];

    var player = Q("Player").first();
    this._super({
      x: player.p.x + Q.width + 50,
      y: levels[Math.floor(Math.random() * 3)],
      frame: Math.random() < 0.5 ? 1 : 0,
      scale: 2,
      type: SPRITE_BOX,
      sheet: "crates",
      vx: -600 + 200 * Math.random(),
      vy: 0,
      ay: 0,
      theta: (300 * Math.random() + 200) * (Math.random() < 0.5 ? 1 : -1)
    });


    this.on("hit");
  },

  step: function(dt) {
    this.p.x += this.p.vx * dt;


    this.p.vy += this.p.ay * dt;
    this.p.y += this.p.vy * dt;
    if(this.p.y != 565) {
      this.p.angle += this.p.theta * dt;
    }

    if(this.p.x < 0) { this.destroy(); }

  },

  hit: function() {
    this.p.type = 0;
    this.p.collisionMask = Q.SPRITE_NONE;
    this.p.vx = 200;
    this.p.ay = 400;
    this.p.vy = -300;
    this.p.opacity = 0.5;
    clearInterval(timer);
    window.sessionStorage.setItem("thisScore", score);
    if (window.localStorage.getItem("highScore") == null)
    window.localStorage.setItem("highScore", score);
    else if (parseInt(window.localStorage.getItem("highScore"))< score) window.localStorage.setItem("highScore", score);
    $("#youLose").css("display","block");
  }
  

});

Q.GameObject.extend("BoxThrower",{
  init: function() {
    this.p = {
      launchDelay: 1.5,
      launchRandom: 1,
      launch: 2
    }
  },

  update: function(dt) {
    this.p.launch -= dt;

    if(this.p.launch < 0) {
      this.stage.insert(new Q.Box());
      this.p.launch = this.p.launchDelay + this.p.launchRandom * Math.random();
    }
  }

});


Q.scene("level1",function(stage) {

  stage.insert(new Q.Repeater({ asset: "background-wall.png",
                                speedX: 0.5,
                                y: 0 }));

  stage.insert(new Q.Repeater({ asset: "background-floor.png",
                                repeatY: false,
                                speedX: 1.0,
                                y: 113 }));

  stage.insert(new Q.BoxThrower());

  stage.insert(new Q.Player());
  stage.add("viewport");

});
  
Q.load("player.png, background-wall.png, background-floor.png, crates.png", function() {
	 Q.sheet("player","player.png",{"sx":0,"sy":0,"tilew":72,"tileh":98});
	 Q.sheet("crates","crates.png",{"sx":0,"sy":0,"tilew":32,"tileh":32});
    Q.animations("player", {
    
      walk_right: { frames: [0,1,2,3,4,5,6,7,8,9,10], rate: 1/15, flip: false, loop: true },
      jump_right: { frames: [13], rate: 1/10, flip: false },
      stand_right: { frames:[14], rate: 1/10, flip: false },
      duck_right: { frames: [15], rate: 1/10, flip: false },
    });
    Q.stageScene("level1");
  
});


});
