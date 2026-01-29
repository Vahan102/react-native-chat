import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { styles } from "../../styles/styles";
import { sendRequest } from "../../api/global";
import { saveToken } from "../../storage/storage";

export default function Login({ navigation }: any) {
  const loadScene = () => {
    navigation.navigate("Registration");
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNext = async () => {
    if (!email || !password) {
      Alert.alert("error");
      return;
    }

    const formData = {
      email: email,
      password: password,
    };

    try {
      const res = await sendRequest("login", "POST", "login", "", formData);

      console.log("Server response:", res);

      await saveToken(res.token)

      // Alert.alert("Good!.");

      navigation.navigate("Menu");
    } catch (error) {
      // console.error("Registration error:", error);
      Alert.alert("Error.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerBlock}>
          <Text style={styles.primaryHeader}>log in to an account</Text>
          <Text style={styles.secondaryHeader}>
            We're so excited to see you again!
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              keyboardType="email-address" //
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
          <Text style={styles.linkText}>Registration</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
