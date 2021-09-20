import {Animated, Image, Pressable, StyleSheet, Text} from 'react-native';
import {BIG_NUM} from '../../shared/static';
import React from 'react';
import {isEmpty} from 'ramda';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const UserCard = ({onPress, style, user}) => {
  return (
    <AnimatedPressable onPress={onPress} style={style}>
      {isEmpty(user) ? (
        <>
          <Text>{'No encontrado'}</Text>
        </>
      ) : (
        <>
          <Image
            source={require('../../shared/pic.jpg')}
            style={styles.image}
          />
          <Text>{user.name}</Text>
          <Text>{user.id}</Text>
        </>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 80,
    height: 80,
    borderRadius: BIG_NUM,
  },
});

export default UserCard;
