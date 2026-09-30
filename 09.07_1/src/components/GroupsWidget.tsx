import { mockGroups } from '../dal/api';

export default function GroupsWidget() {
  return (
    <div style={{ marginBottom: '20px', padding: '10px', background: '#e0e0e0', borderRadius: '5px' }}>
      <h2>Категорії</h2>
      <div style={{ display: 'flex', gap: '10px' }}>
        {mockGroups.map(g => (
          <div 
            key={g.id} 
            title={`Перехід до групи\n${g.name}\n${g.description}`}
            style={{ padding: '5px 10px', background: '#fff', border: '1px solid #ccc', cursor: 'pointer' }}
          >
            {g.name}
          </div>
        ))}
      </div>
    </div>
  );
}
