import * as classroom from './classroom.js'
import * as robot from '../minigames/robot.js'
import * as classroomHallway from './classroomHallway.js'
import * as studyRoom from './studyRoom.js'
import * as dormHallway from './dormHallway.js'
import * as closetGame from '../minigames/closetGame.js'
import * as dorm from './dorm.js'
import * as cardGame from '../minigames/cardGame.js'
import * as ending1 from '../minigames/ending1.js'
import * as ending2 from '../minigames/ending2.js'
import * as card from '../npc/card.js'
import * as room_teacher from '../npc/room_teacher.js'
import * as hallway_teacher from '../npc/hallway_teacher.js'
import * as friend from '../npc/friend.js'

export const maplist = {
    classroom: classroom,
    robot : robot,
    classroomHallway: classroomHallway,
    studyRoom: studyRoom,
    dormHallway: dormHallway,
    dorm : dorm,
    closetGame : closetGame,
    cardGame : cardGame,
    ending1: ending1,
    ending2: ending2,
    card: card,
    hallway_teacher:hallway_teacher,
    room_teacher:  room_teacher,
    friend: friend,

}


const img = new Image();
img.src = '';
let imgLoaded = false;


export function loadMap(state){
    imgLoaded = false;
    img.src = `../images/${state}.jpg`;
    console.log('map image loading...')
    for(let i of maplist[state].interaction){
        if(i.imageSrc){
        i.loadObj()
        }

    }
    img.onload = () =>{
        imgLoaded = true;
        console.log('map image loading')
    }

}

export function drawMap(ctx, canvas, player){
    if(imgLoaded)
        ctx.drawImage(img,0,0, canvas.width, canvas.height)
    for (let obs of maplist[player.state].obstacles){
        if(player.key == obs.key||obs.key==-1){        
            obs.drawObstacle(ctx, 'red')
        }
    }
        for (let i of maplist[player.state].interaction){
        if(player.key == i.key||i.key==-1){
        i.drawObstacle(ctx,'blue')
        }
    }
    for (let i of maplist[player.state].interaction){
        if((player.key == i.key||i.key==-1)&&(i.imgLoaded)){
            console.log(`obj image: ${i.name}`)
        i.drawObj(ctx)
        }
    }

}