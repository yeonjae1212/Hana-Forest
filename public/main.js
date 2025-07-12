import { player, Input } from "./player.js";
import { maplist, drawMap} from "./maps/maps.js";

export const canvas = document.getElementById('canvas');
export const ctx = canvas.getContext('2d');


canvas.width = 1280;
canvas.height = 720;

Input.init();

function frame(){
    requestAnimationFrame(frame)
    ctx.clearRect(0,0, canvas.width, canvas.height);

    drawMap(ctx,canvas,player);
    player.move(canvas, maplist);
    player.draw(ctx);

}

frame()