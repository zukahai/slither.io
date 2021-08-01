game_W = 0, game_H = 0;

var bg_im = new Image();
bg_im.src = "images/Map2.png";
SPEED = 1;
MaxSpeed = 0;
chX = chY = 0;
mySnake = 0;
FOOD = [];
score = 1000;

Xfocus = Yfocus = 0;
XX = 0, YY = 0;

class game {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.init();
    }

    init() {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);

        this.render();

        mySnake = new snake(this);
        for (let i = 0; i < 500; i++) {
            FOOD[i] = new food(this, this.getSize() / (2 + Math.random() * 4), (Math.random() - Math.random()) * 5000, (Math.random() - Math.random()) * 5000);
        }
        
        this.loop();

        this.listenMouse();
        this.listenTouch();
    }

    listenTouch() {
        document.addEventListener("touchmove", evt => {
            var y = evt.touches[0].pageY;
            var x = evt.touches[0].pageX;
            chX = (x - game_W / 2) / 15;
            chY = (y - game_H / 2) / 15;
        })

        document.addEventListener("touchstart", evt => {
            var y = evt.touches[0].pageY;
            var x = evt.touches[0].pageX;
            chX = (x - game_W / 2) / 15;
            chY = (y - game_H / 2) / 15;
            mySnake.speed = 2;
        })

        document.addEventListener("touchend", evt => { 
            mySnake.speed = 1;
        })
    }

    listenMouse() {
        document.addEventListener("mousedown", evt => {
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            mySnake.speed = 2;
        })

        document.addEventListener("mousemove", evt => {
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            chX = (x - game_W / 2) / 15;
            chY = (y - game_H / 2) / 15;
        })

        document.addEventListener("mouseup", evt => {
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            mySnake.speed = 1;
        })
    }

    loop() {
        this.update();
        this.draw();
        setTimeout(() => this.loop(), 30);
    }

    update() {
        if (mySnake.speed == 2)
            score--;
        this.render();
        while (Math.abs(chY) * Math.abs(chY) + Math.abs(chX) * Math.abs(chX) > MaxSpeed * MaxSpeed && chY * chX != 0) {
            chX /= 1.1;
            chY /= 1.1;
        }
        while (Math.abs(chY) * Math.abs(chY) + Math.abs(chX) * Math.abs(chX) < MaxSpeed * MaxSpeed && chY * chX != 0) {
            chX *= 1.1;
            chY *= 1.1;
        }

        Xfocus += 1.5 * chX * mySnake.speed;
        Yfocus += 1.5 * chY * mySnake.speed;
        if (Xfocus < 0)
            Xfocus = bg_im.width / 2 + 22;
        if (Xfocus > bg_im.width / 2 + 22)
            Xfocus = 0;
        if (Yfocus < 0)
            Yfocus = bg_im.height / 2 + 60;
        if (Yfocus > bg_im.height / 2 + 60)
            Yfocus = 0;
        mySnake.dx = chX;
        mySnake.dy = chY;
        XX += chX * mySnake.speed;
        YY += chY * mySnake.speed;
    }

 
    render() {
        if (this.canvas.width != document.documentElement.clientWidth || this.canvas.height != document.documentElement.clientHeight) {
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight;
            game_W = this.canvas.width;
            game_H = this.canvas.height;
            SPEED = this.getSize() / 7;
            SPEED = 1;
            MaxSpeed = this.getSize() / 7;
            if (mySnake.v != null) {
                mySnake.v[0].x = XX + game_W / 2;
                mySnake.v[0].y = YY + game_H / 2;
            }
        }
    }

    draw() {
        this.clearScreen();
        for (let i = 0; i < FOOD.length; i++)
            FOOD[i].draw();
        mySnake.draw();
        this.drawScore();
    }

    drawScore() {
        this.context.font = this.getSize() / 1.5 + 'px Arial Black';
        this.context.fillStyle = "#FF00CC";
        this.context.fillText("Score: " + score, this.getSize(), this.getSize());
    }

    clearScreen() {
        this.context.clearRect(0, 0, game_W, game_H);
        this.context.drawImage(bg_im, Xfocus, Yfocus, 1.5 * game_W, 1.5 * game_H, 0, 0, game_W, game_H);
    }

    getSize() {
        var area = game_W * game_H;
        return Math.sqrt(area / 300);
    }
}

var g = new game();