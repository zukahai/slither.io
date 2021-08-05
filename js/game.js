game_W = 0, game_H = 0;

var bg_im = new Image();
bg_im.src = "images/Map2.png";
SPEED = 1;
MaxSpeed = 0;
chX = chY = 1;
mySnake = [];
FOOD = [];
NFood = 2000;
Nsnake = 20;
sizeMap = 2000;
index = 0;
minScore = 200;

Xfocus = Yfocus = 0;
XX = 0, YY = 0;

names = ["Ahmed Steinke",
    "Aubrey Brass",
    "Johanne Boothe",
    "Sunni Markland",
    "Tifany Sugar",
    "Latonya Tully",
    "Bobette Huckaby",
    "Daryl Nowicki",
    "Lizeth Kremer",
    "Chiquita Pitt",
    "Christinia Siler",
    "Rena Reep",
    "Evan Mcknight",
    "Sofia Freeland",
    "Virgie Vaughns",
    "Kit Polen",
    "Emma Rutland",
    "Queen Guertin",
    "Cecily Pasquariello",
    "Palmer Myer",
    "Kera Quinton",
    "Domonique Diebold",
    "Henriette Sockwell",
    "Adeline Pettway",
    "Shu Osby",
    "Shantay Wallner",
    "Isaias Drewes",
    "Lettie Gatz",
    "Remona Maravilla",
    "Jessenia Mick",
    "Noelle Rickey",
    "Lavon Revard",
    "Shavonne Stogsdill",
    "Hailey Razo",
    "Bart Somerville",
    "Hannah Masker",
    "Frederica Farmer",
    "Glennie Thorpe",
    "Sherrell Arriaga",
    "Lawanda Maines",
    "Douglass Watts",
    "Naida Grund",
    "Branda Bussiere",
    "Carmelo Savory",
    "Gabriela Blanchette",
    "Tran Huf",
    "Antoinette Hinrichs",
    "Deborah Primmer",
    "Drusilla Mcvea",
    "Charlsie Acy",
    "Nadene Royce",
    "Danette Touchet",
    "Luana Endo",
    "Elvina Hibbitts",
    "Ludivina Dahle",
    "Fabiola Mcwhirter",
    "Isabella Mosier",
    "Lon Lassiter",
    "Laurence Hanning",
    "NamZ Bede"
];

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
            mySnake[i] = new snake(names[Math.floor(Math.random() * 99999) % names.length], this, Math.floor(2 * minScore + Math.random() * 2 * minScore), (Math.random() - Math.random()) * sizeMap, (Math.random() - Math.random()) * sizeMap);
        mySnake[0] = new snake("HaiZuka", this, minScore, game_W / 2, game_H / 2);
        for (let i = 0; i < NFood; i++) {
            FOOD[i] = new food(this, this.getSize() / (7 + Math.random() * 10), (Math.random() - Math.random()) * sizeMap, (Math.random() - Math.random()) * sizeMap);
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
            if (Math.sqrt((mySnake[0].v[0].x - mySnake[i].v[0].x) * (mySnake[0].v[0].x - mySnake[i].v[0].x) + (mySnake[0].v[0].y - mySnake[i].v[0].y) * (mySnake[0].v[0].y - mySnake[i].v[0].y)) > sizeMap) {
                mySnake[i].v[0].x = (mySnake[0].v[0].x + mySnake[i].v[0].x) / 2;
                mySnake[i].v[0].y = (mySnake[0].v[0].y + mySnake[i].v[0].y) / 2;
            }
    }

    unFood() {
        if (mySnake.length <= 0)
            return;
        for (let i = 0; i < mySnake.length; i++)
            for (let j = 0; j < FOOD.length; j++) {
                if ((mySnake[i].v[0].x - FOOD[j].x) * (mySnake[i].v[0].x - FOOD[j].x) + (mySnake[i].v[0].y - FOOD[j].y) * (mySnake[i].v[0].y - FOOD[j].y) < 1.5 * mySnake[i].size * mySnake[i].size) {
                    mySnake[i].score += Math.floor(FOOD[j].value);
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
                            FOOD[index] = new food(this, this.getSize() / (2 + Math.random() * 2), mySnake[i].v[k].x + Math.random() * mySnake[i].size / 2, mySnake[i].v[k].y + Math.random() * mySnake[i].size / 2);
                            FOOD[index++].value = 0.4 * mySnake[i].score / (mySnake[i].v.length / 5);
                            if (index >= FOOD.length)
                                index = 0;
                        }
                        if (i != 0)
                            mySnake[i] = new snake(names[Math.floor(Math.random() * 99999) % names.length], this, Math.max(Math.floor((mySnake[0].score > 10 * minScore) ? mySnake[0].score / 10 : minScore), mySnake[i].score / 10), this.randomXY(XX), this.randomXY(YY));
                        else {
                            mySnake[i] = new snake("HaiZuka", this, minScore, this.randomXY(XX), this.randomXY(YY));
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
        let data = [];
        for (let i = 0; i < mySnake.length; i++)
            data[i] = mySnake[i];
        for (let i = 0; i < data.length - 1; i++)
            for (let j = i + 1; j < data.length; j++)
                if (data[i].score < data[j].score) {
                    let t = data[i];
                    data[i] = data[j];
                    data[j] = t;
                }
        let index = 0;
        for (let i = 1; i < mySnake.length; i++)
            if (data[i].name == "HaiZuka")
                index = i;
        this.context.font = this.getSize() / 4 + 'px Arial Black';
        for (let i = 0; i < 10; i++) {
            this.context.fillStyle = "#AA0000";
            if (i == index)
                this.context.fillStyle = "#CC99FF";
            this.context.fillText("#" + (i + 1), 3 * game_W / 4, this.getSize() / 2 * (i + 1));
            this.context.fillText(data[i].name, 3 * game_W / 4 + game_W / 24, this.getSize() / 2 * (i + 1));
            this.context.fillText(Math.floor(data[i].score), 3 * game_W / 4 + game_W / 5.5, this.getSize() / 2 * (i + 1));
        }
        if (index > 9) {
            this.context.fillStyle = "#CC99FF";
            this.context.fillText("#" + (index + 1), 3 * game_W / 4, this.getSize() / 2 * (10 + 1));
            this.context.fillText(data[index].name, 3 * game_W / 4 + game_W / 24, this.getSize() / 2 * (10 + 1));
            this.context.fillText(Math.floor(data[index].score), 3 * game_W / 4 + game_W / 5.5, this.getSize() / 2 * (10 + 1));
        }
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

    isPoint(x, y) {
        if (x - XX < -3 * this.getSize())
            return false;
        if (y - YY < -3 * this.getSize())
            return false;
        if (x - XX > game_W + 3 * this.getSize())
            return false;
        if (y - YY > game_H + 3 * this.getSize())
            return false;
        return true;
    }
}

var g = new game();