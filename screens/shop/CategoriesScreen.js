import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { FlatList, Platform } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import CategoryGridTile from '../../components/UI/CategoryGridTile';
import EmptyState from '../../components/UI/EmptyState';
import Error from '../../components/UI/Error';
import Loader from '../../components/UI/Loader';
//Actions
import * as categoryActions from '../../store/actions/categories';

const CategoriesScreen = props => {
  //check if we are loading
  const [isLoading, setIsLoading] = useState(false);
  //check if we get any errors
  const [error, setError] = useState();
  //Get a slice of the state, in particular the categories
  const categories = useSelector(state => state.categories.categories);

  const dispatch = useDispatch(); //make onDispatch available for the buttons

  //Runs whenever the component is loaded, and fetches the latest categories
  const loadCategories = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(categoryActions.fetchCategories());
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    loadCategories();
  }, [dispatch, loadCategories]);

  //Om något gick fel, visa ett error message
  if (error) {
    return <Error actionOnPress={loadCategories} />;
  }

  //Om vi inte har något i den valda kategorin: visa ett empty state
  if (categories.length === 0 || !categories) {
    return <EmptyState>Inga kategorier ännu</EmptyState>;
  }

  //Vissa en spinner när vi laddar våra kategorier
  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && categories.length === 0) {
    return <EmptyState>Det finns inga kategorier ännu.</EmptyState>;
  }

  const renderGridItem = itemData => {
    return (
      <CategoryGridTile
        title={itemData.item.categoryName}
        color={itemData.item.color}
        onSelect={() => {
          props.navigation.navigate({
            routeName: 'ProductsOverview',
            params: {
              categoryName: itemData.item.categoryName //name of category, to be used when filtering the items in the next screen
            }
          });
        }}
      />
    );
  };

  return (
    <FlatList
      keyExtractor={(item, index) => item.id}
      data={categories}
      renderItem={renderGridItem}
      numColumns={2}
    />
  );
};

//Overrides the default title being set in the ShopNavigator defaultNavigationOptions
CategoriesScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Kategorier',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer(); //Navigate nowhere, just open the sidedrawer
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          onPress={() => {
            navData.navigation.navigate('Cart'); //Go to cart on clicking the cart button
          }}
        />
      </HeaderButtons>
    )
  };
};

export default CategoriesScreen;