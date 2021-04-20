import Phaser from 'phaser';
import {RoundedButton, SimpleButton, Simpleimage} from '../Objects/Objects.js';
import stageinfo from '../stage/stageinfo.json';

class SceneTitle extends Phaser.Scene {
    constructor(){
        super({key:"title"});
    }
    preload(){}
    create(){
        this.game.scale.setGameSize(1500, 800);
        this.add.text(200, 50, 'プ ロ グ ラ ミ ン グ 教 室', {fontFamily: "PixelMplus10", fontSize: 70, color: 'lime'});
        var firststage = new RoundedButton(this, 100, 400, 500, 50, 0xffff00, "最初のステージへ", 'red');
        firststage.button.on('pointerdown', function(){
            this.scene.start("game", {stage_num:0});
        }.bind(this));
        var stageselect = new RoundedButton(this, 700, 400, 500, 50, 0xffff00, "ステージを選ぶ", "red");
        //stageselect.text
        stageselect.button.on('pointerdown', function(){
            this.scene.start("select");
        }.bind(this));
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
    }
    update(){}
} 
export default SceneTitle;