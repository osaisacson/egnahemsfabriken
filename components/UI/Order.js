import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Card from './Card';
import OrderActions from './OrderActions';
import SmallRectangularItem from './SmallRectangularItem';
import StatusText from './StatusText';
import TouchableCmp from './TouchableCmp';

const Order = ({ order, navigation, projects, loggedInUserId, isProductDetail }) => {
  const [showDetails, setShowDetails] = useState(false);

  const { productId, projectId, quantity, comments } = order;

  const products = useSelector((state) => state.products.availableProducts);
  const currentProduct = products.find((product) => product.id === productId);

  const projectForProduct = projectId ? projects.find((project) => project.id === projectId) : {};

  const toggleShowDetails = () => {
    setShowDetails((prevState) => !prevState);
  };

  return (
    <Card style={{ marginTop: 4 }}>
      {/* Title and quantity */}
      <View style={styles.oneLineSpread}>
        <Text style={{ fontSize: 18, fontFamily: 'roboto-bold' }}>{currentProduct.title}</Text>
        <Text style={{ fontSize: 16, fontFamily: 'roboto-bold' }}>{quantity} st</Text>
      </View>
      <Divider />

      {/* Image, buttonlogic and buyershortcut */}
      <OrderActions
        navigation={navigation}
        loggedInUserId={loggedInUserId}
        order={order}
        isProductDetail={isProductDetail}
      />

      {/* Trigger for showing  order details */}
      <TouchableCmp onPress={toggleShowDetails}>
        <AntDesign
          style={{
            textAlign: 'right',
            paddingRight: 10,
            paddingBottom: 10,
            marginTop: isProductDetail ? 10 : 0,
          }}
          name="caretdown"
          size={18}
          color="#666"
        />
      </TouchableCmp>

      {/* Collapsible section with order details */}
      {showDetails ? (
        <>
          <Divider />
          <View style={{ paddingVertical: 20 }}>
            <>
              <StatusText
                textStyle={{ width: 200, textAlign: 'right' }}
                label="Upphämtningsaddress:"
                text={currentProduct.address}
              />
              <StatusText
                textStyle={{ width: 200, textAlign: 'right' }}
                label="Detaljer om hämtning:"
                text={currentProduct.pickupDetails}
              />
              <StatusText
                textStyle={{ width: 200, textAlign: 'right' }}
                label="Säljarens telefon:"
                text={`0${currentProduct.phone}`}
              />
              {comments ? <Text>Kommentarer: {comments}</Text> : null}
            </>

            {projectForProduct && !projectForProduct === '000' ? (
              <View style={styles.oneLineSpread}>
                <Text style={{ fontFamily: 'roboto-light-italic', marginLeft: 8 }}>
                  Att användas i projekt:
                </Text>
                <View>
                  <SmallRectangularItem
                    detailPath="ProjectDetail"
                    item={projectForProduct}
                    navigation={navigation}
                  />
                </View>
              </View>
            ) : null}
          </View>
        </>
      ) : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  oneLineSpread: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
});

export default Order;
