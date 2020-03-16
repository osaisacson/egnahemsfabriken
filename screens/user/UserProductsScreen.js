import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { FlatList } from 'react-native';
import SaferArea from '../../components/UI/SaferArea';
import HeaderTwo from '../../components/UI/HeaderTwo';
import EmptyState from '../../components/UI/EmptyState';
import Error from '../../components/UI/Error';
import Loader from '../../components/UI/Loader';
import ProductItem from '../../components/UI/ProductItem';
import SearchBar from '../../components/UI/SearchBar';
import { MaterialIcons } from '@expo/vector-icons';

//Actions
import * as productsActions from '../../store/actions/products';
//Constants
import Colors from '../../constants/Colors';

const UserProductsScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  //Get user products with the status 'redo' or 'bearbetas'
  const userProducts = useSelector(state => state.products.userProducts);
  //Prepare for changing the rendered products on search
  const [renderedProducts, setRenderedProducts] = useState(userProducts);
  const [searchQuery, setSearchQuery] = useState('');

  const productsSorted = renderedProducts.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      console.log('UserProductsScreen: fetching Products');
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('focus', loadProducts);
  //   return () => {
  //     unsubscribe();
  //   };
  // }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  const searchHandler = text => {
    const newData = renderedProducts.filter(item => {
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setRenderedProducts(text.length ? newData : userProducts);
    setSearchQuery(text.length ? text : '');
  };

  const selectItemHandler = (id, ownerId, title, detailPath) => {
    props.navigation.navigate(detailPath, {
      detailId: id,
      ownerId: ownerId,
      detailTitle: title
    });
  };

  if (error) {
    return <Error actionOnPress={loadProducts} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && userProducts.length === 0) {
    return <EmptyState text="Inga produkter ännu, prova lägga till några." />;
  }

  return (
    <SaferArea>
      <SearchBar
        actionOnChangeText={text => searchHandler(text)}
        searchQuery={searchQuery}
        placeholder="Leta bland ditt återbruk"
      />
      <HeaderTwo
        title={'Ditt upplagda återbruk'}
        subTitle={
          'Allt som är redo att hämtas, håller på att bearbetas, eller har blivit hämtat.'
        }
        questionText={'Här ska det vara en förklaring'}
        icon={
          <MaterialIcons
            name="file-upload"
            size={20}
            style={{ marginRight: 5 }}
          />
        }
        indicator={productsSorted.length ? productsSorted.length : 0}
      />
      <FlatList
        horizontal={false}
        numColumns={3}
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={productsSorted}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <ProductItem
            itemData={itemData.item}
            onSelect={() => {
              selectItemHandler(
                itemData.item.id,
                itemData.item.ownerId,
                itemData.item.title,
                'ProductDetail'
              );
            }}
          ></ProductItem>
        )}
      />
    </SaferArea>
  );
};

export default UserProductsScreen;
