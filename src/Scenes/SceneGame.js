import Blockly, { CollapsibleToolboxCategory__Class } from 'blockly';
import Phaser from 'phaser';
//import map1 from '../stage/tilemapNaomi1.json';
import tiles from '../stage/map.png';
import tiles2 from '../stage/tilesets-big.png';
import player1 from '../stage/player.png';
import SimpleButton from '../Objects/Objects.js'
import stageinfo from '../stage/stageinfo.json';

class SceneGame extends Phaser.Scene {
    init(data){
        this.stage_num=data.stage_num;
    }
    constructor(){
        super({key:'game'});

        //グローバル変数の代わり
        this.blocklyDiv = document.getElementById("blocklyDiv");
        this.blocklyDiv.style.left = 30*16;
        this.player;
        this.workspace;
        this.mapDat;
        this.map2Img;
        //ゲーム再生用変数
        this.cmdDelta=45;
        this.tick=0;
        this.isRunning=false;
        this.commandGenerator=undefined;
    }
    preload(){
        //ここのthisはおそらくPhaser.sceneのこと
        console.log(stageinfo.stages);
        console.log(stageinfo.stages[this.stage_num].filename)
        var map1=require('../stage/'+stageinfo.stages[this.stage_num].filename+'.json');
        this.load.tilemapTiledJSON('map'+this.stage_num, map1);
        this.load.image("tiles", tiles);
        this.load.image("tiles2", tiles2);
        this.load.spritesheet("player", player1, { frameWidth: 32, frameHeight: 32});
        //put the toolbox in the workspace
        var options = {
            toolbox: document.getElementById('toolbox'),
            collapse: true,
            comments: true,
            disable: true,
            maxBlocks: Infinity,
            trashcan: true,
            horizontalLayout: false,
            toolboxPosition: 'start',
            css: true,
            rtl: false,
            scrollbars: true,
            sounds: true,
            oneBasedIndex: true,
            grid: {
              spacing: 20,
              length: 1,
              colour: '#888',
              snap: true
            }
        }
        this.workspace = Blockly.inject('blocklyDiv', options);
        this.blocklyDiv.style.visibility="visible";
        //ボタンを押すと発火するようにする
        const executeButton = document.getElementById("executeButton");
        executeButton.style.visibility="visible";
        executeButton.onclick = this.LoadBlocksandGenerateCommand.bind(this);
    }
    create(){
        // 背景を設定したり、プレイヤーの初期配置をしたりする
        //canvasとmapの大きさは比率も合わせて一致している必要があります。
        this.mapDat = this.add.tilemap("map"+this.stage_num);
        let tileset = this.mapDat.addTilesetImage("map", "tiles");
        let tileset2 = this.mapDat.addTilesetImage("tilesets-big", "tiles2");
        this.backgroundLayer = this.mapDat.createLayer("ground", [tileset,tileset2]);
        this.movableLayer = this.mapDat.createLayer("movable", [tileset,tileset2]);
        this.goalLayer = this.mapDat.createLayer("goal", [tileset,tileset2]);
        this.obstacleLayer = this.mapDat.createLayer("obstacle", [tileset,tileset2]);//ないときはnullになる
        //this.map2Img = game.canvas.width / this.backgroundLayer.width;
        //configのサイズをbackgroundLayerと合わせるんだったらこれでいいのでは？
        this.map2Img =1;
        //this.backgroundLayer.setScale(this.map2Img);
        let playerX=stageinfo.stages[this.stage_num].playerx;
        let playerY=stageinfo.stages[this.stage_num].playery;
        this.player = this.add.sprite(this.mapDat.tileWidth * playerX * this.map2Img, this.mapDat.tileWidth * playerY * this.map2Img, "player");
        this.player.setOrigin(0, 0);
        this.player.gridX=playerX;
        this.player.gridY=playerY;
        this.player.targetX = this.player.x;
        this.player.targetY = this.player.y;
         //player animations https://photonstorm.github.io/phaser3-docs/Phaser.Animations.AnimationState.html
        this.player.anims.create({key:'move3', frames:this.player.anims.generateFrameNames('player', { start: 0, end: 2 }), frameRate:10,repeat:-1});//down
        this.player.anims.create({key:'move1', frames:this.player.anims.generateFrameNames('player', { start: 3, end: 5 }), frameRate:10,repeat:-1});//left
        this.player.anims.create({key:'move0',frames:this.player.anims.generateFrameNames('player', { start:6, end: 8 }), frameRate:10,repeat:-1});//right
        this.player.anims.create({key:'move2',   frames:this.player.anims.generateFrameNames('player', { start: 9, end: 11 }), frameRate:10,repeat:-1});//up
    }
    update(){
        //プレイヤーを動かしたり、衝突判定からのロジックを回したり
        //ここでblockが使われたらこの動作をします的なことを書きます
        //多分キャラクターの座標更新だけなので難しくなさそう。
        //キャラクターの座標更新
        if (this.player.targetX != this.player.x) {
            const difX = this.player.targetX - this.player.x;
            this.player.x += difX / Math.abs(difX) * 1;  // とてもよくない(画像サイズ規定を設けるor微分方程式なので減衰覚悟でやる)
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
        if (!this.isRunning)return;
        if (++this.tick === this.cmdDelta) {
            this.player.anims.stop();
            //ゴール判定 goal判定
            if (this.goalLayer.layer.data[this.player.gridY][this.player.gridX].index > 0) {
                this.clearGame();
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
        const dx = [1, -1, 0, 0];
        const dy = [0, 0, -1, 1];
        const nextGX = player.gridX + dx[dir];
        const nextGY = player.gridY + dy[dir];
        this.player.anims.play('move'+dir);
        //this.mapDat.layers[1].data[i][j].indexでも同じ
        if (this.movableLayer.layer.data[nextGY][nextGX].index <= 0)return;//壁には進めない
        if(this.obstacleLayer&&this.obstacleLayer.layer.data[nextGY][nextGX].index > 0)return;//障害物があるとすすめない
        player.targetX += dx[dir] * this.mapDat.tileWidth * this.map2Img;
        player.gridX = nextGX;
        player.targetY += dy[dir] * this.mapDat.tileHeight * this.map2Img;
        player.gridY = nextGY;
        
    }
    removeObstacle(player) {
        //向いている方角の障害物を除去しようとする
        const dir=this.getDirection(player);
        const dx = [1, -1, 0, 0];
        const dy = [0, 0, -1, 1];
        const nextGX = player.gridX + dx[dir];
        const nextGY = player.gridY + dy[dir];
        if (this.obstacleLayer&&this.obstacleLayer.layer.data[nextGY][nextGX].index > 0) {
          //向いている方向に障害物がある場合、それを取り除く
          this.obstacleLayer.layer.data[nextGY][nextGX].index=-1;
          console.log("remove!")
          return;
        }
    }
    getDirection(player){//向いている方向を検知する(どうやってやるんや)
        return 0;//とりあえず右を返す
    }
    clearGame(){
        console.log("goal");
        this.endRunning();
        let message = new SimpleButton(this, 50, 200, 300, 50, 0xfffff00, 'Game Clear', 'green');
        let titleButton = new SimpleButton(this, 50, 300, 200, 30, 0xfffff00, 'Title', 'red');
        titleButton.button.on('pointerdown',function(){
            this.exitGameScene();
            this.scene.start("title");
        }.bind(this));
        if(this.stage_num+1<stageinfo.stages.length){
            var nextButton=new SimpleButton(this, 50, 350, 200, 30, 0xfffff00, "Next Stage", "red")
            nextButton.button.on('pointerdown', function(){
                this.exitGameScene();
                this.scene.restart({stage_num:this.stage_num+1});
            }.bind(this));
        }
    }
    exitGameScene(){
        //これが何をやってるのかは実はよく知らない
        this.registry.destroy();
        this.events.off();
        this.workspace.dispose();
    }
    endRunning(){
        this.player.anims.stop();
        this.isRunning=false;
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
            //this.commandGenerator.next().bind(this)();
            //console.log("hello");
            if(!this.isRunning)this.isRunning=true;
          }catch(e){
              alert(e);
          }
    }  
    resetRunning(){
        this.endRunning();
        let playerX=stageinfo.stages[this.stage_num].playerx;
        let playerY=stageinfo.stages[this.stage_num].playery;
        this.player.gridX=playerX;
        this.player.gridY=playerY;
        this.player.targetX = this.player.x = this.mapDat.tileWidth * playerX * this.map2Img;
        this.player.targetY = this.player.y = this.mapDat.tileWidth * playerY * this.map2Img;
    }  
} 
export default SceneGame;