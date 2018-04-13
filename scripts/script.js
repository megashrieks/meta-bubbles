var can = document.getElementById("can");
var ctx = can.getContext("2d");

var arr = [];
var grid = [];
const TOTAL_CIRCLES = 10;
const GRID_SIZE = 10;
class Circle {
    constructor() {
        this.x = 50 + ~~(Math.random() * (can.width - 100));
        this.y = 50 + ~~(Math.random() * (can.height - 100));
        this.radius = 10 + ~~(Math.random() * 50);
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
function lerp(p1, p2, g) {
    return {
        x: p2.x + (p1.x - p2.x) * ((1 - g[p2.x / GRID_SIZE][p2.y / GRID_SIZE]) / (g[p1.x / GRID_SIZE][p1.y / GRID_SIZE] - g[p2.x / GRID_SIZE][p2.y / GRID_SIZE])),
        y: p2.y + (p1.y - p2.y) * ((1 - g[p2.x / GRID_SIZE][p2.y / GRID_SIZE]) / (g[p1.x / GRID_SIZE][p1.y / GRID_SIZE] - g[p2.x / GRID_SIZE][p2.y / GRID_SIZE]))
    }
}
function draw() {
    ctx.clearRect(0, 0, can.width, can.height);
    for (var i = 0; i < TOTAL_CIRCLES; ++i) {
        arr[i].update();
    }
    for (var i = 0; i < can.width; i += GRID_SIZE) {
        for (var j = 0; j < can.height; j += GRID_SIZE) {
            var v = 0;
            for (var k = 0; k < TOTAL_CIRCLES; ++k) {
                v += (arr[k].radius * arr[k].radius) / (((arr[k].x - i) * (arr[k].x - i)) + ((arr[k].y - j) * (arr[k].y - j)))
            }
            grid[(i / GRID_SIZE)][(j / GRID_SIZE)] = v;
        }
    }
    var threshold = 1.0;
    for (var i = 0; i < can.width - GRID_SIZE; i += GRID_SIZE) {
        for (var j = 0; j < can.height - GRID_SIZE; j += GRID_SIZE) {
            var a = grid[i / GRID_SIZE][j / GRID_SIZE] > threshold;
            var b = grid[i / GRID_SIZE][(j + GRID_SIZE) / GRID_SIZE] > threshold;
            var c = grid[(i + GRID_SIZE) / GRID_SIZE][(j + GRID_SIZE) / GRID_SIZE] > threshold;
            var d = grid[(i + GRID_SIZE) / GRID_SIZE][j / GRID_SIZE] > threshold;
            var ap = {
                x: i,
                y: j
            }, bp = {
                x: i,
                y: j + GRID_SIZE
            }, cp = {
                x: i + GRID_SIZE,
                y: j + GRID_SIZE
            }, dp = {
                x: i + GRID_SIZE,
                y: j
            };
            var p1, p2;
            if ((a && !b && !c && !d) || (!a && b && c && d)) {
                p1 = {
                    x: lerp(ap, dp, grid).x,
                    y: lerp(ap, dp, grid).y
                };
                p2 = {
                    x: lerp(ap, bp, grid).x,
                    y: lerp(ap, bp, grid).y
                };
            }
            else if ((!a && b && !c && !d) || (a && !b && c && d)) {
                p1 = {
                    x: lerp(bp, ap, grid).x,
                    y: lerp(bp, ap, grid).y
                };
                p2 = {
                    x: lerp(bp, cp, grid).x,
                    y: lerp(bp, cp, grid).y
                };
            }
            else if ((!a && !b && c && !d) || (a && b && !c && d)) {
                p1 = {
                    x: lerp(cp, bp, grid).x,
                    y: lerp(cp, bp, grid).y
                };
                p2 = {
                    x: lerp(cp, dp, grid).x,
                    y: lerp(cp, dp, grid).y
                };
            }
            else if ((!a && !b && !c && d) || (a && b && c && !d)) {
                p1 = {
                    x: lerp(dp, cp, grid).x,
                    y: lerp(dp, cp, grid).y
                };
                p2 = {
                    x: lerp(dp, ap, grid).x,
                    y: lerp(dp, ap, grid).y
                };
            } else if ((a && b && !c && !d) || (!a && !b && c && d)) {
                p1 = {
                    x: lerp(ap, dp, grid).x,
                    y: lerp(ap, dp, grid).y
                };
                p2 = {
                    x: lerp(bp, cp, grid).x,
                    y: lerp(bp, cp, grid).y
                };
            } else if ((a && !b && !c && d) || (!a && b && c && !d)) {
                p1 = {
                    x: lerp(ap, bp, grid).x,
                    y: lerp(ap, bp, grid).y
                };
                p2 = {
                    x: lerp(dp, cp, grid).x,
                    y: lerp(dp, cp, grid).y
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