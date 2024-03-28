import { IVec2Like, TiledLayer, v2, Vec2 } from "cc";

export class TileMap_Utils {

    public static get_tile_postion_by_id(id: number, tiled_layer: TiledLayer) {
        let tile_x_y = this.get_tile_x_y(id, tiled_layer);
        return this.get_tile_position_by_x_y(tile_x_y.x, tile_x_y.y, tiled_layer);
    }

    static hex_length = 52;
    public static get_tile_position_by_x_y(x_id: number, y_id: number, tiled_layer: TiledLayer) {
        let layer_size = tiled_layer.getLayerSize();
        let tile_size = tiled_layer.getMapTileSize();
        let tile_extra_height = tile_size.height - this.hex_length;
        let total_width = (tile_size.width) * (layer_size.width + 0.5);
        let total_height = (tile_size.height - tile_extra_height / 2) * layer_size.height + tile_extra_height / 2;

        let x = (x_id + (y_id % 2 == 0 ? 0 : 0.5) + 0.5) * tile_size.width - total_width / 2;
        let y = (-y_id) * (this.hex_length + tile_extra_height / 2) + total_height / 2 - tile_size.height / 2;
        return v2(x, y);
    }

    public static get_tile_x_y_by_position(position: IVec2Like, tiled_layer: TiledLayer) {
        let layer_size = tiled_layer.getLayerSize();
        let tile_size = tiled_layer.getMapTileSize();
        let tile_extra_height = tile_size.height - this.hex_length;
        let total_width = (tile_size.width) * (layer_size.width + 0.5);
        let total_height = (tile_size.height - tile_extra_height / 2) * layer_size.height + tile_extra_height / 2;

        let y_id = -Math.round((position.y + tile_size.height / 2 - total_height / 2) / (this.hex_length + tile_extra_height / 2));
        let x_id = Math.round(((position.x + total_width / 2) - ((y_id % 2 == 0 ? 0 : 0.5) + 0.5) * tile_size.width) / tile_size.width);
        return v2(x_id, y_id);
    }

    public static get_tile_x_y(id: number, tiled_layer: TiledLayer) {
        let layer_size = tiled_layer.getLayerSize();
        let x_id = id % layer_size.width;
        let y_id = Math.floor(id / layer_size.width);
        return v2(x_id, y_id);
    }

    public static get_tile_id(pos: Vec2, tiled_layer: TiledLayer) {
        let layer_size = tiled_layer.getLayerSize();
        return layer_size.width * pos.y + pos.x;
    }

    public static get_tile_is_surrounded_by_gid(id: number, tiled_layer: TiledLayer, arr_gid: number[]) {
        let layer_size = tiled_layer.getLayerSize();
        let x_id = id % layer_size.width;
        let y_id = Math.floor(id / layer_size.width);
        let pos = v2(x_id, y_id);
        if (arr_gid.indexOf(tiled_layer.getTileGIDAt(pos.x, pos.y + 1)) >= 0) {
            return tiled_layer.getTileGIDAt(pos.x, pos.y + 1);
        }
        if (arr_gid.indexOf(tiled_layer.getTileGIDAt(pos.x, pos.y - 1)) >= 0) {
            return tiled_layer.getTileGIDAt(pos.x, pos.y - 1);
        }
        if (arr_gid.indexOf(tiled_layer.getTileGIDAt(pos.x + 1, pos.y)) >= 0) {
            return tiled_layer.getTileGIDAt(pos.x + 1, pos.y);
        }
        if (arr_gid.indexOf(tiled_layer.getTileGIDAt(pos.x - 1, pos.y)) >= 0) {
            return tiled_layer.getTileGIDAt(pos.x - 1, pos.y);
        }
        return 0;
    }
}