import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {getCurrentTime} from '/workspaces/Social-Foodies/app/TimeGet.js'
import MapComponent from './MapComponent';

//ios = View -> UIView
//android = View -> AndroidView
export default function App() {
  return (
    <div>
      <h1>My Google Map</h1>
      <MapComponent />
    </div>

   
  );
}

{/* <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text style={styles.countText}>Time: {getCurrentTime()}</Text>
      <StatusBar style="auto" />
    </View> */}

    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 30,
    margin: 20,
  },
});
