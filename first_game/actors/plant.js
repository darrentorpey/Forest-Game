function add_plant(data) {
  gbox.addObject({
    id: data.id,
    group: 'plants',
    tileset: 'plant',
    health_level: 1,

    initialize:function() { // From now, go back to the capman object for what I'm not commenting. You're getting better, so let's make the things harder :)
      toys.topview.initialize(this,{
        colh: gbox.getTiles(this.tileset).tileh,
        colw: gbox.getTiles(this.tileset).tilew,
        staticspeed: 2,
        nodiagonals: true,
        noreset: true,
        frames:{
          still:{ speed:2, frames:[0] },
          hit:{speed:1,frames:[0,1,0,1]},
          standup:{ speed:1, frames:[0] },
          standdown:{ speed:1, frames:[1] },
          standleft:{ speed:1, frames:[2] },
          standright:{ speed:1, frames:[2] },
          movingup:{speed:1,frames:[0] },
          movingdown:{speed:1,frames:[1] },
          movingleft:{speed:1,frames:[2] },
          movingright:{speed:1,frames:[2] }
        },
        x:data.x, // This time, we will place ghosts on creation. We will destroy and recreate the ghosts every time, since the status of enemies, bullets and foes rarely needs to be kept.
        y:data.y
      });
      // maingame.hud.setWidget('plant_label1', { widget: 'label', font: 'small', value: '&&&&&', dx: (-1 * gbox.getScreenW()) + data.x, dw: gbox.getScreenW() - 5, dy: gbox.getScreenH() - 155, halign:gbox.ALIGN_RIGHT, clear:true });
      // maingame.hud.setValue('plant_label1', 'value', '?');
    },

    first:function() {
      
    },

    blit:function() { // In the blit phase, we're going to render the ghost on the screen, just like capman.
      gbox.blitTile(gbox.getBufferContext(),{ tileset:this.tileset, tile: this.frame, dx:this.x, dy:this.y, fliph:this.fliph, flipv:this.flipv, camera:this.camera, alpha:1});
    }
  });
}