import Blockly, { CollapsibleToolboxCategory__Class } from 'blockly';
import Phaser from 'phaser';
import map1 from '../stage/tilemapNaomi.json';
import tiles from '../stage/map.png';
import tiles2 from '../stage/tilesets-big.png';
import player1 from '../stage/player.png';
import SimpleButton from '../Objects/Objects.js'

class SceneGame extends Phaser.Scene {
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
        this.load.tilemapTiledJSON('map1', map1);
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
        //bind
        //this.runCode=this.runCode.bind(this);
        //this.clearGame=this.clearGame.bind(this);
        //this.tryMove=this.tryMove.bind(this);
    }
    create(){
        // 背景を設定したり、プレイヤーの初期配置をしたりする
        //canvasとmapの大きさは比率も合わせて一致している必要があります。
        this.mapDat = this.add.tilemap("map1");
        let tileset = this.mapDat.addTilesetImage("map", "tiles");
        let tileset2 = this.mapDat.addTilesetImage("tilesets-big", "tiles2");
        this.backgroundLayer = this.mapDat.createLayer("ground", [tileset,tileset2]);
        this.movableLayer = this.mapDat.createLayer("movable", [tileset,tileset2]);
        this.goalLayer = this.mapDat.createLayer("goal", [tileset,tileset2]);
        //this.map2Img = game.canvas.width / this.backgroundLayer.width;
        //configのサイズをbackgroundLayerと合わせるんだったらこれでいいのでは？
        this.map2Img =1;
        //this.backgroundLayer.setScale(this.map2Img);
        let playerX=2;
        let playerY=2;
        this.player = this.add.sprite(this.mapDat.tileWidth * playerX * this.map2Img, this.mapDat.tileWidth * playerY * this.map2Img, "player");
        this.player.setOrigin(0, 0);
        this.player.gridX=playerX;
        this.player.gridY=playerY;
        this.player.targetX = this.player.x;
        this.player.targetY = this.player.y;
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
        if (this.isRunning) {
            if (++this.tick === this.cmdDelta) {
                let gen = this.commandGenerator.next();//yieldで止まってたコマンドを再開する
                if(gen.value)this.workspace.highlightBlock(gen.value);
                //ゴール判定 goal判定
                if (this.goalLayer.layer.data[this.player.gridY][this.player.gridX].index > 0) {
                    this.clearGame();
                }
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
        //movableレイヤーが0以上であれば動ける
        //this.mapDat.layers[1].data[i][j].indexでも同じ
        if (this.movableLayer.layer.data[nextGY][nextGX].index <= 0) {
          //console.log(this.mapDat.layers[1].data[nextGY][nextGX].index);
          return;//壁には進めない
        }
        player.targetX += dx[dir] * this.mapDat.tileWidth * this.map2Img;
        player.gridX = nextGX;
        player.targetY += dy[dir] * this.mapDat.tileHeight * this.map2Img;
        player.gridY = nextGY;
        
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
    }
    exitGameScene(){
        this.workspace.dispose();
    }
    endRunning(){
        this.isRunning=false;
        this.tick=0;
    }
    LoadBlocksandGenerateCommand(){//ボタンを押すと発火
        //多分player位置の初期化もしないといけない
        window.LoopTrap = 1000;
          Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";¥n';
          var code = Blockly.JavaScript.workspaceToCode(this.workspace);
          console.log(code);
          Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
          try{
            this.commandGenerator = eval("(function* () {" + code + "}.bind(this))()");
            //this.commandGenerator.next().bind(this)();
            console.log("hello");
            if(!this.isRunning)this.isRunning=true;
          }catch(e){
              alert(e);
          }
    }    
} 
export default SceneGame;