
export class RoundedButton {
    constructor(scene, x, y, width, height, buttonColor, text, textColor) {
        this.button = scene.add.graphics();
        this.button.fillStyle(buttonColor).fillRoundedRect(x - 10, y, width, height, 25);
        this.button.stroke();
        this.button.strokeRoundedRect(x - 10, y, width, height, 25);
        this.button.lineStyle(4, 0xff00ff, 1);
        this.text = scene.add.text(x, y, text, {fontFamily: "PixelMplus10", fontSize: height, color: textColor});
        this.button.setInteractive(new Phaser.Geom.Rectangle(x, y, width, height), Phaser.Geom.Rectangle.Contains);
    }
};
export class SimpleButton {
    constructor(scene, x, y, width, height, text, textColor) {
        this.button = scene.add.rectangle(
            x+width/2, y+height/2,
            width, height);
        this.text = scene.add.text(x, y, text, {fontFamily: "PixelMplus10", fontSize: height, color: textColor});
        this.button.setInteractive();
    }
};
export class Simpleimage {
    constructor(scene, x, y, text) {
        this.button = scene.add.image(
            x, y,
            text);
        this.button.setInteractive();
    }
};