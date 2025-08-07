import { Block } from "./block.js";

export const obstacles = [
    new Block(0, 0, 350, 130,'Wall_left'),
    new Block(500, 0, 800, 130, 'Wall_right'),
    new Block(120, 400, 25, 110, 'teacher')
]

export const interaction = [
    new Block(1100, 130, 200, 600, 'whereToGo', null, "어디로 이동하면 좋을까?"),
    new Block(350, 0, 150, 130, 'dorm', dorm, "기숙사 호실로 들어갈까?"),
    new Block(100, 380, 60, 170, 'card', card, "생활관 선생님과 대화를 시도해볼까?",'../images/dorm_teacher.png', 1)
]

       

export function card(player){
    if(player.key===1){
          player.interaction = true
          player.state = 'card'
          player.x = 500
          player.y = 500
    }
}

export function dorm(player){
    if(player.key===7){
        player.key++
        console.log(`player key is changed to${player.key}`)
    }
    
    player.state = 'dorm'
    player.x = 540
    player.y = 570
    player.interaction = true

}
