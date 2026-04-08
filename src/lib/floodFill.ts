export function floodFill(
  imageData: ImageData,
  startX: number,
  startY: number,
  tolerance: number,
  width: number,
  height: number
): boolean[] {
  const data = imageData.data;
  const visited = new Uint8Array(width * height);
  const result = new Array<boolean>(width * height).fill(false);

  const getPixel = (x: number, y: number) => {
    const idx = (y * width + x) * 4;
    return { r: data[idx], g: data[idx + 1], b: data[idx + 2], a: data[idx + 3] };
  };

  const seedPixel = getPixel(startX, startY);

  const colorDiff = (x: number, y: number) => {
    const p = getPixel(x, y);
    return Math.abs(p.r - seedPixel.r) + Math.abs(p.g - seedPixel.g) + Math.abs(p.b - seedPixel.b);
  };

  const stack: Array<[number, number]> = [[startX, startY]];
  while (stack.length > 0) {
    const [cx, cy] = stack.pop()!;
    if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;
    const idx = cy * width + cx;
    if (visited[idx]) continue;
    visited[idx] = 1;

    if (colorDiff(cx, cy) <= tolerance * 3) {
      result[idx] = true;
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
  }

  return result;
}
