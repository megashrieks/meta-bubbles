var can = document.getElementById("can");
var ctx = can.getContext("2d");

var arr = [];
var grid = [];
const TOTAL_CIRCLES = 10;
const GRID_SIZE = 5;
class Circle {
    constructor() {
        this.x = 50 + ~~(Math.random() * (can.width - 100));
        this.y = 50 + ~~(Math.random() * (can.height - 100));
        this.radius = 50 + ~~(Math.random() * 20);
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
        ctx.strokeStyle = "#fff";
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
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
function lerp(p1, p2) {
    return {
        x: p2.x + (p1.x - p2.x) * ((1.0 - grid[p2.x / GRID_SIZE][p2.y / GRID_SIZE]) / (grid[p1.x / GRID_SIZE][p1.y / GRID_SIZE] - grid[p2.x / GRID_SIZE][p2.y / GRID_SIZE])),
        y: p2.y + (p1.y - p2.y) * ((1.0 - grid[p2.x / GRID_SIZE][p2.y / GRID_SIZE]) / (grid[p1.x / GRID_SIZE][p1.y / GRID_SIZE] - grid[p2.x / GRID_SIZE][p2.y / GRID_SIZE]))
    }
}
function draw() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, can.width, can.height);
    for (var i = 0; i < TOTAL_CIRCLES; ++i) {
        arr[i].update();
        //arr[i].draw();
    }
    for (var i = 0; i <= can.width; i += GRID_SIZE) {
        for (var j = 0; j <= can.height; j += GRID_SIZE) {
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
            var a = grid[i / GRID_SIZE][j / GRID_SIZE] >= threshold;
            var b = grid[i / GRID_SIZE][(j + GRID_SIZE) / GRID_SIZE] >= threshold;
            var c = grid[(i + GRID_SIZE) / GRID_SIZE][(j + GRID_SIZE) / GRID_SIZE] >= threshold;
            var d = grid[(i + GRID_SIZE) / GRID_SIZE][j / GRID_SIZE] >= threshold;
            if (a + b + c + d == 0 || a + b + c + d == 4) continue;
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
            var p1, p2, p3, p4, temp;
            if ((a && !b && !c && !d) || (!a && b && c && d)) {
                temp = lerp(ap, dp);
                p1 = {
                    x: temp.x,
                    y: temp.y
                };
                temp = lerp(ap, bp);
                p2 = {
                    x: temp.x,
                    y: temp.y
                };
            }
            else if ((!a && b && !c && !d) || (a && !b && c && d)) {
                temp = lerp(bp, ap);
                p1 = {
                    x: temp.x,
                    y: temp.y
                };
                temp = lerp(bp, cp)
                p2 = {
                    x: temp.x,
                    y: temp.y
                };
            }
            else if ((!a && !b && c && !d) || (a && b && !c && d)) {
                temp = lerp(cp, bp)
                p1 = {
                    x: temp.x,
                    y: temp.y
                };
                temp = lerp(cp, dp)
                p2 = {
                    x: temp.x,
                    y: temp.y
                };
            }
            else if ((!a && !b && !c && d) || (a && b && c && !d)) {
                temp = lerp(dp, cp)
                p1 = {
                    x: temp.x,
                    y: temp.y
                };
                temp = lerp(dp, ap);
                p2 = {
                    x: temp.x,
                    y: temp.y
                };
            }
            else if ((a && b && !c && !d) || (!a && !b && c && d)) {
                temp = lerp(ap, dp);
                p1 = {
                    x: temp.x,
                    y: temp.y
                };
                temp = lerp(bp, cp)
                p2 = {
                    x: temp.x,
                    y: temp.y
                };
            }
            else if ((a && !b && !c && d) || (!a && b && c && !d)) {
                temp = lerp(ap, bp);
                p1 = {
                    x: temp.x,
                    y: temp.y
                };
                temp = lerp(dp, cp);
                p2 = {
                    x: temp.x,
                    y: temp.y
                };
            }
            else if (!a && b && !c && d) {
                temp = lerp(ap, bp);
                p1 = {
                    x: temp.x,
                    y: temp.y
                };
                temp = lerp(ap, dp);
                p2 = {
                    x: temp.x,
                    y: temp.y
                };
                temp = lerp(bp, cp);
                p3 = {
                    x: temp.x,
                    y: temp.y
                };
                temp = lerp(cp, dp);
                p4 = {
                    x: temp.x,
                    y: temp.y
                };
            } else if (a && !b && c && !d) {
                temp = lerp(ap, bp);
                p1 = {
                    x: temp.x,
                    y: temp.y
                };
                temp = lerp(bp, cp);
                p2 = {
                    x: temp.x,
                    y: temp.y
                };
                temp = lerp(ap, dp);
                p3 = {
                    x: temp.x,
                    y: temp.y
                };
                temp = lerp(dp, cp);
                p4 = {
                    x: temp.x,
                    y: temp.y
                };
            }
            if (p1 != undefined && p2 != undefined) {
                ctx.beginPath();
                ctx.strokeStyle = "orange";
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
                ctx.closePath();
            }
            if (p3 != undefined && p4 != undefined) {
                ctx.beginPath();
                ctx.strokeStyle = "orange";
                ctx.moveTo(p3.x, p3.y);
                ctx.lineTo(p4.x, p4.y);
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
requestAnimationFrame(draw);