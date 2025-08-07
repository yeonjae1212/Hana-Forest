import { Block } from "../maps/block.js";

export const obstacles = []
export const interaction = [
new Block(460,450,400,400,'oribae',null,null,'../images/robot2.png')
]
let frameCount = 0

export function init(player){}

export function gameLoop(player, isColliding, loadMap){
    let ori = interaction[0]
    ori.y--
    ori.y--
    if(ori.y<-300){
        player.state = 'ending2'
        loadMap('ending2')
    }
}

