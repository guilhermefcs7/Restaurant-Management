import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Category } from "../../pages/Order";

interface ModalPickerProps {
  handleCloseModal: () => void;
  options: Category[];
  selectedItem: (item: Category) => void;
}

const { width: USER_WIDTH, height: USER_HEIGHT } = Dimensions.get("window");

export function ModalPicker({
  handleCloseModal,
  options,
  selectedItem,
}: ModalPickerProps) {
  function onPressItem(item: Category) {
    selectedItem(item);

    handleCloseModal();
  }

  const option = options.map((item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.option}
      onPress={() => onPressItem(item)}>
      <Text style={styles.item}>{item?.name} </Text>
    </TouchableOpacity>
  ));

  return (
    <TouchableOpacity onPress={handleCloseModal} style={styles.container}>
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>{option}</ScrollView>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: USER_WIDTH - 20,
    height: USER_HEIGHT / 2,
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: "#8a8a8a",
    borderRadius: 4,
  },
  option: {
    alignItems: "flex-start",
    borderTopWidth: 0.8,
    borderTopColor: "#8a8a8a",
  },
  item: {
    margin: 18,
    fontSize: 15,
    fontWeight: "bold",
    color: "#101026",
  },
});
