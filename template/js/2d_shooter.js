const app = Vue.createApp({
  mounted() {
    this.init_shooter_game();
  },
  methods: {
    redirect_github(){
        location.href = this.github_link;
    }, 

    init_shooter_game(){

      const DEV_MODE = false;

      const stage = document.getElementById('canvas');
      const ctx = stage.getContext('2d');
      const hud = document.querySelector('.hud');
      const scoreNode = hud.querySelector('.hud__score span');
      
      let GameOver = false;

      let ship =
        lasers = [],
        enemies = [],
        playing = false,
        gameStarted = false,
        speedMultiplier = 0,
        enemySeedFrameInterval = 0,
        score = 0,
        tick = 0,
        laserTick = 0;
        
      function randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      
      function calcScore(x) {
        return Math.floor((1 / x) * 500);
      }
      

      // Ship Constructor

      function Ship(options) {  
        this.radius = 15;
        this.x = options.x || stage.width * .5 - this.radius - .5;
        this.y = options.y || stage.height - this.radius - 30;
        this.width = this.radius * 2;
        this.height = this.width;
        this.color = options.color || 'red';
        this.left = false;
        this.right = false;
        this.speed = 8;
        this.active = true;
        
        // key methods
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
      }
      // update Ship object position
      Ship.prototype.update = function(x) {
        this.x = x;
        this.y = stage.height - this.radius - 30;
      }
      // draw ship object on canvas
      Ship.prototype.draw = function() {
        ctx.save();
        
        if (DEV_MODE) {
          ctx.fillStyle = 'skyblue';
          ctx.fillRect(this.x, this.y, this.width, this.width);
        }
        
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + this.radius - 5, this.y, 10, this.radius);
        ctx.fillRect(this.x, this.y + this.radius, this.width, 10);
        ctx.fillRect(this.x, this.y + this.radius + 10, 10, 5);
        ctx.fillRect(this.x + this.width - 10, this.y + this.radius + 10, 10, 5);
        
        ctx.restore();
      }
      // actions onKeyDown
      Ship.prototype.onKeyDown = function(e) {
        if (ship.active) { // only if ship is alive
          // if keyDown is 'D'
          if (e.keyCode === 68) this.right = true;
          // if keyDown is 'Q'
          else if (e.keyCode === 81) this.left = true;
          // if keyDown is space :
          if (e.keyCode == 16 && !this.shooting) {
            this.shooting = true;
            laserTick = 0;
          }
        }
      }
      // stop actions onKeyUp
      Ship.prototype.onKeyUp = function(e) {
        if (e.keyCode === 68) this.right = false;
        else if (e.keyCode === 81) this.left = false;
        else if (e.keyCode == 16) this.shooting = false;
      }
      

      // Laser Constructor

      function Laser(options) {
        this.x = options.x - .5;
        this.y = options.y || stage.height - 50;
        this.width = 6;
        this.height = 20;
        this.speed = 15;
        this.color = options.color || 'white';
        this.active = true;
      }
      
      Laser.prototype.update = function(y) {
        this.y = y;
      }
      
      Laser.prototype.draw = function() {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      

      // Enemy Constructor

      function Enemy(options) {
        this.radius = randomBetween(10, 80); // only simple balls for the moment
        this.width = this.radius * 2;
        this.height = this.width;
        this.x = randomBetween(0, stage.width - this.width);
        this.y = -this.radius * 2;
        this.color = options != undefined && options.color ? options.color : 'white';
        this.speed = 2;
        this.active = true;
      }
      
      Enemy.prototype.update = function(x, y) {
        this.x = x;
        this.y = y;
      }
      
      Enemy.prototype.draw = function() {
        if (DEV_MODE) {
          ctx.fillStyle = 'skyblue';
          ctx.fillRect(this.x, this.y, this.width, this.width);
        }
        
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      


      function hitTest(item1, item2) {
        let collision = true;
        if (
          item1.x > item2.x + item2.width ||
          item1.y > item2.y + item2.height ||
          item2.x > item1.x + item1.width ||
          item2.y > item1.y + item1.height) 
        {
          collision = false;
        }
        return collision;    
      }
      
      function handleLaserCollision() {  
        for (let enemy of enemies) {
          for (let laser of lasers) {
            let collision = hitTest(laser, enemy);
            if (collision && laser.active) {
              console.log('you destroyed an enemy');
              enemy.active = false;
              laser.active = false;
              
              // increase enemy speed and frequency of enemy spawns
              speedMultiplier += .025;
              if (enemySeedFrameInterval > 20) {
                enemySeedFrameInterval -= 2;
              }
              
              // increase score
              score += 1; // To increase score depending on enemy size : calcScore(enemy.radius)
              scoreNode.textContent = score;
            }
          }
        }
      }
      
      function handleShipCollision() {
        // check for collisions with ennemy
        if (enemies.length) {
          for (let enemy of enemies) {
            let collision = hitTest(ship, enemy);
            GameOver = false;
            if (collision) {
              console.log('your ship was destroyed');
              ship.active = false;
              setTimeout(() => {
                ship.active = true;
                speedMultiplier = 1;
                enemySeedFrameInterval = 100;
                score = 0;
                scoreNode.textContent = score;
                GameOver = true;
              }, 2000);
              
            }
          }
        }
      }
      
      function drawShip(xPosition) {
        if (ship.active) {
          ship.update(xPosition);
          ship.draw();
        }
      }
      
      function drawEnemies() {
        if (enemies.length) {
      
          for (let enemy of enemies) {
            // draw an enemy if it's active
            if (enemy.active) {
              enemy.update(enemy.x, enemy.y += enemy.speed * speedMultiplier);
              enemy.draw();
            }
          }
        }
      }
      
      function enemyCleanup() {
        if (enemies.length) {
          enemies = enemies.filter(enemy => {
            let visible = enemy.y < stage.height + enemy.width;
            let active = enemy.active === true;
            return visible && active;
          });
        }
      }
      
      function drawLasers() {
        if (lasers.length) {
          for (let laser of lasers) {
            if (laser.active) {
              laser.update(laser.y -= laser.speed);
              laser.draw();
            }
          }
        }
      }
      
      function laserCleanup() {
        lasers = lasers.filter(laser => {
          let visible = laser.y > -laser.height;
          let active = laser.active === true;
          return visible && active;
        });
      }
      
      function render(delta) {
        
        if (playing) {
          let xPos = ship.x;
          
          // seed new enemies
          if (tick % enemySeedFrameInterval === 0 && ship.active) {
            const enemy = new Enemy();
            enemies.push(enemy);
            console.log({enemySeedFrameInterval, speedMultiplier})
          }
          
          // background
          ctx.save();
          ctx.fillStyle = '#222222';
          ctx.fillRect(0, 0, stage.width, stage.height);
          ctx.restore();
          drawScore(); // Display score
          if(GameOver === true) drawGameOver(); // Display Game Over (only on collision)
          
          // ship movement
          if (ship.left) 
            xPos = ship.x -= ship.speed;
          else if (ship.right) 
            xPos = ship.x += ship.speed;
      
          // stage boundaries
          if (gameStarted) {
            if (xPos < 0) 
              xPos = 0;
            else if (xPos > stage.width - ship.width) 
              xPos = stage.width - ship.width;  
          }
          
          // create lasers, if shooting
          if (ship.active && ship.shooting) {
            if (laserTick === 0 || laserTick % 10 === 0) {
              let laser = new Laser({
                color: 'red',
                x: ship.x + ship.radius - 3
              });
              lasers.push(laser);
            }
          }
          
          drawShip(xPos);
          
          handleShipCollision();
          handleLaserCollision();
          
          drawLasers();
          drawEnemies();
          
          enemyCleanup();
          laserCleanup();
          
          if (ship.shooting) laserTick++;
          tick++;
        }
        requestAnimationFrame(render);
      }

      function drawScore() {
        ctx.font = "30px Comic Sans MS";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Score: " + score, stage.width / 2, 50);
      }
      function drawGameOver() {
        ctx.font = "50px Verdana";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", stage.width / 2, stage.height/2);
      }        

      function startGame(e) {
        console.log('starting game'); 
        if (e) {
          e.currentTarget.blur();
        }
        speedMultiplier = 1;
        enemySeedFrameInterval = 100;
        ship.x = stage.width * .5 - ship.radius - .5;
        ship.y = stage.height - ship.radius - 30;
        enemies = [];
        
        gameStarted = true;
      }
      
      function onResize() {
        stage.width = window.innerWidth - 200;
        stage.height = window.innerHeight - 100;
      }
      
      window.addEventListener('resize', onResize);
      //document.body.appendChild(stage);
      onResize();
  
      ship = new Ship({ color:'#ff9d00', x: -100, y: -100});

      // Intro : slow speeds
      speedMultiplier = 6,
      enemySeedFrameInterval = 20;
      
      startGame();
      playing = true;
      render();
      ctx.font = "30px Comic Sans MS";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Hello World", stage.width/2, stage.height/2); // DISPLAY SCORE (not working)

    },
  },
    
}).mount("#app");