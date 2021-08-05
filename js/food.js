ArrColor = ["#FF0000", "#FFFF00", "#00FF00", "#FF00FF", "#FFFFFF", "#00FFFF", "#7FFF00", "#FFCC00"];
class food {
    constructor(game, size, x, y) {
        this.game = game;
        this.size = size / 2;
        this.value = this.size;
        this.x = x;
        this.y = y;
        this.init();
    }

    init() {
        this.color = ArrColor[Math.floor(Math.random() * 99999) % ArrColor.length];
    }

    draw() {
        if (this.game.isPoint(this.x, this.y)) {
            this.game.context.beginPath();
            this.game.context.arc(this.x - this.size / 2 - XX, this.y - this.size / 2 - YY, this.size, 0, Math.PI * 2, false);
            this.game.context.fillStyle = this.color;
            this.game.context.fill();
            this.game.context.closePath()
        }
    }
}