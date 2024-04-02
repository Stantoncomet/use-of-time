# Engine Overview
Hi, welcome to the docs for VNESS, an "engine" for creating *really* simple visual novels and stories. This page is mostly for creating your own novel, so I hope that's what you're here for!

## The Structure of Everything
The premsie of this engine is that a story exists primarily as images, .png files, at least for now. Each picture represents a scene and has its own folder, thus a `scene.png` exists in a corresponding scene directory. These folders are numbered, according to the choices in the scene the folder is in.
If this all sounds really confusing, sorry! Here's a simplified example of a game:

- Epic Game Title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<-- Main game folder
  - config.txt &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<-- Config for the game
  - scene.png &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<-- Starting scene
  - 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<-- Option `0` in the first scene, a folder
    - scene.png &nbsp;&nbsp;<-- Scene you get sent to if you choose option `0` in the first scene
    - 0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<-- Scene folder for option `0` in scene `0`
      - scene.png
    - 1
      - scene.png
  - 1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<-- Option `1` in the first scene, another folder
    - scene.png &nbsp;&nbsp;<-- Scene you get sent to if you choose option `1` in the first scene
    - 0 <-- Scene folder for option `0` in scene `1`
      - scene.png
    - 1
      - scene.png
    - 2
      - jump.txt

Hopefully you get the picture. I'm working on different ways to structure this thing...

Basically, just put your images in a bunch of folders and have a jolly ole time trying to figure out where you are at all times.

## More Terminology
If wanted to reference "the second option's scene in the first scene's first option", the fourth `scene.png` on the diagram, I would use it's scene id, which happens to be `0/1` or `01`. The first `0` is option `0` in the first scene followed by option `1` in that scene. Likely your paths will lots of small numbers, unless your game has lots of options.

## Bonus Stuff
Some more tools you aid you on your creative journey, no need to thank me.

### Jumps
If you've realized you've made too many paths and want to just have some options lead to the same spot, but reasonably don't want to duplicated your entire story after that point, then you can use jump files! A jump file simply replaces where a `scene.png` would go, and contains a scene id to the desired part in the story. The id is in compressed format. Example of a `jump.txt` file:
```
scene:01201
```
Leaving a file just as `scene:` will jump the story to the very first scene.

### Config File
Oh yeah this is a file where you can define values that the engine uses to display your story. Currently the options are:

- scene-width
  - Width to display scenes, in pixels
- scene-height
  - Height to display scenes, in pixels

Here's a `config.txt` example:
```
scene-width:400
scene-height:300
```
