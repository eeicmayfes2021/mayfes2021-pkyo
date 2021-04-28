import Phaser from 'phaser';
import {RoundedButton, SimpleButton, Simpleimage} from '../Objects/Objects.js';
import stageinfo from '../stage/stageinfo.json';

class SceneSelect extends Phaser.Scene {
    constructor(){
        super({key:"select"});
    }
    preload(){}
    create(){
        this.game.scale.setGameSize(1300, 700);
        this.add.text(250, 30, 'ス テ ー ジ せ ん た く', {fontFamily: "PixelMplus10", fontSize: 70, color: 'lime'});
        this.add.text(160, 100, 'チュートリアル & 初級', {fontFamily: "PixelMplus10", fontSize: 35, color: 'maroon'});
        this.add.text(160, 270, '中級', {fontFamily: "PixelMplus10", fontSize: 35, color: 'aqua'});
        this.add.text(160, 400, '上級', {fontFamily: "PixelMplus10", fontSize: 35, color: 'purple'});
        let ofs = 0;
        var buttons = new Array(stageinfo.stages.length);
        for (let index = 0; index < stageinfo.stages.length; ++index) {
            buttons[index]=new RoundedButton(this, 200 + 500 * (index % 2), ofs + 150+40*Math.floor(index / 2), 120, 30, 0xffff00, "STAGE"+index, "red", 15);
            let discription=new SimpleButton(this, 320 + 500 * (index % 2), ofs + 155+40*Math.floor(index / 2), 150, 20, stageinfo.stages[index].description, "black");
            buttons[index].button.on('pointerdown', function(){
                this.scene.start("game",{stage_num:index});
            }.bind(this));
            let of2 = ofs;
            //ここ、カス実装
            buttons[index].button.on('pointerover', function(){
                buttons[index].button.clear();
                buttons[index].button.fillStyle(0x000000, 1);
                buttons[index].button.fillRoundedRect(200 + 500 * (index % 2) - 13, of2 + 150+40*Math.floor(index / 2) - 2, 125, 35, 15);
                buttons[index].button.stroke();
                buttons[index].button.strokeRoundedRect(200 + 500 * (index % 2) - 13, of2 + 150+40*Math.floor(index / 2) - 2, 125, 35, 15);
                buttons[index].button.lineStyle(4, 0x000000, 1);
            });
            buttons[index].button.on('pointerout', function(){
                buttons[index].button.clear();
                buttons[index].button.fillStyle(0xffff00, 1);
                buttons[index].button.fillRoundedRect(200 + 500 * (index % 2) - 10, of2 + 150+40*Math.floor(index / 2), 120, 30, 15);
                buttons[index].button.stroke();
                buttons[index].button.strokeRoundedRect(200 + 500 * (index % 2) - 10, of2 + 150+40*Math.floor(index / 2), 120, 30, 15);
                buttons[index].button.lineStyle(4, 0x000000, 1);
            });
            if(index == 5) ofs += 50;
            else if(index == 9) ofs += 50;
        }
        let num = stageinfo.stages.length;
        if(window.savenum>-1){
            var LoadButton=new RoundedButton(this, 200, 320+40*Math.floor(num / 2), 180, 30, 0xfffff00, "Load", "red", 15)
            LoadButton.button.on('pointerdown', function(){
                this.scene.start("game",{stage_num:window.savenum});
            }.bind(this));
        }else{
            var LoadButton=new RoundedButton(this, 200, 320+40*Math.floor(num / 2), 180, 30, 0xfffff00, "Load", "gray", 15)    
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
    }
    update(){}
} 
export default SceneSelect;