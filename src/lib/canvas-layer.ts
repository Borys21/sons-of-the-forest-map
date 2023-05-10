import leaflet, { Coords, TileLayer, TileLayerOptions } from "leaflet";

type Tile = HTMLCanvasElement & { complete: boolean };

const OFFSETS = [0, 1, 2, 4, 8, 16, 32];
const CanvasLayer = leaflet.TileLayer.extend({
  getTileUrl: function (coords: Coords) {
    const zoom = -this.options.minZoom + coords.z;
    coords.x += OFFSETS[zoom];
    coords.y += OFFSETS[zoom];
    return leaflet.TileLayer.prototype.getTileUrl.call(this, coords);
  },
  createCanvas: function (
    tile: Tile,
    coords: Coords,
    done: (err: unknown, tile: Tile) => void
  ) {
    let err: unknown;
    const ctx = tile.getContext("2d")!;
    const { doubleSize } = this.options;

    const { x: width, y: height } = this.getTileSize();
    tile.width = doubleSize ? width * 2 : width;
    tile.height = doubleSize ? height * 2 : height;

    const img = new Image();
    img.onload = () => {
      try {
        ctx.drawImage(img, 0, 0);
        tile.complete = true;
      } catch (e) {
        err = e;
      } finally {
        done(err, tile);
      }
    };
    const tileZoom = this._getZoomForUrl();
    img.src = isNaN(tileZoom) ? "" : this.getTileUrl(coords);
    img.crossOrigin = "anonymous";
  },
  createTile: function (coords: Coords, done: () => void) {
    const { timeout } = this.options;
    const { z: zoom } = coords;
    const tile = document.createElement("canvas");

    if (timeout) {
      if (zoom !== this._delaysForZoom) {
        this._clearDelaysForZoom();
        this._delaysForZoom = zoom;
      }

      if (!this._delays[zoom]) this._delays[zoom] = [];

      this._delays[zoom].push(
        setTimeout(() => {
          this.createCanvas(tile, coords, done);
        }, timeout)
      );
    } else {
      this.createCanvas(tile, coords, done);
    }
    return tile;
  },
  _clearDelaysForZoom: function () {
    const prevZoom = this._delaysForZoom;
    const delays = this._delays[prevZoom];

    if (!delays) return;

    delays.forEach((delay: number, index: number) => {
      clearTimeout(delay);
      delete delays[index];
    });

    delete this._delays[prevZoom];
  },
}) as new (url: string, options: TileLayerOptions) => TileLayer;

export const createCanvasLayer = function (
  url: string,
  options: TileLayerOptions
) {
  return new CanvasLayer(url, options);
};
