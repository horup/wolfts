import * as THREE from 'three';

export default class Input
{
    pressed = {};
    mouseDown:boolean = false;
    startMouseX:number = 0;
    startMouseY:number = 0;
    mouseX:number = 0;
    mouseY:number = 0;
    constructor()
    {
        document.body.onmousedown = (e) =>
        {
            this.mouseDown = true;
            this.startMouseX = e.offsetX;
            this.startMouseY = e.offsetY;
            document.body.onmousemove(e);
        }
        document.body.onmouseup = (e) =>
        {
            this.mouseDown = false;
        }
        document.body.onmousemove = (e) =>
        {
            let x = e.offsetX - this.startMouseX;
            let y = e.offsetY - this.startMouseY;
            this.mouseX = x / document.body.clientWidth * 2;
            this.mouseY = y / document.body.clientHeight * 2;
        }

        document.addEventListener('touchstart', (e)=>
        {
            document.body.onmousedown({offsetX:e.touches[0].clientX, offsetY:e.touches[0].clientY} as any);
        });

        document.addEventListener('touchmove', (e)=>
        {
            document.body.onmousemove({offsetX:e.touches[0].clientX, offsetY:e.touches[0].clientY} as any);
        });

        document.addEventListener('touchend', (e)=>
        {
            document.body.onmouseup({offsetX:0, offsetY:0} as any);
        });

        document.body.onkeydown = (e) => {
            this.pressed[e.keyCode] = true;
        }
        document.body.onkeyup = (e) => {
            this.pressed[e.keyCode] = false;
        }
    }

    handle(camera:THREE.Camera)
    {
        let speed = 0.05*4;
        let rotation = 0.05;
        if (this.pressed[37])
            camera.rotateY(rotation);
        else if (this.pressed[39])
            camera.rotateY(-rotation);

        let v = new THREE.Vector3();
        if (this.pressed[38])
            camera.translateZ(-speed);
        else if (this.pressed[40])
            camera.translateZ(speed);
        if (this.mouseDown)
        {
            camera.rotateZ(rotation * -this.mouseX);
            camera.translateZ(speed*this.mouseY);
        }
    }
}