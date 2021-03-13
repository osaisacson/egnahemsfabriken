import moment from 'moment/min/moment-with-locales';
import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Divider } from 'react-native-paper';

import Card from './Card';
import OrderActions from './OrderActions';
import SmallRectangularItem from './SmallRectangularItem';
import StatusText from './StatusText';
import TouchableCmp from './TouchableCmp';
import Colors from '../../constants/Colors';

const Order = ({
  order,
  navigation,
  loggedInUserId,
  isProductDetail,
  projects,
  products,
  profiles,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const {
    productId,
    projectId,
    quantity,
    comments,
    buyerId,
    suggestedDate,
    isAgreed,
    isCollected,
  } = order;

  const currentProduct = productId ? products.find((product) => product.id === productId) : {};
  if (!currentProduct) {
    console.log('The product has likely been deleted');
    return null;
  }
  const projectForProduct = projectId ? projects.find((project) => project.id === projectId) : {};

  const buyerProfile = buyerId ? profiles.find((profile) => profile.profileId === buyerId) : {};

  const toggleShowDetails = () => {
    setShowDetails((prevState) => !prevState);
  };

  const formattedDate = (dateToFormat) => {
    return moment(dateToFormat).locale('sv').format('D MMMM, HH:mm');
  };

  return (
    <Card style={{ marginTop: 4 }}>
      {/* Title and quantity */}
      <View style={{ ...styles.oneLineSpread, alignItems: 'flex-end' }}>
        {!isProductDetail ? (
          <Text style={{ fontSize: 20, fontFamily: 'roboto-bold' }}>{currentProduct.title} </Text>
        ) : null}
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={{ fontSize: 16, fontFamily: 'roboto-bold' }}>
            {quantity} st {quantity > 1 ? 'reserverade' : 'reserverad'}{' '}
          </Text>
          <Text style={{ fontSize: 16 }}>
            {moment(order.createdOn).locale('sv').format('D MMMM YYYY')}
          </Text>
        </View>
      </View>
      <Divider />

      {/* Image, buttonlogic and buyershortcut */}
      <OrderActions
        navigation={navigation}
        loggedInUserId={loggedInUserId}
        order={order}
        isProductDetail={isProductDetail}
        products={products}
        profiles={profiles}
        projectForProduct={projectForProduct}
      />
      <Divider />

      {/* Trigger for showing  order details */}
      <TouchableCmp onPress={toggleShowDetails}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <Text style={{ fontFamily: 'bebas-neue', color: Colors.neutral, fontSize: 20 }}>
            Detaljer{' '}
          </Text>
          <AntDesign
            style={{
              textAlign: 'right',
              paddingRight: 10,
              paddingBottom: 10,
              marginTop: showDetails ? 10 : 0,
            }}
            name={showDetails ? 'caretup' : 'caretdown'}
            size={25}
            color={Colors.neutral}
          />
        </View>
      </TouchableCmp>

      {/* Collapsible section with order details */}
      {showDetails ? (
        <>
          <View style={{ paddingVertical: 20 }}>
            <>
              <StatusText
                alwaysShow
                textStyle={{
                  width: suggestedDate ? 200 : '100%',
                  color: suggestedDate ? '#000' : Colors.primary,
                  textAlign: suggestedDate ? 'right' : 'center',
                }}
                label={
                  suggestedDate && isAgreed
                    ? 'Hämtas den:'
                    : isCollected
                    ? 'Hämtades den:'
                    : suggestedDate && !isAgreed
                    ? 'Föreslagen tid:'
                    : ''
                }
                text={
                  suggestedDate && !isCollected
                    ? formattedDate(suggestedDate)
                    : isCollected
                    ? formattedDate(isCollected)
                    : 'Inget förslag på upphämtningstid ännu'
                }
              />
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
                text={currentProduct.phone}
              />
              <StatusText
                textStyle={{ width: 200, textAlign: 'right' }}
                label={`${buyerProfile.profileName}'s telefon:`}
                text={buyerProfile.phone}
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
