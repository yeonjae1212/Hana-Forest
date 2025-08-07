import { Block } from "./block.js";

export const obstacles = [
    new Block(0,0,1280,350,"wall"),
    new Block(0,600,1100,120,'underWall(l,c)'),
    new Block(1100,600,180,120,'underWall(r)'),
    new Block(965,370,30,100,'teacher npc',null,null,null,4)
]

export const interaction = [
    new Block(1100,350,200,400,'whereToGo',null,"어디로 가면 좋을까?"),
    new Block(230,580,170,200,'classroom',classroom,"교과교실로 들어가시겠습니까?"),
    new Block(950,370,65,180,'teacher npc',teacher_npc,'선생님과 대화를 시작하시겠습니까?','../images/hallway_teacher.png',4)
]

export function classroom(player){
    if(player.key===2){
        player.key++
        console.log(`player key is changed to${player.key}`)
    }
    else if(player.key ==9){
        player.key++
        console.log(`player key is changed to${player.key}`)
    }
    player.state = 'classroom';
    player.interaction = true
    player.x = 270
    player.y = 250
}

export function teacher_npc(player){
    if(player.key===4){
        player.state = 'hallway_teacher';
        player.x = 900;
        player.y = 400;
        player.interaction = true
}
    }

export function whereToGo(player){
    if(player.key===5){
        player.key++
        console.log(`player key is changed to${player.key}`)
    }
    player.state = 'studyRoom';
    player.interaction = true
}