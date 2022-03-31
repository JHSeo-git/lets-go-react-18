import { Item } from './Suspenses.types';

export type StoryProps = {
  item: Item;
};

function Story({ item }: StoryProps) {
  const { host } = item.url ? new URL(item.url) : { host: '#' };

  return (
    <div
      style={{
        margin: '0.25rem 0',
        padding: '0.25rem',
        border: '1px solid gray',
        borderRadius: '0.25rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.75rem',
        }}
      >
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          {item.title}
        </a>
        {item.url && (
          <a href={`http://${host}`}>[{host.replace(/^www\./, '')}]</a>
        )}
      </div>
    </div>
  );
}

export default Story;
