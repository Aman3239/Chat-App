import { StyleSheet, Text, View, KeyboardAvoidingView, ScrollView, TextInput, Pressable, Image } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { useSocketContext } from '../SocketContext';

const ChatRoom = () => {
    const navigation = useNavigation();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const { token, userId, setToken, setUserId } = useContext(AuthContext)
    const { socket } = useSocketContext();
    const route = useRoute();
    useLayoutEffect(() => {
        return navigation.setOptions({
            headerTitle: "",
            headerLeft: () => (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons name="arrow-back" size={26} color="black" />
                    <Pressable>
                        <Image source={{ uri:route?.params?.image }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                    </Pressable>
                    <View>
                        <Text>{route?.params?.name}</Text>
                    </View>
                </View>
            )
        })
    }, []);

    const listMessages = () => {
        const { socket } = useSocketContext();
        useEffect(() => {
            socket?.on('newMessage', newMessage => {
                newMessage.shouldShake = true;
                setMessages([...messages, newMessage]);
            });

            return () => socket?.off('newMessage');
        }, [socket, messages, setMessages])
    }

    listMessages();

    const sendMessage = async (senderId, receiverId) => {
        try {
            await axios.post("http://10.0.2.2:8000/sendMessage", {
                senderId,
                receiverId,
                message
            });
            socket.emit('sendMessage', { senderId, receiverId, message });

            setMessage("");
            setTimeout(() => {
                fetchMessages();
            }, 100)
        } catch (error) {
            console.log("Error", error)
        }
    }
    const fetchMessages = async () => {
        try {
            const senderId = userId;
            const receiverId = route?.params?.receiverId;

            const response = await axios.get('http://10.0.2.2:8000/messages', {
                params: { senderId, receiverId }
            });

            setMessages(response.data)
        } catch (error) {
            console.log("Error", error)
        }
    }
    useEffect(() => {
        fetchMessages();
    }, [])
    console.log("Messages", messages);

    const formatTime = time => {
        const options = { hour: 'numeric', minute: 'numeric' };
        return new Date(time).toLocaleString('en-US', options);
    };
    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView>
                {messages?.map((item, index) => {
                    return (
                        < Pressable key={index + "isuhdiosj"} style={[
                            item?.senderId?._id == userId ? {
                                alignSelf: "flex-end",
                                backgroundColor: "#DCFBC6",
                                padding: 8,
                                maxWidth: "60%",
                                margin: 10,
                                borderRadius: 7
                            } : {
                                alignSelf: "flex-start",
                                backgroundColor: "white",
                                padding: 8,
                                margin: 10,
                                maxWidth: "60%",
                                borderRadius: 7
                            }
                        ]}>
                            <Text style={{ fontSize: 13, textAlign: "left" }}>{item?.message}</Text>
                            <Text style={{ textAlign: "right", fontSize: 9, color: "gray", marginTop: 4 }}>{formatTime(item?.timeStamp)}</Text>
                        </Pressable>
                    )
                })}
            </ScrollView>

            <View style={{ backgroundColor: "white", flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#dddddd", marginBottom: 20 }}>
                <Entypo name="emoji-happy" size={24} color="gray" />
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder='Type your message...'
                    style={{ flex: 1, height: 40, borderWidth: 1, borderColor: "#ddddd", borderRadius: 20, paddingHorizontal: 10, marginLeft: 10 }}
                />

                <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginHorizontal: 8 }}>

                    <Entypo name="camera" size={24} color="gray" />
                    <Feather name="mic" size={24} color="gray" />
                </View>

                <Pressable
                    onPress={() => sendMessage(userId, route?.params.receiverId)}
                    style={{ backgroundColor: "#0066b2", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 }}
                >
                    <Text style={{ textAlign: "center", color: "white" }}>Send</Text>
                </Pressable>
            </View>

        </KeyboardAvoidingView>
    )
}

export default ChatRoom

const styles = StyleSheet.create({})