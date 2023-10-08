import React, { useState, useEffect } from "react";
import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";

const App = () => {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [reminders, setReminders] = useState([]);

  const addReminder = () => {
    if (name && birthdate) {
      setReminders([...reminders, { name, birthdate }]);
      setName("");
      setBirthdate("");
    }
  };

  const renderReminderItem = ({ item }) => (
    <View style={styles.reminderItem}>
      <Text>{item.name}</Text>
      <Text>{item.birthdate}</Text>
    </View>
  );

  useEffect(() => {
    // Request permissions for notifications (iOS and Android)
    async function getPushNotificationPermissions() {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        if (status !== "granted") {
          alert("Please enable notifications for this app in settings.");
          return;
        }
      }
    }

    getPushNotificationPermissions();
  }, []);

  useEffect(() => {
    // Schedule birthday reminders as notifications
    reminders.forEach((reminder) => {
      const { name, birthdate } = reminder;
      const [month, day] = birthdate.split("/");
      const now = new Date();
      const notificationDate = new Date(
        now.getFullYear(),
        month - 1,
        day,
        9,
        0,
        0
      ); // Set the time to 9:00 AM

      if (notificationDate > now) {
        const schedulingOptions = {
          content: {
            title: "Birthday Reminder",
            body: `Today is ${name}'s birthday!`,
          },
          trigger: {
            date: notificationDate,
            repeats: true, // Repeat annually
          },
        };
        Notifications.scheduleNotificationAsync(schedulingOptions);
      }
    });
  }, [reminders]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Birthday Reminder</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Birthdate (MM/DD)"
          value={birthdate}
          onChangeText={(text) => setBirthdate(text)}
        />
        <Button title="Add Reminder" onPress={addReminder} />
      </View>
      <FlatList
        data={reminders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderReminderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  reminderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
});

AppRegistry.registerComponent(appName, () => App);
export default App;
