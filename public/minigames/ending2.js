import { Block } from "../maps/block.js";
export const interaction = [
    new Block(600,450,100,100,'oribae',null,null,'../images/robot3.png')
]
export const obstacles = []


const messageBox = document.createElement('div');
messageBox.id = "message";
messageBox.innerHTML = `<p id ='title'>The End</p>`
Object.assign(messageBox.style, {
    position: 'absolute',
    left: '30%',
    top: '20%',
    transform: 'translate(-50%, -50%)',
    textAlign: "center",
    fontSize: "40px",
    color: "rgba(255, 255, 255, 0.9)",
    zIndex: "1000"
});

export function init(player){}

export function gameLoop(player, isColliding, loadMap){
    let ori = interaction[0]
    ori.x--
    if(ori.x<100){
        document.body.appendChild(messageBox);
    }
}
