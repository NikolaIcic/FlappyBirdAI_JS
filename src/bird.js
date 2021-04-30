export class Bird{

    constructor(){
        this.alive = true;
        this.color = 0; // 0 - new birds, 1 - champion, 2 - child, 3 - mutation
        this.x = 35;
        this.y = 40;
        this.speed = 0;
        this.score = 0;
        this.ref = null;
        this.Bias = new Array(3);
        this.Weights = new Array(2);
        this.Bias[0] = new Array(4);
        this.Bias[1] = new Array(2);
        this.Weights[0] = new Array(8);
        this.Weights[1] = new Array(2);
        for(let i=0;i<8;i++){
            this.Weights[0][i] = (Math.random()*2)-1; // random number beetween -1 and 1
        }
        for(let i=0;i<2;i++){
            this.Weights[1][i] = (Math.random()*2)-1;
        }
    }
    Jump(){
        this.speed = -0.7;
    }
    AI(ObsX,ObsY,HoleSize){
        // inputs
        this.Bias[0][0] = this.y / 100; // Bird y
        this.Bias[0][1] = (ObsX - this.x) / 100; // Distance to Obs
        this.Bias[0][2] = (ObsY - this.y + 4) / 100; // y1
        this.Bias[0][3] = (ObsY + HoleSize - this.y - 3) / 100; // y2
        // hidden layer
        this.Bias[1][0] = this.Bias[0][0] * this.Weights[0][0] + this.Bias[0][1] * this.Weights[0][1] + this.Bias[0][2] * this.Weights[0][2] 
        + this.Bias[0][3] * this.Weights[0][3];
        this.Bias[1][1] = this.Bias[0][0] * this.Weights[0][4] + this.Bias[0][1] * this.Weights[0][5] + this.Bias[0][2] * this.Weights[0][6] 
        + this.Bias[0][3] * this.Weights[0][7];
        // output
        this.Bias[2] = this.Bias[1][0] * this.Weights[1][0] + this.Bias[1][1] * this.Weights[1][1];
        if(this.Bias[2] > 0)
            this.speed = -0.7;
    }
}