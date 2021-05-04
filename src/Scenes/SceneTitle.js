import Phaser from 'phaser';
import {RoundedButton, SimpleButton, Simpleimage} from '../Objects/Objects.js';
import stageinfo from '../stage/stageinfo.json';

class SceneTitle extends Phaser.Scene {
    constructor(){
        super({key:"title"});
    }
    preload(){}
    create(){
        this.game.scale.setGameSize(1300, 700);
        this.add.text(200, 50, 'プ ロ グ ラ ミ ン グ 教 室', {fontFamily: "PixelMplus10", fontSize: 70, color: 'lime'});
        var firststage = new RoundedButton(this, 100, 400, 500, 50, 0xffff00, "最初のステージへ", 'red', 15);
        firststage.button.on('pointerdown', function(){
            this.scene.start("game", {stage_num:0});
        }.bind(this));
        firststage.button.on('pointerover', function(){
            firststage.button.clear();
            firststage.button.fillStyle(0x000000, 1);
            firststage.button.fillRoundedRect(95, 395, 510, 60, 15);
            firststage.button.stroke();
            firststage.button.strokeRoundedRect(95, 395, 510, 60, 15);
            firststage.button.lineStyle(4, 0x000000, 1);
        });
        firststage.button.on('pointerout', function(){
            firststage.button.clear();
            firststage.button.fillStyle(0xffff00, 1);
            firststage.button.fillRoundedRect(100, 400, 500, 50, 15);
            firststage.button.stroke();
            firststage.button.strokeRoundedRect(100, 400, 500, 50, 15);
            firststage.button.lineStyle(4, 0x000000, 1);
        });
        var stageselect = new RoundedButton(this, 700, 400, 500, 50, 0xffff00, "ステージを選ぶ", "red", 15);
        //stageselect.text
        stageselect.button.on('pointerdown', function(){
            this.scene.start("select");
        }.bind(this));
        stageselect.button.on('pointerover', function(){
            stageselect.button.clear();
            stageselect.button.fillStyle(0x000000, 1);
            stageselect.button.fillRoundedRect(695, 395, 510, 60, 15);
            stageselect.button.stroke();
            stageselect.button.strokeRoundedRect(695, 395, 510, 60, 15);
            stageselect.button.lineStyle(4, 0x000000, 1);
        });
        stageselect.button.on('pointerout', function(){
            stageselect.button.clear();
            stageselect.button.fillStyle(0xffff00, 1);
            stageselect.button.fillRoundedRect(700, 400, 500, 50, 15);
            stageselect.button.stroke();
            stageselect.button.strokeRoundedRect(700, 400, 500, 50, 15);
            stageselect.button.lineStyle(4, 0x000000, 1);
        });
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