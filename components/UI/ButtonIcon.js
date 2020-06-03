import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton, Badge } from 'react-native-paper';

import TouchableCmp from './TouchableCmp';

const ButtonIcon = (props) => {
  return (
    <TouchableCmp style={{ ...styles.container, ...props.style }}>
      {props.badge ? <Badge style={styles.badge}>{props.badge}</Badge> : null}
      <IconButton
        icon={props.icon}
        size={props.size ? props.size : 20}
        animated
        color="#fff"
        style={{
          borderColor: props.borderColor ? props.borderColor : '#fff',
          borderWidth: 0.5,
          backgroundColor: props.color,
        }}
        onPress={props.onSelect}
      />
    </TouchableCmp>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  badge: {
    borderWidth: 0.7,
    borderColor: '#fff',
    position: 'absolute',
    zIndex: 100,
  },
});

export default ButtonIcon;
