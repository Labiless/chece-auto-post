import { FFCreator, FFScene, FFImage } from "ffcreator"
import path from 'path';

export default class VideoMaker {

    VIDEO = {
        HEIGHT: 1920,
        WIDTH: 1080
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
        scene.setDuration(10);

        const image = new FFImage({ path: img, x: this.VIDEO.WIDTH/2, y: this.VIDEO.HEIGHT/2 });
        scene.addChild(image);
        scene.addAudio(audio);

        this.creator.addChild(scene);
        this.creator.output(outPath);
        this.creator.start();
        this.creator.closeLog(); 
        return true;
    }

}