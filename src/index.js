import { Game } from './game.js';

window.onload = () =>{
    
    const canvs = document.getElementById("main");
    const g = new Game(canvs);
    //g.CreateBirds(50);
    g.DrawBirds();
    g.CreateObstacles();
    g.Invalidate();
    g.Checkup();
    g.Gameover();
    g.BirdAI();
    //g.Test();
    
    canvs.onclick = ()=>{
        if(g.startGame && !g.gameOn){
            g.startGame = false;
            g.gameOn = true;
        }else{
            g.Jump();
        }
    }
}
