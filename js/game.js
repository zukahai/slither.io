game_W = 0, game_H = 0;

var bg_im = new Image();
bg_im.src = "images/Map2.png";
SPEED = 1;
MaxSpeed = 0;
chX = chY = 0;
mySnake = [];
FOOD = [];
NFood = 2000;
Nsnake = 20;
sizeMap = 2000;
index = 0;

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
        for (let i = 0; i < NFood; i++) {
            FOOD[i] = new food(this, this.getSize() / (10 + Math.random() * 10), (Math.random() - Math.random()) * sizeMap, (Math.random() - Math.random()) * sizeMap);
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
        this.checkDie();

        mySnake[0].dx = chX;
        mySnake[0].dy = chY;
        XX += chX * mySnake[0].speed;
        YY += chY * mySnake[0].speed;
        mySnake[0].v[0].x = XX + game_W / 2;
        mySnake[0].v[0].y = YY + game_H / 2;
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
                FOOD[i] = new food(this, this.getSize() / (10 + Math.random() * 10), (Math.random() - Math.random()) * sizeMap + mySnake[0].v[0].x, (Math.random() - Math.random()) * sizeMap + mySnake[0].v[0].y);
                // console.log(FOOD[i]);
            }
    }

    changeSnake() {
        for (let i = 0; i < mySnake.length; i++)
            if (Math.sqrt((mySnake[0].v[0].x - mySnake[i].v[0].x) * (mySnake[0].v[0].x - mySnake[i].v[0].x ) + (mySnake[0].v[0].y - mySnake[i].v[0].y ) * (mySnake[0].v[0].y - mySnake[i].v[0].y)) > sizeMap) {
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
                    mySnake[i].score += Math.floor(FOOD[j].size);
                    FOOD[j] = new food(this, this.getSize() / (5 + Math.random() * 10), (Math.random() - Math.random()) * 5000 + XX, (Math.random() - Math.random()) * 5000 + YY);
                }
            }
    }

    checkDie() {
        for (let i = 0; i < mySnake.length; i++)
            for (let j = 0; j < mySnake.length; j++)
                if (i != j) {
                    let kt = true;
                    for (let k = 0; k < mySnake[j].v.length; k++)
                        if (this.range(mySnake[i].v[0].x, mySnake[i].v[0].y, mySnake[j].v[k].x, mySnake[j].v[k].y) < mySnake[i].size)
                            kt = false;
                    if (!kt) {
                        for (let k = 0; k < mySnake[i].v.length; k += 5) {
                            FOOD[index++] = new food(this, this.getSize() / (2 + Math.random() * 2),  mySnake[i].v[k].x,  mySnake[i].v[k].y);
                            if (index >= FOOD.length)
                                index = 0;
                        }
                        if (i != 0)
                            mySnake[i] = new snake(i, this, Math.floor((mySnake[0].score > 1500) ? mySnake[0].score / 3 : 500),  this.randomXY(XX), this.randomXY(YY));
                        else {
                            mySnake[i] = new snake("HaiZuka", this, Math.floor(500 + Math.random() * 500),  this.randomXY(XX), this.randomXY(YY));
                            XX = mySnake[0].v[0].x - game_W / 2;
                            YY = mySnake[0].v[0].y - game_H / 2;
                        }
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

    range(a, b, c, d) {
        return Math.sqrt((a - c) * (a - c) + (b - d) * (b - d));
    }

    randomXY(n) {
        let ans = 0;
        while (Math.abs(ans) < 1) {
            ans = 3 * Math.random() - 3 * Math.random();
        }
        return ans * sizeMap + n;
    }
}

var g = new game();