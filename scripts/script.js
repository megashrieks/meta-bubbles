var can = document.getElementById("can");
var ctx = can.getContext("2d");

var arr = [];
var grid = [];
const drag = 75;
var settings = {
    GRID_SIZE: 5,
    TOTAL_CIRCLES: 35,
    delay: 50,
    show: true
}, settings_copy = {};
class Circle {
    constructor() {
        this.x = 50 + ~~(Math.random() * (can.width - 100));
        this.y = 50 + ~~(Math.random() * (can.height - 100));
        this.radius = 10 + ~~(Math.random() * 20);
        this.target = {
            x: can.width / 2,
            y: can.height / 2
        };
        this.directions = [1, -1]
        this.vel = {
            x: 3 * Math.random() * this.directions[~~(Math.random() * 2)],
            y: 3 * Math.random() * this.directions[~~(Math.random() * 2)]
        };
    }
    update() {
        this.vel.x = (-this.x + this.target.x) / (drag * (this.radius / 15) / 10);
        this.vel.y = (-this.y + this.target.y) / (drag * (this.radius / 15) / 10);
        this.x += this.vel.x;
        this.y += this.vel.y;
    }
    draw() {
        ctx.beginPath();
        ctx.strokeStyle = "#fff";
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
    }
}

function setup() {
    // arr = [];
    grid = [];
    for (var i = arr.length; i < settings.TOTAL_CIRCLES; ++i) {
        var circ = new Circle();
        arr.push(circ);
    }
    for (var i = 0; i < can.width; i += settings.GRID_SIZE) {
        grid.push([]);
        for (var j = 0; j < can.height; j += settings.GRID_SIZE) {
            grid[i / settings.GRID_SIZE].push(0.0);
        }
    }
}
function lerp(p1, p2) {
    return {
        x: p2.x + (p1.x - p2.x) * ((1.0 - grid[p2.x / settings.GRID_SIZE][p2.y / settings.GRID_SIZE]) / (grid[p1.x / settings.GRID_SIZE][p1.y / settings.GRID_SIZE] - grid[p2.x / settings.GRID_SIZE][p2.y / settings.GRID_SIZE])),
        y: p2.y + (p1.y - p2.y) * ((1.0 - grid[p2.x / settings.GRID_SIZE][p2.y / settings.GRID_SIZE]) / (grid[p1.x / settings.GRID_SIZE][p1.y / settings.GRID_SIZE] - grid[p2.x / settings.GRID_SIZE][p2.y / settings.GRID_SIZE]))
    }
}
function v_to_b(v1, v2, v3, v4) {
    //variable to binary
    return v4 + (v3 << 1) + (v2 << 2) + (v1 << 3);
}
function draw() {
    if (JSON.stringify(settings_copy) != JSON.stringify(settings)) {
        setup();
        settings_copy = Object.assign({}, settings);
    }
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, can.width, can.height);
    for (var i = 0; i < settings.TOTAL_CIRCLES; ++i) {
        arr[i].update(i);
        settings.show && arr[i].draw();
    }
    for (var i = 0; i <= can.width; i += settings.GRID_SIZE) {
        for (var j = 0; j <= can.height; j += settings.GRID_SIZE) {
            var v = 0;
            for (var k = 0; k < settings.TOTAL_CIRCLES; ++k) {
                v += (arr[k].radius * arr[k].radius) / (((arr[k].x - i) * (arr[k].x - i)) + ((arr[k].y - j) * (arr[k].y - j)))
            }
            grid[(i / settings.GRID_SIZE)][(j / settings.GRID_SIZE)] = v;
        }
    }
    var threshold = 1.0;
    for (var i = 0; i < can.width - settings.GRID_SIZE; i += settings.GRID_SIZE) {
        for (var j = 0; j < can.height - settings.GRID_SIZE; j += settings.GRID_SIZE) {
            var a = grid[i / settings.GRID_SIZE][j / settings.GRID_SIZE] >= threshold;
            var b = grid[i / settings.GRID_SIZE][(j + settings.GRID_SIZE) / settings.GRID_SIZE] >= threshold;
            var c = grid[(i + settings.GRID_SIZE) / settings.GRID_SIZE][(j + settings.GRID_SIZE) / settings.GRID_SIZE] >= threshold;
            var d = grid[(i + settings.GRID_SIZE) / settings.GRID_SIZE][j / settings.GRID_SIZE] >= threshold;
            if (a + b + c + d == 0 || a + b + c + d == 4) continue;
            var ap = {
                x: i,
                y: j
            }, bp = {
                x: i,
                y: j + settings.GRID_SIZE
            }, cp = {
                x: i + settings.GRID_SIZE,
                y: j + settings.GRID_SIZE
            }, dp = {
                x: i + settings.GRID_SIZE,
                y: j
            };
            var p1, p2, p3, p4, temp;
            var v = v_to_b(a, b, c, d);
            if (v == 8 || v == 7) {
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
            else if (v == 4 || v == 11) {
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
            else if (v == 2 || v == 13) {
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
            else if (v == 1 || v == 14) {
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
            else if (v == 12 || v == 3) {
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
            else if (v == 9 || v == 6) {
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
            else if (v == 5) {
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
            } else if (v == 10) {
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
can.onmousemove = function (e) {
    for (var i = 0; i < settings.TOTAL_CIRCLES; ++i) {
        function timeout(i) {
            setTimeout(function () {
                if (i < window.arr.length)
                    window.arr[i].target = {
                        x: e.clientX,
                        y: e.clientY
                    }
            }, i * settings.delay);
        }
        timeout(i);
    }
};
resize();
requestAnimationFrame(draw);