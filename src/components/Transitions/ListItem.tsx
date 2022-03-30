export type ListItemProps = {
  name: string;
  highlight: string;
};

function ListItem({ name, highlight }: ListItemProps) {
  const index = name.toLocaleLowerCase().indexOf(highlight.toLocaleLowerCase());
  if (index === -1) {
    return <div>{name}</div>;
  }
  return (
    <div>
      {name.slice(0, index)}
      <span className="highlight">
        {name.slice(index, index + highlight.length)}
      </span>
      {name.slice(index + highlight.length)}
    </div>
  );
}

export default ListItem;
