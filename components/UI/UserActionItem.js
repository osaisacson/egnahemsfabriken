import { Entypo } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import CachedImage from './CachedImage';
import ProductStatusCopy from './ProductStatusCopy';
import TouchableCmp from './TouchableCmp';

const UserActionItem = (props) => {
  const selectItemHandler = (id, ownerId, title) => {
    props.navigation.navigate(props.detailPath, {
      detailId: id,
      ownerId,
      detailTitle: title,
    });
  };

  return (
    <TouchableCmp
      onPress={() => {
        selectItemHandler(props.item.id, props.item.ownerId, props.item.title);
      }}
      useForeground>
      <View style={{ ...styles.itemContainer, ...props.style }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.touchable}>
            <View style={styles.imageContainer}>
              <CachedImage style={styles.image} uri={props.item.image} />
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{props.item.title}</Text>
            <ProductStatusCopy essentialStatusOnly selectedProduct={props.item} />
          </View>
        </View>
        <Entypo name="chevron-thin-right" size={20} color="#c9c9c9" />
      </View>
    </TouchableCmp>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    marginLeft: 10,
  },
  title: {
    fontFamily: 'roboto-regular',
    fontSize: 16,
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  touchable: {
    height: 70,
    width: 70,
    borderRadius: 100 / 2,
    overflow: 'hidden',
    borderWidth: 0.1,
    borderColor: '#000',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: 100 / 2,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100 / 2,
  },
});

export default UserActionItem;