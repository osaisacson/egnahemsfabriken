import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
//Components
import { View, Alert, Text } from 'react-native';
import { Divider, Title, Paragraph } from 'react-native-paper';
import Moment from 'moment/min/moment-with-locales';

import {
  DetailWrapper,
  detailStyles,
} from '../../components/wrappers/DetailWrapper';
import CachedImage from '../../components/UI/CachedImage';
import ContactDetails from '../../components/UI/ContactDetails';
import HeaderThree from '../../components/UI/HeaderThree';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import HorizontalScrollContainer from '../../components/UI/HorizontalScrollContainer';
import Loader from '../../components/UI/Loader';
import FilterLine from '../../components/UI/FilterLine';
import RoundItem from '../../components/UI/RoundItem';
import ButtonIcon from '../../components/UI/ButtonIcon';
import ButtonAction from '../../components/UI/ButtonAction';
import SectionCard from '../../components/UI/SectionCard';

import StatusBadge from '../../components/UI/StatusBadge';

//Constants
import Colors from '../../constants/Colors';
//Actions
import * as productsActions from '../../store/actions/products';

const ProductDetailScreen = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  //Get product and owner id from navigation params (from parent screen) and current user id from state
  const productId = props.route.params.detailId;
  const ownerId = props.route.params.ownerId;
  const loggedInUserId = useSelector((state) => state.auth.userId);

  //Set up state hooks
  const [isLoading, setIsLoading] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [showUserProjects, setShowUserProjects] = useState(false);

  //Find us the product that matches the current productId
  const selectedProduct = useSelector((state) =>
    state.products.availableProducts.find((prod) => prod.id === productId)
  );

  //Get all projects from state, and then return the ones that matches the id of the current product
  const userProjects = useSelector((state) => state.projects.userProjects);
  const projectForProduct = userProjects.filter(
    (proj) => proj.id === selectedProduct.projectId
  );

  //Check status of product and privileges of user
  const hasEditPermission = ownerId === loggedInUserId;
  const isReady = selectedProduct.status === 'redo';
  const isReserved = selectedProduct.status === 'reserverad';
  const isPickedUp = selectedProduct.status === 'hämtad';

  const editProductHandler = (id) => {
    navigation.navigate('EditProduct', { detailId: id });
  };

  const deleteHandler = () => {
    const id = selectedProduct.id;
    Alert.alert(
      'Är du säker?',
      'Vill du verkligen radera den här produkten? Det går inte att gå ändra sig när det väl är gjort.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, radera',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
            dispatch(productsActions.deleteProduct(id));
          },
        },
      ]
    );
  };

  const collectHandler = () => {
    const id = selectedProduct.id;
    const projectId = selectedProduct.projectId;
    Alert.alert(
      'Är produkten hämtad?',
      'Genom att klicka här bekräftar du att produkten är hämtad. Den kommer då försvinna från det aktiva förrådet och hamna i ditt Gett Igen förråd.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, flytta den',
          style: 'destructive',
          onPress: () => {
            dispatch(
              productsActions.changeProductStatus(id, 'hämtad', projectId)
            );
            props.navigation.goBack();
          },
        },
      ]
    );
  };

  const toggleIsReadyHandle = () => {
    const id = selectedProduct.id;
    setIsToggled((prevState) => !prevState);
    let status = selectedProduct.status === 'bearbetas' ? 'redo' : 'bearbetas';
    dispatch(productsActions.changeProductStatus(id, status));
    props.navigation.goBack();
  };

  const toggleReserveButton = () => {
    setShowUserProjects((prevState) => !prevState);
  };

  const unReserveHandler = () => {
    Alert.alert(
      'Avbryt reservation?',
      'Om du avbryter reservationen kommer återbruket igen bli tillgängligt för andra.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, ta bort',
          style: 'destructive',
          onPress: () => {
            setIsLoading(true);
            dispatch(productsActions.unReserveProduct(selectedProduct.id)).then(
              setIsLoading(false)
            );
          },
        },
      ]
    );
  };

  const reserveHandler = (clickedProjectId) => {
    const id = selectedProduct.id;
    const projectId = clickedProjectId ? clickedProjectId : '000';

    Alert.alert(
      'Kom ihåg',
      'Denna reservation gäller i ett dygn. Du måste själv kontakta säljaren för att komma överens om hämtningstid. Du hittar reservationen under din profil.',
      [
        { text: 'Avbryt', style: 'default' },
        {
          text: 'Jag förstår',
          style: 'destructive',
          onPress: () => {
            dispatch(
              productsActions.changeProductStatus(id, 'reserverad', projectId)
            );
            props.navigation.navigate('Min Sida');
          },
        },
      ]
    );
  };

  const {
    reservedUserId,
    category,
    condition,
    style,
    material,
    color,
  } = selectedProduct;

  const shorterDate = selectedProduct.reservedUntil
    ? Moment(selectedProduct.reservedUntil).locale('sv').calendar()
    : 'never';

  const isReservedOrPickedUp = isReserved || isPickedUp;
  const isReservedUser = reservedUserId === loggedInUserId;
  const isPaused = selectedProduct.status === 'bearbetas';

  if (isLoading) {
    return <Loader />;
  }

  return (
    <DetailWrapper>
      <View>
        <Text style={{ textAlign: 'right', color: '#666' }}>
          Upplagt{' '}
          {Moment(selectedProduct.date).locale('sv').startOf('hour').fromNow()}
        </Text>
        <SectionCard>
          {/* Info about who created the product post */}
          <ContactDetails
            profileId={ownerId}
            productId={selectedProduct.id}
            hideButton={isPickedUp}
            buttonText={'hämtningsdetaljer'}
          />

          {/* Product image */}
          <CachedImage
            style={detailStyles.image}
            uri={selectedProduct.image ? selectedProduct.image : ''}
          />

          {/* Show delete and edit buttons if the user has editing 
        permissions and the product is not yet picked up */}
          {hasEditPermission && !isPickedUp ? (
            <>
              <View style={detailStyles.editOptions}>
                <ButtonIcon
                  icon="pen"
                  color={Colors.neutral}
                  onSelect={() => {
                    editProductHandler(selectedProduct.id);
                  }}
                />
                <ButtonIcon
                  icon="delete"
                  color={Colors.warning}
                  onSelect={deleteHandler.bind(this)}
                />
              </View>
            </>
          ) : null}

          {/* General description */}
          <Title>{selectedProduct.title}</Title>
          <Paragraph>{selectedProduct.description}</Paragraph>
          {selectedProduct.length ? (
            <View style={detailStyles.spaceBetweenRow}>
              <Paragraph>LÄNGD:</Paragraph>
              <Paragraph>{selectedProduct.length}</Paragraph>
            </View>
          ) : null}
          {selectedProduct.height ? (
            <View style={detailStyles.spaceBetweenRow}>
              <Paragraph>HÖJD:</Paragraph>
              <Paragraph>{selectedProduct.height}</Paragraph>
            </View>
          ) : null}
          {selectedProduct.width ? (
            <View style={detailStyles.spaceBetweenRow}>
              <Paragraph>BREDD:</Paragraph>
              <Paragraph>{selectedProduct.width}</Paragraph>
            </View>
          ) : null}
          <Divider style={{ marginTop: 10 }} />

          {/* Only show filter badges if we have any filters */}
          {category || condition || style || material || color ? (
            <>
              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                {category === 'Ingen' ? null : <FilterLine filter={category} />}
                {condition === 'Inget' ? null : (
                  <FilterLine filter={`${condition} skick`} />
                )}
                {style === 'Ingen' ? null : <FilterLine filter={style} />}
                {material === 'Inget' ? null : <FilterLine filter={material} />}
                {color === 'Ingen' ? null : <FilterLine filter={color} />}
              </View>
              <Divider style={{ marginBottom: 10 }} />
            </>
          ) : null}

          {/* Price */}
          <Paragraph style={{ textAlign: 'right', padding: 20 }}>
            {selectedProduct.price ? `${selectedProduct.price} kr` : 'Gratis'}
          </Paragraph>

          {/* When trying to reserve, open this up for selection of associated project */}
          {!isReservedOrPickedUp && showUserProjects ? (
            <>
              <HeaderThree
                text={'Vilket projekt ska återbruket användas i?'}
                style={detailStyles.centeredHeader}
              />

              <HorizontalScrollContainer>
                <RoundItem
                  itemData={{
                    image: './../../assets/avatar-placeholder-image.png',
                    title: 'Inget projekt',
                  }}
                  key={'000'}
                  isHorizontal={true}
                  onSelect={() => {
                    reserveHandler('000');
                  }}
                />
                {userProjects.map((item) => (
                  <RoundItem
                    itemData={item}
                    key={item.id}
                    isHorizontal={true}
                    onSelect={() => {
                      reserveHandler(item.id);
                    }}
                  />
                ))}
              </HorizontalScrollContainer>
            </>
          ) : null}
        </SectionCard>

        {/* Buttons to show for products ready to be reserved */}
        {!isPickedUp && !isReserved ? (
          <SectionCard>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginVertical: 10,
              }}
            >
              {/* Reserve */}
              {!isPaused ? (
                <ButtonAction
                  disabled={isReserved}
                  onSelect={toggleReserveButton}
                  title={'reservera'}
                />
              ) : null}

              {/* Pause - to show if user is the creator */}
              {hasEditPermission ? (
                <ButtonAction
                  style={{ marginRight: 10 }}
                  isToggled={isToggled}
                  icon={isReady ? 'pause' : null}
                  title={isReady ? 'pausa' : 'avpausa, sätt som redo'}
                  onSelect={toggleIsReadyHandle.bind(this)}
                />
              ) : null}
            </View>
          </SectionCard>
        ) : null}

        {/* Buttons to show for products that have been reserved */}
        {isReserved && (isReservedUser || hasEditPermission) ? (
          <SectionCard>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginVertical: 10,
              }}
            >
              {/* Change to 'collected' - to show if user is the creator */}
              {hasEditPermission ? (
                <ButtonAction
                  disabled={isPickedUp}
                  title="byt till hämtad"
                  onSelect={collectHandler.bind(this)}
                />
              ) : null}

              {/* Un-reserve. */}
              {isReservedUser ? (
                <ButtonAction
                  disabled={isPickedUp}
                  onSelect={unReserveHandler}
                  title={'avreservera'}
                />
              ) : null}
            </View>
          </SectionCard>
        ) : null}

        {/* Show pause badge if product is paused */}
        {isPaused ? (
          <SectionCard>
            <StatusBadge
              text={'Pausad för bearbetning'}
              icon={Platform.OS === 'android' ? 'md-pause' : 'ios-pause'}
              backgroundColor={Colors.neutral}
            />
          </SectionCard>
        ) : null}

        {/* Information about the reservation */}
        {isReservedOrPickedUp ? (
          <SectionCard>
            {/* Show collected badge if product is collected */}
            {isPickedUp ? (
              <StatusBadge
                text={`Hämtad${isReservedUser ? ' av dig' : ''}!`}
                icon={
                  Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
                }
                backgroundColor={Colors.completed}
              />
            ) : null}
            {isReserved ? (
              <StatusBadge
                text={`Reserverad ${
                  isReservedUser ? 'av dig ' : ''
                }till ${shorterDate}`}
                icon={
                  Platform.OS === 'android' ? 'md-bookmark' : 'ios-bookmark'
                }
                backgroundColor={Colors.primary}
              />
            ) : null}

            {!isReservedUser ? (
              <ContactDetails
                profileId={
                  reservedUserId ? reservedUserId : selectedProduct.newOwnerId
                }
                hideButton={isPickedUp}
                buttonText={'kontaktdetaljer'}
              />
            ) : null}
            {selectedProduct.projectId && projectForProduct.length ? (
              <>
                <Divider />

                <View style={detailStyles.centered}>
                  <HeaderThree
                    text={isPickedUp ? 'Används i ' : 'För att användas i '}
                    style={detailStyles.centeredHeader}
                  />

                  <HorizontalScroll
                    scrollHeight={155}
                    roundItem={true}
                    detailPath={'ProjectDetail'}
                    scrollData={projectForProduct}
                    navigation={props.navigation}
                  />
                </View>
              </>
            ) : null}
          </SectionCard>
        ) : null}
      </View>
    </DetailWrapper>
  );
};

//Sets/overrides the default navigation options in the ShopNavigator
export const screenOptions = (navData) => {
  return {
    headerTitle: '',
  };
};

export default ProductDetailScreen;
