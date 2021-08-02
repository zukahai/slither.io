class food{
    constructor(game, size, x, y) {
        this.game = game;
        this.size = size;
        this.x = x;
        this.y = y;
        this.init();
    }

    init() {
        let rd = Math.floor(Math.random() * 1000000) % 5;
        this.food_im = new Image();
        this.food_im.src = "images/food/" + rd + ".png";
    }

    draw() {
        if (this.game.isPoint(this.x, this.y))
            this.game.context.drawImage(this.food_im,  this.x - this.size / 2 - XX, this.y - this.size / 2 - YY, this.size, this.size);
    }
}