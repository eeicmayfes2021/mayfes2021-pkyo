import Blockly from 'blockly';
import Phaser from 'phaser';
import map1 from './stage/tilemapNaomi.json';
import tiles from './stage/map.png';
import tiles2 from './stage/tilesets-big.png';
import player1 from './stage/player.png';
import SceneTitle from './Scenes/SceneTitle';
import SimpleButton from './Objects/Objects.js'
//import xmlFile1 from '../Blockly/test.xml';
//import BlocklyRunner from '../Blockly/BlocklyRunner.js';

var config = {
    type: Phaser.AUTO,
    width: 30*16,
    height: 30*20,
    parent: 'phaserDiv',
    physics:{
        default: 'arcade',
        arcade: {
            gravity: {
                x: 0,
                y: 0,
            },
            debug: false,
        }
    },
    //ここにシーンを追加(preloadとかはここで定義しなくても良い)
    scene: [
        SceneTitle,
        {
        key:"stage1",
        preload: preload, // 以下に定義する preload 関数をセットする
        create: create, // 以下に定義する create 関数をセットする
        update: update // 以下に定義する update 関数をセットする
        }
    ],
    render: {
        transparent: true,
    },
};

const blocklyDiv = document.getElementById("blocklyDiv");
blocklyDiv.style.left = config.width;
var player;
// ゲーム開始!!!
var game = new Phaser.Game(config);

var workspace;
// ゲーム開始前に呼び出される関数定義
function preload ()
{ // アセット（画像とか）の取得を行う
    //ここのthisはおそらくPhaser.sceneのこと
    this.load.tilemapTiledJSON('map1', map1);
    this.load.image("tiles", tiles);
    this.load.image("tiles2", tiles2);
    this.load.spritesheet("player", player1, { frameWidth: 32, frameHeight: 32});
    //put the toolbox in the workspace
    workspace = Blockly.inject('blocklyDiv', options);
    blocklyDiv.style.visibility="visible";
    //ボタンを押すと発火するようにする
    const executeButton = document.getElementById("executeButton");
    executeButton.style.visibility="visible";
    executeButton.onclick = LoadBlocksandGenerateCommand;
    //bind
    runCode=runCode.bind(this);
    clearGame=clearGame.bind(this);
}
var mapDat;
var map2Img;
// ゲーム開始時に呼び出される関数
function create ()
{ // 背景を設定したり、プレイヤーの初期配置をしたりする
    //canvasとmapの大きさは比率も合わせて一致している必要があります。
    mapDat = this.add.tilemap("map1");
    let tileset = mapDat.addTilesetImage("map", "tiles");
    let tileset2 = mapDat.addTilesetImage("tilesets-big", "tiles2");
    this.backgroundLayer = mapDat.createLayer("ground", [tileset,tileset2]);
    this.movableLayer = mapDat.createLayer("movable", [tileset,tileset2]);
    this.goalLayer = mapDat.createLayer("goal", [tileset,tileset2]);
    //map2Img = game.canvas.width / this.backgroundLayer.width;
    //configのサイズをbackgroundLayerと合わせるんだったらこれでいいのでは？
    map2Img =1;
    //this.backgroundLayer.setScale(map2Img);
    let playerX=2;
    let playerY=2;
    player = this.add.sprite(mapDat.tileWidth * playerX * map2Img, mapDat.tileWidth * playerY * map2Img, "player");
    player.setOrigin(0, 0);
    player.gridX=playerX;
    player.gridY=playerY;
    player.targetX = player.x;
    player.targetY = player.y;
}

