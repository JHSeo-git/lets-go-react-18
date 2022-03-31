export type ColorItemProps = {
  color: string;
};

function ColorItem({ color }: ColorItemProps) {
  return <div className="color-box" style={{ backgroundColor: color }}></div>;
}

export default ColorItem;
