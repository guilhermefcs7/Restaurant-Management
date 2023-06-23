import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Feather } from "@expo/vector-icons";
import { api } from "../../service/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";
import { ModalPicker } from "../../components/ModalPicker";
import { ListItem } from "../../components/ListItem";

type RouteDetailParams = {
  Order: {
    number: number | string;
    order_id: string;
  };
};

export type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
};

export type ListItem = {
  id: string;
  product_id: string;
  name: string;
  amount: string | number;
};

type OrderRouteProps = RouteProp<RouteDetailParams, "Order">;

export default function Order() {
  const route = useRoute<OrderRouteProps>();

  const [category, setCategory] = useState<Category[] | []>([]);

  const [selectedCategory, setSelectedCategory] = useState<
    Category | undefined
  >();

  const [categoryModalIsOpen, setCategoryModalIsOpen] = useState(false);

  const [products, setProducts] = useState<Product[] | []>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const [productModalIsOpen, setProductModalIsOpen] = useState(false);

  const [amount, setAmount] = useState("1");

  const [listitems, setListItems] = useState<ListItem[]>([]);

  const navigation =
    useNavigation<NativeStackNavigationProp<StackParamsList>>();

  useEffect(() => {
    async function getCategories() {
      const response = await api.get("/category");

      setCategory(response.data);
      setSelectedCategory(response.data[0]);
    }

    getCategories();
  }, []);

  useEffect(() => {
    async function getProducts() {
      const category_id = selectedCategory?.id;

      const response = await api.get("/category/product", {
        params: {
          category_id,
        },
      });

      setProducts(response.data);
      setSelectedProduct(response.data[0]);
    }

    getProducts();
  }, [selectedCategory]);

  async function handleCloseOrder() {
    const order_id = route.params?.order_id;

    try {
      await api.delete("/order", {
        params: {
          order_id,
        },
      });

      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  function handleChangeCategory(item: Category) {
    setSelectedCategory(item);
  }

  function handleChangeProduct(item: Product) {
    setSelectedProduct(item);
  }

  async function handleAddItem() {
    const ConvertedAmount = Number(amount);

    const payload = {
      order_id: route.params?.order_id,
      product_id: selectedProduct?.id,
      amount: ConvertedAmount,
    };

    try {
      const response = await api.post("/order/add", payload);
      console.log(response);

      let data = {
        id: response.data.id,
        product_id: selectedProduct?.id as string,
        name: selectedProduct?.name as string,
        amount: amount,
      };

      setListItems((prevState) => [...prevState, data]);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteItem(item_id: string) {
    await api.delete("/order/remove", {
      params: {
        item_id,
      },
    });

    let newListOfItems = listitems.filter((item) => item.id !== item_id);

    setListItems(newListOfItems);
  }

  function handleFinishOrder() {
    navigation.navigate("FinishOrder", {
      number: route.params.number,
      order_id: route.params.order_id,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mesa {route.params.number} </Text>

        {listitems.length === 0 && (
          <TouchableOpacity>
            <Feather
              name="trash-2"
              size={28}
              color="#ff3f4b"
              onPress={handleCloseOrder}
            />
          </TouchableOpacity>
        )}
      </View>

      {category.length !== 0 && (
        <TouchableOpacity
          style={styles.input}
          onPress={() => setCategoryModalIsOpen(true)}>
          <Text style={{ color: "#fff" }}>{selectedCategory?.name}</Text>
        </TouchableOpacity>
      )}

      {products.length !== 0 && (
        <TouchableOpacity
          style={styles.input}
          onPress={() => setProductModalIsOpen(true)}>
          <Text style={{ color: "#fff" }}>{selectedProduct?.name} </Text>
        </TouchableOpacity>
      )}

      <View style={styles.qtdContainer}>
        <Text style={styles.qtdText}>Quantidade</Text>

        <TextInput
          style={[styles.input, { width: "60%", textAlign: "center" }]}
          placeholder="1"
          placeholderTextColor="#f0f0f0"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.buttonAdd} onPress={handleAddItem}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { opacity: listitems.length === 0 ? 0.2 : 1 }]}
          disabled={listitems.length === 0}
          onPress={handleFinishOrder}>
          <Text style={styles.buttonText}>Avançar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginTop: 24 }}
        data={listitems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem data={item} deleteItem={handleDeleteItem} />
        )}
      />

      <Modal
        transparent={true}
        visible={categoryModalIsOpen}
        animationType="fade">
        <ModalPicker
          handleCloseModal={() => setCategoryModalIsOpen(false)}
          options={category}
          selectedItem={handleChangeCategory}
        />
      </Modal>

      <Modal
        transparent={true}
        visible={productModalIsOpen}
        animationType="fade">
        <ModalPicker
          handleCloseModal={() => setProductModalIsOpen(false)}
          options={products}
          selectedItem={handleChangeProduct}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: "5%",
    paddingEnd: "4%",
    paddingStart: "4%",
    backgroundColor: "#1d1d2e",
  },
  header: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
    marginTop: 24,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 14,
  },
  input: {
    backgroundColor: "#101026",
    borderRadius: 4,
    width: "100%",
    height: 40,
    marginBottom: 12,
    justifyContent: "center",
    paddingHorizontal: 8,
    color: "#fff",
    fontSize: 20,
  },
  qtdContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  qtdText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  buttonAdd: {
    backgroundColor: "#3fd1ff",
    borderRadius: 4,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    width: "20%",
  },
  buttonText: {
    color: "#101026",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#3fffa3",
    borderRadius: 4,
    height: 40,
    width: "75%",
    justifyContent: "center",
    alignItems: "center",
  },
});
