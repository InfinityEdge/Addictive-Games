window.addEventListener("load",function() {
var lose=false;
var Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
        .setup( "myGame" ).touch();


Q.input.touchControls({
  controls:  [ [ ],
               [ ],
               ['up', ' ▲ ' ]]
});

var SPRITE_OBJECT = 1;
var SPRITE_PLAYER = 11;

Q.gravityY = 2000;

var player = Q.Sprite.extend("Player",{

  init: function(p) {

    this._super(p,{
      sheet: "player",
      sprite: "player",
      collisionMask: SPRITE_OBJECT,
      type: SPRITE_PLAYER,  
      x: 40,
      y: 107,
      speed: 200,
      jump: -400
    });

    
    this.add("2d, animation");
  },

  step: function(dt) {
    this.p.vx += (this.p.speed - this.p.vx)/4;

    if(this.p.y > 107) {
      this.p.y = 107;
      this.p.landed = 1;
      this.p.vy = 0;
    } else {
      this.p.landed = 0;
    }

    if(Q.inputs['up'] && this.p.y > -20) {
      this.p.vy = this.p.jump;
    } 


      this.play("fly");
    this.stage.viewport.centerOn(this.p.x + 120 , 0 );

  }
});

Q.Sprite.extend("Coin",{
  init: function() {

    var levels = [ 100, 80, 60, 40, 20, 0, -20, -40 ];

    var player = Q("Player").first();
    this._super({
      x: player.p.x + Q.width -20,
      y: levels[Math.floor(Math.random() * levels.length)],
      frame: 0,
      scale: 2,
      type: SPRITE_OBJECT,
      collisionMask: SPRITE_PLAYER,
      sheet: "coin",
      vx: -150 + 200 * Math.random(),
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
    var player = Q("Player").first();
    if(this.p.x < player.p.x-80) { this.destroy(); }

  },

  hit: function() {
    this.p.type = 0;
    this.p.vx = 200;
    this.p.ay = 400;
    this.p.vy = -300;
    this.p.opacity = 0.5;
    if (!lose) Q.state.inc("score",10);
  }
  

});


Q.Sprite.extend("Fireball",{
  init: function() {

    var levels = [ 100, 80, 60, 40, 20, 0, -20, -40 ];

    var player = Q("Player").first();
    this._super({
      x: player.p.x + Q.width -20,
      y: levels[Math.floor(Math.random() * levels.length)],
      frame:  0,
      scale: 2,
      type: SPRITE_OBJECT,
      collisionMask: SPRITE_PLAYER,
      sheet: "fireball",
      vx: -250 + 200 * Math.random(),
      vy: 0,
      ay: 0,
      theta: (400 * Math.random() + 200) * (Math.random() < 0.5 ? 1 : -1)
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
    var player = Q("Player").first();
    if(this.p.x < player.p.x-80) { this.destroy(); }

  },

  hit: function() {
    
    this.p.type = 0;
    this.p.vx = 200;
    this.p.ay = 400;
    this.p.vy = -300;
    this.p.opacity = 0.5;
    if (window.localStorage.getItem("score") == null) window.localStorage.setItem("score",Q.state.get("score"));
    if (parseInt(window.localStorage.getItem("score")) < parseInt(Q.state.get("score"))) window.localStorage.setItem("score",Q.state.get("score"));
    $("#highScore").html("High Score : "+window.localStorage.getItem("score"));
    Q.stageScene("endGame",1, { label: "Score: "+Q.state.get("score")+"" });
  }
  

});



Q.GameObject.extend("FireballThrower",{
  init: function() {
    this.p = {
      launchDelay: 0.5,
      launchRandom: 1,
      launch: 1
    }
  },

  update: function(dt) {
    this.p.launch -= dt;

    if(this.p.launch < 0) {
      this.stage.insert(new Q.Fireball());
      this.p.launch = this.p.launchDelay + this.p.launchRandom * Math.random();
    }
  }

});


Q.GameObject.extend("CoinThrower",{
  init: function() {
    this.p = {
      launchDelay: 0.75,
      launchRandom: 1,
      launch: 5
    }
  },

  update: function(dt) {
    this.p.launch -= dt;

    if(this.p.launch < 0) {
      this.stage.insert(new Q.Coin());
      this.p.launch = this.p.launchDelay + this.p.launchRandom * Math.random();
    }
  }

});


Q.GameObject.extend("FireballSupportThrower",{
  init: function() {
    this.p = {
      launchDelay: 0.75,
      launchRandom: 1,
      launch: 3
    }
  },

  update: function(dt) {
    this.p.launch -= dt;

    if(this.p.launch < 0) {
      this.stage.insert(new Q.Coin());
      this.p.launch = this.p.launchDelay + this.p.launchRandom * Math.random();
    }
  }

});

Q.UI.Text.extend("Score",{ 
  init: function(p) {
    document.getElementById("score").innerHTML = "Score: 0";
    var player = Q("Player").first();
    this._super({
      label: "",
      x: 160,
      y: -35
    });

    Q.state.on("change.score",this,"score");
  },

  score: function(score) {
    document.getElementById("score").innerHTML = "Score: " + score;
    this.p.label = "";
  }
});



Q.scene('endGame',function(stage) {
  lose = true;
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));
  
  var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                           label: "Play Again" }));         
  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                        label: stage.options.label }));
  button.on("click",function() {
    Q.clearStages();
    Q.stageScene('level1');
  });
  box.fit(20);
  console.log("ko");
});


Q.scene("level1",function(stage) {
  lose=false;
  stage.insert(new Q.Repeater({ asset: "background-wall.png",
                                speedX: 0.5,
                                repeatY: false,
                                y: -80}));

  stage.insert(new Q.Repeater({ asset: "background-floor.png",
                                repeatY: false,
                                speedX: 1.0,
                                y: 60 }));
  stage.insert(new Q.Score());
  stage.insert(new Q.CoinThrower());
  stage.insert(new Q.FireballThrower());
  stage.insert(new Q.Player());
  Q.state.set({ score: 0, lives: 2, lose: false });
  stage.add("viewport");

});
  



Q.load("player.png, background-wall.png, background-floor.png, coin.png, fireball.png", function() {
    Q.sheet("player","player.png",{"sx":0,"sy":0,"tilew":32,"tileh":27});
    Q.sheet("coin","coin.png",{"sx":0,"sy":0,"tilew":12,"tileh":12});
    Q.sheet("fireball","fireball.png",{"sx":0,"sy":0,"tilew":12,"tileh":12});
    Q.animations("player", {
      fly: { frames: [0,1,2], rate: 1/15, flip: false, loop: false }
    });
    Q.stageScene("level1");
  
});


});
