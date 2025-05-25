import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Composant DropDown pour afficher un menu déroulant avec des options sélectionnables
const DropDown = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false); // État pour suivre si le menu déroulant est ouvert
  const [selectedOption, setSelectedOption] = useState("temp_new"); // État pour suivre l'option sélectionnée

  return (
    <View>
      {/* Bouton pour ouvrir/fermer le menu déroulant */}
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
          <MaterialCommunityIcons name="layers" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Liste déroulante */}
      {isOpen && (
        <View style={styles.dropdownList}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedOption(option.value); // Met à jour l'option sélectionnée
                onSelect(option); // Déclenche le callback onSelect
                setIsOpen(false); // Ferme le menu déroulant
              }}
            >
              {/* Icône de validation pour l'option sélectionnée */}
              <MaterialCommunityIcons
                name={selectedOption === option.value ? "check" : ""}
                size={20}
                color="white"
              />
              {/* Nom de l'option */}
              <Text style={styles.itemText}>{option.name}</Text>
              {/* Icône associée à l'option */}
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

// Styles pour le composant DropDown
const styles = StyleSheet.create({
  container: {
    // Style pour le bouton du menu déroulant
    backgroundColor: "rgba(255, 255, 255, 0.17)",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    right: 10,
  },
  headerText: {
    // Style pour le texte d'en-tête (non utilisé dans ce composant)
    fontSize: 16,
    color: "#333",
  },
  dropdownList: {
    // Style pour le conteneur de la liste déroulante
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
    // Style pour chaque élément de la liste déroulante
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(4, 40, 55, 0.48)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    // Style pour le texte de chaque élément
    marginLeft: 10,
    fontSize: 16,
    color: "white",
  },
});

export default DropDown;
