window.addEventListener("load",function() {
var score = 0;
var timer;
var lost = false;
var counter = 0; 

var thread2 = setInterval(function(){
	counter += 1;
  $.each( $( "img" ), function() {
	   if (parseInt(new Date($(this).attr("id")).getTime()) < new Date().getTime()-Math.floor(4000-counter))
		   {
		   	lost = true;
		   	$("#youLose").css("display","block");
        window.localStorage.setItem("thisScoreFontom", score);
    if (window.localStorage.getItem("highScoreFontom") == null)
    window.localStorage.setItem("highScoreFontom", score);
    else if (parseInt(window.localStorage.getItem("highScoreFontom"))< score) window.localStorage.setItem("highScoreFontom", score);
		   }
	});
}, 20);
var thread = setInterval(function (){
	var rand = Math.floor(Math.random()*100);
	if (!lost)
		{
		if (rand >-1 && rand < 20)
	$("body").append("<img id=' "+new Date()+"' style='position: absolute; top : 120px; right: 20px' src='images/spooky.png' class='tr1'>");
		if (rand >30 && rand < 50)
		$("body").append("<img id=' "+new Date()+"' style='position: absolute; top : 120px; right: 100px' src='images/spooky.png' class='tr2'>");
		if (rand >60 && rand < 80)
		$("body").append("<img id=' "+new Date()+"' style='position: absolute; top : 120px; left: 80px' src='images/spooky.png' class='tr3'>");
		if (rand >90)
		$("body").append("<img id=' "+new Date()+"' style='position: absolute; top : 120px; left: 20px' src='images/spooky.png' class='tr4'>");
		}
		}, 200);

var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
        .setup("quintus",{ maximize: true }).touch();

Q.input.touchControls({
	  controls:  [ ['up', ' ▲ ' ],
	               ['left', ' ▲ ' ] ,
	               ['fire', ' ▲ '],
	               ['down', ' ▲ ' ]]
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
      y: 1480,
      standingPoints: [ [ -16, 44], [ -23, 35 ], [-23,-48], [23,-48], [23, 35 ], [ 16, 44 ]],
      duckingPoints : [ [ -16, 44], [ -23, 35 ], [-23,-10], [23,-10], [23, 35 ], [ 16, 44 ]],
      speed: 200,
      jump: 0
    })

    this.p.points = this.p.standingPoints;

    this.add("2d, animation");
  },

  step: function(dt) {

      if(Q.inputs['down']) { 
      $('.tr1').remove();
      }
      if(Q.inputs['fire']) { 
          $('.tr2').remove();
          }
      if(Q.inputs['left']) { 
          $('.tr3').remove();
          }
      if(Q.inputs['up']) { 
          $('.tr4').remove();
          }
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

    if(this.p.y > 800) { this.destroy(); }

  },

  hit: function() {
    
  }
  

});

Q.GameObject.extend("BoxThrower",{
  init: function() {
    this.p = {
      launchDelay: 1.1,
      launchRandom: 1,
      launch: 2
    }
  },

  update: function(dt) {
   

    if(this.p.launch < 0) {
      this.stage.insert(new Q.Box());
      //this.p.launch = this.p.launchDelay + this.p.launchRandom * Math.random();
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
