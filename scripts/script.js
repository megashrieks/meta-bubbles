var can = document.getElementById("can");
var ctx = can.getContext("2d");

var arr = [];
var grid = [];
const TOTAL_CIRCLES = 10;
const GRID_SIZE = 7.5;
class Circle {
    constructor() {
        this.x = ~~(Math.random() * can.width);
        this.y = ~~(Math.random() * can.height);
        this.radius = 20 + ~~(Math.random() * 50);
        this.directions = [1, -1]
        this.vel = {
            x: 3 * Math.random() * this.directions[~~(Math.random() * 2)],
            y: 3 * Math.random() * this.directions[~~(Math.random() * 2)]
        };
    }
    update() {
        this.x += this.vel.x;
        this.y += this.vel.y;
        if (this.x + this.radius >= can.width || this.x - this.radius <= 0)
            this.vel.x *= -1;
        if (this.y + this.radius >= can.height || this.y - this.radius <= 0)
            this.vel.y *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI * 2);
        //ctx.stroke();
        ctx.closePath();
    }
}

function setup() {
    for (var i = 0; i < TOTAL_CIRCLES; ++i) {
        var circ = new Circle();
        arr.push(circ);
    }
    for (var i = 0; i < can.width; i += GRID_SIZE) {
        grid.push([]);
        for (var j = 0; j < can.height; j += GRID_SIZE) {
            grid[i / GRID_SIZE].push(0.0);
        }
    }
}
function draw() {
    ctx.clearRect(0, 0, can.width, can.height);
    for (var i = 0; i < TOTAL_CIRCLES; ++i) {
        arr[i].update();
        arr[i].draw();
    }
    for (var i = 0; i < can.width; i += GRID_SIZE) {
        for (var j = 0; j < can.height; j += GRID_SIZE) {
            var v = 0;
            for (var k = 0; k < TOTAL_CIRCLES; ++k) {
                v += (arr[k].radius * arr[k].radius) / (((arr[k].x - i) * (arr[k].x - i)) + ((arr[k].y - j) * (arr[k].y - j)))
            }
            if (v > 1) {
                ctx.beginPath();
                ctx.arc(i, j, 2, 0, Math.PI * 2);
                //ctx.fill();
                ctx.closePath();
            }
            grid[(i / GRID_SIZE)][(j / GRID_SIZE)] = v;
        }
    }
    for (var i = 0; i < can.width - GRID_SIZE; i += GRID_SIZE) {
        for (var j = 0; j < can.height - GRID_SIZE; j += GRID_SIZE) {
            var a = grid[i / GRID_SIZE][j / GRID_SIZE] > 1;
            var b = grid[i / GRID_SIZE][(j + GRID_SIZE) / GRID_SIZE] > 1;
            var c = grid[(i + GRID_SIZE) / GRID_SIZE][(j + GRID_SIZE) / GRID_SIZE] > 1;
            var d = grid[(i + GRID_SIZE) / GRID_SIZE][j / GRID_SIZE] > 1;
            var p1, p2;
            if ((a && !b && !c && !d) || (!a && b && c && d)) {
                p1 = {
                    x: i + GRID_SIZE / 2,
                    y: j
                };

                p2 = {
                    x: i,
                    y: j + GRID_SIZE / 2
                };
            }
            else if ((!a && b && !c && !d) || (a && !b && c && d)) {
                p1 = {
                    x: i,
                    y: j + GRID_SIZE / 2
                };

                p2 = {
                    x: i + GRID_SIZE / 2,
                    y: j + GRID_SIZE
                };
            }
            else if ((!a && !b && c && !d) || (a && b && !c && d)) {
                p1 = {
                    x: i + GRID_SIZE / 2,
                    y: j + GRID_SIZE
                }
                p2 = {
                    x: i + GRID_SIZE,
                    y: j + GRID_SIZE / 2
                };
            }
            else if ((!a && !b && !c && d) || (a && b && c && !d)) {
                p1 = {
                    x: i + GRID_SIZE,
                    y: j + GRID_SIZE / 2
                }
                p2 = {
                    x: i + GRID_SIZE / 2,
                    y: j
                };
            } else if ((a && b && !c && !d) || (!a && !b && c && d)) {
                p1 = {
                    x: i + GRID_SIZE / 2,
                    y: j
                }
                p2 = {
                    x: i + GRID_SIZE / 2,
                    y: j + GRID_SIZE
                };
            } else if ((a && !b && !c && d) || (!a && b && c && !d)) {
                p1 = {
                    x: i,
                    y: j + GRID_SIZE / 2
                }
                p2 = {
                    x: i + GRID_SIZE,
                    y: j + GRID_SIZE / 2
                };
            }
            if (p1 != undefined && p2 != undefined) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
    requestAnimationFrame(draw);
}
function resize() {
    can.width = window.innerWidth;
    can.height = window.innerHeight;
}
window.onresize = resize;
resize();
setup();
draw();