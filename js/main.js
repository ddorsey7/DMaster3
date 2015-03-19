window.onload = function()
{
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    //var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
	var game = new Phaser.Game(1600, 1200, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update});// render: render });
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'ball', 'assets/bomb.png' );
		game.load.image( 'dude', 'assets/jet.png' );
		game.load.image( 'box', 'assets/ibg.jpg' );
		
		game.load.image( 'cop', 'assets/police.png');
		
		game.load.audio('boden', 'assets/Power.m4a');
		
    }
    
    var bouncy;
    
    var image;
	var knocker;
	var cursors;
	var balls;
	var cop;
	
	var score;
	var scoreString = '';
	var scoreText;
	var stateText;
	
	var time;
	var timeString="Time: ";
	var timeText;
	
	var bg;
	
	var flag=true;
	
	var music;
	
	var startTime;

	function create() {
		//background
		bg = game.add.tileSprite(0, 0, 1600, 1200, 'box');

		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 200;
		game.time.events.loop(150, fire, this);
		
		//music
		
		startTime=game.time.time;

		cursors = game.input.keyboard.createCursorKeys();
    
		//  This creates a simple sprite that is using our loaded image and
		//  displays it on-screen
		//  and assign it to a variable
		balls = game.add.group();
		balls.createMultiple(3, 'ball', 0, false);
		
		// The score
		score=0;
		scoreString = 'Score : ';
		scoreText = game.add.text(10, 10, scoreString + score, { font: '68px Arial', fill: '#fff' });
		
		//Timer
		//var gameRT=(Math.floor(game.time.time / 1000) % 60);
		time=0;//-gameRT;
		timeText = game.add.text(1000, 10, timeString + time, { font: '68px Arial', fill: '#fff' });
		
		//  Text
		stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
		stateText.anchor.setTo(0.5, 0.5);
		stateText.visible = false;
		
		
		knocker = game.add.sprite(game.world.centerX,game.world.centerY, 'dude');
		//cop = game.add.sprite(game.rnd.integerInRange(100, 700), game.rnd.integerInRange(32, 200), 'cop');
		game.physics.enable([knocker,balls], Phaser.Physics.ARCADE);
		//knocker.body.immovable = true;
		knocker.anchor.setTo(0.5,0.5);//new code
		knocker.body.collideWorldBounds = true;
		knocker.body.allowRotation= false;//new code
		knocker.body.allowGravity = 0;
		
		music = game.add.audio('boden');
		music.play();
		
		//cop code
		//cop.anchor.setTo(0.5,0.5);//new code
		//cop.body.collideWorldBounds = true;
		//cop.body.allowRotation= false;//new code

		//This gets it moving
		//balls.setAll('body.collideWorldBounds', true);
		//balls.setAll('body.bounce.x', 1);
		//balls.setAll('body.bounce.y', 1);
		//balls.setAll('body.minBounceVelocity', 0);
	}

	//Move the knocker with the arrow keys
	function update () {
		//time
		updateTime();
		//score keeper
		game.physics.arcade.collide(knocker, balls, hit, null, this);
		//Cop hit
		game.physics.arcade.collide(knocker, cop, collisionHandler, null, this);
		// Enable physics between balls
		game.physics.arcade.collide(balls);
		//new code
		knocker.rotation = game.physics.arcade.moveToPointer(knocker, 60, game.input.activePointer, 500);
		//cop.rotation = game.physics.arcade.moveToObject(cop, knocker, 15,500);
		//Resets balls
		balls.forEachAlive(checkBounds, this);
		//music
		
	}
	
	function collisionHandler (knocker, cop) 
	{
		if(score>0)
			score -= 20;
		
		scoreText.text = scoreString + score;
		
	}
	
	function updateTime()
	{
		
		time = (Math.floor((game.time.time-startTime) / 1000));// % 60);
		if(flag==true)
			time=0;
		flag=false;
		timeText.text= "time: "+time + "/60";
		if (score>=1000)
		{
			stateText.text = "You Won";
			stateText.visible = true;
		}
		if((time == 59)&(score>=1000))
		{
			stateText.text = "You Won";
			stateText.visible = true;
		}
		if((time == 59)&(score<1000))
		{
			stateText.text = "You Lose";
			stateText.visible = true;
		}
	}
	
	function hit (knocker, ball) {
	
		ball.kill();
	
		score += 20;

		scoreText.text = 'score: ' + score;

	}
	
	function checkBounds(ball) {

		if (ball.y > 1200)
		{
			ball.kill();
			score -= 10;

			scoreText.text = 'score: ' + score;
		}

	}
	
	function fire() {

    var ball = balls.getFirstExists(false);

    if (ball)
    {
        ball.frame = game.rnd.integerInRange(0,6);
        ball.exists = true;
        ball.reset(game.world.randomX, 0);
    }

}
};
