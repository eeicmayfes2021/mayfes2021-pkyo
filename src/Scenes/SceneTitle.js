import Phaser from 'phaser';
import {SimpleButton, Simpleimage} from '../Objects/Objects.js';
import stageinfo from '../stage/stageinfo.json';

class SceneTitle extends Phaser.Scene {
    constructor(){
        super({key:"title"});
    }
    preload(){}
    create(){
        this.game.scale.setGameSize(1200, 800);
        this.add.text(200, 100, 'プログラミング教室', {fontFamily: "PixelMplus10", fontSize: 50, color: 'red'});
        for (let index = 0; index < stageinfo.stages.length; index++) {
            var startButton=new SimpleButton(this, 100 + 400 * ((index - index % 9) / 9), 200+50*(index % 9), 200, 50, 0xfffff00, "STAGE"+index, "red");
            var discription=new SimpleButton(this, 100 + 400 * ((index - index % 9) / 9), 200+50*(index % 9), 200, 10, 0xfffff00, stageinfo.stages[index].description, "black");
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
            var startButton=new SimpleButton(this, 100 + 400 * ((num - num % 9) / 9), 200+50*(num % 9), 200, 50, 0xfffff00, "Load", "red")
            startButton.button.on('pointerdown', function(){
                this.scene.start("game",{stage_num:window.savenum});
                }.bind(this));
        }else{
            var startButton=new SimpleButton(this, 100 + 400 * ((num - num % 9) / 9), 200+50*(num % 9), 200, 50, 0xfffff00, "Load", "gray")    
        }
    }
    update(){}
} 
export default SceneTitle;