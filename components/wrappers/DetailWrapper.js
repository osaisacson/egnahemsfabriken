import React from 'react';
import { View, StyleSheet } from 'react-native';

import SaferArea from './SaferArea';
import ScrollViewToTop from './ScrollViewToTop';

export const DetailWrapper = ({ children }) => {
  return (
    <SaferArea>
      <ScrollViewToTop>
        <View style={detailStyles.mainDetailWrap}>{children}</View>
      </ScrollViewToTop>
    </SaferArea>
  );
};

export const detailStyles = StyleSheet.create({
  mainDetailWrap: {
    flex: 1,
    marginBottom: 50,
    marginHorizontal: 8,
  },
  centeredContent: {
    flex: 1,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 300,
    width: '100%',
    borderRadius: 5,
  },
  amount: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 5,
    zIndex: 99,
    backgroundColor: 'rgba(255,255,255,0.8)',
    fontFamily: 'roboto-bold',
    fontSize: 15,
    textAlign: 'right',
    marginRight: 8,
  },
  price: {
    position: 'absolute',
    right: -9,
    top: 0,
    padding: 5,
    zIndex: 99,
    backgroundColor: 'rgba(255,255,255,0.8)',
    fontFamily: 'roboto-bold',
    fontSize: 15,
    textAlign: 'right',
    marginRight: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredHeader: {
    marginTop: 10,
    alignSelf: 'center',
  },
  sectionHeader: {
    marginLeft: 5,
    fontFamily: 'bebas-neue-bold',
    fontSize: 18,
    paddingTop: 30,
  },
  textCard: {
    marginVertical: 4,
  },
  proposalText: {
    textAlign: 'left',
    fontSize: 20,
    fontFamily: 'roboto-bold',
  },
  boundaryText: {
    paddingVertical: 15,
    textAlign: 'left',
    fontSize: 18,
    fontFamily: 'roboto-light',
  },
  spaceBetweenRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
    marginBottom: 10,
    alignItems: 'center',
  },
  editOptions: {
    marginTop: -20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formControl: {
    width: '100%',
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  label: {
    fontFamily: 'roboto-bold',
    marginVertical: 8,
  },
  subLabel: {
    fontFamily: 'roboto-light-italic',
  },
  emptyState: {
    padding: 20,
    color: '#c0c0c0',
  },
});
