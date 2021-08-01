var bd_im = new Image();
bd_im.src = "images/body.png";

class snake{
    constructor(name ,game, score,x , y) {
        this.name = name;
        this.game = game;
        this.score = score;
        this.x = x;
        this.y = y;
        this.init();
    }

    init() {
        this.time = Math.floor(20 + Math.random() * 100);
        this.speed = 1;
        this.size = this.game.getSize() * 1;
        this.angle = 0;
        this.dx = Math.random() * MaxSpeed - Math.random() * MaxSpeed;
        this.dy = Math.random() * MaxSpeed - Math.random() * MaxSpeed;
        this.v = [];
        for (let i = 0; i < 50; i++) 
            this.v[i] = {x : this.x, y : this.y};
        this.sn_im = new Image();
        this.sn_im.src = "images/head.png";
    }

    update() {
        this.time--;
        this.angle = this.getAngle(this.dx, this.dy);
        if (this.name != "HaiZuka") {
            console.log(this.dx, ' ', this.dy, ' ', this.getAngle(this.dx, this.dy));
            if (this.time > 50)
                this.speed = 2;
            else
                this.speed = 1;
        }
        
        if (this.time <= 0) {
            this.time = Math.floor(20 + Math.random() * 100);
            this.dx = Math.random() * MaxSpeed - Math.random() * MaxSpeed;
            this.dy = Math.random() * MaxSpeed - Math.random() * MaxSpeed;
        }
        this.v[0].x += this.dx * this.speed;
        this.v[0].y += this.dy * this.speed;

        for (let i = 1; i < this.v.length; i++) {
            if (this.range(this.v[i], this.v[i - 1]) > this.size / 5) {
                this.v[i].x = (this.v[i].x + this.v[i - 1].x) / 2;
                this.v[i].y = (this.v[i].y + this.v[i - 1].y) / 2;
                this.v[i].x = (this.v[i].x + this.v[i - 1].x) / 2;
                this.v[i].y = (this.v[i].y + this.v[i - 1].y) / 2;
            }
        }
        if (this.score < 500)
            return;
        if (this.speed == 2)
            this.score--;
        let csUp = Math.pow((this.score) / 1000, 1 / 5) ;
        this.size = this.game.getSize() / 2 * csUp;
        let N = 3 * Math.floor(50 * Math.pow((this.score) / 1000, 1 / 1));
        if (N > this.v.length) {
            this.v[this.v.length] = {x : this.v[this.v.length - 1].x, y : this.v[this.v.length - 1].y};
        } else
            this.v = this.v.slice(0, N);
    }

    draw() {
        this.update();

        for (let i = this.v.length - 1; i >= 1; i--)
            this.game.context.drawImage(bd_im,  this.v[i].x - XX - (this.size) / 2, this.v[i].y - YY - (this.size) / 2, this.size, this.size);

        this.game.context.save();
        this.game.context.translate(this.v[0].x - XX, this.v[0].y - YY);
        this.game.context.rotate(this.angle - Math.PI / 2);
        this.game.context.drawImage(this.sn_im,  -this.size / 2, - this.size / 2, this.size, this.size);
        this.game.context.restore();
    }

    getAngle(a, b){
        let c = Math.sqrt(a * a + b * b);
        let al = Math.acos(a / c);
        if (b < 0)
            al += 2 * (Math.PI - al);
        return al;
    }

    range(v1, v2) {
        return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y));
    }
}