import { StyleSheet, Text, View, KeyboardAvoidingView, SafeAreaView, TextInput, Pressable, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

const RegisterScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [image, setImage] = useState('')
    const [name, setName] = useState('')
    const navigation = useNavigation()

    const handleregister = ()=>{
        const user = {
            name:name,
            email:email,
            password:password,
            image:image
        };

        axios.post('http://10.0.2.2:8000/register',user).then(response=>{
            console.log(response);
            Alert.alert("Registration successfull","You have been register successfully")
            setName("");
            setEmail("");
            setPassword("");
            setImage("")

        }).catch(error=>{
            Alert.alert("Registration error","An error ocurred while registering!")
        })
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "White" }}>
            <View style={{ padding: 10, alignItems: "center" }}>
                <KeyboardAvoidingView>
                    <View style={{ marginTop: 80, alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 20, fontWeight: "500" }}>Set up your profile</Text>
                        <Text style={{ marginTop: 10, color: "gray", textAlign: "center", marginHorizontal: 12 }}>Profiles are visible to your connections and groups</Text>
                        <Pressable style={{ marginTop: 10 }}>
                            <Image
                                style={{ width: 70, height: 70, borderRadius: 50 }}
                                source={{ uri: image ? image : "https://t4.ftcdn.net/jpg/02/29/75/83/240_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg" }}
                            />
                            <Text style={{ textAlign: "center", marginTop: 4, color: "gray", fontSize: 12 }}>Add</Text>
                        </Pressable>
                        <View style={{ marginTop: 30 }}>
                            <View>
                                
                                <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>Name :</Text>
                                <View>
                                    <TextInput
                                        value={name}
                                        onChangeText={setName}
                                        placeholderTextColor="#BEBEBE"
                                        style={{
                                            width: 320,
                                            marginTop: 5,
                                            borderBottomColor: "#BEBEBE",
                                            borderBottomWidth: 1,
                                            paddingBottom: 10,
                                            fontFamily: "GeezaPro-Bold",
                                            fontSize: email ? 15 : 15
                                        }}
                                        placeholder='Enter your name'
                                    />
                                </View>

                                <Text style={{ fontSize: 18, fontWeight: "600", color: "gray", marginTop: 25 }}>Email :</Text>
                                <View>
                                    <TextInput
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholderTextColor="#BEBEBE"
                                        style={{
                                            width: 320,
                                            marginTop: 5,
                                            borderBottomColor: "#BEBEBE",
                                            borderBottomWidth: 1,
                                            paddingBottom: 10,
                                            fontFamily: "GeezaPro-Bold",
                                            fontSize: email ? 15 : 15
                                        }}
                                        placeholder='Enter your email'
                                    />
                                </View>

                                <Text style={{ fontSize: 18, fontWeight: "600", color: "gray", marginTop: 25 }}>Password :</Text>
                                <View>
                                    <TextInput
                                    secureTextEntry={true}
                                        value={password}
                                        onChangeText={setPassword}
                                        placeholderTextColor="#BEBEBE"
                                        style={{
                                            width: 320,
                                            marginTop: 5,
                                            borderBottomColor: "#BEBEBE",
                                            borderBottomWidth: 1,
                                            paddingBottom: 10,
                                            fontFamily: "GeezaPro-Bold",
                                            fontSize: email ? 15 : 15
                                        }}
                                        placeholder='Enter your password'
                                    />
                                </View>

                                <Text style={{ fontSize: 18, fontWeight: "600", color: "gray", marginTop: 25 }}>Image :</Text>
                                <View>
                                    <TextInput
                                        value={image}
                                        onChangeText={setImage}
                                        placeholderTextColor="#BEBEBE"
                                        style={{
                                            width: 320,
                                            marginTop: 5,
                                            borderBottomColor: "#BEBEBE",
                                            borderBottomWidth: 1,
                                            paddingBottom: 10,
                                            fontFamily: "GeezaPro-Bold",
                                            fontSize: email ? 15 : 15
                                        }}
                                        placeholder='Enter your image URL'
                                    />
                                </View>
                                
                            </View>
                        </View>
                        <Pressable
                        onPress={handleregister}
                        style={{
                            width: 200, backgroundColor: "#4A55A2", padding: 15, marginTop: 50, marginLeft: "auto", marginRight: "auto", borderRadius: 6

                        }}>
                            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold", textAlign: "center" }}>Register</Text>
                        </Pressable>

                        <Pressable onPress={() => navigation.navigate("Login")}>
                            <Text style={{ textAlign: "center", color: "gray", fontSize: 16, margin: 12 }}>Already have an account? Login</Text>
                        </Pressable>
                    </View>


                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({})