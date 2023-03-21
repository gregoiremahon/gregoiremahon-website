src="https://cdn.jsdelivr.net/gh/bbbootstrap/libraries@main/toasty.js"
const app = Vue.createApp({

    data() {
        return {
          github_link: "https://github.com/gregoiremahon/pong-game"
        }
    },

    mounted() {
        this.initPongGame();
    },

    methods: {
        redirect_github(){
            location.href = this.github_link;
        }, 

        initPongGame() {
            const canvas = document.getElementById("pong");
            const ctx = canvas.getContext("2d");
            var mySound = new sound("bounce.wav");
            const paddleWidth = 10;
            const paddleHeight = 100;
            const ballRadius = 8;

            const leftPaddle = {
            x: 10,
            y: canvas.height / 2 - paddleHeight / 2,
            width: paddleWidth,
            height: paddleHeight,
            dy: 0,
            };

            const rightPaddle = {
            x: canvas.width - 10 - paddleWidth,
            y: canvas.height / 2 - paddleHeight / 2,
            width: paddleWidth,
            height: paddleHeight,
            dy: 0,
            };

            const ball = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: ballRadius,
            dx: 3,
            dy: 3,
            };

            function sound(src) {
                this.sound = document.createElement("audio");
                this.sound.src = src;
                this.sound.setAttribute("preload", "auto");
                this.sound.setAttribute("controls", "none");
                this.sound.style.display = "none";
                document.body.appendChild(this.sound);
                this.play = function(){
                  this.sound.play();
                }
                this.stop = function(){
                  this.sound.pause();
                }
            }

            function drawPaddle(paddle) {
            ctx.fillStyle = "green";
            ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
            }

            function drawBall() {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
            ctx.fill();
            }

            function movePaddles() {
                //console.log(leftPaddle.y, canvas.height)
                if (leftPaddle.y + leftPaddle.dy >= 0 && leftPaddle.y + leftPaddle.dy + leftPaddle.height <= canvas.height) {
                leftPaddle.y += leftPaddle.dy;
                }
            
                if (rightPaddle.y + rightPaddle.dy >= 0 && rightPaddle.y + rightPaddle.dy + rightPaddle.height <= canvas.height) {
                rightPaddle.y += rightPaddle.dy;
                }
            }
            

            function moveBall() {
            ball.x += ball.dx;
            ball.y += ball.dy;
            }

            function detectCollision() {
            if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
                ball.dy *= -1;
            }

            if (
                (ball.x - ball.radius <= leftPaddle.x + leftPaddle.width &&
                ball.y >= leftPaddle.y &&
                ball.y <= leftPaddle.y + leftPaddle.height) ||
                (ball.x + ball.radius >= rightPaddle.x &&
                ball.y >= rightPaddle.y &&
                ball.y <= rightPaddle.y + rightPaddle.height)
            ) {
                mySound.play();
                ball.dx *= -1;
            }

            if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
                ball.x = canvas.width / 2;
                ball.y = canvas.height / 2;
                ball.dx *= -1;
            }
            }

            function update() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                movePaddles();
                moveBall();
                detectCollision();
            
                drawPaddle(leftPaddle);
                drawPaddle(rightPaddle);
                drawBall();
            
                requestAnimationFrame(update);
            }
            
            function keyDownHandler(e) {
                if (e.key === "ArrowUp") {
                rightPaddle.dy = -5;
                } else if (e.key === "ArrowDown") {
                rightPaddle.dy = 5;
                }
            
                if (e.key === "z" || e.key === "Z") {
                leftPaddle.dy = -5;
                } else if (e.key === "s" || e.key === "S") {
                leftPaddle.dy = 5;
                }
            }
            
            function keyUpHandler(e) {
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                rightPaddle.dy = 0;
                }
            
                if (e.key === "z" || e.key === "Z" || e.key === "s" || e.key === "S") {
                leftPaddle.dy = 0;
                }
            }


            
            document.addEventListener("keydown", keyDownHandler);
            document.addEventListener("keyup", keyUpHandler);
            
            update();
        },
    
},
}).mount("#app");