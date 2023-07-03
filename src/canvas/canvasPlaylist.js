import { createCanvas, loadImage, createImageData, registerFont } from 'canvas';
import fs from "fs";

export default class CanvasPlaylist {

    IMAGE = {
        WIDTH: 1000,
        HEIGHT: 1000
    }

    // FONT_PATH = "static/font/Beachfly Free Trial.ttf"
    canvas;
    ctx;
    customFont;

    constructor() {
        // this.customFont = registerFont(this.FONT_PATH, { family: this.TEXT.FONT_FAMILY});
        this.canvas = createCanvas(this.IMAGE.WIDTH, this.IMAGE.HEIGHT);
        this.ctx = this.canvas.getContext('2d');
    }

    getImageBitmap = async (data) => {
        const bmp = await createImageData(new Blob([data]));
        return bmp;
    }

    // it return the height of the text block
    writeNumber = (text, left, top) => {
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "black";
        this.ctx.font = `800 70px Arial`;
        this.ctx.fillText(`#${text}`, left, top);
    }    

    writeAllTracks = (tracksData) => {

        let top = 300;
        let lineHeight = 85;
        let left = 120;

        this.ctx.textAlign = "left";
        this.ctx.fillStyle = "black";

        tracksData.forEach(trackData => {
            this.ctx.font = `35px Arial`;
            this.ctx.fillText(`${trackData.name}`, left, top);
            this.ctx.font = `25px Arial`;
            this.ctx.fillText(`${trackData.artist}`, left, top+30);
            top+=lineHeight;
        })

    }
    writeTrack = (text) => {

    }

    createTracksListImage = async (template, tracksData) => {
        const imgTemplate = await loadImage(template);
        this.ctx.drawImage(imgTemplate, 0, 0, this.IMAGE.WIDTH , this.IMAGE.HEIGHT);

        this.writeAllTracks(tracksData);
        console.log("canvas ok, image tracks list created");
        return this.canvas.toDataURL('image/png');
    }

    createCoverImage = async (template, number) => {
        const imgTemplate = await loadImage(template);
        this.ctx.drawImage(imgTemplate, 0, 0, this.IMAGE.WIDTH , this.IMAGE.HEIGHT);
        this.writeNumber(number, 740,890);
        console.log("canvas ok, cover image created");
        return this.canvas.toDataURL('image/png');
    }
}

