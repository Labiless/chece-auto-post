import { FFCreator, FFScene, FFImage } from "ffcreator"
import path from 'path';

export default class VideoMaker {

    VIDEO = {
        DURATION: 14,
        HEIGHT: 1920,
        WIDTH: 1080,
        BG_COLOR : "#5f7e5f",
        ROTATION_LOGO:{
            LEFT: 758,
            TOP: 1522
        }
    }
    creator;


    constructor() {
        this.init();
    }

    init = () => {
        this.creator = new FFCreator({
            cacheDir: "temp_file",
            outputDir: "temp_file",
            width: this.VIDEO.WIDTH,
            height: this.VIDEO.HEIGHT
        });

        this.creator.on('start', () => {
            console.log(`FFCreator start`);
        });
        this.creator.on('error', e => {
            console.log(`FFCreator error: ${JSON.stringify(e)}`);
        });
        this.creator.on('progress', e => {
            console.log(`FFCreator progress: ${e.state} ${(e.percent * 100) >> 0}%`);
        });
    }

    createVideo = async (img, audio, outPath, callback) => {

        this.creator.on('complete', async e => {
            console.log(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output} `);
            await callback();
        });

        const scene = new FFScene();
        scene.setDuration(this.VIDEO.DURATION);    
        scene.setBgColor(this.VIDEO.BG_COLOR);

        const background = new FFImage({path: "./static/img/background-fadein.jpg", x: this.VIDEO.WIDTH/2, y: this.VIDEO.HEIGHT/2});
        scene.addChild(background);

        const image = new FFImage({ path: img, x: this.VIDEO.WIDTH/2, y: this.VIDEO.HEIGHT/2 });
        image.addEffect('fadeIn', 1, 0);
        scene.addChild(image);
        scene.addAudio(audio);

        const rotatingLogo = new FFImage({path: "./static/img/rotation_text.png", x: this.VIDEO.ROTATION_LOGO.LEFT, y: this.VIDEO.ROTATION_LOGO.TOP});
        rotatingLogo.addAnimate({
            from: { rotate:0, scale: 0.5, alpha: 1 },
            to: { rotate:100, scale: 0.5, alpha:1 },
            time: 100,
            delay: 0,
        });
        scene.addChild(rotatingLogo);

        this.creator.addChild(scene);
        this.creator.output(outPath);
        this.creator.start();
        this.creator.closeLog(); 
        return true;
    }

}