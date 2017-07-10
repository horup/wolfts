# wolfts
partial Wolf3D engine implemented using TypeScript + THREE.JS lib.
Not a game *yet*, but a tech-demo: http://wolfts.hrup.dk
Currently implemented:
- map loading from Tiled JSON format.
- wall textures
- sprites, both *static* sprites such as items and animated sprites such as guards.
- loads from atlas to improve speed.
- grid is buffered into a single geometry to improve speed.
- sprites are batched into single Buffer geometry to improve speed.
- pushwalls.
- doors
- semi touch support, works on tablets and phones.
- collision detection between grid and pushwalls. 

Todos:
- shooting
- ai
- item pickups
- exiting level
- bosses.
- health
- secrets

![ScreenShot](https://user-images.githubusercontent.com/29634453/27526358-7c4fe5e8-5a45-11e7-9d0c-d77ddcdc6c58.png)
