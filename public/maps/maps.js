import * as classroom from './classroom.js'
import * as robot from '../minigames/robot.js'
import * as classroomHallway from './classroomHallway.js'
import * as studyRoom from './studyRoom.js'
import * as dormHallway from './dormHallway.js'
import * as closetGame from '../minigames/closetGame.js'
import * as dorm from './dorm.js'
import * as card from '../minigames/card.js'

export const maplist = {
    classroom: classroom,
    robot : robot,
    classroomHallway: classroomHallway,
    studyRoom: studyRoom,
    dormHallway: dormHallway,
    dorm : dorm,
    closetGame : closetGame,
    card : card,

}


const img = new Image();
img.src = '';
let imgLoaded = false;


export function loadMap(state){
    imgLoaded = false;
    img.src = `/images/${state}.jpg`;
    img.onload = () =>{
        imgLoaded = true;
    }

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