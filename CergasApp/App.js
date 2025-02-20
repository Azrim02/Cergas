import { StatusBar } from 'expo-status-bar';
import { 
  Dimensions,
  StyleSheet, 
  Text, 
  View, 
  TouchableHighlight, 
  Image, 
  SafeAreaView, 
  Button, 
  Alert} from 'react-native';
import WelcomeScreen from './app/screens/WelcomeScreen';
import ViewImageScreen from './app/screens/ViewImageScreen';

export default function App() {
  const handlePress = () => console.log('Text clicked');
  console.log(Dimensions.get('screen'));
  return (

    <WelcomeScreen/>
  );
}
