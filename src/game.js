import { Bird } from './bird.js'
import { Obstacle } from './obstacle.js'

export class Game{

    constructor(canvs){
        this.Birds = [];
        this.Obstacles = [];
        this.currentObs = null;
        this.gameOn = false;
        this.startGame = true;
        this.canvas = canvs;
        this.Hole = 25;
        this.AccelerationY = 0.016;
        this.SpeedX = 0.19;
        this.TopScore = 0;
        this.Score = 0;
        this.Generation = 0;
        this.NumOfBirds = 55;
        this.NumOfRandom = 55;
        this.Birds.push(new Bird());
    }
    AddBird(){
        this.Birds.push(new Bird());
    }
    AddObstacle(){
        let obs = new Obstacle(Math.floor(Math.random()*(100-this.Hole-13))+2);
        let div = document.createElement("div");
        div.className = "Obstacle";
        div.style.left = obs.x + "%";
        this.canvas.appendChild(div);
        obs.ref = div;
        this.Obstacles.push(obs);

        let part1 = document.createElement("div");
        part1.className = "ObsPart";
        part1.style.height = obs.y + "vh";

        let part2 = document.createElement("div");
        part2.className = "ObsPart";
        part2.style.height = (100 - obs.y - this.Hole) + "vh";
        part2.style.marginTop = this.Hole + "vh";
        div.appendChild(part1);
        div.appendChild(part2);
        if(this.currentObs == null){
            this.currentObs = obs;
        }
    }
    CreateObstacles(){
        setInterval(()=>{
            if(this.gameOn)
                this.AddObstacle();
        },2000);
    }
    CreateBirds(num){
        for(let i=0;i<num;i++){
            this.AddBird();
        }
    }
    DrawBirds(){
        this.Birds.forEach((bird)=>{
            let div = document.createElement("div");
            if(bird.color == 0){
                div.className = "Bird";
            }else if(bird.color == 1){
                div.className = "BirdChampion";
            }else if(bird.color == 2){
                div.className = "BirdChild";
            }else if(bird.color == 3){
                div.className = "BirdMutation";
            }else if(bird.color == 4){
                div.className = "BirdCombination";
            }
            
            div.style.top = bird.y + "%";
            div.style.left = bird.x + "%";
            this.canvas.appendChild(div);
            bird.ref = div;
        });
    }
    Invalidate(){
        setInterval(()=>{
            if(this.gameOn){
                this.Birds.forEach((bird)=>{
                    if(bird.alive){
                        bird.speed += this.AccelerationY;
                        bird.y += bird.speed;
                        bird.ref.style = 'transform: rotate(' + bird.speed * 45 + 'deg)';
                        bird.ref.style.top = bird.y + "%";
                        bird.ref.style.left = bird.x + "%";
                    }else if(bird.x > 0){
                        bird.x -= this.SpeedX;
                        bird.ref.style.left = bird.x + "%";
                        if(bird.y < 89){
                            bird.y += 0.7;
                            bird.ref.style.top = bird.y + "%";
                        }
                    }
                });
                this.Obstacles.forEach((obs)=>{
                    obs.x -= this.SpeedX;
                    obs.ref.style.left = obs.x + "%";
                });
                /*if(this.currentObs!=null){
                    document.getElementsByClassName("Info3")[0].innerHTML = `x:${this.currentObs.x.toFixed(2)}
                    <br>y:${this.currentObs.y.toFixed(2)}`;
                }   */
            }
        },10);
    }
    Checkup(){
        setInterval(()=>{
            
            // check for dead birds
            this.Birds.forEach((bird)=>{
                if(bird.alive){
                    if(bird.y >= 87 || bird.y <= 5){
                        bird.score = this.Score;
                        bird.alive = false;
                    }
                }
            });
            if(this.currentObs != null && this.currentObs.x >= 31 && this.currentObs.x <= 41){ // x range 35(-4,+6)
                this.Birds.forEach((bird)=>{
                    if(bird.alive){
                        if(bird.y <= this.currentObs.y+5){ // offset is +5
                            bird.score = this.Score;
                            bird.alive = false;
                        }else if(bird.y >= this.currentObs.y+this.Hole-3){ // offset is -3
                            bird.score = this.Score;
                            bird.alive = false;
                        }
                    }
                });
            }
            // delete obstacles out of sight
            this.Obstacles.forEach((obs,index) => {
                if(obs.x <= 14){
                    obs.ref.remove();
                    //this.Obstacles.splice(index,1);
                    this.Obstacles.shift();
                }
            });
            // change current obstacle
            if(this.currentObs != null){
                if(this.currentObs.x < 30){
                    this.currentObs = this.Obstacles[1];
                    this.Score++;
                    document.getElementsByClassName("Score")[0].innerHTML = "score:" + this.Score;
                }
            }
        },1);
    }
    Gameover(){
        setInterval(()=>{
            let alldead = true;
            for(let i=0;i<this.Birds.length;i++){
                if(this.Birds[i].alive){
                    alldead = false;
                    break;
                }
            }
            if(alldead && this.gameOn){
                setTimeout(()=>{
                    this.gameOn = false;
                    /*for (let i = 1; i < 10; i++){
                        window.clearInterval(i);
                    }*/   
                    setTimeout(()=>{
                        this.NewGame(false);
                    },500);
                },700);
            }
        },800);
    }
    NewGame(clickToStart){
        
        // before deleting
        this.Birds[0].alive = true;
        this.Birds[0].color = 1;
        this.Birds[0].x = 35;
        this.Birds[0].y = 40;
        this.Birds[0].speed = 0;
        this.Birds[0].score = 0;
        this.Birds.forEach((bird)=>{
            if(bird.score > this.TopScore){
                this.TopScore = bird.score;
                for(let i=0;i<8;i++){
                    this.Birds[0].Weights[0][i] = bird.Weights[0][i];
                }
                for(let i=0;i<2;i++){
                    this.Birds[0].Weights[1][i] = bird.Weights[1][i];
                }
            }
        });

        // delete old stuff
        this.Birds.forEach((el)=>{
            if(el.ref != null)
                el.ref.remove();
        });
        this.Obstacles.forEach((el)=>{
            if(el.ref != null)
                el.ref.remove();
        });
        this.Birds.splice(1,this.Birds.length-1);
        this.Obstacles.splice(0,this.Obstacles.length);

        // set new properties
        this.currentObs = null;
        this.startGame = clickToStart;
        this.Score = 0;
        this.Generation++;
        document.getElementsByClassName("Info1")[0].innerHTML = `TopScore:${this.TopScore}<br>Generation:${this.Generation}`;
        document.getElementsByClassName("Score")[0].innerHTML = "score:" + this.Score;
        if(!this.startGame)
            this.gameOn = true;
        if(this.TopScore >= 1){
            this.NumOfRandom = 20;
        }

        // Creating Birds
        // Children
        for(let i=0;i<this.NumOfBirds-this.NumOfRandom;i++){
            let b = new Bird();
            if((Math.random()*50) > 7){ // child
                b.color = 2;
                for(let j=0;j<8;j++){
                    b.Weights[0][j] = this.Birds[0].Weights[0][j] + ((Math.random()*4-2)/10);
                }
                for(let j=0;j<2;j++){
                    b.Weights[1][j] = this.Birds[0].Weights[1][j] + ((Math.random()*4-2)/10);
                }
            }else{ // mutation and combination
                if((Math.random()*50) > 25){ // combination
                    b.color = 4;
                    for(let j=0;j<8;j++){
                        if(Math.random()*30>25){
                            b.Weights[0][j] = (Math.random()*2)-1;
                        }else{
                            b.Weights[0][j] = this.Birds[0].Weights[0][j];
                        }
                    }
                    for(let j=0;j<2;j++){
                        if(Math.random()*20>14){
                            b.Weights[1][j] = (Math.random()*2)-1;
                        }else{
                            b.Weights[1][j] = this.Birds[0].Weights[1][j];
                        }
                    }
                }else{ // mutation
                    b.color = 3;
                    b.Weights[0][Math.floor(Math.random()*8)] = (Math.random()*2)-1;  
                }
               
            }
            this.Birds.push(b);
        }

        // Random Birds
        this.CreateBirds(this.NumOfRandom);

        // Draw Birds
        this.DrawBirds(this.canvas);
    }
    Jump(){
        this.Birds.forEach((bird)=>{
            bird.Jump();
        });
    }
    BirdAI(){
        setInterval(()=>{
            this.Birds.forEach((bird)=>{
                if(bird.alive){
                    if(this.currentObs != null){
                        bird.AI(this.currentObs.x,this.currentObs.y,this.Hole);
                    }
                    else{
                        bird.AI(90,25,this.Hole);
                    }
                }
            });
        },10);
    }
    Test(){
        this.Birds.forEach((bird)=>{
            console.log(bird);
        });
    }
}