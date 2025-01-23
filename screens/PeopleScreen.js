import { StyleSheet, Text, View,SafeAreaView, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../AuthContext'
import User from '../components/User'

const PeopleScreen = () => {
  const [users,setUsers] = useState([])
  const {token,userId} = useContext(AuthContext)

  const fectchUsers = async()=>{
    try {
      const response = await fetch(`http://10.0.2.2:8000/users/${userId}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    fectchUsers()
  },[])
  console.log("users",users)
  return (
    <SafeAreaView>
      <View>
        <Text style={{textAlign:"center",fontSize:15,fontWeight:"500",marginTop:12}}>Peoples using ChatApp</Text>
      </View>
      <FlatList data={users} renderItem={({item})=>(
        <User item={item} key={item?._id}/>
      )}/>
    </SafeAreaView>
  )
}

export default PeopleScreen

const styles = StyleSheet.create({})