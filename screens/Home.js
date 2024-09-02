import React from 'react';
// prettier-ignore
import {Text, TextInput, View, StyleSheet, SectionList, Alert, Image, Pressable} from "react-native";
import { Searchbar } from 'react-native-paper';
import debounce from 'lodash.debounce';
// prettier-ignore
import { DataContext, AuthContext } from '../utils/context';
import LittleLemonHeader from './LittleLemonHeader';
import Filters from '../components/Filters';
import AntDesign from '@expo/vector-icons/AntDesign';
import { getSectionListData, useUpdateEffect } from '../utils/utils';
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync('menu');
// or any files within the Snack


const createTable = async () => {
  await db.execAsync(`
PRAGMA journal_mode = WAL;
create table if not exists menuitems (id integer primary key not null, name text, price text, description text, image text, category text);
`);
};

const saveMenuItems = async (menuItems) => {
  await db.runAsync(`
insert into menuitems (id, name, price, description, image, category) values ${menuItems
        .map(
          item =>
            `("${item.id}", "${item.name}", "${item.price}", "${item.description}", "${item.image}", "${item.category}")`
        )
        .join(", ")}`
    );
}

const getMenuItems = async () => {
  const allMenuItemsFromDb = await db.getAllAsync("select * from menuitems");
  return allMenuItemsFromDb;
};

const filterByQueryAndCategories = async (query, activeCategories) => {
  const filteredMenuItems = await db.getAllAsync(`
    select * from menuitems where name like ? and category in ('${activeCategories.join(
          "','"
        )}')`,
        [`%${query}%`]
    );
  return filteredMenuItems;
};

const BASE_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const sections = ['starters', 'mains', 'desserts', 'drinks'];
const Item = ({ name, price, description, image }) => (
  <View style={styles.item}>
    <View style={styles.itemBody}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.price}>${price}</Text>
    </View>
    <Image
      style={styles.itemImage}
      source={{
        uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/thumbnails/t_${image}?raw=true`,
      }}
    />
  </View>
);

export default function Home({ navigation, route }) {
  const loginState = React.useContext(DataContext);
  const [data, setData] = React.useState([]);
  const [searchBarText, setSearchBarText] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [searchPressed, setSearchPressed] = React.useState(false);

  const [filterSelections, setFilterSelections] = React.useState(
    sections.map(() => false)
  );

  const fetchData = async () => {
    try {
      const response = await fetch(BASE_URL);
      const json = await response.json();
      const menu = json.menu.map((item, index) => ({
        id: index + 1,
        name: item.name,
        price: item.price.toString(),
        description: item.description,
        image: item.image,
        category: item.category,
      }));
      return menu;
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  React.useEffect(() => {
    (async () => {
      let menuItems = [];
      try {
        await createTable();
        menuItems = await getMenuItems();
        if (!menuItems.length) {
          menuItems = await fetchData();
          saveMenuItems(menuItems);
        }
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, [filterSelections, query]);

  const lookup = React.useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = React.useMemo(() => debounce(lookup, 1000), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  return (
    <>
      <LittleLemonHeader routeName={route.name} data={loginState} />
      <View style={styles.heroContainer}>
        <View style={styles.heqderContainer}>
          <Text style={styles.headerText}>Little Lemon</Text>
        </View>
        <View style={styles.miniHeroContainer}>
          <View style={styles.miniHeroTextContainer}>
            <View>
              <Text style={styles.heroSubheaderText}>Chicago</Text>
            </View>
            <View>
              <Text style={styles.heroBodyText}>
                {'\n'}We are a family owned Mediterranean restaurant, focused on
                traditional recipes served with a modern twist.
              </Text>
            </View>
          </View>
          <Image
            style={styles.heroImage}
            source={require('../assets/HeroImage.png')}
            accessible={true}
            accessibilityLabel={'Image of food held by'}
          />
        </View>
        <View style={styles.searchContainer}>
          {searchPressed ? <View style={styles.searchBox}>
            <Pressable style={styles.searchButton} onPress = {() => setSearchPressed(!searchPressed)}><AntDesign name="search1" size={25} color="#333333" /></Pressable><TextInput
          style={styles.inputBox}
          placeholder="Search"
          placeholderTextColor="#333333"
          onChangeText={handleSearchChange}
        />
          </View> :
          <Pressable style={styles.searchButton} onPress = {() => setSearchPressed(!searchPressed)}>
            <AntDesign name="search1" size={25} color="#333333" />
          </Pressable>}
        </View>
      </View>
      <View style={styles.filterContainer}>
        <Text>Order for Delivery!</Text>
        <Filters
          selections={filterSelections}
          onChange={handleFiltersChange}
          sections={sections}
        />
      </View>
      <View style={styles.menuList}>
        <SectionList
          style={styles.sectionList}
          sections={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Item
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image}
            />
          )}
          renderSectionHeader={({ section: { name } }) => (
            <Text style={styles.itemHeader}>{name}</Text>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    alignItems: 'left',
    justifyContent: 'left',
    padding: 10,
    flex: 0.3,
    backgroundColor: '#495E57',
  },
  filterContainer: {
    alignItems: 'left',
    justifyContent: 'left',
    padding: 10,
    backgroundColor: '#EEEEEE',
  },
  menuList: {
    padding: 10,
    backgroundColor: '#EEEEEE',
    flex: 0.5,
  },
  heqderContainer: {
    alignItems: 'left',
    justifyContent: 'left',
  },
  miniHeroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  miniHeroTextContainer: {
    alignItems: 'left',
    justifyContent: 'left',
    width: '70%',
  },
  searchContainer: {
    alignItems: 'left',
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroImage: {
    width: 130,
    height: 130,
    borderRadius: 20,
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    width: 300,
    height: 50,
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
  },
  inputBox: {
    width: 250,
    height: 50,
  },
  headerText: {
    fontSize: 35,
    color: '#F4CE14',
  },
  heroSubheaderText: {
    fontSize: 25,
    color: '#EEEEEE',
  },
  heroBodyText: {
    fontSize: 15,
    color: '#EEEEEE',
  },
  sectionList: {
    paddingHorizontal: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingVertical: 10,
  },
  itemBody: {
    flex: 1,
  },
  itemHeader: {
    fontSize: 18,
    paddingVertical: 4,
    paddingLeft: 4,
    color: '#EEEEEE',
    backgroundColor: '#495E57',
  },
  name: {
    fontSize: 15,
    color: '#000000',
    paddingBottom: 5,
  },
  description: {
    color: '#495E57',
    paddingRight: 5,
    fontSize: 12,
  },
  price: {
    fontSize: 15,
    color: '#EE9972',
    paddingTop: 5,
  },
  itemImage: {
    width: 100,
    height: 100,
  },
});
