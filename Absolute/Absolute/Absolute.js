var Absolute = (function () {
    function Absolute() {
        this.bosslevel = 0;
    }
    Absolute.main = function (args) {
        Absolute.init();
        Absolute.installListeners();
        Absolute.addHitListener(Absolute.canvas);
        Absolute.LifeCycle();
    };
    Absolute.init = function () {
        Absolute.canvas = document.getElementById("canvas");
        var body = document.querySelector("body");
        var size = Math.min(body.clientHeight, body.clientWidth);
        Absolute.canvas.width = 1024;
        Absolute.canvas.height = 768;
        Absolute.canvas.style.top = (body.clientHeight / 2 - size / 2 + 10) + "px";
        Absolute.canvas.style.left = (body.clientWidth / 2 - size / 2 + 10) + "px";
        Absolute.ctx = Absolute.canvas.getContext("2d");
        var n;
        Absolute.ship = document.getElementById("sprite-ship");
        Absolute.bullet = document.getElementById("sprite-bullet");
        Absolute.fire = new Array(Absolute.fireframe);
        for (n = 0; n < Absolute.fireframe; n++) {
            Absolute.fire[n] = document.getElementById("sprite-fire" + n);
        }
        Absolute.boom = new Array(Absolute.bframes + 1);
        for (n = 0; n <= Absolute.bframes; n++) {
            Absolute.boom[n] = document.getElementById("sprite-boom" + n);
        }
        Absolute.xSize = ((Absolute.canvas.width - Absolute.borderwidth * 2) | 0);
        Absolute.ySize = ((Absolute.canvas.height - Absolute.borderwidth * 2 - Absolute.scoreheight) | 0);
        Absolute.x = ((Absolute.xSize - Absolute.sxsize) / 2 | 0);
        Absolute.y = Absolute.ySize - Absolute.sysize - Absolute.scoreheight - Absolute.borderwidth;
        Absolute.mousex = -1;
        Absolute.blevel = 3;
        Absolute.slevel = 3;
        Absolute.bx = new Array(Absolute.blevel * 10);
        Absolute.by = new Array(Absolute.blevel * 10);
        for (n = 0; n < Absolute.blevel * 10; n++) {
            Absolute.bx[n] = -1;
        }
        Absolute.meteor = document.getElementById("sprite-meteor");
        Absolute.maxmet = ((Absolute.canvas.height / Absolute.symet + 1) | 0);
        Absolute.maxmet = Absolute.maxmet * 10;
        Absolute.metx = new Array(Absolute.maxmet);
        Absolute.mety = new Array(Absolute.maxmet);
        Absolute.metf = new Array(Absolute.maxmet);
        Absolute.metr = new Array(Absolute.maxmet);
        Absolute.blast = document.getElementById("blast");
        Absolute.crash = document.getElementById("collisn");
        Absolute.kill = document.getElementById("destroy");
        Absolute.initStars();
        Absolute.rndcnt = 777;
        Absolute.sbfx = new Array(11);
        Absolute.sbfy = new Array(11);
        Absolute.sbfx[0] = 10;
        Absolute.sbfy[0] = 0;
        Absolute.sbfx[1] = 15;
        Absolute.sbfy[1] = 10;
        Absolute.sbfx[2] = 0;
        Absolute.sbfy[2] = 10;
        Absolute.sbfx[3] = 3;
        Absolute.sbfy[3] = 15;
        Absolute.sbfx[4] = 17;
        Absolute.sbfy[4] = 15;
        Absolute.sbfx[5] = 20;
        Absolute.sbfy[5] = 20;
        Absolute.sbfx[6] = 23;
        Absolute.sbfy[6] = 15;
        Absolute.sbfx[7] = 37;
        Absolute.sbfy[7] = 15;
        Absolute.sbfx[8] = 40;
        Absolute.sbfy[8] = 10;
        Absolute.sbfx[9] = 25;
        Absolute.sbfy[9] = 10;
        Absolute.sbfx[10] = 30;
        Absolute.sbfy[10] = 0;
    };
    Absolute.initStars = function () {
        Absolute.starsX = new Array(Absolute.numStars);
        Absolute.starsY = new Array(Absolute.numStars);
        Absolute.starsC = new Array(Absolute.numStars);
        for (var i = 0; i < Absolute.numStars; i++) {
            Absolute.starsX[i] = (((Math.random() * Absolute.xSize - 1) + 1) | 0);
            Absolute.starsY[i] = (((Math.random() * Absolute.ySize - 1) + 1) | 0);
            Absolute.starsC[i] = Absolute.NewColor();
        }
    };
    Absolute.paint = function () {
        if (Absolute.ingame) {
            Absolute.PlayGame();
        }
        else {
            Absolute.ShowIntroScreen();
        }
    };
    Absolute.PlayGame = function () {
        Absolute.NewMeteor();
        Absolute.MoveShip();
        Absolute.DrawPlayField();
        if (Absolute.sunbird)
            Absolute.SunBird();
        Absolute.ShowScore();
        Absolute.distance++;
        Absolute.score += 100;
        if (Absolute.distance % Absolute.maxdist === 0) {
            Absolute.difflev++;
            if (Absolute.difflev > 2 && Absolute.difflev < 10) {
                Absolute.renew -= 20;
                Absolute.bmax += 1;
                Absolute.smax += 1;
                Absolute.metmy++;
                Absolute.mrenew--;
            }
            if (Absolute.difflev > 3 && Absolute.difflev < 11) {
                Absolute.maxtribe++;
                Absolute.sbmove++;
            }
            if (Absolute.difflev > 3) {
                Absolute.sunbird = true;
                Absolute.tribe = Absolute.maxtribe;
            }
        }
        Absolute.rcnt++;
        if (Absolute.rcnt % ((Absolute.renew / Absolute.blevel | 0)) === 0) {
            Absolute.bcur++;
            if (Absolute.bcur > Absolute.bmax)
                Absolute.bcur = Absolute.bmax;
        }
        if (Absolute.distance % 500 === 0) {
            Absolute.scur++;
            if (Absolute.scur > Absolute.smax)
                Absolute.scur = Absolute.smax;
        }
        if (Absolute.rcnt > Absolute.renew)
            Absolute.rcnt = 0;
    };
    Absolute.ShowIntroScreen = function () {
        Absolute.DrawPlayField();
        if (Absolute.rndcnt > Absolute.bframes) {
            Absolute.rndbx = ((Math.random() * (Absolute.xSize - Absolute.sxbom) + 1) | 0);
            Absolute.rndby = ((Math.random() * (Absolute.ySize - Absolute.sybom) + 1) | 0);
            Absolute.rndcnt = 0;
        }
        Absolute.ctx.drawImage(Absolute.boom[Absolute.rndcnt], Absolute.rndbx, Absolute.rndby);
        Absolute.rndcnt++;
        for (var i = 0; i < (Absolute.xSize / Absolute.bul_xs | 0); i++) {
            Absolute.ctx.drawImage(Absolute.bullet, i * Absolute.bul_xs, 0);
            Absolute.ctx.drawImage(Absolute.bullet, i * Absolute.bul_xs, Absolute.ySize - Absolute.bul_ys);
        }
        if (Absolute.showtitle) {
            Absolute.ctx.font = "30px Arial";
            Absolute.ctx.fillStyle = "white";
            Absolute.ctx.fillText("Absolute Space", (Absolute.canvas.width - 240) / 2, (Absolute.canvas.height - 80) / 2);
            Absolute.ctx.font = "14px Arial";
            Absolute.ctx.fillText("(c)2000 by Aleksey Udovydchenko", (Absolute.canvas.width - 240) / 2, (Absolute.canvas.height - 40) / 2);
            Absolute.ctx.fillText("freewebdesign@crosswinds.net", (Absolute.canvas.width - 240) / 2, (Absolute.canvas.height - 0) / 2);
            Absolute.ctx.fillText("Javascript conversion by Ian Wigley 2016", (Absolute.canvas.width - 290) / 2, (Absolute.canvas.height + 40) / 2);
        }
        else {
            Absolute.ctx.fillStyle = "white";
            Absolute.ctx.font = "14px Arial";
            Absolute.ctx.fillText("Press the Left Mouse Button to start game", (Absolute.canvas.width - 260) / 2, (Absolute.canvas.height - 40) / 2);
            Absolute.ctx.fillText("Use cursor keys to move, press left CTRL to fire", (Absolute.canvas.width - 300) / 2, (Absolute.canvas.height - 0) / 2);
            Absolute.ctx.fillText("LAST SCORE: " + Absolute.score, (Absolute.canvas.width - 100) / 2, (Absolute.canvas.height + 40) / 2);
        }
        Absolute.count--;
        if (Absolute.count <= 0) {
            Absolute.count = Absolute.screendelay;
            Absolute.showtitle = !Absolute.showtitle;
        }
    };
    Absolute.DrawPlayField = function () {
        Absolute.ctx.clearRect(0, 0, 1024, 768);
        Absolute.moveStars();
        for (var a = 0; a < Absolute.numStars; a++) {
            Absolute.ctx.strokeStyle = "yellow";
            Absolute.ctx.fillStyle = Absolute.starsC[a];
            Absolute.ctx.beginPath();
            Absolute.ctx.arc(Absolute.starsX[a], Absolute.starsY[a], 2, 0, Math.PI * 2, true);
            Absolute.ctx.fill();
        }
        Absolute.ShowMeteors();
        Absolute.KillEmAll();
        Absolute.ctx.drawImage(Absolute.ship, Absolute.x, Absolute.y);
        if (Absolute.firecnt !== 0) {
            Absolute.ctx.drawImage(Absolute.fire[Absolute.firecnt - 1], Absolute.x + (((Absolute.sxsize - Absolute.sxfire) / 2 | 0)), Absolute.y + Absolute.sysize);
        }
        Absolute.firecnt++;
        if (Absolute.firecnt > 2) {
            Absolute.firecnt = 0;
        }
        Absolute.Collisions();
        if (Absolute.shield > 0) {
            Absolute.ctx.beginPath();
            Absolute.ctx.save();
            Absolute.ctx.scale(2, 1);
            var arc = Absolute.x + 42;
            Absolute.ctx.arc(arc /= 2, Absolute.y + 20, 30, 0, Absolute.sysize + Absolute.shield * 2);
            Absolute.ctx.closePath();
            Absolute.ctx.lineWidth = 1;
            Absolute.ctx.strokeStyle = "grey";
            Absolute.ctx.stroke();
            Absolute.ctx.restore();
            Absolute.shield--;
        }
    };
    Absolute.ShowScore = function () {
        var my;
        Absolute.sstretch = (((Absolute.xSize - Absolute.txtalign * 2) / Math.max(Absolute.bmax, Absolute.smax)) | 0);
        my = ((Absolute.canvas.height - Absolute.scoreheight + 10) | 0);
        Absolute.ctx.fillStyle = "green";
        Absolute.ctx.font = "16px Arial";
        Absolute.ctx.fillText("laser: " + Absolute.bcur + "/" + Absolute.bmax, 10, my - 30);
        Absolute.ctx.beginPath();
        Absolute.ctx.lineWidth = 1;
        Absolute.ctx.strokeStyle = "aqua";
        Absolute.ctx.rect(Absolute.txtalign, my - 40, Absolute.bmax * Absolute.sstretch, 10);
        Absolute.ctx.fillStyle = "green";
        Absolute.ctx.fillRect(Absolute.txtalign, my - 40, Absolute.bcur * Absolute.sstretch, 10);
        Absolute.ctx.stroke();
        my += 15;
        Absolute.ctx.fillStyle = "aqua";
        Absolute.ctx.font = "16px Arial";
        Absolute.ctx.fillText("shield: " + Absolute.scur + "/" + Absolute.smax, 10, my - 10);
        Absolute.ctx.beginPath();
        Absolute.ctx.lineWidth = 1;
        Absolute.ctx.strokeStyle = "red";
        Absolute.ctx.rect(Absolute.txtalign, my - 20, Absolute.smax * Absolute.sstretch, 10);
        Absolute.ctx.fillStyle = "aqua";
        Absolute.ctx.fillRect(Absolute.txtalign, my - 20, Absolute.scur * Absolute.sstretch, 10);
        Absolute.ctx.stroke();
        my += 20;
        Absolute.ctx.fillStyle = "white";
        Absolute.ctx.font = "18px Arial";
        Absolute.ctx.fillText("Score: " + Absolute.score, 10, my);
    };
    Absolute.MoveShip = function () {
        var xx;
        var yy;
        Absolute.oldx = Absolute.x;
        Absolute.oldy = Absolute.y;
        xx = Absolute.mousex;
        if (xx > 0) {
            yy = Absolute.mousey;
            if (xx < Absolute.x)
                Absolute.dx = -1;
            if (xx > Absolute.x + Absolute.sxsize)
                Absolute.dx = 1;
            if (yy < Absolute.y)
                Absolute.dy = -1;
            if (yy > Absolute.y + Absolute.sysize)
                Absolute.dy = 1;
            if (xx > Absolute.x && xx < Absolute.x + Absolute.sxsize && yy > Absolute.y && yy < Absolute.y + Absolute.sysize) {
                Absolute.dx = 0;
                Absolute.dy = 0;
                Absolute.mousex = -1;
            }
        }
        Absolute.x += Absolute.dx * Absolute.movex;
        Absolute.y += Absolute.dy * Absolute.movey;
        if (Absolute.x >= (Absolute.canvas.width - Absolute.borderwidth - Absolute.sxsize) || Absolute.x <= Absolute.borderwidth) {
            Absolute.dx = 0;
            Absolute.x = Absolute.oldx;
        }
    };
    Absolute.FireGun = function () {
        var n = 0;
        var f = -1;
        while ((n < Absolute.blevel * 10 && Absolute.bx[n] >= 0))
            n++;
        if (n < Absolute.blevel * 10)
            f = n;
        if (f >= 0) {
            Absolute.bx[f] = Absolute.x + (((Absolute.sxsize - Absolute.bul_xs) / 2 | 0));
            Absolute.by[f] = Absolute.y;
            Absolute.bcur--;
            Absolute.blast.play();
        }
    };
    Absolute.KillEmAll = function () {
        for (var n = 0; n < Absolute.blevel * 10; n++) {
            if (Absolute.bx[n] > 0) {
                Absolute.by[n] -= Absolute.bmy;
                if (Absolute.by[n] < Absolute.borderwidth || Absolute.MetHit(n) || Absolute.BirdHit(Absolute.bx[n], Absolute.by[n])) {
                    Absolute.bx[n] = -1;
                }
                else {
                    Absolute.ctx.drawImage(Absolute.bullet, Absolute.bx[n], Absolute.by[n]);
                }
            }
        }
    };
    Absolute.MetHit = function (f) {
        for (var n = 0; n < Absolute.maxmet; n++) {
            if (Absolute.metx[n] >= 0) {
                if (Absolute.metr[n] && Absolute.bx[f] + Absolute.bul_xs > Absolute.metx[n] && Absolute.bx[f] < Absolute.metx[n] + Absolute.sxmet && Absolute.by[f] + Absolute.bul_ys > Absolute.mety[n] && Absolute.by[f] < Absolute.mety[n] + Absolute.symet) {
                    Absolute.DelMeteor(n);
                    Absolute.kill.play();
                    return true;
                }
            }
        }
        return false;
    };
    Absolute.ShowMeteors = function () {
        var n;
        Absolute.mtotal = 0;
        for (n = 0; n < Absolute.maxmet; n++) {
            if (Absolute.metx[n] >= 0) {
                Absolute.mtotal++;
                Absolute.mety[n] += Absolute.metmy;
                if (Absolute.mety[n] > Absolute.canvas.height - Absolute.borderwidth - Absolute.scoreheight - 100) {
                    Absolute.DelMeteor(n);
                }
                else {
                    if (Absolute.metr[n]) {
                        Absolute.ctx.drawImage(Absolute.meteor, Absolute.metx[n], Absolute.mety[n]);
                    }
                    else {
                        Absolute.ctx.drawImage(Absolute.boom[Absolute.bframes - Absolute.metf[n]], Absolute.metx[n] + ((Absolute.sxmet - Absolute.sxbom) / 2 | 0), Absolute.mety[n] + ((Absolute.symet - Absolute.sybom) / 2 | 0));
                        Absolute.metf[n]--;
                        if (Absolute.metf[n] < 0)
                            Absolute.DelMeteor(n);
                    }
                }
            }
        }
    };
    Absolute.NewMeteor = function () {
        var n = 0;
        var f = -1;
        Absolute.metcount++;
        if (Absolute.metcount > (Absolute.mrenew / Absolute.metmy | 0)) {
            Absolute.metcount = 0;
            while ((n < Absolute.maxmet && Absolute.metx[n] >= 0))
                n++;
            if (n < Absolute.maxmet)
                f = n;
            if (f >= 0) {
                Absolute.metx[f] = ((Math.random() * (Absolute.xSize - Absolute.sxmet) + 1) | 0);
                Absolute.mety[f] = Absolute.borderwidth - Absolute.symet;
                Absolute.metr[f] = true;
                Absolute.metf[f] = Absolute.bframes;
            }
        }
    };
    Absolute.moveStars = function () {
        for (var i = 0; i < Absolute.numStars; i++) {
            if (Absolute.starsY[i] + 1 > Absolute.ySize - (Absolute.speed * 2)) {
                Absolute.starsY[i] = 0;
                Absolute.starsX[i] = (((Math.random() * Absolute.xSize - 1) + 1) | 0);
                Absolute.starsC[i] = Absolute.NewColor();
            }
            else {
                Absolute.starsY[i] += Absolute.speed;
            }
        }
    };
    Absolute.Collisions = function () {
        for (var n = 0; n < Absolute.maxmet; n++) {
            if (Absolute.metx[n] > -1) {
                if (Absolute.metr[n] && Absolute.x + Absolute.sxsize > Absolute.metx[n] && Absolute.x < Absolute.metx[n] + Absolute.sxmet && Absolute.y + Absolute.sysize > Absolute.mety[n] &&
                    Absolute.y < Absolute.mety[n] + Absolute.symet) {
                    Absolute.HitShip();
                    Absolute.DelMeteor(n);
                }
            }
        }
    };
    Absolute.HitShip = function () {
        Absolute.crash.play();
        Absolute.shield = Absolute.maxshield;
        Absolute.scur--;
        if (Absolute.scur < 0)
            Absolute.GameOver();
    };
    Absolute.DelMeteor = function (n) {
        if (Absolute.metr[n]) {
            Absolute.metr[n] = false;
            Absolute.metf[n] = Absolute.bframes;
        }
        else {
            Absolute.metx[n] = -1;
            Absolute.metr[n] = true;
            Absolute.metf[n] = 0;
        }
    };
    Absolute.NewColor = function () {
        var color = ["#AAAAAA", "#FF9992", "#BF9232"];
        return color[Math.floor(Math.random() * color.length)];
    };
    Absolute.prototype.start = function () { };
    Absolute.prototype.stop = function () { };
    Absolute.GameStart = function () {
        Absolute.bmax = Absolute.blevel * Absolute.blevel;
        Absolute.bcur = Absolute.bmax;
        Absolute.smax = Absolute.slevel * Absolute.slevel;
        Absolute.scur = Absolute.smax;
        Absolute.difflev = 3;
        Absolute.distance = 0;
        Absolute.score = 0;
        Absolute.renew = 250;
        for (var n = 0; n < Absolute.maxmet; n++) {
            Absolute.metx[n] = -1;
            Absolute.metf[n] = 0;
            Absolute.metr[n] = true;
        }
        Absolute.metcount = 0;
        Absolute.metmy = 2;
        Absolute.mrenew = 60;
        Absolute.sbx = -1;
        Absolute.sbmove = 2;
        Absolute.maxtribe = 1;
        Absolute.sunbird = false;
        Absolute.sbefore = true;
        Absolute.safter = false;
    };
    Absolute.GameOver = function () {
        Absolute.ingame = false;
    };
    Absolute.SunBird = function () {
        var xcur;
        var ycur;
        xcur = new Array(11);
        ycur = new Array(11);
        if (Absolute.sbx < 0) {
            Absolute.sbx = (((Math.random() * Absolute.xSize - 40) + 1) | 0);
            Absolute.sby = -5;
            Absolute.sbefore = true;
            Absolute.safter = false;
        }
        Absolute.sby += Absolute.sbmove;
        Absolute.ctx.beginPath();
        if (Absolute.y + (Absolute.sysize / 2 | 0) < Absolute.sby)
            Absolute.safter = true;
        if (Absolute.sbefore && Absolute.safter) {
            Absolute.ctx.fillRect(0, Absolute.sby + 15, Absolute.xSize, 2);
            Absolute.HitShip();
        }
        for (var i = 0; i < 11; i++) {
            xcur[i] = Absolute.sbfx[i] + Absolute.sbx;
            ycur[i] = Absolute.sbfy[i] + Absolute.sby;
            Absolute.ctx.lineTo(xcur[i], ycur[i]);
        }
        Absolute.ctx.lineTo(xcur[0], ycur[0]);
        Absolute.ctx.stroke();
        if (Absolute.sby > Absolute.xSize + 20) {
            Absolute.sbx = -1;
            Absolute.sbefore = true;
            Absolute.safter = false;
        }
        Absolute.sbefore = false;
        if (Absolute.y + (Absolute.sysize / 2 | 0) > Absolute.sby)
            Absolute.sbefore = true;
    };
    Absolute.BirdHit = function (blx, bly) {
        if (Absolute.sunbird) {
            if (blx + Absolute.bul_xs > Absolute.sbx && blx < Absolute.sbx + 40 && bly + Absolute.bul_ys > Absolute.sby && bly < Absolute.sby + 20) {
                Absolute.tribe--;
                if (Absolute.tribe < 0) {
                    Absolute.sunbird = false;
                }
                Absolute.sbx = -1;
                Absolute.sbefore = true;
                Absolute.safter = false;
                return true;
            }
        }
        return false;
    };
    Absolute.LifeCycle = function () {
        Absolute.paint();
        window.requestAnimationFrame(function (time) {
            Absolute.LifeCycle();
        });
    };
    Absolute.installListeners = function () {
        Absolute.canvas.addEventListener("mousedown", function (event) {
            Absolute.onMouseDown(event);
            return null;
        }, true);
        Absolute.canvas.addEventListener("mousemove", function (event) {
            Absolute.onMouseMove(event);
            return null;
        }, true);
        Absolute.canvas.addEventListener("mouseup", function (event) {
            Absolute.onMouseUp(event);
            return null;
        }, true);
    };
    Absolute.addHitListener = function (element) {
        window.addEventListener("keydown", function (event) {
            Absolute.onKeyPress(event);
            return null;
        });
    };
    Absolute.onMouseDown = function (event) {
        event.preventDefault();
        Absolute.ingame = true;
        Absolute.GameStart();
    };
    Absolute.onMouseUp = function (event) {
        event.preventDefault();
    };
    Absolute.onMouseMove = function (event) {
        event.preventDefault();
        Absolute.onInputDeviceMove(event, false);
    };
    Absolute.onInputDeviceMove = function (event, touchDevice) { };
    Absolute.onKeyPress = function (event) {
        event.preventDefault();
        Absolute.onKeyboardPress(event, false);
    };
    Absolute.onKeyboardPress = function (event, touchDevice) {
        switch (((event.keyCode | 0))) {
            case 17:
                if (Absolute.bcur > 0) {
                    Absolute.FireGun();
                }
                break;
            case 37:
                Absolute.dx = -1;
                break;
            case 39:
                Absolute.dx += 1;
                break;
        }
    };
    Absolute.ingame = false;
    Absolute.x = 0;
    Absolute.y = 0;
    Absolute.mousex = 0;
    Absolute.mousey = 0;
    Absolute.oldx = 0;
    Absolute.oldy = 0;
    Absolute.dx = 0;
    Absolute.dy = 0;
    Absolute.count = 0;
    Absolute.shield = 0;
    Absolute.showtitle = true;
    Absolute.firecnt = 0;
    Absolute.bmy = 16;
    Absolute.bul_xs = 54;
    Absolute.bul_ys = 8;
    Absolute.sxmet = 80;
    Absolute.symet = 84;
    Absolute.numStars = 30;
    Absolute.speed = 6;
    Absolute.rndcnt = 777;
    Absolute.sxbom = 71;
    Absolute.sybom = 100;
    Absolute.bframes = 4;
    Absolute.distance = 0;
    Absolute.maxdist = 2000;
    Absolute.slevel = 0;
    Absolute.blevel = 0;
    Absolute.difflev = 0;
    Absolute.smax = 0;
    Absolute.bmax = 0;
    Absolute.scur = 0;
    Absolute.bcur = 0;
    Absolute.renew = 0;
    Absolute.rcnt = 0;
    Absolute.txtalign = 100;
    Absolute.score = 0;
    Absolute.sbx = 0;
    Absolute.sby = 0;
    Absolute.sbmove = 0;
    Absolute.maxtribe = 0;
    Absolute.tribe = 0;
    Absolute.maxshield = 9;
    Absolute.backcol = 1056832;
    Absolute.fireframe = 2;
    Absolute.borderwidth = 0;
    Absolute.sxsize = 90;
    Absolute.sysize = 39;
    Absolute.sxfire = 11;
    Absolute.syfire = 6;
    Absolute.movex = 10;
    Absolute.movey = 5;
    Absolute.scoreheight = 45;
    Absolute.screendelay = 300;
    return Absolute;
}());
window.onload = function () {
    Absolute.main(null);
};
//# sourceMappingURL=Absolute.js.map