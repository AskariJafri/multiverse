// screens/NeighboursScreen.jsx
import { useNavigate } from 'react-router-dom';
import { Card } from '../UI/Card';

const neighbours = [
  { id: 'abc123', name: "Alice's House", owner: 'Alice', thumbnail: null },
  { id: 'def456', name: "Bob's Place", owner: 'Bob', thumbnail: null },
  { id: 'ghi789', name: "Carol's Home", owner: 'Carol', thumbnail: null },
];

export default function NeighboursScreen() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-cyan-400">Neighbours</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {neighbours.map(({ id, name, owner, thumbnail }) => (
          <Card 
            key={id} 
            className="cursor-pointer hover:shadow-cyan-500/40 transition-shadow"
            onClick={() => navigate(`/house/${id}`)}
          >
            <div className="aspect-video bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600 rounded-xl flex items-center justify-center text-white text-lg font-semibold">
              {thumbnail ? (
                <img src={thumbnail} alt={name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div>{name}</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm text-gray-400">Owner: {owner}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
