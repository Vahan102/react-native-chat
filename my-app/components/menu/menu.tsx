import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
  StyleSheet,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

import ServerActionButtons from "../buttons/addServer";
import ServerInterface from "../server/ServerInterface";
import { getRequest } from "../../api/get";
import { getToken } from "../../storage/storage";

const DiscordLogo = () => (
  <Svg width="30" height="30" viewBox="0 0 50 50" fill="none">
    <Path
      d="M42.5 0H7.5C3.35786 0 0 3.35786 0 7.5V42.5C0 46.6421 3.35786 50 7.5 50H42.5C46.6421 50 50 46.6421 50 42.5V7.5C50 3.35786 46.6421 0 42.5 0Z"
      fill="#7289DA"
    />
    <Path
      d="M33.7891 38.2812L31.7383 35.8398C35.7422 34.7656 37.3047 32.0312 37.3047 32.0312C32.2266 36.8164 18.3594 37.0117 12.9883 32.0312C12.9883 32.0312 14.3555 34.5703 18.457 35.8398L16.2109 38.2812C9.375 38.1836 6.73828 33.5938 6.73828 33.5938C6.73828 23.4375 11.2305 15.332 11.2305 15.332C15.8203 12.1094 20.0195 12.1094 20.0195 12.1094L20.3125 12.5C14.6484 14.0625 12.207 16.6016 12.207 16.6016C18.8477 12.1094 32.5195 12.5 37.8906 16.6016C37.9883 16.5039 34.668 13.8672 29.4922 12.5L29.9805 12.1094C29.9805 12.1094 34.1797 12.1094 38.7695 15.332C38.7695 15.332 43.2617 23.4375 43.2617 33.5938C43.2617 33.5938 40.625 38.1836 33.7891 38.2812Z"
      fill="white"
    />
  </Svg>
);
const PlusIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path
      d="M22.5 13.5H13.5V22.5C13.5 22.8978 13.342 23.2794 13.0607 23.5607C12.7794 23.842 12.3978 24 12 24C11.6022 24 11.2206 23.842 10.9393 23.5607C10.658 23.2794 10.5 22.8978 10.5 22.5V13.5H1.5C1.10218 13.5 0.720645 13.342 0.43934 13.0607C0.158036 12.7794 0 12.3978 0 12C0 11.6022 0.158036 11.2206 0.43934 10.9393C0.720645 10.658 1.10218 10.5 1.5 10.5H10.5V1.5C10.5 1.10217 10.658 0.720644 10.9393 0.439339C11.2206 0.158033 11.6022 0 12 0C12.3978 0 12.7794 0.158033 13.0607 0.439339C13.342 0.720644 13.5 1.10217 13.5 1.5V10.5H22.5C22.8978 10.5 23.2794 10.658 23.5607 10.9393C23.842 11.2206 24 11.6022 24 12C24 12.3978 23.842 12.7794 23.5607 13.0607C23.2794 13.342 22.8978 13.5 22.5 13.5Z"
      fill="#00AA50"
    />
  </Svg>
);
const CompassIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="12" fill="#23A559" />
    <Path
      d="M9.39799 9.27675L17.5623 5.44971C18.1323 5.18253 18.7267 5.7695 18.4666 6.34278L14.7247 14.5921C14.656 14.7436 14.5339 14.8645 14.3817 14.9317L6.30244 18.5036C5.73248 18.7556 5.1534 18.1691 5.41264 17.6024L9.06954 9.60827C9.13629 9.46234 9.25269 9.34486 9.39799 9.27675Z"
      fill="#1E1F22"
    />
    <Circle
      cx="2.3706"
      cy="2.3706"
      r="2.3706"
      transform="matrix(0.707107 0.707107 0.707107 -0.707107 8.77295 12.1597)"
      fill="#23A559"
    />
  </Svg>
);

