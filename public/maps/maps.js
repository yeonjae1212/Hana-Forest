import * as classRoom from './classroom.js'

export const maplist = {
    classRoom: classRoom
}

let imgLoaded = false;
const img = new Image();
img.src = "/images/classRoom.jpg";
img.onload = () =>{
    imgLoaded = true;
}

export function drawMap(ctx, canvas, player){
    if(imgLoaded)
        ctx.drawImage(img,0,0, canvas.width, canvas.height)
    for (let obs of maplist[player.state].obstacles){
        obs.drawObstacle(ctx, 'red')
    }
    for (let i of maplist[player.state].interaction){
        i.drawObstacle(ctx,'blue')
    }
}