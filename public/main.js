import { player, Input ,isColliding} from "./player.js";
import { maplist, drawMap, loadMap} from "./maps/maps.js";

export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');


canvas.width = 1280;
canvas.height = 720;

Input.init();
loadMap(player.state);

function frame(){
    requestAnimationFrame(frame)
    ctx.clearRect(0,0, canvas.width, canvas.height);

    if(player.state === 'card'){
        if(!maplist['card'].isInitialized){
            maplist['card'].init(player);
        }
        maplist['card'].gameLoop(player,isColliding,loadMap)
    }
    drawMap(ctx,canvas,player);
    player.move(canvas, maplist,loadMap);
    player.draw(ctx);

}

frame()