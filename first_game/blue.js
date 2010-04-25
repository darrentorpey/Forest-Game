BLUE_MANAGER = {
  init: function(blue_tiles) {
    this.blue_tiles = blue_tiles;

    return this;
  },

  grow_blue: function() {
    for (tile in this.blue_tiles) {
      var blue_tile = this.blue_tiles[tile];

      var next_up    = maze.map[blue_tile.y - 1][blue_tile.x];
      var far_up     = maze.map[blue_tile.y - 2][blue_tile.x];

      var next_down  = maze.map[blue_tile.y + 1][blue_tile.x];
      var far_down   = maze.map[blue_tile.y + 2][blue_tile.x];

      var next_right = maze.map[blue_tile.y][blue_tile.x + 1];
      var far_right  = maze.map[blue_tile.y][blue_tile.x + 2];

      var next_left  = maze.map[blue_tile.y][blue_tile.x - 1];
      var far_left   = maze.map[blue_tile.y][blue_tile.x - 2];

      if (next_up == BLUE_PATH && !is_wall(far_up)) {
        this.grow_into({ x: blue_tile.x, y: blue_tile.y - 1 });
      } else if (next_left == BLUE_PATH && !is_wall(far_left)) {
        this.grow_into({ x: blue_tile.x - 1, y: blue_tile.y });
      } else if (next_right == BLUE_PATH && !is_wall(far_right)) {
        this.grow_into({ x: blue_tile.x + 1, y: blue_tile.y });
      } else if (next_down == BLUE_PATH && !is_wall(far_down)) {
        this.grow_into({ x: blue_tile.x, y: blue_tile.y + 1 });
      }
    }
  },

  grow_into: function(coords) {
    help.setTileInMap(gbox.getCanvasContext('mazecanvas'), maze, coords.x, coords.y, BLUE_TILE);
    this.blue_tiles.push({ x: coords.x, y: coords.y });
  }
}

function is_wall(tile) {
  return any_match([0, 1, 2, 3, 4, 5, 6, 7, 8], tile);
}