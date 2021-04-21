import Phaser from 'phaser';
import {RoundedButton, SimpleButton, Simpleimage} from '../Objects/Objects.js';
import stageinfo from '../stage/stageinfo.json';

class SceneSelect extends Phaser.Scene {
    constructor(){
        super({key:"select"});
    }
    preload(){}
    create(){
        this.game.scale.setGameSize(1500, 700);
        this.add.text(200, 30, 'ス テ ー ジ せ ん た く', {fontFamily: "PixelMplus10", fontSize: 70, color: 'lime'});
        for (let index = 0; index < stageinfo.stages.length; index++) {
            var startButton=new RoundedButton(this, 100 + 400 * ((index - index % 9) / 9), 150+60*(index % 9), 200, 50, 0xfffff00, "STAGE"+index, "red");
            var discription=new SimpleButton(this, 100 + 400 * ((index - index % 9) / 9), 150+60*(index % 9), 200, 10, stageinfo.stages[index].description, "black");
            startButton.button.on('pointerdown', function(){
                this.scene.start("game",{stage_num:index});
            }.bind(this));
        }
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
        let num = stageinfo.stages.length;
        if(window.savenum>-1){
            var startButton=new RoundedButton(this, 100 + 400 * ((num - num % 9) / 9), 200+60*(num % 9), 200, 50, 0xfffff00, "Load", "red")
            startButton.button.on('pointerdown', function(){
                this.scene.start("game",{stage_num:window.savenum});
                }.bind(this));
        }else{
            var startButton=new RoundedButton(this, 100 + 400 * ((num - num % 9) / 9), 200+60*(num % 9), 200, 50, 0xfffff00, "Load", "gray")    
        }
    }
    update(){}
} 
export default SceneSelect;