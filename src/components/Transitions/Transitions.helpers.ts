import randomColor from 'randomcolor';

export function getColors(len: number) {
  const colors = [];
  for (let i = 0; i < len; i++) {
    colors.push(randomColor());
  }
  return colors;
}
