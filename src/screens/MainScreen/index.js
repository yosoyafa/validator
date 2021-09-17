import {API_URL} from '@env';
import {isEmpty, length} from 'ramda';
import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  Keyboard,
  View,
} from 'react-native';

import {ID_LENGTH} from '../../shared/static';
import {colors} from '../../shared/utils';
import HideKeyboardModule from '../../../NativeModules';

const MainScreen = () => {
  const [id, setId] = useState('');
  const [active, setActive] = useState(2);

  const inputRef = useRef(null);

  useEffect(() => {
    const validate = async id => {
      if (length(id) === ID_LENGTH) {
        const data = await getUser(id);
        if (!isEmpty(data)) {
          setActive(data[0].active ? 1 : 0);
        }
      }
    };
    validate(id);
  }, [id]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => {
      HideKeyboardModule.hideSoftKeyBoard();
    });

    Keyboard.addListener('keyboardDidHide', () => {
      inputRef.current.focus();
    });
  }, []);

  const getUser = async id => {
    try {
      const response = await fetch(API_URL + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();
      return json.data;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors[active]}}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default MainScreen;