//ゲーム再生用変数
const cmdDelta=45;
var tick=0;
var isRunning=false;
let commandGenerator=undefined;
// ゲーム進行時に呼び出される関数
function update ()
{ //プレイヤーを動かしたり、衝突判定からのロジックを回したり
    //ここでblockが使われたらこの動作をします的なことを書きます
    //多分キャラクターの座標更新だけなので難しくなさそう。

    //キャラクターの座標更新
    if (player.targetX != player.x) {
        const difX = player.targetX - player.x;
        player.x += difX / Math.abs(difX) * 1;  // とてもよくない(画像サイズ規定を設けるor微分方程式なので減衰覚悟でやる)
    }
    if (player.targetY != player.y) {
        const difY = player.targetY - player.y;
        player.y += difY / Math.abs(difY) * 1;
    }
    //コマンドが生成されている時それを実行する
    runCode();
}
Blockly.Blocks['move'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Move")
          .appendField(new Blockly.FieldDropdown([["→", "0"],["←", "1"],["↑", "2"],["↓", "3"]]), "move_direction");
      this.setNextStatement(true);
      this.setPreviousStatement(true);
      this.setColour(270);
      this.setTooltip("");
      this.setHelpUrl("");
    }
};
  Blockly.JavaScript['move'] = function(block) {
    var dropdown_direction = block.getFieldValue('move_direction');
    var code = `workspace.highlightBlock("${block.id}");tryMove(player,${dropdown_direction});yield true;\n`;
    return code;
  };
  Blockly.Blocks['while'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldLabelSerializable("この中をくりかえします"), "string");
      this.appendStatementInput("NAME")
          .setCheck(null);
      this.setColour(230);
      this.setTooltip("");
      this.setHelpUrl("");
    }
  };
  Blockly.JavaScript['while'] = function(block) {
    var childblock=Blockly.JavaScript.statementToCode(block, 'NAME');
    var code = `while(true){${childblock}}\n`;
    return code;
  };

function tryMove(player, dir) {
    // ここはこれでいいの？ってなるけど
    const dx = [1, -1, 0, 0];
    const dy = [0, 0, -1, 1];
    const nextGX = player.gridX + dx[dir];
    const nextGY = player.gridY + dy[dir];
    //movableレイヤーが0以上であれば動ける
    //game.scene.scenes[0].movableLayer.layer.data[i][j].indexでも同じ
    if (mapDat.layers[1].data[nextGY][nextGX].index <= 0) {
      //console.log(mapDat.layers[1].data[nextGY][nextGX].index);
      return;//壁には進めない
    }
    player.targetX += dx[dir] * mapDat.tileWidth * map2Img;
    player.gridX = nextGX;
    player.targetY += dy[dir] * mapDat.tileHeight * map2Img;
    player.gridY = nextGY;
    
}
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
  
  // take the text generated by the blocks and run it as code
  //var code = Blockly.JavaScript.workspaceToCode(workspace);
  function runCode() {
    if (isRunning) {
        if (++tick === cmdDelta) {
            //console.log(commandGenerator);
            let gen = commandGenerator.next();//yieldで止まってたコマンドを再開する
            //ゴール判定 goal判定
            if (player.targetX == player.x && mapDat.layers[2].data[player.gridY][player.gridX].index > 0) {
                clearGame();
            }
            if (!gen.done) tick = 0;
            else {
                endRunning();
            }
        }
    }
  }
function clearGame(){
    console.log("goal");
    endRunning();
    //game.scene.scenes[0]だと心許ないのでbindしてthis
    let message = new SimpleButton(this, 50, 200, 300, 50, 0xfffff00, 'Game Clear', 'green');
    let titleButton = new SimpleButton(this, 50, 300, 200, 30, 0xfffff00, 'Title', 'red');
    titleButton.button.on('pointerdown',function(){
        exitGameScene();
        this.scene.start("title");
    }.bind(this));
}
function exitGameScene(){
    workspace.dispose();
}
function endRunning(){
    isRunning=false;
    tick=0;
}

function LoadBlocksandGenerateCommand(){//ボタンを押すと発火
    //多分player位置の初期化もしないといけない
    window.LoopTrap = 1000;
      Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";¥n';
      var code = Blockly.JavaScript.workspaceToCode(workspace);
      console.log(code);
      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
      try{
        commandGenerator=eval("(function* () {" + code + "})()");
        if(!isRunning)isRunning=true;
      }catch(e){
          console.log(e);
      }
    }
