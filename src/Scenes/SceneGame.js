import Blockly, { CollapsibleToolboxCategory__Class } from 'blockly';
import Phaser from 'phaser';
//import map1 from '../stage/tilemapNaomi1.json';
import nums from '../images/num.png';
import tiles2 from '../images/tilesets-big.png';
import fieldtiles from '../images/fields.png';
import boxtiles from '../images/boxes.png';
import blacktile from '../images/darkness.png';
import stageclear from '../images/stageclear2.png';
import nextstage from '../images/nextstage.png';
import nextstage2 from '../images/nextstage2.png';
import gototitle from '../images/title.png';
import gototitle2 from '../images/title-next.png';
import player1 from '../images/player.png';
import player2 from '../images/player2.png';
import star from '../images/star2.png';
import {RoundedButton, SimpleButton, Simpleimage} from '../Objects/Objects.js';
import stageinfo from '../stage/stageinfo.json';
import { CONTROLS_FLOW_STATEMENTS_HELPURL } from 'blockly/msg/en';

class SceneGame extends Phaser.Scene {
    init(data){
        this.stage_num=data.stage_num;
        window.savenum=this.stage_num;
    }
    constructor(){
        super({key:'game'});

        //グローバル変数の代わり
        this.leftblock;
        //体力です
        this.leftenergy;
        this.numEnergy;
        //this.blocklyDiv.style.left = 30*16;
        this.player;
        this.workspace;
        this.mapDat;
        this.map2Img;
        this.stars = new Array(3);
        //ゲーム再生用変数
        this.cmdDelta=45;
        this.tick=0;
        this.isRunning=false;
        this.ismoving=false;
        this.commandGenerator=undefined;
        this.funcs={};
        this.tilesets;
        this.teleportindex;
        this.getkey = 0;//キーを何個取得したか
    }
    preload(){
        //ここのthisはおそらくPhaser.sceneのこと
        console.log(stageinfo.stages[this.stage_num].filename);
        this.leftenergy = stageinfo.stages[this.stage_num].leftenergy;
        var map1 = require('../stage/'+stageinfo.stages[this.stage_num].filename+'.json');
        this.load.tilemapTiledJSON('map'+this.stage_num, map1);
        this.load.image("tiles", nums);
        this.load.image("tiles2", tiles2);
        this.load.image("fieldtiles", fieldtiles);
        this.load.image("blacktile", blacktile);
        this.load.image("boxtiles", boxtiles);
        this.load.image("star", star);
        this.load.spritesheet("player", player1, { frameWidth: 32, frameHeight: 32});
        this.load.spritesheet("player2", player2, { frameWidth: 32, frameHeight: 32});
        this.load.image("stageclear", stageclear);
        this.load.image("nextstage", nextstage);
        this.load.image("nextstage2", nextstage2);
        this.load.image("gototitle", gototitle);
        this.load.image("gototitle2", gototitle2);
        //put the toolbox in the workspace
        var options = {
            toolbox: document.getElementById('toolbox'),
            collapse: true,
            comments: true,
            disable: true,
            maxBlocks: stageinfo.stages[this.stage_num].blocklimit,
            trashcan: true,
            horizontalLayout: false,
            toolboxPosition: 'start',
            css: true,
            rtl: false,
            scrollbars: false,
            sounds: true,
            oneBasedIndex: true,
            grid: {
              spacing: 20,
              length: 1,
              colour: '#888',
              snap: true
            }
        }
        //ボタンの配置
        var toolboxDiv=document.getElementById("toolbox");
        let blocks=stageinfo.stages[this.stage_num].blocks.split(',');
        toolboxDiv.innerHTML="";
        blocks.forEach(block=>{
            toolboxDiv.innerHTML+=`<block type="${block}"></block>`;
        });
        //blocklyを設定
        var blocklyDiv = document.getElementById("blocklyDiv");
        this.workspace = Blockly.inject('blocklyDiv', options);
        blocklyDiv.style.visibility="visible";
        //Button部分の設定
        const ButtonDiv = document.getElementById("ButtonDiv");
        ButtonDiv.style.visibility="visible";
        //制限を記載
        var numFrame=document.getElementById("numFrame");
        this.numEnergy=document.getElementById("numenergy");//だいぶキモイことをしています
        var clearlevel1=document.getElementById("level1");
        var clearlevel2=document.getElementById("level2");
        clearlevel1.style.left=30 + 'px';
        clearlevel2.style.left=250 + 'px';
        clearlevel1.style.top=10 + 'px';
        clearlevel2.style.top=10 + 'px';
        this.teleportindex = stageinfo.stages[this.stage_num].teleportid;
        this.leftblock=stageinfo.stages[this.stage_num].blocklimit;
        numFrame.innerHTML=`残りブロック数: ${this.leftblock}`;
        numFrame.style.left=250+'px';
        numFrame.style.top=(blocklyDiv.offsetHeight-30)+'px';
        if(this.stage_num == 14){
            clearlevel1.innerHTML=`レベル2: 残り体力${stageinfo.stages[this.stage_num].clearlevel[0]}以下`;
            clearlevel2.innerHTML=`レベル3: 残り体力${stageinfo.stages[this.stage_num].clearlevel[1]}以下`;
        }
        else{
            clearlevel1.innerHTML=`レベル2: 残り体力${stageinfo.stages[this.stage_num].clearlevel[0]}以上`;
            clearlevel2.innerHTML=`レベル3: 残り体力${stageinfo.stages[this.stage_num].clearlevel[1]}以上`;
        }
        this.numEnergy.innerHTML=`残り体力: ${this.leftenergy}`;
        this.numEnergy.style.left=250+'px';
        this.numEnergy.style.top=(blocklyDiv.offsetHeight-60)+'px';
        this.workspace.addChangeListener(function(event) {
            if (event.type === Blockly.Events.BLOCK_CREATE) {
              this.leftblock -= 1;
              this.leftenergy -= 10;
            } else if (event.type === Blockly.Events.BLOCK_DELETE) {
              this.leftblock += event.ids.length;;
              this.leftenergy += 10 * event.ids.length;;
            }
            numFrame.innerHTML = `残りブロック数: ${this.leftblock}`;
            this.numEnergy.innerHTML = `残り体力: ${this.leftenergy}`;
        }.bind(this));
        //ボタンを押すと発火するようにする
        const executeButton = document.getElementById("executeButton");
        executeButton.style.visibility="visible";
        executeButton.onclick = this.LoadBlocksandGenerateCommand.bind(this);
        //ボタンを押すと発火するようにする
        const playerChangeButton = document.getElementById("playerChangeButton");
        playerChangeButton.style.visibility="visible";
        playerChangeButton.onclick = this.playerChange.bind(this);
        const resetbutton = document.getElementById("resetbutton");
        resetbutton.style.visibility="visible";
        resetbutton.onclick = this.resetCommand.bind(this);
        const titlebutton = document.getElementById("titlebutton");
        titlebutton.style.visibility="visible";
        titlebutton.onclick = this.selectCommand.bind(this);
    }
    create(){
        // 背景を設定したり、プレイヤーの初期配置をしたりする
        //canvasとmapの大きさは比率も合わせて一致している必要があります。
        this.mapDat = this.add.tilemap("map"+this.stage_num);
        this.tileset = this.mapDat.addTilesetImage("num", "tiles");
        this.tileset2 = this.mapDat.addTilesetImage("tilesets-big", "tiles2");
        this.fieldtiles = this.mapDat.addTilesetImage("fields", "fieldtiles");
        this.blacktile = this.mapDat.addTilesetImage("darkness", "blacktile");
        this.boxtiles = this.mapDat.addTilesetImage("boxes", "boxtiles");
        this.tilesets = [this.tileset,this.tileset2,this.fieldtiles,this.blacktile,this.boxtiles];
        this.backgroundLayer = this.mapDat.createLayer("ground", this.tilesets);
        this.movableLayer = this.mapDat.createLayer("movable", this.tilesets);
        this.goalLayer = this.mapDat.createLayer("goal", this.tilesets);
        this.numLayer = this.mapDat.createLayer("num", this.tilesets);
        this.obstacleLayer = this.mapDat.createLayer("obstacle", this.tilesets);//ないときはnullになる
        this.keyLayer = this.mapDat.createLayer("key", this.tilesets);//ないときはnullになる
        this.teleportLayer = this.mapDat.createLayer("teleport", this.tilesets);//ないときはnullになる
        //this.map2Img = game.canvas.width / this.backgroundLayer.width;
        //ここ破滅実装
        //configのサイズをbackgroundLayerと合わせるんだったらこれでいいのでは？
        this.map2Img =1;
        //this.backgroundLayer.setScale(this.map2Img);
        let playerX=stageinfo.stages[this.stage_num].playerx;
        let playerY=stageinfo.stages[this.stage_num].playery;
        let playerdirection=stageinfo.stages[this.stage_num].playerdirection;
        this.player = this.add.sprite(this.mapDat.tileWidth * playerX * this.map2Img, this.mapDat.tileWidth * playerY * this.map2Img, "player");
        this.player.setOrigin(0, 0);
        this.player.gridX=playerX;
        this.player.gridY=playerY;
        this.player.targetX = this.player.x;
        this.player.targetY = this.player.y;
        this.player.setFrame( playerdirection*3+1 );
         //player animations https://photonstorm.github.io/phaser3-docs/Phaser.Animations.AnimationState.html
        this.player.anims.create({key:'move3-player', frames:this.player.anims.generateFrameNames('player', { start: 0, end: 2 }), frameRate:10,repeat:-1});//down
        this.player.anims.create({key:'move1-player', frames:this.player.anims.generateFrameNames('player', { start: 3, end: 5 }), frameRate:10,repeat:-1});//left
        this.player.anims.create({key:'move0-player',frames:this.player.anims.generateFrameNames('player', { start:6, end: 8 }), frameRate:10,repeat:-1});//right
        this.player.anims.create({key:'move2-player',   frames:this.player.anims.generateFrameNames('player', { start: 9, end: 11 }), frameRate:10,repeat:-1});//up
        this.player.anims.create({key:'move3-player2', frames:this.player.anims.generateFrameNames('player2', { start: 0, end: 2 }), frameRate:10,repeat:-1});//down
        this.player.anims.create({key:'move1-player2', frames:this.player.anims.generateFrameNames('player2', { start: 3, end: 5 }), frameRate:10,repeat:-1});//left
        this.player.anims.create({key:'move0-player2',frames:this.player.anims.generateFrameNames('player2', { start:6, end: 8 }), frameRate:10,repeat:-1});//right
        this.player.anims.create({key:'move2-player2',   frames:this.player.anims.generateFrameNames('player2', { start: 9, end: 11 }), frameRate:10,repeat:-1});//up
    }
    update(){
        //プレイヤーを動かしたり、衝突判定からのロジックを回したり
        //ここでblockが使われたらこの動作をします的なことを書きます
        //多分キャラクターの座標更新だけなので難しくなさそう。
        //キャラクターの座標更新
        if (this.player.targetX != this.player.x) {
            const difX = this.player.targetX - this.player.x;
            this.player.x += difX / Math.abs(difX) * 1; 
        }
        if (this.player.targetY != this.player.y) {
            const difY = this.player.targetY - this.player.y;
            this.player.y += difY / Math.abs(difY) * 1;
        }
        //コマンドが生成されている時それを実行する
        this.runCode();
    }
    //さまざまな関数
    runCode() {
        if (!this.isRunning){
            this.workspace.highlightBlock(false);
            return;
        }
        if (++this.tick === this.cmdDelta) {
            this.player.anims.stop();
            //ゴール判定 goal判定
            if (this.goalLayer.hasTileAt(this.player.gridX,this.player.gridY)) {
                if(this.keyLayer){
                    if(this.stage_num == 11 || this.getkey == stageinfo.stages[this.stage_num].keycnt)this.clearGame();
                }else{
                    this.clearGame();
                }
            }else{
                let gen = this.commandGenerator.next();//yieldで止まってたコマンドを再開する
                if(gen.value)this.workspace.highlightBlock(gen.value);
                if (!gen.done) this.tick = 0;
                else {
                    this.endRunning();
                }
            }
        }
    }
    tryMove(player, dir) {
        // ここはこれでいいの？ってなるけど
        this.ismoving=true;
        const dx = [1, -1, 0, 0];
        const dy = [0, 0, -1, 1];
        const nextGX = player.gridX + dx[dir];
        const nextGY = player.gridY + dy[dir];
        this.player.anims.play('move'+dir+"-"+player.texture.key);
        if(this.numLayer){
            if(this.numLayer.hasTileAt(player.gridX, player.gridY)){
                let tilenum = this.numLayer.getTileAt(player.gridX, player.gridY).index;
                if(tilenum < 538) this.leftenergy += 0;//ただの数字の時の処理を何か考えてください
                else if(tilenum < 547) this.leftenergy += tilenum - 537;
                else if(tilenum < 556) this.leftenergy *= tilenum - 546;
                if(this.stage_num == 14){
                    if(this.leftenergy >= 32768) this.leftenergy = this.leftenergy % 65536 - 65536;
                    else if(this.leftenergy < -32768) this.leftenergy = this.leftenergy % 65536 + 65536;
                }
                this.numEnergy.innerHTML = `残り体力: ${this.leftenergy}`;
            }
        }
        //this.mapDat.layers[1].data[i][j].indexでも同じ
        if (!this.movableLayer.hasTileAt(nextGX,nextGY) || (this.obstacleLayer&&this.obstacleLayer.hasTileAt(nextGX,nextGY))){
            this.leftenergy -= 50;
            this.numEnergy.innerHTML = `残り体力: ${this.leftenergy}`;
            return;//壁または障害物には進めない
        }
        if(this.keyLayer&&this.keyLayer.hasTileAt(nextGX,nextGY)){
            this.getkey=true;
            this.keyLayer.removeTileAt(nextGX,nextGY,false);
        }//keyを取得
        player.targetX += dx[dir] * this.mapDat.tileWidth * this.map2Img;
        player.gridX = nextGX;
        player.targetY += dy[dir] * this.mapDat.tileHeight * this.map2Img;
        player.gridY = nextGY;
        this.leftenergy -= 1;
        this.numEnergy.innerHTML = `残り体力: ${this.leftenergy}`;
    }
    removeObstacle(player) {
        //向いている方角の障害物を除去しようとする
        const dir=this.getDirection(player);
        const dx = [1, -1, 0, 0];
        const dy = [0, 0, -1, 1];
        const nextGX = player.gridX + dx[dir];
        const nextGY = player.gridY + dy[dir];
        if (this.obstacleLayer&&this.obstacleLayer.hasTileAt(nextGX,nextGY)) {
          //向いている方向に障害物がある場合、それを取り除く
          this.obstacleLayer.removeTileAt(nextGX,nextGY,false);
          console.log("remove!");
          return;
        }
        else{
            this.leftenergy -= 50;
            this.numEnergy.innerHTML = `残り体力: ${this.leftenergy}`;
            return;
        }
    }
    getDirection(player){//向いている方向を検知する
        //todo:この中身を実装する
        //0:right,1;left,2:up,3,downを返すように
        let num=parseInt(player.frame.name);
        console.log("direction:"+[3,1,0,2][Math.floor(num/3)]);
        return [3,1,0,2][Math.floor(num/3)];
    }
    changeDirection(player,dir){
        let num=parseInt(player.frame.name);
        console.log("changeDirection");
        if(dir==0)player.setFrame( [3,9,0,6][Math.floor(num/3)]+1 );//右
        else if(dir==1) player.setFrame( [6,0,9,3][Math.floor(num/3)]+1 );//左
        else player.setFrame( [9,6,3,0][Math.floor(num/3)]+1 );
        console.log(player.frame.name);
    }
    clearGame(){
        window.savenum=-1;
        console.log("goal");
        this.endRunning();
        if(this.keyLayer) this.keyLayer.destroy();
        this.player.setDepth(0);
        this.backgroundLayer.setAlpha(0.8);
        this.movableLayer.setAlpha(0.8);
        this.goalLayer.setAlpha(0.8);
        this.player.setAlpha(0.8);
        if(this.obstacleLayer) this.obstacleLayer.setAlpha(0.8);
        if(this.numLayer) this.numLayer.setAlpha(0.8);
        if(this.teleportLayer) this.teleportLayer.setAlpha(0.8);
        let message = new Simpleimage(this, 240, 200, "stageclear");
        let titleButton = new Simpleimage(this, 200, 550, "gototitle");
        let level = 0;
        if(this.stage_num != 14){
            if(stageinfo.stages[this.stage_num].clearlevel[1] <= this.leftenergy) level = 2;
            else if(stageinfo.stages[this.stage_num].clearlevel[0] <= this.leftenergy) level = 1;
        }
        else{
            if(stageinfo.stages[this.stage_num].clearlevel[1] >= this.leftenergy) level = 2;
            else if(stageinfo.stages[this.stage_num].clearlevel[0] >= this.leftenergy) level = 1;
        }
        if(level == 2){
            this.stars[0] = new Simpleimage(this, 250, 370, "star");
            this.stars[1] = new Simpleimage(this, 160, 390, "star");
            this.stars[2] = new Simpleimage(this, 340, 390, "star");
        }
        else if(level == 1){
            this.stars[0] = new Simpleimage(this, 280, 390, "star");
            this.stars[1] = new Simpleimage(this, 190, 390, "star");
        }
        else{
            this.stars[0] = new Simpleimage(this, 235, 390, "star");
        }
        let twittershare=new SimpleButton(this,300,470,100,20,"Twitterでシェア","black");
        twittershare.button.on('pointerdown',function(){
            var tweet = 'eeicプログラミング教室　ステージ'+this.stage_num+'「'+stageinfo.stages[this.stage_num].description+'」をスコア'+this.leftenergy+'でクリアしました。星'+(level+1)+'！ #eeic_pkyo #近未来体験2021';
            var link = 'https://2020.eeic.jp/'//サイトができたら変更
            var url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweet)+'&url=' +encodeURIComponent(link);
            var s = window.open(url, '_blank');
            if (s && s.focus)s.focus();
            else if (!s)window.location.href = url;
        }.bind(this));
        let facebookshare=new SimpleButton(this,300,440,100,20,"Facebookでシェア","black");
        facebookshare.button.on('pointerdown',function(){
            var link = 'https://2020.eeic.jp/'//サイトができたら変更
            var url = 'http://www.facebook.com/share.php?u=' +encodeURIComponent(link);
            var s = window.open(url, '_blank');
            if (s && s.focus)s.focus();
            else if (!s)window.location.href = url;
        }.bind(this));
        titleButton.button.on('pointerdown',function(){
            this.exitGameScene();
            this.scene.start("title");
        }.bind(this));
        titleButton.button.on('pointerover',function(){
            titleButton.button.setTexture("gototitle2");
            titleButton.button.setScale(1.05, 1.05);
        }.bind(this));
        titleButton.button.on('pointerout',function(){
            titleButton.button.setTexture("gototitle");
            titleButton.button.setScale(1, 1);
        }.bind(this));
        if(this.stage_num+1<stageinfo.stages.length){
            window.savenum=this.stage_num+1;
            var nextButton=new Simpleimage(this, 170, 470, "nextstage");
            nextButton.button.on('pointerdown', function(){
                this.exitGameScene();
                this.scene.restart({stage_num:this.stage_num+1});
            }.bind(this));
            nextButton.button.on('pointerover', function(){
                nextButton.button.setTexture("nextstage2");
                nextButton.button.setScale(1.05, 1.05);
            }.bind(this));
            nextButton.button.on('pointerout', function(){
                nextButton.button.setTexture("nextstage");
                nextButton.button.setScale(1, 1);
            }.bind(this));
        }
    }
    exitGameScene(){
        //これが何をやってるのかは実はよく知らない
        this.isRunning = false;
        this.commandGenerator = undefined;
        this.registry.destroy();
        this.events.off();
        this.workspace.dispose();
    }
    endRunning(){
        if(this.player)this.player.anims.stop();
        this.isRunning=false;
        this.ismoving=false;
        this.tick=0;
    }
    LoadBlocksandGenerateCommand(){//ボタンを押すと発火
        this.resetRunning();//多分player位置の初期化など
        window.LoopTrap = 1000;
          Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";¥n';
          var code = Blockly.JavaScript.workspaceToCode(this.workspace);
          console.log(code);
          Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
          try{
            this.commandGenerator = eval("(function* () {" + code + "}.bind(this))()");
            if(!this.isRunning)this.isRunning=true;
          }catch(e){
              alert(e);
          }
    } 
    resetCommand(){
        this.isRunning = false;
        this.commandGenerator = undefined;
        this.resetRunning();
    } 
    selectCommand(){
        this.exitGameScene();
        this.scene.start("select");
    }
    resetRunning(){
        this.endRunning();
        //まじでこれでいいの？かなり無駄な気がするぜ！
        //破滅実装最高すぎ！
        if(this.mapDat)this.mapDat.destroy();
        for(let i = 0; i < 3; ++i){
            if(this.stars[i]) this.stars[i].button.destroy();
        }
        this.leftenergy = stageinfo.stages[this.stage_num].leftenergy  - 10 * (stageinfo.stages[this.stage_num].blocklimit - this.leftblock);
        this.numEnergy.innerHTML = `残り体力: ${this.leftenergy}`;
        this.mapDat = this.add.tilemap("map"+this.stage_num);
        this.backgroundLayer = this.mapDat.createLayer("ground", this.tilesets);
        this.movableLayer = this.mapDat.createLayer("movable", this.tilesets);
        this.numLayer = this.mapDat.createLayer("num", this.tilesets);
        this.goalLayer = this.mapDat.createLayer("goal", this.tilesets);
        this.obstacleLayer = this.mapDat.createLayer("obstacle", this.tilesets);//ないときはnullになる
        this.keyLayer = this.mapDat.createLayer("key", this.tilesets);//ないときはnullになる
        this.teleportLayer = this.mapDat.createLayer("teleport", this.tilesets);//ないときはnullになる
        this.player.setDepth(1);//playerを前に持ってくる
        //this.obstacleLayer = this.mapDat.createLayer("obstacle", [this.tileset,this.tileset2]);//ないときはnullになる
        let playerX=stageinfo.stages[this.stage_num].playerx;
        let playerY=stageinfo.stages[this.stage_num].playery;
        let playerdirection=stageinfo.stages[this.stage_num].playerdirection;
        this.player.gridX=playerX;
        this.player.gridY=playerY;
        this.player.targetX = this.player.x = this.mapDat.tileWidth * playerX * this.map2Img;
        this.player.targetY = this.player.y = this.mapDat.tileWidth * playerY * this.map2Img;
        this.player.setFrame( playerdirection*3+1 );
        this.funcs={};//funcsの初期化
        this.getkey=false;
    } 
    playerChange(){//プレイヤーの容姿を変更する
        console.log("change!");
        let num=parseInt(this.player.frame.name);
        if(this.player.texture.key=="player"){
            this.player=this.player.setTexture("player2");
        }else{
            this.player.setTexture("player");
        }
        this.player.setFrame(num);
        if(this.ismoving){
            let dir = this.getDirection(this.player);
            this.player.anims.play('move'+dir+"-"+this.player.texture.key);
        }
    }
    checkIf(player,direction,layer,flag){
        var player_direction=this.getDirection(player);////0:right,1;left,2:up,3,downを返すように
        var dir=0;
        if(direction==0)dir=[0,1,2,3][player_direction];//前
        if(direction==1)dir=[3,2,0,1][player_direction];//右
        if(direction==2)dir=[2,3,1,0][player_direction];//左
        if(direction==3)dir=[1,0,3,2][player_direction];//後ろ
        const dx = [1, -1, 0, 0];
        const dy = [0, 0, -1, 1];
        const nextGX = player.gridX + dx[dir];
        const nextGY = player.gridY + dy[dir];
        if(flag == 0){
            if (layer.hasTileAt(nextGX,nextGY)) {
                return true;
            }else{
                return false;
            }
        }
        else{
            if (!layer.hasTileAt(nextGX,nextGY)) {
                return true;
            }else{
                return false;
            }
        }
    }
    run_teleport(){
        //カス実装
        let x = this.player.gridX;
        let y = this.player.gridY;
        let index = -1;
        for(let i = 0; i < stageinfo.stages[this.stage_num].teleportid.length; ++i){
            if(stageinfo.stages[this.stage_num].teleportx[i] == x && stageinfo.stages[this.stage_num].teleporty[i] == y){
              index = stageinfo.stages[this.stage_num].teleportid[i];
              break;
            }
        }
        if(index == -1){//テレポート可能のマスじゃなかったらペナルティ
            this.leftenergy -= 50;
            this.numEnergy.innerHTML = `残り体力: ${this.leftenergy}`;
            return;
        }
        this.player.gridX = stageinfo.stages[this.stage_num].teleportx[index];
        this.player.gridY = stageinfo.stages[this.stage_num].teleporty[index];
        this.player.targetX = this.player.x = this.mapDat.tileWidth * this.player.gridX * this.map2Img;
        this.player.targetY = this.player.y = this.mapDat.tileWidth * this.player.gridY * this.map2Img;
        console.log(this.player.gridX, this.player.gridY);
    }
} 
export default SceneGame;