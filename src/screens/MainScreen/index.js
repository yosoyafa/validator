import {
  Animated,
  Button,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {cards, colors} from '../../shared/utils';
import {isEmpty, length, pathOr} from 'ramda';
import {API_URL} from '@env';
import HideKeyboardModule from '../../../NativeModules';
import {ID_LENGTH} from '../../shared/static';
import ScanIcon from '../../components/ScanIcon';
import UserCard from '../../components/UserCard';

const MainScreen = () => {
  const window = useWindowDimensions();

  const [id, setId] = useState('');
  const [user, setUser] = useState({});

  const inputRef = useRef(null);
  const boxAnimationValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const validate = async userId => {
      if (length(userId) === ID_LENGTH) {
        handleClose();
        const newUser = await getUser(userId);
        setUser(newUser || {});
        handleOpen();
        inputRef.current.focus();
      }
    };
    validate(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      HideKeyboardModule.hideSoftKeyBoard();
    });

    Keyboard.addListener('keyboardDidHide', () => {
      inputRef.current.focus();
    });
  }, []);

  const handleOpen = () => {
    Animated.timing(boxAnimationValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleClose = () => {
    Animated.timing(boxAnimationValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    inputRef.current.focus();
  };

  const getUser = async userId => {
    try {
      const response = await fetch(API_URL + userId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      return json.data || {};
    } catch (error) {
      console.error(error);
    }
  };

  const colorTable = {
    0: colors.red,
    1: colors.green,
    2: colors.white,
  };

  const cardStyle = {
    ...styles.animatedBox,
    transform: [
      {
        translateY: boxAnimationValue.interpolate({
          inputRange: [0.001, 1],
          outputRange: [window.height / 2 - 30, 2 * window.height],
          extrapolate: 'extend',
        }),
      },
    ],
  };

  const helperButtons = () => (
    <>
      <Button
        title="valid"
        onPress={() => {
          setId(cards.valid);
        }}
      />
      <Button
        title="invalid"
        onPress={() => {
          setId(cards.invalid);
        }}
      />
      <Button
        title="not found"
        onPress={() => {
          setId(cards.notFound);
        }}
      />
    </>
  );

  return (
    <SafeAreaView
      style={{
        ...styles.container,
        backgroundColor: colorTable[pathOr(2, ['active'], user)],
      }}>
      {true && helperButtons()}
      <View pointerEvents="none">
        <TextInput
          style={styles.input}
          onChangeText={setId}
          value={id}
          onPressIn={() => Keyboard.dismiss()}
          ref={inputRef}
          autoFocus
        />
      </View>
      {isEmpty(id) && <ScanIcon style={{...styles.icon}} />}
      <UserCard
        user={user}
        onPress={() => {
          handleClose();
          setId('');
        }}
        style={cardStyle}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    display: 'none',
  },
  animatedBox: {
    position: 'absolute',
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 8,
    padding: 20,
    alignSelf: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    alignSelf: 'center',
  },
});

export default MainScreen;
