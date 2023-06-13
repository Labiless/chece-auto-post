import { createCanvas, loadImage, createImageData, registerFont } from 'canvas';
import fs from "fs";

export default class Canvas {

    STORIES_SIZE = {
        HEIGHT: 1920,
        WIDTH: 1080
    }
    TEXT = {
        MAX_WIDTH : this.STORIES_SIZE.WIDTH/100 * 100,
        LEFT : this.STORIES_SIZE.WIDTH/ 2 + 10,
        NAME_TOP: 150,
        NAME_SIZE: 80,
        ARTIST_SIZE: 60,
        LINE_HEIGHT: 80,
        FONT_FAMILY: "Heavitas",
        COLOR: "#577372"
    }

    FONT_PATH = "static/font/Heavitas.ttf"
    canvas;
    ctx;
    customFont;

    constructor() {
        this.customFont = registerFont(this.FONT_PATH, { family: this.TEXT.FONT_FAMILY});
        this.canvas = createCanvas(this.STORIES_SIZE.WIDTH, this.STORIES_SIZE.HEIGHT);
        this.ctx = this.canvas.getContext('2d');
    }

    getImageBitmap = async (data) => {
        const bmp = await createImageData(new Blob([data]));
        return bmp;
    }

    // it return the height of the text block
    writeName = (text) => {
        const maxCharInARow = this.calcMaxCharInARow(this.TEXT.NAME_SIZE/100 * 60, this.TEXT.MAX_WIDTH);
        const allRows = this.calcNumberOfRow(text,maxCharInARow);

        this.ctx.textAlign = "center";
        this.ctx.fillStyle = this.TEXT.COLOR;
        this.ctx.font = `800 ${this.TEXT.NAME_SIZE}px ${this.TEXT.FONT_FAMILY}`;

        let lineHeight = 0;
        allRows.forEach(el => {
            this.ctx.fillText(el, this.TEXT.LEFT, (this.TEXT.NAME_TOP + lineHeight));
            lineHeight += this.TEXT.LINE_HEIGHT;
        })
        return lineHeight;
    }    

    writeArtist = (text, top) => {
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = this.TEXT.COLOR;
        this.ctx.font = `800 ${this.TEXT.ARTIST_SIZE}px ${this.TEXT.FONT_FAMILY}`
        this.ctx.fillText(text, this.TEXT.LEFT, (this.TEXT.NAME_TOP +top));
    }

    calcNumberOfRow = (text,maxCharInARow) => {
        let cont = maxCharInARow;
        let currentString = "";
        let res = [];

        const splittedText= text.split(" ");

        splittedText.forEach((el, i) => {

            cont-=(el.length + 1);
            if( i == (splittedText.length-1)){
                currentString += (el + " ");
                res.push(currentString);
                return
            }
            else if(cont < 0){
                res.push(currentString);
                currentString = "";
                cont = maxCharInARow;
                cont-=(el.length + 1);
                currentString += (el + " ");
                return
            }
            else{
                currentString+=(el + " ");
                return
            }
        });
        return res;
    }   

    calcMaxCharInARow = (charPx, maxWidth) => maxWidth/charPx;

    createImg = async (template, spotifyCover, trackName, trackArtist) => {
        const imgTemplate = await loadImage(template);
        const imgCover = await loadImage(spotifyCover);

        this.ctx.drawImage(imgCover, 0, 280, this.STORIES_SIZE.WIDTH , this.STORIES_SIZE.WIDTH );
        this.ctx.drawImage(imgTemplate, 0, 0, this.STORIES_SIZE.WIDTH , this.STORIES_SIZE.HEIGHT);

        const topNextText = this.writeName(trackName);
        this.writeArtist(trackArtist, topNextText);

        console.log("canvas ok, image created");
        return this.canvas.toDataURL('image/png');
    }
}