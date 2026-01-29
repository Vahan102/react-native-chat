import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getToken } from "../../storage/storage";
import { getRequest } from "../../api/get";
import { connectSocket, sendSocketMessage, disconnectSocket } from "../../api/websocket";

export default function ServerInterface({ serverName = "Chat", serverLink, navigation }: any) {


  let calling = ()=>{
     navigation.navigate("Call");
  }

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  
  const mySentMessagesIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    let isMounted = true; 

    const init = async () => {
      try {
        setLoading(true);
        const storedToken = await getToken();
        
        if (typeof storedToken === "string") {
       
          const response = await getRequest(
            "getServerMesseges",
            "GET",
            serverLink,
            "getServerMesseges",
            storedToken
          );

          if (isMounted && response && response["data"]) {
            setMessages(response["data"].reverse());
          }

          connectSocket(storedToken, (newMessage) => {
            console.log("New message in UI:", newMessage);
            
            if (mySentMessagesIds.current.has(newMessage.id)) {
                return; 
            }

            const formattedMsg = {
                id: newMessage.id || Date.now().toString() + Math.random(),
                text: newMessage.text,
                isMe: false, 
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            };

            setMessages((prevMessages) => {
                if (prevMessages.some(m => m.id === formattedMsg.id)) return prevMessages;
                return [formattedMsg, ...prevMessages];
            });
          });
        }
      } catch (error) {
        console.error("Error loading chat:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
      disconnectSocket();
    };
  }, [serverLink]); 

  const handleSendMessage = () => {
    if (text.trim().length === 0) return;

    const tempId = Date.now().toString();
    
    mySentMessagesIds.current.add(tempId);

    sendSocketMessage(text, serverLink);

    const myMessage = {
      id: tempId,
      text: text,
      isMe: true,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [myMessage, ...prev]);
    setText("");
  };

  const renderItem = ({ item }: any) => (
    <View style={[styles.msgRow, item.isMe ? styles.msgRowMe : styles.msgRowThem]}>
      <View style={[styles.bubble, item.isMe ? styles.bubbleMe : styles.bubbleThem]}>
        <Text style={styles.msgText}>{item.text}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{serverName}</Text>
        <TouchableOpacity>
          <Ionicons name="call" onPress={calling} size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0} 
      >
        <FlatList
          data={messages}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={renderItem}
          inverted={true} 
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="messege..."
            placeholderTextColor="#777"
            multiline
          />
          <TouchableOpacity onPress={handleSendMessage} style={styles.sendBtn}>
            <Ionicons name="send" size={24} color={text ? "#007AFF" : "#555"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#121212",
  },

  header: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
    backgroundColor: "#1E1E1E",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  keyboardView: {
    flex: 1,
    width: "100%",
  },

  list: {
    flex: 1,
    width: "100%",
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  msgRow: {
    width: "100%",
    marginBottom: 8,
    flexDirection: "row",
  },
  msgRowMe: {
    justifyContent: "flex-end",
  },
  msgRowThem: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
  },
  bubbleMe: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 2,
  },
  bubbleThem: {
    backgroundColor: "#262626",
    borderBottomLeftRadius: 2,
  },
  msgText: {
    color: "#fff",
    fontSize: 16,
  },
  timeText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },

  // 5. ВВОД - ШИРИНА 100%
  inputContainer: {
    width: "100%", // Ширина 100%
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1E1E1E",
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
  },
  input: {
    flex: 1,
    backgroundColor: "#262626",
    color: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendBtn: {
    marginLeft: 10,
    padding: 5,
  },
});
