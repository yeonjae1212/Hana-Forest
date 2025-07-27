export class Block {
    constructor(x, y, width, height, name, imageSrc = null) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.name = name;
        this.imageSrc = imageSrc;


  
    }

    // 이미지 그리기 (이미지가 존재할 경우에만)
    drawImage(ctx) {

        if (imageSrc) {
            this.image = new Image();
            this.image.src = imageSrc;

                // 이미지가 완전히 로드된 후 draw 실행
            this.image.onload = () => {
                const canvas = document.getElementById("canvas");
                const ctx = canvas.getContext("2d");
                this.drawImage(ctx);
            };

            this.image.onerror = () => {
                console.error(`이미지 로드 실패: ${imageSrc}`);
            };
        }   
        else {
            this.image = null;
        }

        if (this.image && this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else if (this.image) {
            // 이미지가 아직 로드되지 않았다면, 로드된 후 다시 그리기 시도
            this.image.onload = () => {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            };
        }
    }

    drawObstacle(ctx, color){
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}
