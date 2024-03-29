import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { SignIn, loadingAuth } = useContext(AuthContext);

  async function handleLogin() {
    if (email === "" || password === "") {
      return;
    }

    await SignIn({ email, password });
  }

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../../assets/logo.png")} />

      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Digite seu email..."
          style={styles.input}
          placeholderTextColor="#ddd"
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Digite sua senha..."
          style={styles.input}
          placeholderTextColor="#ddd"
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loadingAuth ? (
            <ActivityIndicator size={25} color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Acessar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1d1d2e",
  },
  logo: {
    marginBottom: 18,
    width: 120,
    height: 120,
  },
  inputContainer: {
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 32,
  },
  input: {
    width: "95%",
    height: 40,
    backgroundColor: "#101026",
    marginBottom: 12,
    borderRadius: 4,
    paddingHorizontal: 8,
    color: "#fff",
  },
  button: {
    width: "95%",
    height: 40,
    backgroundColor: "#3fffa3",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#101026",
  },
});
