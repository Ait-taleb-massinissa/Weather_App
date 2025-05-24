import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const DropDown = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("temp_new");

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
          <MaterialCommunityIcons name="layers" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {isOpen && (
        <View style={styles.dropdownList}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedOption(option.value);
                onSelect(option);
                setIsOpen(false);
              }}
            >
              <MaterialCommunityIcons
                name={selectedOption === option.value ? "check" : ""}
                size={20}
                color="white"
              />
              <Text style={styles.itemText}>{option.name}</Text>
              <MaterialCommunityIcons
                name={option.icon}
                size={20}
                color="white"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.17)",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    right: 10,
  },

  headerText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownList: {
    position: "absolute",
    top: 50,
    right: 10,
    width: 220,
    marginTop: 5,
    backgroundColor: "rgb(26, 66, 83)",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(4, 40, 55, 0.48)",
    elevation: 3,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(4, 40, 55, 0.48)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
    color: "white",
  },
});

export default DropDown;
