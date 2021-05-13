import Phaser from 'phaser';
import {RoundedButton, SimpleButton, Simpleimage} from '../Objects/Objects.js';
import titletiles from '../images/tilesets-big.png';
import player1 from '../images/player.png';
import player2 from '../images/player2.png';


class SceneTitle extends Phaser.Scene {
    constructor(){
        super({key:"title"});
        this.player1;
        this.player2;
        this.mapDat;
        this.map2Img;
        this.cmdDelta=35;
        this.tick=0;
        this.commandGenerator;
        this.firstposition1x = [9, 9, 15, 15, 15, 19, 19, 19, 24, 24, 24, 31, 31, 9, 9, 15, 15, 15, 19, 19, 19, 24, 24, 24, 31, 31, 9, 9, 15, 15, 19, 19, 24, 24, 31, 31];
        this.firstposition1y = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 9, 11, 8, 9, 11, 8, 12, 8, 9, 10];
        this.firstdirection = [0, 2, 0, 1, 2, 2, 1, 0, 0, 2, 1, 0, 1, 3, 2, 3, 1, 2, 1, 3, 2, 3, 2, 1, 3, 1, 0, 3, 3, 0, 3, 0, 0, 3, 0, 3];
        this.changeind = {};
        this.changeind2 = {};
        this.teleportind = {};
        this.flagfirst = false;
        this.flagfirst2 = false;
        this.hikisuu;
        this.firstposition2x = [11, 13, 16, 18, 21, 23, 27, 29, 11, 13, 16, 18, 21, 23, 27, 29, 26, 26];
        this.firstposition2y = [7, 7, 7, 7, 7, 7, 7, 7, 11, 11, 11, 11, 11, 11, 11, 11, 8, 10];
        this.firstdirection2 = [0, 1, 0, 1, 2, 1, 2, 1, 3, 1, 3, 1, 2, 1, 2, 1, 0, 3];
    }
    preload(){
        let sta = new Array(15);
        for(let i = 0; i < 15; ++i){
            let str = "stage" + i;
            sta[i] = document.getElementById(str);
            sta[i].style.visibility = "hidden";
        }
        var alert = document.getElementById("alert");
        alert.style.visibility = "hidden";
        //いらないボタンなどを隠す(クソ実装)
        const executeButton = document.getElementById("executeButton");
        executeButton.style.visibility="hidden";
        const playerChangeButton = document.getElementById("playerChangeButton");
        playerChangeButton.style.visibility="hidden";
        const blocklyDiv = document.getElementById("blocklyDiv");
        blocklyDiv.style.visibility="hidden";
        const ButtonDiv = document.getElementById("ButtonDiv");
        ButtonDiv.style.visibility="hidden";
        const resetbutton = document.getElementById("resetbutton");
        resetbutton.style.visibility="hidden";
        const titlebutton = document.getElementById("titlebutton");
        titlebutton.style.visibility="hidden";
        var map1 = require('../stage/title.json');
        this.load.tilemapTiledJSON("map", map1);
        this.load.image("tiles0", titletiles);
        this.load.spritesheet("player1", player1, { frameWidth: 32, frameHeight: 32});
        this.load.spritesheet("player2", player2, { frameWidth: 32, frameHeight: 32});
        for(let i = 0; i < 36; ++i){
            if(this.firstposition1y[i] != 5 && this.firstposition1y[i] != 13) continue;
            let id = this.firstposition1x[i] + this.firstposition1y[i] * 40;
            if(this.changeind[id]) continue;
            if(this.firstposition1x[i] == 9 && this.firstposition1y[i] == 5) this.changeind[id] = [0, 2];
            else if(this.firstposition1x[i] == 9 && this.firstposition1y[i] == 13) this.changeind[id] = [3, 2];
            else if(this.firstposition1x[i] == 31 && this.firstposition1y[i] == 13) this.changeind[id] = [1, 3]
            else if(this.firstposition1x[i] == 31 && this.firstposition1y[i] == 5) this.changeind[id] = [1, 0];
            else if(this.firstposition1y[i] == 5) this.changeind[id] = [1, 0, 2];
            else this.changeind[id] = [1, 3, 2];
        }
        for(let i = 0; i < 18; ++i){
            let id = this.firstposition2x[i] + this.firstposition2y[i] * 40;
            if(this.firstposition2x[i] != 11 && this.firstposition2x[i] != 16){
                this.teleportind[id] = i;
            }
            else{
                if(this.firstposition2y[i] == 7) this.changeind2[id] = [2, 0];
                else if(this.firstposition2y[i] == 11) this.changeind2[id] = [2, 3];
            }
        }
        let id = 371;
        this.changeind2[id] = [0, 3, 2];
        id = 376;
        this.changeind2[id] = [0, 3, 2];
        id = 302;
        this.changeind2[id] = [0, 1, 2];
        id = 462;
        this.changeind2[id] = [3, 1, 2];
        id = 373;
        this.teleportind[id] = 100;
        id = 378;
        this.teleportind[id] = 100;
    }
    create(){
        this.mapDat = this.add.tilemap("map");
        this.tileset = this.mapDat.addTilesetImage("tilesets-big", "tiles0");
        this.backgroundLayer = this.mapDat.createLayer("ground", this.tileset);
        this.movableLayer = this.mapDat.createLayer("movable", this.tileset);
        this.game.scale.setGameSize(1300, 700);
        this.add.text(200, 50, 'プ ロ グ ラ ミ ン グ 教 室', {fontFamily: "PixelMplus10", fontSize: 70, color: 'blue'});
        var firststage = new RoundedButton(this, 100, 480, 450, 50, 0xffff00, "最初のステージへ", 'red', 15);
        firststage.button.on('pointerdown', function(){
            this.scene.start("game", {stage_num:0});
        }.bind(this));
        firststage.button.on('pointerover', function(){
            firststage.button.clear();
            firststage.button.fillStyle(0x000000, 1);
            firststage.button.fillRoundedRect(87, 475, 460, 60, 15);
            firststage.button.stroke();
            firststage.button.strokeRoundedRect(87, 475, 460, 60, 15);
            firststage.button.lineStyle(4, 0x000000, 1);
        });
        firststage.button.on('pointerout', function(){
            firststage.button.clear();
            firststage.button.fillStyle(0xffff00, 1);
            firststage.button.fillRoundedRect(90, 480, 450, 50, 15);
            firststage.button.stroke();
            firststage.button.strokeRoundedRect(90, 480, 450, 50, 15);
            firststage.button.lineStyle(4, 0x000000, 1);
        });
        var stageselect = new RoundedButton(this, 700, 480, 400, 50, 0xffff00, "ステージを選ぶ", "red", 15);
        //stageselect.text
        stageselect.button.on('pointerdown', function(){
            this.scene.start("select");
        }.bind(this));
        stageselect.button.on('pointerover', function(){
            stageselect.button.clear();
            stageselect.button.fillStyle(0x000000, 1);
            stageselect.button.fillRoundedRect(687, 475, 410, 60, 15);
            stageselect.button.stroke();
            stageselect.button.strokeRoundedRect(687, 475, 410, 60, 15);
            stageselect.button.lineStyle(4, 0x000000, 1);
        });
        stageselect.button.on('pointerout', function(){
            stageselect.button.clear();
            stageselect.button.fillStyle(0xffff00, 1);
            stageselect.button.fillRoundedRect(690, 480, 400, 50, 15);
            stageselect.button.stroke();
            stageselect.button.strokeRoundedRect(690, 480, 400, 50, 15);
            stageselect.button.lineStyle(4, 0x000000, 1);
        });
        //以下タイトルのステージ
        this.map2Img =1;
        this.hikisuu = Math.floor(Math.random() * 2);
        let id;
        let playerX;
        let playerY;
        let playerdirection;
        if(this.hikisuu == 0){
            id = Math.floor(Math.random() * 36);
            playerX=this.firstposition1x[id];
            playerY=this.firstposition1y[id];
            playerdirection= this.firstdirection[id];
        }
        else{
            id = Math.floor(Math.random() * 18);
            playerX=this.firstposition2x[id];
            playerY=this.firstposition2y[id];
            playerdirection= this.firstdirection2[id];
        }
        this.player1 = this.add.sprite(this.mapDat.tileWidth * playerX * this.map2Img, this.mapDat.tileWidth * playerY * this.map2Img, "player1");
        this.player1.setOrigin(0, 0);
        this.player1.gridX=playerX;
        this.player1.gridY=playerY;
        this.player1.targetX = this.player1.x;
        this.player1.targetY = this.player1.y;
        this.player1.setFrame( playerdirection * 3 + 1);
         //player animations https://photonstorm.github.io/phaser3-docs/Phaser.Animations.AnimationState.html
        this.player1.anims.create({key:'move3-player1', frames:this.player1.anims.generateFrameNames("player1", { start: 0, end: 2 }), frameRate:10,repeat:-1});//down
        this.player1.anims.create({key:'move1-player1', frames:this.player1.anims.generateFrameNames("player1", { start: 3, end: 5 }), frameRate:10,repeat:-1});//left
        this.player1.anims.create({key:'move0-player1' , frames:this.player1.anims.generateFrameNames("player1", { start:6, end: 8 }), frameRate:10,repeat:-1});//right
        this.player1.anims.create({key:'move2-player1', frames:this.player1.anims.generateFrameNames("player1", { start: 9, end: 11 }), frameRate:10,repeat:-1});//up
        if(this.hikisuu == 0){
            id = Math.floor(Math.random() * 18);
            playerX=this.firstposition2x[id];
            playerY=this.firstposition2y[id];
            playerdirection= this.firstdirection2[id];
        }
        else{
            id = Math.floor(Math.random() * 36);
            playerX=this.firstposition1x[id];
            playerY=this.firstposition1y[id];
            playerdirection= this.firstdirection[id];
        }
        this.player2 = this.add.sprite(this.mapDat.tileWidth * playerX * this.map2Img, this.mapDat.tileWidth * playerY * this.map2Img, "player2");
        this.player2.setOrigin(0, 0);
        this.player2.gridX=playerX;
        this.player2.gridY=playerY;
        this.player2.targetX = this.player2.x;
        this.player2.targetY = this.player2.y;
        this.player2.setFrame( playerdirection*3+1 );
         //player animations https://photonstorm.github.io/phaser3-docs/Phaser.Animations.AnimationState.html
        this.player2.anims.create({key:'move3-player2', frames:this.player2.anims.generateFrameNames("player2", { start: 0, end: 2 }), frameRate:10,repeat:-1});//down
        this.player2.anims.create({key:'move1-player2', frames:this.player2.anims.generateFrameNames("player2", { start: 3, end: 5 }), frameRate:10,repeat:-1});//left
        this.player2.anims.create({key:'move0-player2' , frames:this.player2.anims.generateFrameNames("player2", { start:6, end: 8 }), frameRate:10,repeat:-1});//right
        this.player2.anims.create({key:'move2-player2', frames:this.player2.anims.generateFrameNames("player2", { start: 9, end: 11 }), frameRate:10,repeat:-1});//up
    }
    update(){
        this.commandGenerator = eval("(function* () {while(1){if(this.hikisuu == 0){this.move_player1(this.player1); this.move_player2(this.player2);} else{this.move_player1(this.player2); this.move_player2(this.player1);} yield;}}.bind(this))()");
        if (this.player1.targetX != this.player1.x) {
            const difX = this.player1.targetX - this.player1.x;
            this.player1.x += difX / Math.abs(difX) * 1; 
        }
        if (this.player1.targetY != this.player1.y) {
            const difY = this.player1.targetY - this.player1.y;
            this.player1.y += difY / Math.abs(difY) * 1;
        }
        if (this.player2.targetX != this.player2.x) {
            const difX = this.player2.targetX - this.player2.x;
            this.player2.x += difX / Math.abs(difX) * 1; 
        }
        if (this.player2.targetY != this.player2.y) {
            const difY = this.player2.targetY - this.player2.y;
            this.player2.y += difY / Math.abs(difY) * 1;
        }
        this.runCode();
    }
    getDirection(player){//向いている方向を検知する
        //todo:この中身を実装する
        //0:right,1;left,2:up,3,downを返すように
        let num=parseInt(player.frame.name);
        return [3,1,0,2][Math.floor(num/3)];
    }
    move_player1(player){
        let zahyo = player.gridX + player.gridY * 40;
        if(this.flagfirst && this.changeind[zahyo]){
            let id = Math.floor(Math.random() * this.changeind[zahyo].length);
            let preid = Math.floor(parseInt(player.frame.name) / 3);
            if(preid == 0 && this.changeind[zahyo][id] == 3) id = (id + 1) % this.changeind[zahyo].length;
            else if(preid == 3 && this.changeind[zahyo][id] == 0) id = (id + 1) % this.changeind[zahyo].length;
            else if(preid == 1 && this.changeind[zahyo][id] == 2) id = (id + 1) % this.changeind[zahyo].length;
            else if(preid == 2 && this.changeind[zahyo][id] == 1) id = (id + 1) % this.changeind[zahyo].length;
            let ind = this.changeind[zahyo][id];
            player.setFrame(ind * 3);
        }
        this.flagfirst = true;
        let dir = this.getDirection(player);
        const dx = [1, -1, 0, 0];
        const dy = [0, 0, -1, 1];
        const nextGX = player.gridX + dx[dir];
        const nextGY = player.gridY + dy[dir];
        player.anims.play('move'+dir+"-"+player.texture.key);
        player.targetX += dx[dir] * this.mapDat.tileWidth * this.map2Img;
        player.gridX = nextGX;
        player.targetY += dy[dir] * this.mapDat.tileHeight * this.map2Img;
        player.gridY = nextGY;
    }
    move_player2(player){
        let zahyo = player.gridX + player.gridY * 40;
        if(this.flagfirst2 && this.changeind2[zahyo]){
            let id = Math.floor(Math.random() * this.changeind2[zahyo].length);
            let preid = Math.floor(parseInt(player.frame.name) / 3);
            if(preid == 0 && this.changeind2[zahyo][id] == 3) id = (id + 1) % this.changeind2[zahyo].length;
            else if(preid == 3 && this.changeind2[zahyo][id] == 0) id = (id + 1) % this.changeind2[zahyo].length;
            else if(preid == 1 && this.changeind2[zahyo][id] == 2) id = (id + 1) % this.changeind2[zahyo].length;
            else if(preid == 2 && this.changeind2[zahyo][id] == 1) id = (id + 1) % this.changeind2[zahyo].length;
            let ind = this.changeind2[zahyo][id];
            player.setFrame(ind * 3);
        }
        else if(this.flagfirst2 && this.teleportind[zahyo]){
            let id = Math.floor(Math.random() * 18);
            player.setFrame(this.firstdirection2[id] * 3);
            player.gridX = this.firstposition2x[id];
            player.gridY = this.firstposition2y[id];
            player.targetX = player.x = this.mapDat.tileWidth * player.gridX * this.map2Img;
            player.targetY = player.y = this.mapDat.tileWidth * player.gridY * this.map2Img;
        }
        this.flagfirst2 = true;
        let dir = this.getDirection(player);
        const dx = [1, -1, 0, 0];
        const dy = [0, 0, -1, 1];
        const nextGX = player.gridX + dx[dir];
        const nextGY = player.gridY + dy[dir];
        player.anims.play('move'+dir+"-"+player.texture.key);
        player.targetX += dx[dir] * this.mapDat.tileWidth * this.map2Img;
        player.gridX = nextGX;
        player.targetY += dy[dir] * this.mapDat.tileHeight * this.map2Img;
        player.gridY = nextGY;
    }
    runCode() {
        if (++this.tick === this.cmdDelta) {
            //ゴール判定 goal判定
            let gen = this.commandGenerator.next();//yieldで止まってたコマンドを再開する
            if (!gen.done) this.tick = 0;
        }
    }
} 
export default SceneTitle;