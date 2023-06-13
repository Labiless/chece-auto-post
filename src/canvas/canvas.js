import { createCanvas, loadImage, createImageData } from 'canvas';
import fs from "fs";

export default class Canvas {

    STORIES_SIZE = {
        HEIGHT: 1920,
        WIDTH: 1080
    }
    canvas;
    ctx;


    constructor() {
        this.canvas = createCanvas(this.STORIES_SIZE.WIDTH, this.STORIES_SIZE.HEIGHT);
        this.ctx = this.canvas.getContext('2d');
    }

    getImageBitmap = async (data) => {
        const bmp = await createImageData(new Blob([data]));
        return bmp;
    }

    createImg = async (template, spotifyCover) => {
        const imgTemplate = await loadImage(template);
        const imgCover = await loadImage(spotifyCover);

        this.ctx.drawImage(imgCover, 0, 280, this.STORIES_SIZE.WIDTH , this.STORIES_SIZE.WIDTH );
        this.ctx.drawImage(imgTemplate, 0, 0, this.STORIES_SIZE.WIDTH , this.STORIES_SIZE.HEIGHT);

        console.log("canvas ok, image created");
        return this.canvas.toDataURL('image/png');
    }
}