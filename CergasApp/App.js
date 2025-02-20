import { StatusBar } from 'expo-status-bar';
import { Dimensions } from 'react-native';
import WelcomeScreen from './app/screens/WelcomeScreen';
import ViewImageScreen from './app/screens/ViewImageScreen';
import HomeScreen from './app/screens/HomeScreen';
import Playground from './app/screens/Playground';

export default function App() {
  const handlePress = () => console.log('Text clicked');
  console.log(Dimensions.get('screen'));
  return (
    <WelcomeScreen/>
  );
}
