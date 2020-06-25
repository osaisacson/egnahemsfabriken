import React from 'react';
import { Avatar, Badge } from 'react-native-paper';
import { useSelector } from 'react-redux';

import TouchableCmp from './TouchableCmp';

const UserAvatar = (props) => {
  //Get logged in userId from state, and products
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.profileId;

  const availableProducts = useSelector((state) => state.products.availableProducts);

  const reservedProducts = availableProducts.filter((prod) => prod.status === 'reserverad');

  //Get all products which are reserved by or from the logged in user
  const reservedBy = reservedProducts.filter((prod) => prod.reservedUserId === loggedInUserId)
    .length;

  const reservedFrom = reservedProducts.filter((prod) => prod.ownerId === loggedInUserId).length;

  //Get all products which have a time for collection set, and are pending collection by or for the user
  const collectedProducts = availableProducts.filter((prod) => prod.status === 'ordnad');

  const collectionBy = collectedProducts.filter((prod) => prod.collectingUserId === loggedInUserId)
    .length;

  const collectionFrom = collectedProducts.filter((prod) => prod.ownerId === loggedInUserId).length;

  const badgeNumber = reservedBy + reservedFrom + collectionBy + collectionFrom;

  //If we are passing a userId, use this as the current user, else use the currently logged in user
  let currentUser;
  if (props.userId) {
    currentUser = useSelector((state) =>
      state.profiles.allProfiles.find((prof) => prof.profileId === props.userId)
    );
  } else {
    currentUser = useSelector((state) => state.profiles.userProfile);
  }

  return (
    <TouchableCmp
      activeOpacity={0.5}
      onPress={props.actionOnPress}
      style={
        props.style
          ? props.style
          : {
              marginHorizontal: 10,
              marginTop: 40,
            }
      }>
      <Avatar.Image
        style={{
          color: '#fff',
          backgroundColor: '#fff',
          borderWidth: 0.5,
          borderColor: '#666',
        }}
        source={
          currentUser && currentUser.image
            ? { uri: currentUser.image }
            : require('./../../assets/avatar-placeholder-image.png')
        }
        size={props.size ? props.size : 40}
      />
      {props.showBadge && badgeNumber > 0 ? (
        <Badge
          style={{
            fontWeight: 'bold',
            position: 'relative',
            bottom: 20,
          }}>
          {badgeNumber}
        </Badge>
      ) : null}
    </TouchableCmp>
  );
};

export default UserAvatar;