export default function Main({navigation}:any) {
  const [activeTab, setActiveTab] = useState<any>("home");

  const [servers, setServers] = useState<any[]>([]);

  const handleServerCreated = (newServer: any) => {
    setServers([...servers, newServer]);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedToken = await getToken();

        if (typeof storedToken === "string") {
          const servers = await getRequest(
            "getUserServers",
            "GET",
            "",
            "getUserServers",
            storedToken
          );
          console.log(servers)

          setServers(servers["data"]);
        }
      } catch (error) {
        console.error("error:", error);
      }
    };

    void loadData();
  }, []);

  const addButtonFunction = () => {
    setActiveTab("create");
  };

  const goHome = () => {
    setActiveTab("home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1f22" />

      <View style={styles.sidebar}>
        <ScrollView contentContainerStyle={styles.sidebarList}>
          <View style={styles.sidebarItemContainer}>
            <View
              style={[styles.pill, activeTab === "home" && styles.pillActive]}
            />
            <TouchableOpacity
              onPress={goHome}
              style={[styles.sidebarButton, styles.discordButton]}
            >
              <DiscordLogo />
            </TouchableOpacity>
          </View>

          <View style={styles.separator} />

          {servers.map((server: any) => (
            <View key={server.id} style={styles.sidebarItemContainer}>
              <View
                style={[
                  styles.pill,
                  activeTab === server.id && styles.pillActive,
                ]}
              />

              <TouchableOpacity
                onPress={() => setActiveTab(server.id)}
                style={[styles.sidebarButton, styles.serverIconContainer]}
              >
                {server.img ? (
                  <Image
                    source={{ uri: server.img }}
                    style={styles.serverIconImage}
                  />
                ) : (
                  <Text style={styles.serverIconText}>
                    {server.name ? server.name.charAt(0).toUpperCase() : "?"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.sidebarItemContainer}>
            <View
              style={[styles.pill, activeTab === "create" && styles.pillActive]}
            />
            <TouchableOpacity
              onPress={addButtonFunction}
              style={[
                styles.sidebarButton,
                activeTab === "create" && { backgroundColor: "#23A559" },
                activeTab !== "create" && { backgroundColor: "#313338" },
              ]}
            >
              <PlusIcon />
            </TouchableOpacity>
          </View>

          {/* <View style={styles.sidebarItemContainer}>
            <TouchableOpacity style={styles.sidebarButton}>
              <CompassIcon />
            </TouchableOpacity>
          </View> */}
        </ScrollView>
      </View>

      <View style={styles.menu}>
        {activeTab === "home" ? (
          <View style={styles.mini}>
            <Image
              source={{ uri: "https://i.redd.it/4zgagzeyej7f1.png" }}
              style={styles.pfp}
              resizeMode="cover"
            />
            <Text style={styles.nothing}>
              There is nothing here at the moment.
            </Text>
          </View>
        ) : activeTab === "create" ? (
          <ServerActionButtons
            onCreate={handleServerCreated}
            onAdd={() => console.log("Click get button")}
          />
        ) : (
          (() => {
            const currentServer = servers.find((s: any) => s.id === activeTab);
            return (
              <ServerInterface
                serverLink={currentServer?.link}
                serverId={activeTab}
                serverName={currentServer?.name}
                navigation={navigation}
              />
            );
          })()
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#2c2d2f",
  },
  serverIconContainer: {
    backgroundColor: "#313338",
    overflow: "hidden",
  },
  serverIconText: {
    color: "#dbdee1",
    fontSize: 16,
    fontWeight: "500",
  },
  serverIconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  sidebar: {
    width: 80,
    backgroundColor: "#1e1f22",
    height: "100%",
    alignItems: "center",
    paddingTop: 12,
  },
  sidebarList: {
    alignItems: "center",
    gap: 15,
  },
  sidebarItemContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 60,
  },
  sidebarButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#313338",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  discordButton: {
    backgroundColor: "#313338",
  },
  separator: {
    height: 2,
    width: 32,
    backgroundColor: "#35363C",
    marginVertical: 8,
    borderRadius: 1,
  },
  pill: {
    position: "absolute",
    left: 0,
    width: 4,
    height: 8,
    backgroundColor: "white",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    opacity: 0,
  },
  pillActive: {
    height: 40,
    opacity: 1,
  },

  menu: {
    flex: 1,
    backgroundColor: "#2c2d2f",
    justifyContent: "center",
    alignItems: "center",
  },
  mini: {
    width: 270,
    alignItems: "center",
  },
  pfp: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#313338",
  },
  nothing: {
    fontFamily: "System",
    fontSize: 18,
    color: "#6dc08f",
    textAlign: "center",
    fontWeight: "600",
  },
});
