var sn_im = new Image();
sn_im.src = "images/head.png";

class snake{
    constructor(game) {
        this.game = game;
        this.init();
    }

    init() {
        this.size = this.game.getSize() * 1;
        this.angle = 0;
    }

    draw() {
        this.game.context.save();
        this.game.context.translate(game_W / 2, game_H / 2);
        this.game.context.rotate(this.angle - Math.PI / 2);
        this.game.context.drawImage(sn_im,  -this.size / 2, - this.size / 2, this.size, this.size);

        this.game.context.restore();
    }
}