import React, { useState, useEffect } from "react";
import { AppRegistry, SafeAreaView, View, Text, TextInput, Button, FlatList, StyleSheet, Modal } from "react-native";
import { name as appName } from "./app.json";
import { Notifications } from "expo";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Import the date picker

const App = () => {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [reminders, setReminders] = useState([]);
  const [isTodayBirthday, setIsTodayBirthday] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false); // State for showing/hiding the date picker

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateConfirm = (date) => {
    hideDatePicker();
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
    setBirthdate(formattedDate);
  };

  const addReminder = () => {
    if (name) {
      setReminders([...reminders, { name, birthdate }]);
      setName("");
      setBirthdate("");
    } else {
      alert("Please enter a name.");
    }
  };

  const renderReminderItem = ({ item }) => (
    <View style={styles.reminderItem}>
      <Text>{item.name}</Text>
      <Text>{item.birthdate}</Text>
    </View>
  );

  useEffect(() => {
    // Check if today is the user's birthday
    if (reminders.length > 0) {
      const today = new Date();
      const todayFormatted = `${today.getMonth() + 1}/${today.getDate()}`;
      setIsTodayBirthday(reminders.some((reminder) => reminder.birthdate === todayFormatted));
    }
  }, [reminders]);

  useEffect(() => {
    // Display a modal if today is the user's birthday
    if (isTodayBirthday) {
      setModalVisible(true);
    }
  }, [isTodayBirthday]);

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
          onFocus={showDatePicker} // Show the date picker when the input is focused
        />
        <Button title="Add Reminder" onPress={addReminder} />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
        />
      </View>
      <FlatList
        data={reminders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderReminderItem}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Today is your birthday!</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
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
    marginTop: 48,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    width: "80%",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
});

AppRegistry.registerComponent(appName, () => App);
export default App;
