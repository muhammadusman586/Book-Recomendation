import { Link } from "expo-router";
import { Text, View } from "react-native";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export default function Index() {

  const {token , user,checkAuth}=useAuthStore();

  console.log(user);
  useEffect(()=>{
    checkAuth();
  },[]);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{color:"red"}}>Hello {user?.username}</Text>
      <Link href="/(auth)/signup">Token: {token} </Link>
      <Link href="/(auth)">Login </Link>
    </View>
  );
}
