import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { FirebaseAuth } from '../Auth/FirebaseConfig'
const Home = () => {
  const Logout = () => {
    // Logout logic here
    FirebaseAuth.signOut().then(() => {
      console.log('User signed out!')
    }).catch((error) => {
      console.log(error)
    })
  }
  return (
    <View style={styles.container}>
      <Pressable style={styles.btn} onPress={Logout}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  )
}

export default Home
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  btn: {
    backgroundColor: 'lightblue',
    padding: 15,
    borderRadius: 10,
  },
})