import React, {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
import {CreditCardInput} from 'react-native-credit-card-input';
import {useDispatch} from 'react-redux';
import {updatePayment, createUser} from '../../store/modules/app/actions';

import {
  Container,
  Button,
  ButtonText,
  Title,
  SubTitle,
  Spacer,
} from '../../styles';

const Payment = () => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(true);
  const [payment, setPayment] = useState({
    nome: null,
    numero: null,
    validade: null,
    cvv: null,
  });

  const signIn = () => {
    dispatch(updatePayment(payment));
    dispatch(createUser());
  };

  useEffect(() => {
    const keyboarDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      setVisible(false),
    );

    const keyboarDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      setVisible(true),
    );

    return () => {
      keyboarDidShowListener.remove();
      keyboarDidHideListener.remove();
    };
  }, []);

  return (
    <Container padding={30} justify="flex-start">
      <Container align="flex-start" height={40}>
        <Title>Escolha como pagar</Title>
        <SubTitle>Preencha os dados do cartão de crédito.</SubTitle>
      </Container>
      <Container>
        <Spacer height={50} />
        <CreditCardInput
          requiresName
          onChange={(e) => {
            const {number, expiry, cvc, name} = e.values;
            setPayment({
              numero: number,
              nome: name,
              validade: expiry,
              cvv: cvc,
            });
          }}
        />
      </Container>
      {visible && (
        <Container height={70} justify="flex-end">
          <Button onPress={() => signIn()}>
            <ButtonText>Comece a usar</ButtonText>
          </Button>
        </Container>
      )}
    </Container>
  );
};

export default Payment;
