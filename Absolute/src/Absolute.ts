export class Absolute {

    ingame: boolean = false;
    x: number = 0;
    y: number = 0;
    mousex: number = 0;
    mousey: number = 0;
    oldx: number = 0;
    oldy: number = 0;
    dx: number = 0;
    dy: number = 0;
    count: number = 0;
    shield: number = 0;
    showtitle: boolean = true;
    ship: HTMLImageElement;
    fire: HTMLImageElement[];
    firecnt: number = 0;
    bullet: HTMLImageElement;
    bx: number[];
    by: number[];
    bmy: number = 16;
    bul_xs: number = 54;
    bul_ys: number = 8;
    meteor: HTMLImageElement;
    maxmet: number = 0;
    metcount: number = 0;
    mtotal: number = 0;
    mrenew: number = 0;
    metmy: number = 0;
    metx: number[];
    mety: number[];
    metf: number[];
    metr: boolean[];
    sxmet: number = 80;
    symet: number = 84;
    starsX: number[];
    starsY: number[];
    starsC: string[];
    numStars: number = 30;
    speed: number = 6;
    xSize: number = 0;
    ySize: number = 0;
    boom: HTMLImageElement[];
    rndbx: number = 0;
    rndby: number = 0;
    rndcnt: number = 777;
    sxbom: number = 71;
    sybom: number = 100;
    bframes: number = 4;
    distance: number = 0;
    maxdist: number = 2000;
    slevel: number = 0;
    blevel: number = 0;
    difflev: number = 0;
    bosslevel: number = 0;
    smax: number = 0;
    bmax: number = 0;
    scur: number = 0;
    bcur: number = 0;
    renew: number = 0;
    rcnt: number = 0;
    sstretch: number = 0;
    txtalign: number = 100;
    score: number = 0;
    blast: HTMLAudioElement;
    crash: HTMLAudioElement;
    kill: HTMLAudioElement;
    sunbird: boolean = false;
    sbefore: boolean = false;
    safter: boolean = false;
    sbx: number = 0;
    sby: number = 0;
    sbmove: number = 0;
    maxtribe: number = 0;
    tribe: number = 0;
    sbfx: number[];
    sbfy: number[];
    maxshield: number = 9;
    backcol: number = 1056832;
    fireframe: number = 2;
    borderwidth: number = 0;
    sxsize: number = 90;
    sysize: number = 39;
    sxfire: number = 11;
    syfire: number = 6;
    movex: number = 10;
    movey: number = 5;
    scoreheight: number = 45;
    screendelay: number = 300;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private m_animTimer: number = 0;

    public Main(): void {
        this.Init();
        this.installListeners();
        this.addHitListener(this.canvas);
        this.LifeCycle();
    }

    public Init(): void {
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        let body: Element = document.querySelector("body");
        let size: number = Math.min(body.clientHeight, body.clientWidth);

        this.canvas.style.top = (body.clientHeight / 2 - size / 2 + 10) + "px";
        this.canvas.style.left = (body.clientWidth / 2 - size / 2 + 10) + "px";
        this.ctx = this.canvas.getContext("2d");

        this.ship = <HTMLImageElement>document.getElementById("sprite-ship");
        this.bullet = <HTMLImageElement>document.getElementById("sprite-bullet");
        this.fire = new Array(this.fireframe);

        let n: number;
        for (n = 0; n < this.fireframe; n++) {
            this.fire[n] = <HTMLImageElement>document.getElementById("sprite-fire" + n);
        }
        this.boom = new Array(this.bframes + 1);
        for (n = 0; n <= this.bframes; n++) {
            this.boom[n] = <HTMLImageElement>document.getElementById("sprite-boom" + n);
        }
        this.xSize = (Math.trunc(this.canvas.width - this.borderwidth * 2));
        this.ySize = (Math.trunc(this.canvas.height - this.borderwidth * 2 - this.scoreheight));
        this.x = (Math.trunc((this.xSize - this.sxsize) / 2));
        this.y = this.ySize - this.sysize - this.scoreheight - this.borderwidth;
        this.mousex = -1;
        this.blevel = 3;
        this.slevel = 3;
        this.bx = new Array(this.blevel * 10);
        this.by = new Array(this.blevel * 10);
        for (n = 0; n < this.blevel * 10; n++) {
            this.bx[n] = -1;
        }
        this.meteor = <HTMLImageElement>document.getElementById("sprite-meteor");
        this.maxmet = (Math.trunc(this.canvas.height / this.symet + 1));
        this.maxmet = this.maxmet * 10;
        this.metx = new Array(this.maxmet);
        this.mety = new Array(this.maxmet);
        this.metf = new Array(this.maxmet);
        this.metr = new Array(this.maxmet);
        this.blast = <HTMLAudioElement>document.getElementById("blast");
        this.crash = <HTMLAudioElement>document.getElementById("collisn");
        this.kill = <HTMLAudioElement>document.getElementById("destroy");
        this.InitStars();
        this.rndcnt = 777;
        this.sbfx = new Array(11);
        this.sbfy = new Array(11);
        this.sbfx[0] = 10;
        this.sbfy[0] = 0;
        this.sbfx[1] = 15;
        this.sbfy[1] = 10;
        this.sbfx[2] = 0;
        this.sbfy[2] = 10;
        this.sbfx[3] = 3;
        this.sbfy[3] = 15;
        this.sbfx[4] = 17;
        this.sbfy[4] = 15;
        this.sbfx[5] = 20;
        this.sbfy[5] = 20;
        this.sbfx[6] = 23;
        this.sbfy[6] = 15;
        this.sbfx[7] = 37;
        this.sbfy[7] = 15;
        this.sbfx[8] = 40;
        this.sbfy[8] = 10;
        this.sbfx[9] = 25;
        this.sbfy[9] = 10;
        this.sbfx[10] = 30;
        this.sbfy[10] = 0;
    }

    public InitStars(): void {
        this.starsX = new Array(this.numStars);
        this.starsY = new Array(this.numStars);
        this.starsC = new Array(this.numStars);
        for (let i: number = 0; i < this.numStars; i++) {
            this.starsX[i] = (Math.trunc((Math.random() * this.xSize - 1) + 1));
            this.starsY[i] = (Math.trunc((Math.random() * this.ySize - 1) + 1));
            this.starsC[i] = this.NewColor();
        }
    }

    public Paint(): void {
        if (this.ingame) {
            this.PlayGame();
        } else {
            this.ShowIntroScreen();
        }
    }

    public PlayGame(): void {
        this.NewMeteor();
        this.MoveShip();
        this.DrawPlayField();
        if (this.sunbird) {
            this.SunBird();
        }
        this.ShowScore();
        this.distance++;
        this.score += 100;
        if (this.distance % this.maxdist === 0) {
            this.difflev++;
            if (this.difflev > 2 && this.difflev < 10) {
                this.renew -= 20;
                this.bmax += 1;
                this.smax += 1;
                this.metmy++;
                this.mrenew--;
            }
            if (this.difflev > 3 && this.difflev < 11) {
                this.maxtribe++;
                this.sbmove++;
            }
            if (this.difflev > 3) {
                this.sunbird = true;
                this.tribe = this.maxtribe;
            }
        }

        this.rcnt++;
        if (this.rcnt % ((Math.trunc(this.renew / this.blevel))) === 0) {
            this.bcur++;
            if (this.bcur > this.bmax)
                this.bcur = this.bmax;
        }
        if (this.distance % 500 === 0) {
            this.scur++;
            if (this.scur > this.smax)
                this.scur = this.smax;
        }

        if (this.rcnt > this.renew)
            this.rcnt = 0;
    }

    public ShowIntroScreen(): void {
        this.DrawPlayField();
        if (this.rndcnt > this.bframes) {
            this.rndbx = (Math.trunc(Math.random() * (this.xSize - this.sxbom) + 1));
            this.rndby = (Math.trunc(Math.random() * (this.ySize - this.sybom) + 1));
            this.rndcnt = 0;
        }
        this.ctx.drawImage(this.boom[this.rndcnt], this.rndbx, this.rndby);
        if (this.m_animTimer > 0.5) {
            this.rndcnt++;
            this.m_animTimer = 0;
        }
        this.m_animTimer += 0.1;

        for (let i: number = 0; i < (Math.trunc(this.xSize / this.bul_xs)); i++) {
            this.ctx.drawImage(this.bullet, i * this.bul_xs, 0);
            this.ctx.drawImage(this.bullet, i * this.bul_xs, this.ySize - this.bul_ys);
        }

        if (this.showtitle) {
            this.ctx.font = "30px Arial";
            this.ctx.fillStyle = "white";
            this.ctx.fillText("Absolute Space", (this.canvas.width - 240) / 2, (this.canvas.height - 80) / 2);

            this.ctx.font = "14px Arial";
            this.ctx.fillText("(c)2000 by Aleksey Udovydchenko", (this.canvas.width - 240) / 2, (this.canvas.height - 40) / 2);

            this.ctx.fillText("freewebdesign@crosswinds.net", (this.canvas.width - 240) / 2, (this.canvas.height - 0) / 2);

            this.ctx.fillText("Javascript conversion by Ian Wigley 2016", (this.canvas.width - 290) / 2,
                (this.canvas.height + 40) / 2);
        } else {
            this.ctx.fillStyle = "white";
            this.ctx.font = "14px Arial";
            this.ctx.fillText("Press the Left Mouse Button to start game", (this.canvas.width - 260) / 2, (this.canvas.height - 40) / 2);

            this.ctx.fillText("Use cursor keys to move, press left CTRL to fire", (this.canvas.width - 300) / 2,
                (this.canvas.height - 0) / 2);
            this.ctx.fillText("LAST SCORE: " + this.score, (this.canvas.width - 100) / 2, (this.canvas.height + 40) / 2);
        }

        this.count--;
        if (this.count <= 0) {
            this.count = this.screendelay;
            this.showtitle = !this.showtitle;
        }
    }

    public DrawPlayField(): void {
        this.ctx.clearRect(0, 0, 1024, 768);
        this.MoveStars();
        for (let a: number = 0; a < this.numStars; a++) {

            this.ctx.strokeStyle = "yellow";
            this.ctx.fillStyle = this.starsC[a];
            this.ctx.beginPath();
            this.ctx.arc(this.starsX[a], this.starsY[a], 2, 0, Math.PI * 2, true);
            this.ctx.fill();
        }

        this.ShowMeteors();
        this.KillEmAll();
        this.ctx.drawImage(this.ship, this.x, this.y);
        if (this.firecnt !== 0) {

            this.ctx.drawImage(this.fire[this.firecnt - 1], this.x + ((Math.trunc((this.sxsize - this.sxfire) / 2))), this.y + this.sysize);
        }

        this.firecnt++;
        if (this.firecnt > 2) {
            this.firecnt = 0;
        }
        this.Collisions();

        if (this.shield > 0) {
            this.ctx.beginPath();

            this.ctx.save();
            this.ctx.scale(2, 1);
            let arc = this.x + 42;
            this.ctx.arc(arc /= 2, this.y + 20, 30, 0, this.sysize + this.shield * 2);
            this.ctx.closePath();

            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = "grey";
            this.ctx.stroke();

            this.ctx.restore();

            this.shield--;
        }
    }

    public ShowScore(): void {
        let my: number;
        this.sstretch = (Math.trunc((this.xSize - this.txtalign * 2) / Math.max(this.bmax, this.smax)));
        my = (Math.trunc(this.canvas.height - this.scoreheight + 10));
        this.ctx.fillStyle = "green";
        this.ctx.font = "16px Arial";
        this.ctx.fillText("laser: " + this.bcur + "/" + this.bmax, 10, my - 30);
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "aqua";
        this.ctx.rect(this.txtalign, my - 40, this.bmax * this.sstretch, 10);
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(this.txtalign, my - 40, this.bcur * this.sstretch, 10);
        this.ctx.stroke();
        my += 15;
        this.ctx.fillStyle = "aqua";
        this.ctx.font = "16px Arial";
        this.ctx.fillText("shield: " + this.scur + "/" + this.smax, 10, my - 10);
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "red";
        this.ctx.rect(this.txtalign, my - 20, this.smax * this.sstretch, 10);
        this.ctx.fillStyle = "aqua";
        this.ctx.fillRect(this.txtalign, my - 20, this.scur * this.sstretch, 10);
        this.ctx.stroke();
        my += 20;
        this.ctx.fillStyle = "white";
        this.ctx.font = "18px Arial";
        this.ctx.fillText("Score: " + this.score, 10, my);
    }

    public MoveShip(): void {
        let xx: number;
        let yy: number;
        this.oldx = this.x;
        this.oldy = this.y;
        xx = this.mousex;
        if (xx > 0) {
            yy = this.mousey;
            if (xx < this.x)
                this.dx = -1;
            if (xx > this.x + this.sxsize)
                this.dx = 1;
            if (yy < this.y)
                this.dy = -1;
            if (yy > this.y + this.sysize)
                this.dy = 1;

            if (xx > this.x && xx < this.x + this.sxsize && yy > this.y && yy < this.y + this.sysize) {
                this.dx = 0;
                this.dy = 0;
                this.mousex = -1;
            }
        }
        this.x += this.dx * this.movex;
        this.y += this.dy * this.movey;
        if (this.x >= (this.canvas.width - this.borderwidth - this.sxsize) || this.x <= this.borderwidth) {
            this.dx = 0;
            this.x = this.oldx;
        }
    }

    public FireGun(): void {
        let n: number = 0;
        let f: number = -1;
        while ((n < this.blevel * 10 && this.bx[n] >= 0))
            n++;
        if (n < this.blevel * 10)
            f = n;
        if (f >= 0) {
            this.bx[f] = this.x + ((Math.trunc((this.sxsize - this.bul_xs) / 2)));
            this.by[f] = this.y;
            this.bcur--;
            this.blast.play();
        }
    }

    public KillEmAll(): void {
        for (let n: number = 0; n < this.blevel * 10; n++) {
            if (this.bx[n] > 0) {
                this.by[n] -= this.bmy;
                if (this.by[n] < this.borderwidth || this.MetHit(n) || this.BirdHit(this.bx[n], this.by[n])) {
                    this.bx[n] = -1;
                } else {

                    this.ctx.drawImage(this.bullet, this.bx[n], this.by[n]);
                }
            }
        }
    }

    public MetHit(f: number): boolean {
        for (let n: number = 0; n < this.maxmet; n++) {
            if (this.metx[n] >= 0) {
                if (this.metr[n] 
                    && this.bx[f] + this.bul_xs > this.metx[n] 
                    && this.bx[f] < this.metx[n] + this.sxmet 
                    && this.by[f] + this.bul_ys > this.mety[n] 
                    && this.by[f] < this.mety[n] + this.symet) {
                    this.DelMeteor(n);
                    this.kill.play();
                    return true;
                }
            }
        }
        return false;
    }

    public ShowMeteors(): void {
        let n: number;
        this.mtotal = 0;
        for (n = 0; n < this.maxmet; n++) {
            if (this.metx[n] >= 0) {
                this.mtotal++;
                this.mety[n] += this.metmy;
                if (this.mety[n] > this.canvas.height) {
                    this.DelMeteor(n);
                } else if (this.metr[n]) {
                    this.ctx.drawImage(this.meteor, this.metx[n], this.mety[n]);
                } else {
                    this.ctx.drawImage(this.boom[this.bframes - this.metf[n]], this.metx[n] + (Math.trunc((this.sxmet - this.sxbom) / 2)),
                        this.mety[n] + (Math.trunc((this.symet - this.sybom) / 2)));
                    if (this.m_animTimer > 0.5) {
                        this.rndcnt++;
                        this.m_animTimer = 0;
                    }
                    this.m_animTimer += 0.1;
                    this.metf[n]--;
                    if (this.metf[n] < 0)
                        this.DelMeteor(n);
                }
            }
        }
    }

    public NewMeteor(): void {
        let n: number = 0;
        let f: number = -1;
        this.metcount++;
        if (this.metcount > (Math.trunc(this.mrenew / this.metmy))) {
            this.metcount = 0;

            while ((n < this.maxmet && this.metx[n] >= 0))
                n++;
            if (n < this.maxmet)
                f = n;
            if (f >= 0) {
                this.metx[f] = (Math.trunc(Math.random() * (this.xSize - this.sxmet) + 1));
                this.mety[f] = this.borderwidth - this.symet;
                this.metr[f] = true;
                this.metf[f] = this.bframes;
            }
        }
    }

    public MoveStars(): void {
        for (let i: number = 0; i < this.numStars; i++) {
            if (this.starsY[i] + 1 > this.ySize - (this.speed * 2)) {
                this.starsY[i] = 0;
                this.starsX[i] = (Math.trunc((Math.random() * this.xSize - 1) + 1));
                this.starsC[i] = this.NewColor();
            } else {
                this.starsY[i] += this.speed;
            }
        }
    }

    public Collisions(): void {
        for (let n: number = 0; n < this.maxmet; n++) {
            if (this.metx[n] > -1) {
                if (this.metr[n]
                    && this.x + this.sxsize > this.metx[n]
                    && this.x < this.metx[n] + this.sxmet
                    && this.y + this.sysize > this.mety[n]
                    && this.y < this.mety[n] + this.symet) {
                    this.HitShip();
                    this.DelMeteor(n);
                }
            }
        }
    }

    public HitShip(): void {
        this.crash.play();
        this.shield = this.maxshield;
        this.scur--;
        if (this.scur < 0)
            this.GameOver();
    }

    public DelMeteor(n: number): void {
        if (this.metr[n]) {
            this.metr[n] = false;
            this.metf[n] = this.bframes;
        } else {
            this.metx[n] = -1;
            this.metr[n] = true;
            this.metf[n] = 0;
        }
    }

    public NewColor(): string {
        let color = ["#AAAAAA", "#FF9992", "#BF9232"];
        return color[Math.floor(Math.random() * color.length)];
    }

    public GameStart(): void {
        this.bmax = this.blevel * this.blevel;
        this.bcur = this.bmax;
        this.smax = this.slevel * this.slevel;
        this.scur = this.smax;
        this.difflev = 3;
        this.distance = 0;
        this.score = 0;
        this.renew = 250;
        for (let n: number = 0; n < this.maxmet; n++) {
            this.metx[n] = -1;
            this.metf[n] = 0;
            this.metr[n] = true;
        }

        this.metcount = 0;
        this.metmy = 2;
        this.mrenew = 60;
        this.sbx = -1;
        this.sbmove = 2;
        this.maxtribe = 1;
        this.sunbird = false;
        this.sbefore = true;
        this.safter = false;
    }

    public GameOver(): void {
        this.ingame = false;
    }

    public SunBird(): void {
        let xcur: number[];
        let ycur: number[];
        xcur = new Array(11);
        ycur = new Array(11);
        if (this.sbx < 0) {
            this.sbx = (Math.trunc((Math.random() * this.xSize - 40) + 1));
            this.sby = -5;
            this.sbefore = true;
            this.safter = false;
        }

        this.sby += this.sbmove;
        this.ctx.beginPath();
        if (this.y + (Math.trunc(this.sysize / 2)) < this.sby)
            this.safter = true;


        if (this.sbefore && this.safter) {
            this.ctx.fillRect(0, this.sby + 15, this.xSize, 2);
            this.HitShip();
        }

        for (let i: number = 0; i < 11; i++) {
            xcur[i] = this.sbfx[i] + this.sbx;
            ycur[i] = this.sbfy[i] + this.sby;
            this.ctx.lineTo(xcur[i], ycur[i]);
        }

        this.ctx.lineTo(xcur[0], ycur[0]);
        this.ctx.stroke();

        if (this.sby > this.xSize + 20) {
            this.sbx = -1;
            this.sbefore = true;
            this.safter = false;
        }

        this.sbefore = false;
        if (this.y + (Math.trunc(this.sysize / 2)) > this.sby)
            this.sbefore = true;
    }

    public BirdHit(blx: number, bly: number): boolean {
        if (this.sunbird) {
            if (blx + this.bul_xs > this.sbx
                && blx < this.sbx + 40
                && bly + this.bul_ys > this.sby
                && bly < this.sby + 20) {
                this.tribe--;
                if (this.tribe < 0) {
                    this.sunbird = false;
                }
                this.sbx = -1;
                this.sbefore = true;
                this.safter = false;
                return true;
            }
        }
        return false;
    }

    public LifeCycle(): void {
        requestAnimationFrame(this.LifeCycle.bind(this));
        this.Paint();
    }

    public installListeners(): void {
        this.canvas.addEventListener("mousedown", (event) => {
            this.onMouseDown(event);
            return null;
        },
            true);
        this.canvas.addEventListener("mousemove", (event) => {
            this.onMouseMove(event);
            return null;
        },
            true);
        this.canvas.addEventListener("mouseup", (event) => {
            this.onMouseUp(event);
            return null;
        },
            true);
    }

    private addHitListener(element: HTMLElement): void {
        globalThis.addEventListener("keydown", (event) => {
            this.onKeyPress(event);
            return null;
        });
    }

    public onMouseDown(event: MouseEvent) {
        event.preventDefault();
        this.ingame = true;
        this.GameStart();
    }

    public onMouseUp(event: MouseEvent) {
        event.preventDefault();
    }

    public onMouseMove(event: MouseEvent) {
        event.preventDefault();
        this.onInputDeviceMove(event, false);
    }

    public onInputDeviceMove(event: Event, touchDevice: boolean) { }

    public onKeyPress(event: KeyboardEvent) {
        event.preventDefault();
        this.onKeyboardPress(event, false);
    }

    public onKeyboardPress(event: Event, touchDevice: boolean) {

        const keyEvent = event as KeyboardEvent;
        switch (keyEvent.key) {
            case 'Control':
                if (this.bcur > 0) {
                    this.FireGun();
                }
                break;
            case 'ArrowLeft':
                this.dx = -1;
                break;
            case 'ArrowRight':
                this.dx += 1;
                break;
        }
    }
}
