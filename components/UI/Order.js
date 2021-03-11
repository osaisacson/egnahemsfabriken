import { AntDesign } from '@expo/vector-icons';
import moment from 'moment/min/moment-with-locales';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Colors from './../../constants/Colors';
import Card from './Card';
import OrderActions from './OrderActions';
import SmallRectangularItem from './SmallRectangularItem';
import StatusText from './StatusText';
import TouchableCmp from './TouchableCmp';
import UserAvatar from './UserAvatar';

const Order = ({ order, navigation, profiles, projects, loggedInUserId, isProductDetail }) => {
  const [showDetails, setShowDetails] = useState(false);

  const {
    productId,
    buyerId,
    sellerId,
    projectId,
    image,
    quantity,
    reservedUntil,
    comments,
    suggestedDate,
    isCollected,
    buyerAgreed,
    sellerAgreed,
  } = order;

  const products = useSelector((state) => state.products.availableProducts);
  const currentProduct = products.find((product) => product.id === productId);

  const buyerProfile = profiles.find((profile) => profile.profileId === buyerId);
  const projectForProduct = projectId ? projects.find((project) => project.id === projectId) : {};

  const theOneWeAreWaitingFor = profiles.find(
    (profile) => profile.profileId === (!sellerAgreed ? sellerId : buyerId)
  );

  const isBuyer = buyerId === loggedInUserId; //The currently logged in user matches the buyerId in the order
  const isSeller = sellerId === loggedInUserId; //The currently logged in user matches the sellerId in the order

  const waitingForYouAsSeller = isSeller && !sellerAgreed;
  const waitingForYouAsBuyer = isBuyer && !buyerAgreed;
  const waitingForYou = waitingForYouAsSeller || waitingForYouAsBuyer;
  const nameOfThumberOuterGetter = theOneWeAreWaitingFor.profileName;

  const bothHaveAgreedOnTime = buyerAgreed && sellerAgreed && suggestedDate;

  const orderIsExpired =
    !isCollected &&
    new Date(reservedUntil) instanceof Date &&
    new Date(reservedUntil) <= new Date();

  const toggleShowDetails = () => {
    setShowDetails((prevState) => !prevState);
  };

  const goToItem = () => {
    navigation.navigate('ProductDetail', { detailId: productId });
  };

  return (
    <Card style={{ marginTop: 4 }}>
      <TouchableCmp onPress={toggleShowDetails}>
        <View style={styles.oneLineSpread}>
          <Text style={{ fontSize: 18, fontFamily: 'roboto-bold' }}>{currentProduct.title}</Text>
          <Text style={{ fontSize: 16, fontFamily: 'roboto-bold' }}>{quantity} st</Text>
        </View>
        <Divider />

        {!orderIsExpired && !isCollected && suggestedDate ? (
          <>
            <View style={styles.oneLineSpread}>
              {!isCollected ? (
                <>
                  <Text>{!bothHaveAgreedOnTime ? 'Föreslagen upphämtningstid' : 'Hämtas'}</Text>
                  <Text>{moment(suggestedDate).locale('sv').format('D MMM YYYY, HH:mm')}</Text>
                </>
              ) : (
                <>
                  <Text>Hämtades</Text>
                  <Text>{moment(isCollected).locale('sv').format('D MMM YYYY, HH:mm')}</Text>
                </>
              )}
            </View>
            <Divider />
          </>
        ) : null}

        <View style={styles.oneLineSpread}>
          {isProductDetail ? (
            <UserAvatar
              userId={buyerProfile.profileId}
              style={{ margin: 0 }}
              showBadge={false}
              actionOnPress={() => {
                navigation.navigate('Användare', {
                  detailId: buyerProfile.profileId,
                });
              }}
            />
          ) : (
            <TouchableOpacity onPress={goToItem}>
              <Image
                style={{ borderRadius: 3, width: 150, height: 150, resizeMode: 'contain' }}
                source={{ uri: image }}
              />
            </TouchableOpacity>
          )}

          <OrderActions
            order={order}
            loggedInUserId={loggedInUserId}
            isBuyer={isBuyer}
            isSeller={isSeller}
          />

          <View style={[styles.textAndBadge, { justifyContent: 'flex-start' }]}>
            <UserAvatar
              userId={buyerId}
              size={70}
              style={{ margin: 0 }}
              showBadge={false}
              actionOnPress={() => {
                navigation.navigate('Användare', {
                  detailId: buyerId,
                });
              }}
            />
            <View style={[styles.smallBadge, { backgroundColor: Colors.darkPrimary, left: -10 }]}>
              <Text style={styles.smallText}>köpare</Text>
            </View>
          </View>
        </View>
        {isCollected ? (
          <AntDesign
            style={{ textAlign: 'right', paddingRight: 10, paddingBottom: 10, marginTop: -20 }}
            name="checkcircle"
            size={20}
            color={Colors.subtleGreen}
          />
        ) : (
          <AntDesign
            style={{ textAlign: 'right', paddingRight: 10, paddingBottom: 10, marginTop: -20 }}
            name="caretdown"
            size={18}
            color="#666"
          />
        )}
      </TouchableCmp>

      {showDetails ? (
        <>
          <Divider />

          <View style={{ paddingVertical: 20 }}>
            {!orderIsExpired && !isCollected ? (
              <>
                <StatusText
                  textStyle={{ width: 200, textAlign: 'right' }}
                  label="Upphämtningsaddress:"
                  text={currentProduct.address}
                />
                {currentProduct.pickupDetails ? (
                  <StatusText
                    textStyle={{ width: 200, textAlign: 'right' }}
                    label="Detaljer om hämtning:"
                    text={currentProduct.pickupDetails}
                  />
                ) : null}
                {currentProduct.phone ? (
                  <StatusText
                    textStyle={{ width: 200, textAlign: 'right' }}
                    label="Säljarens telefon:"
                    text={currentProduct.phone}
                  />
                ) : null}
                {comments ? <Text>Kommentarer: {comments}</Text> : null}
              </>
            ) : null}
            {orderIsExpired ? (
              <Text
                style={{
                  color: '#000',
                  textAlign: 'center',
                  margin: 10,
                  fontFamily: 'roboto-light-italic',
                }}>
                Reservationen gick ut den{' '}
                {moment(reservedUntil).locale('sv').format('D MMMM YYYY, HH:mm')}. Antingen markera
                som 'hämtad' om den är hämtad, föreslå en ny upphämtningstid, eller avreservera
                beställningen nedan. Notera att både säljaren och köparen kan avreservera när
                reservationen är slut.
              </Text>
            ) : null}
            {isCollected ? (
              <>
                <StatusText
                  label="Datum hämtades"
                  text={moment(isCollected).locale('sv').format('D MMMM YYYY, HH:mm')}
                />

                <View style={styles.oneLineSpread}>
                  <StatusText label="Köpare" style={{ marginLeft: -10 }} />
                  <>
                    <StatusText text={buyerProfile.profileName} />
                    <UserAvatar
                      userId={buyerProfile.profileId}
                      style={{ margin: 0, textAlign: 'right' }}
                      showBadge={false}
                      actionOnPress={() => {
                        navigation.navigate('Användare', {
                          detailId: buyerProfile.profileId,
                        });
                      }}
                    />
                  </>
                </View>
              </>
            ) : null}
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
    paddingHorizontal: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    color: Colors.darkPrimary,
    fontFamily: 'roboto-light-italic',
  },
  textAndBadge: {
    paddingHorizontal: 8,
    flex: 1,
    flexDirection: 'row',
  },
  smallBadge: {
    zIndex: 10,
    paddingHorizontal: 2,
    borderRadius: 5,
    height: 17,
  },
  smallText: {
    textTransform: 'uppercase',
    fontSize: 10,
    padding: 2,
    color: '#fff',
  },
});

export default Order;
