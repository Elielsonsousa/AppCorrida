import React from 'react';
import {Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {updateUser} from '../../store/modules/app/actions';

import {
  Container,
  Button,
  ButtonText,
  Title,
  SubTitle,
  PickerButton,
} from '../../styles';

import car from '../../assets/car.png';
import hand from '../../assets/hand.png';

const Type = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.app);

  const toggleType = (tipo) => {
    dispatch(updateUser({tipo}));
  };

  const nextPage = () => {
    const route = user.tipo === 'M' ? 'Car' : 'Payment';
    navigation.navigate(route);
  };

  return (
    <Container padding={30} justify="flex-start">
      <Container align="flex-start" height={40}>
        <Title>Passageiro ou motorista?</Title>
        <SubTitle>Selecione qual será a sua função no Driverx.</SubTitle>
      </Container>
      <Container>
        <PickerButton
          onPress={() => toggleType('M')}
          active={user.tipo === 'M'}>
          <Image source={car} />
          <Title>Motorista</Title>
        </PickerButton>
        <PickerButton
          onPress={() => toggleType('P')}
          active={user.tipo === 'P'}>
          <Image source={hand} />
          <Title>Passageiro</Title>
        </PickerButton>
      </Container>
      <Container height={70} justify="flex-end">
        <Button onPress={() => nextPage()}>
          <ButtonText>Próximo Passo</ButtonText>
        </Button>
      </Container>
    </Container>
  );
};

export default Type;
