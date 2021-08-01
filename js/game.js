game_W = 0, game_H = 0;

var bg_im = new Image();
bg_im.src = "images/Map2.png";
SPEED = 1;
MaxSpeed = 0;
chX = chY = 0;
mySnake = [];
FOOD = [];
NFood = 1000;
Nsnake = 20;
sizeMap = 3000;

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

        for (let i = 0; i < Nsnake; i++)
            mySnake[i] = new snake(i, this, Math.floor(500 + Math.random() * 1000), (Math.random() - Math.random()) * sizeMap, (Math.random() - Math.random()) * sizeMap);
        mySnake[0] = new snake("HaiZuka", this, 500, game_W / 2, game_H / 2);
        mySnake[0].time = 200000000;
        for (let i = 0; i < NFood; i++) {
            FOOD[i] = new food(this, this.getSize() / (2 + Math.random() * 4), (Math.random() - Math.random()) * sizeMap, (Math.random() - Math.random()) * sizeMap);
            // FOOD[i] = new food(this, this.getSize() / (2 + Math.random() * 4), game_W / 2, game_H / 2);
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
            mySnake[0].speed = 2;
        })

        document.addEventListener("touchend", evt => { 
            mySnake[0].speed = 1;
        })
    }

    listenMouse() {
        document.addEventListener("mousedown", evt => {
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
            mySnake[0].speed = 2;
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
            mySnake[0].speed = 1;
        })
    }

    loop() {
        this.update();
        this.draw();
        setTimeout(() => this.loop(), 30);
    }

    update() {
        this.render();
        this.unFood();
        this.changeFood();
        this.changeSnake();
        this.updateChXY();

        mySnake[0].dx = chX;
        mySnake[0].dy = chY;
        XX += chX * mySnake[0].speed;
        YY += chY * mySnake[0].speed;
    }

    updateChXY() {
        while (Math.abs(chY) * Math.abs(chY) + Math.abs(chX) * Math.abs(chX) > MaxSpeed * MaxSpeed && chY * chX != 0) {
            chX /= 1.1;
            chY /= 1.1;
        }
        while (Math.abs(chY) * Math.abs(chY) + Math.abs(chX) * Math.abs(chX) < MaxSpeed * MaxSpeed && chY * chX != 0) {
            chX *= 1.1;
            chY *= 1.1;
        }

        Xfocus += 1.5 * chX * mySnake[0].speed;
        Yfocus += 1.5 * chY * mySnake[0].speed;
        if (Xfocus < 0)
            Xfocus = bg_im.width / 2 + 22;
        if (Xfocus > bg_im.width / 2 + 22)
            Xfocus = 0;
        if (Yfocus < 0)
            Yfocus = bg_im.height / 2 + 60;
        if (Yfocus > bg_im.height / 2 + 60)
            Yfocus = 0;
    }

    changeFood() {
        for (let i = 0; i < FOOD.length; i++)
            if (Math.sqrt((mySnake[0].v[0].x - FOOD[i].x) * (mySnake[0].v[0].x - FOOD[i].x) + (mySnake[0].v[0].y - FOOD[i].y) * (mySnake[0].v[0].y - FOOD[i].y)) > sizeMap) {
                FOOD[i] = new food(this, this.getSize() / (2 + Math.random() * 4), (Math.random() - Math.random()) * sizeMap + mySnake[0].v[0].x, (Math.random() - Math.random()) * sizeMap + mySnake[0].v[0].y);
                // console.log(FOOD[i]);
            }
    }

    changeSnake() {
        for (let i = 0; i < mySnake.length; i++)
            if (Math.sqrt((mySnake[0].v[0].x - mySnake[i].v[0].x) * (mySnake[0].v[0].x - mySnake[i].v[0].x ) + (mySnake[0].v[0].y - mySnake[i].v[0].y ) * (mySnake[0].v[0].y - mySnake[i].v[0].y)) > sizeMap) {
                mySnake[i].v[0].x = (mySnake[0].v[0].x + mySnake[i].v[0].x) / 2;
                mySnake[i].v[0].y = (mySnake[0].v[0].y + mySnake[i].v[0].y) / 2;
                mySnake[i].v[0].x = (mySnake[0].v[0].x + mySnake[i].v[0].x) / 2;
                mySnake[i].v[0].y = (mySnake[0].v[0].y + mySnake[i].v[0].y) / 2;
            }
    }

    unFood() {
        if (mySnake.length <= 0)
            return;
        for (let i = 0; i < mySnake.length; i++)
            for (let j = 0; j < FOOD.length; j++) {
                if ((mySnake[i].v[0].x - FOOD[j].x) * (mySnake[i].v[0].x - FOOD[j].x) + (mySnake[i].v[0].y - FOOD[j].y) * (mySnake[i].v[0].y - FOOD[j].y) < 2.5 * mySnake[i].size * mySnake[i].size) {
                    mySnake[i].score += Math.floor(FOOD[j].size * 5);
                    FOOD[j] = new food(this, this.getSize() / (2 + Math.random() * 4), (Math.random() - Math.random()) * 5000 + XX, (Math.random() - Math.random()) * 5000 + YY);
                }
            }
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
            if (mySnake.length == 0)
                return;
            if (mySnake[0].v != null) {
                mySnake[0].v[0].x = XX + game_W / 2;
                mySnake[0].v[0].y = YY + game_H / 2;
            }
        }
    }

    draw() {
        this.clearScreen();
        for (let i = 0; i < FOOD.length; i++)
            FOOD[i].draw();
        for (let i = 0; i < mySnake.length; i++)
            mySnake[i].draw();
        this.drawScore();
    }

    drawScore() {
        this.context.font = this.getSize() / 1.5 + 'px Arial Black';
        this.context.fillStyle = "#FF00CC";
        this.context.fillText("Score: " + mySnake[0].score, this.getSize(), this.getSize());
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