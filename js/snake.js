var sn_im = new Image();
sn_im.src = "images/head.png";

var bd_im = new Image();
bd_im.src = "images/body.png";

class snake{
    constructor(game) {
        this.game = game;
        this.init();
    }

    init() {
        this.speed = 1;
        this.size = this.game.getSize() * 1;
        this.angle = 0;
        this.dx = Math.random() * MaxSpeed - Math.random() * MaxSpeed;
        this.dy = Math.random() * MaxSpeed - Math.random() * MaxSpeed;
        this.v = [];
        for (let i = 0; i < 100; i++) 
            this.v[i] = {x : game_W / 2, y : game_H / 2};
        
    }

    update() {
        this.v[0].x += this.dx * this.speed;
        this.v[0].y += this.dy * this.speed;

        for (let i = 1; i < this.v.length; i++) {
            if (this.range(this.v[i], this.v[i - 1]) > this.size / 3 || true) {
                this.v[i].x = (this.v[i].x + this.v[i - 1].x) / 2;
                this.v[i].y = (this.v[i].y + this.v[i - 1].y) / 2;
            }
        }
        this.angle = this.getAngle(this.dx, this.dy);
    }

    draw() {
        this.update();

        for (let i = this.v.length - 1; i >= 1; i--)
            this.game.context.drawImage(bd_im,  this.v[i].x - XX - (this.size) / 2, this.v[i].y - YY - (this.size) / 2, this.size, this.size);

        this.game.context.save();
        this.game.context.translate(game_W / 2, game_H / 2);
        this.game.context.rotate(this.angle - Math.PI / 2);
        this.game.context.drawImage(sn_im,  -this.size / 2, - this.size / 2, this.size, this.size);
        this.game.context.restore();
    }

    getAngle(a, b){
        let c = Math.sqrt(a * a + b * b);
        let al = Math.acos(a / c);
        if (chY < 0)
            al += 2 * (Math.PI - al);
        return al;
    }

    range(v1, v2) {
        return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y));
    }
}