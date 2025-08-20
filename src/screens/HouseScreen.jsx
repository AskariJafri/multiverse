// screens/HouseScreen.jsx
import { useParams } from 'react-router-dom';
import HomeScreen from './HomeScreen';

const myHouseId = 'my-house-0001'; // Your pseudo current user house ID

export default function HouseScreen() {
  const { houseId } = useParams();

  if (!houseId || houseId === myHouseId) {
    return <HomeScreen isMyHouse={true} />;
  }

  return <HomeScreen isMyHouse={false} neighbourHouseId={houseId} />;
}
