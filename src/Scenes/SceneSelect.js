import Phaser from 'phaser';
import {RoundedButton, SimpleButton, Simpleimage} from '../Objects/Objects.js';
import stageinfo from '../stage/stageinfo.json';

class SceneSelect extends Phaser.Scene {
    constructor(){
        super({key:"select"});
    }
    preload(){}
    create(){
        this.game.scale.setGameSize(1500, 1000);
        this.add.text(200, 30, 'ス テ ー ジ せ ん た く', {fontFamily: "PixelMplus10", fontSize: 70, color: 'lime'});
        this.add.text(80, 100, 'チュートリアル & 初級', {fontFamily: "PixelMplus10", fontSize: 40, color: 'maroon'});
        this.add.text(80, 330, '中級', {fontFamily: "PixelMplus10", fontSize: 40, color: 'aqua'});
        this.add.text(80, 500, '上級', {fontFamily: "PixelMplus10", fontSize: 40, color: 'purple'});
        let ofs = 0;
        for (let index = 0; index < stageinfo.stages.length; index++) {
            if(index % 2 == 1){
                var startButton=new RoundedButton(this, 600, ofs + 150+60*Math.floor(index / 2), 200, 50, 0xfffff00, "STAGE"+index, "red");
                var discription=new SimpleButton(this, 600, ofs + 150+60*Math.floor(index / 2), 200, 10, stageinfo.stages[index].description, "black");
                startButton.button.on('pointerdown', function(){
                    this.scene.start("game",{stage_num:index});
                }.bind(this));
            }
            else{
                var startButton=new RoundedButton(this, 100, ofs + 150+60*Math.floor(index / 2), 200, 50, 0xfffff00, "STAGE"+index, "red");
                var discription=new SimpleButton(this, 100, ofs + 150+60*Math.floor(index / 2), 200, 10, stageinfo.stages[index].description, "black");
                startButton.button.on('pointerdown', function(){
                    this.scene.start("game",{stage_num:index});
                }.bind(this));
            }
            if(index == 5) ofs += 50;
            else if(index == 9) ofs += 50;
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
            var startButton=new RoundedButton(this, 100, 300+60*Math.floor(num / 2), 200, 50, 0xfffff00, "Load", "red")
            startButton.button.on('pointerdown', function(){
                this.scene.start("game",{stage_num:window.savenum});
                }.bind(this));
        }else{
            var startButton=new RoundedButton(this, 100, 270+60*Math.floor(num / 2), 200, 50, 0xfffff00, "Load", "gray")    
        }
    }
    update(){}
} 
export default SceneSelect;