import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert
} from "react-native";

import { sendRequest } from "../../api/global"; 
import { getToken } from "../../storage/storage";

const ServerActionButtons = ({ onCreate, onAdd }: any) => {
  
  const [activeTab, setActiveTab] = useState("home"); // "home" | "create" | "get"
  const [serverName, setServerName] = useState("");
  const [serverLink, setServerLink] = useState("");

  const handleCreateConfirm = async () => {
    if (serverName.trim().length === 0) {
      Alert.alert("Error", "Please enter a name.");
      return;
    }
   
    try {
      const storedToken = await getToken();
      if (!storedToken) {
        Alert.alert("Error", "Authentication token not found.");
        return;
      }
  
      const response: any = await sendRequest("createGroup", "POST", "createGroup", storedToken, {
        name: serverName,
        img: ""
      });
      
      console.log("Server created successfully!", response);

      const newServer = {
        id: response?.id || Date.now().toString(), 
        name: serverName,
        img: "" 
      };

      if (onCreate) onCreate(newServer);

      setServerName("");
      setActiveTab("home");

    } catch (error) {
      console.error("Creation error:", error);
      Alert.alert("Error", "Failed to create server.");
    }
  };

  const handleJoinConfirm = async () => {
    if (serverLink.trim().length === 0) {
      Alert.alert("Error", "Please enter a server link or ID.");
      return;
    }

    try {
      const storedToken = await getToken();
      if (!storedToken) {
        Alert.alert("Error", "Authentication token not found.");
        return;
      }

      // ПРЕДПОЛОЖЕНИЕ: Здесь нужно вызвать API для входа в группу.
      // Замените "joinGroup" на ваш реальный эндпоинт API.
      // Обычно передается { link: serverLink } или { id: serverLink }
      const response: any = await sendRequest("joinGroup", "POST", "joinGroup", storedToken, {
        link: serverLink 
      });

      console.log("Joined server successfully!", response);

      // Формируем объект сервера из ответа
      const joinedServer = {
        id: response?.id || Date.now().toString(),
        name: response?.name || "New Server",
        img: response?.img || ""
      };

      // Вызываем колбэк родителя
      if (onAdd) onAdd(joinedServer);

      setServerLink("");
      setActiveTab("home");

    } catch (error) {
      console.error("Join error:", error);
      Alert.alert("Error", "Failed to join server. Check the link.");
    }
  };

  const renderHome = () => (
    <>
      <Text style={styles.title}>Server Menu</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setActiveTab("create")}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Create Server</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.addButton]}
        onPress={() => setActiveTab("get")}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Get Server</Text>
      </TouchableOpacity>
    </>
  );

  const renderCreate = () => (
    <>
      <Text style={styles.title}>Create New Server</Text>
      <Text style={styles.label}>Server Name:</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter name"
        placeholderTextColor="#999"
        value={serverName}
        onChangeText={setServerName}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateConfirm}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => {
          setServerName("");
          setActiveTab("home");
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </>
  );

  // Новая структура для вкладки "get"
  const renderGet = () => (
    <>
      <Text style={styles.title}>Join Server</Text>
      <Text style={styles.label}>Server Link / ID:</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter link or ID"
        placeholderTextColor="#999"
        value={serverLink}
        onChangeText={setServerLink}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, styles.addButton]} // Используем стиль addButton (зеленый/синий)
        onPress={handleJoinConfirm}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Join</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => {
          setServerLink("");
          setActiveTab("home");
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container}>
      {activeTab === "home" && renderHome()}
      {activeTab === "create" && renderCreate()}
      {activeTab === "get" && renderGet()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff", 
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginBottom: 5,
    fontWeight: "600",
    color: "#ccc",
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginBottom: 10,
    elevation: 3,
  },
  addButton: {
    backgroundColor: "#2196F3",
  },
  cancelButton: {
    backgroundColor: "#9E9E9E",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

export default ServerActionButtons;