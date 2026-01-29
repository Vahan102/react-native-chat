import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";

import { sendRequest } from "../../api/global";
import { styles } from "../../styles/styles";
import { getToken } from "../../storage/storage";

type Token = string | null;

export default function Registration({ navigation }: any) {
  const [token, setToken] = useState<Token>(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await getToken();
        setToken(storedToken);
        if (storedToken  !== null) {
           navigation.navigate("Menu")
        }else return;
        console.log("token:", storedToken);
      } catch (error) {
        console.error("error:", error);
      }
    };

    void loadToken();
  }, []);

  const loadScene = () => {
    navigation.navigate("Login");
  };

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (!name || !email || !password) {
      Alert.alert("error");
      return;
    }

    const formData = {
      name: name,
      surname: surname,
      email: email,
      password: password,
    };

    setIsLoading(true);

    try {
      // console.log("Send data:", formData);

      const res = await sendRequest(
        "registration",
        "POST",
        "registration",
        "",
        formData
      );

      // console.log("Server response:", res);

      // Alert.alert("Good!.");

      navigation.navigate("Login");
    } catch (error) {
      // console.error("Registration error:", error);
      Alert.alert("Error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerBlock}>
          <Text style={styles.primaryHeader}>Create an account</Text>
          <Text style={styles.secondaryHeader}>
            We're so excited to see you again!
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter name"
              placeholderTextColor="#72767d"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Surname</Text>
            <TextInput
              style={styles.input}
              value={surname}
              onChangeText={setSurname}
              placeholder="Enter surname"
              placeholderTextColor="#72767d"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#72767d"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry={true}
              placeholderTextColor="#72767d"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.linkContainer} onPress={loadScene}>
          <Text style={styles.linkText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { opacity: isLoading ? 0.7 : 1 }]}
          onPress={handleNext}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Loading..." : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
