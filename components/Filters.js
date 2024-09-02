import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const Filters = ({ onChange, selections, sections }) => {
  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            onChange(index);
          }}
          style={{
            flex: 1 / sections.length,
            justifyContent: "center",
            alignItems: "center",
            padding: 8,
            backgroundColor: selections[index] ? "#495e57" : "#333333",
            borderRadius: 20,
            marginRight: 15,
          }}
        >
          <View>
            <Text
              style={{
                color: selections[index] ? "#edefee" : "#eeeeee",
                fontSize: 12,
              }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: "#EEEEEE",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingLeft: 15,
    paddingTop: 15,
  },
});

export default Filters;