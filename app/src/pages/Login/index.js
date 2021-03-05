import React, {useEffect} from 'react';
import {Image, TextInput,Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import social from '../../services/social';
import {useDispatch} from 'react-redux';
import {updateUser, checkUser} from '../../store/modules/app/actions';

import logo from '../../assets/logo.png';
import bgBottom from '../../assets/bg-bottom-login.png';

import {Container, Button, ButtonText} from '../../styles';
import graph from '../../services/facebook';

const Login = ({navigation}) => {
  const dispatch = useDispatch();

  const login = async () => {
    try {
      const auth = await social.authorize('facebook', {
        scopes: 'email',
      });

      const user = await graph.get(
        `/me?fields=id,name,email&access_token=${auth.response.credentials.accessToken}`,
      );

      dispatch(
        updateUser({
          fbId: user.data.id,
          nome: user.data.name,
          email: user.data.email,
          accessToken: auth.response.credentials.accessToken,
        }),
      );
      dispatch(checkUser());
    } catch (err) {
      alert(err.message);
    }
  };


  const checkLogin = async () => {
    //AsyncStorage.clear();
    const user = await AsyncStorage.getItem('@user');
    if (user) {
      dispatch(updateUser(JSON.parse(user)));
      navigation.replace('Home');
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);


  return (
    <Container color="info50" justify="flex-end">
      <Container
        justify="space-around"
        padding={30}
        position="absolute"
        height={270}
        top={0}
        zIndex={9}>
        <Image source={logo} />

        <Button onPress={() => login()} type="info">
          <ButtonText color="light">Entrar com Facebook</ButtonText>
        </Button>

        <Button type="light">
          <ButtonText>Entrar com Gmail</ButtonText>
        </Button>
      </Container>
      <Image source={bgBottom} />
    </Container>
  );
  };

export default Login;
