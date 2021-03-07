import React, {useEffect, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  updateRide,
  acceptRide,
  requestRide,
} from '../../store/modules/app/actions';
import socket from '../../services/socket';
import api from '../../services/api';

import {
  Container,
  Title,
  SubTitle,
  Spacer,
  Map,
  Avatar,
  Input,
  Button,
  ButtonText,
  VerticalSeparator,
  Bullet,
  PulseCircle,
} from '../../styles';
import {TouchableOpacity} from 'react-native';
import {Marker, Polyline} from 'react-native-maps';

import initialMarker from '../../assets/initial-marker.png';
import finalMarker from '../../assets/final-marker.png';
import driverIcon from '../../assets/driver.png';

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const [driverLocation, setDriverLocation] = useState({
    latitude: -30.011364,
    longitude: -51.1637373,
  });

  const {user, ride} = useSelector((state) => state.app);
  const mapRef = useRef(null);
  const ws = useRef(null);

  const rideStatus = () => {
    if (ride?.user?._id) {
      if (ride?.driver?._id) {
        return 'inRide';
      } else {
        return 'inSearch';
      }
    }

    return 'empty';
  };

  const updateSocketId = async (socketId) => {
    try {
      await api.put(`/socket/${user._id}`, {socketId});
      console.log('socket updated');
    } catch (err) {
      console.log('update socketId error => ' + err.message);
    }
  };

  const updateLocation = async (coordinates) => {
    try {
      await api.put(`/location/${user._id}`, {
        coordinates,
        socketId: ride?.user?.socketId,
        status: rideStatus(),
      });
    } catch (err) {
      console.log('update location error => ' + err.message);
    }
  };

  const updateMapLocation = async (coordinates) => {
    if (user.tipo === 'P') {
      setDriverLocation({
        latitude: coordinates[0],
        longitude: coordinates[1],
      });

      mapRef.current.animateCamera({
        center: {
          latitude: coordinates[0],
          longitude: coordinates[1],
        },
        zoom: 14,
      });
    }
  };

  const rideAccept = () => {
    dispatch(acceptRide());
  };

  const initSocket = () => {
    ws.current = socket();

    ws.current.on('connect', () => {
      const id = ws.current.id;
      updateSocketId(id);

      ws.current.on('ride-request', (ride) => {
        console.log('---- SOLICITAÇÃO DE CORRIDA ---- ');
        dispatch(updateRide(ride));
      });

      ws.current.on('ride', (ride) => {
        dispatch(updateRide(ride));
      });

      ws.current.on('ride-update', (coordinates) => {
        updateMapLocation(coordinates);
      });
    });
  };

  useEffect(() => {
    initSocket();
  }, []);

  useEffect(() => {
    mapRef.current.fitToCoordinates(ride?.info?.route, {
      options: {
        edgePadding: {
          top: 100,
          right: 70,
          bottom: 150,
          left: 70,
        },
      },
    });
  }, [ride]);

  return (
    <Container>
      <Map
        ref={mapRef}
        initialRegion={{
          latitude: -30.011364,
          longitude: -51.1637373,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        disabled={rideStatus() === 'inSearch' && user.tipo === 'P'}
        onRegionChangeComplete={(region) => {
          if (user.tipo === 'M') {
            setDriverLocation(region);
            updateLocation([region.latitude, region.longitude]);
          }
        }}>
        {(ride?._id || user.tipo === 'M') && (
          <Marker coordinate={driverLocation}>
            <Avatar small source={driverIcon} />
          </Marker>
        )}

        {ride?.info?.route && (
          <>
            <Polyline
              coordinates={ride?.info?.route}
              strokeWidth={4}
              strokeColor="#000"
            />

            <Marker coordinate={ride?.info?.route[0]}>
              <Avatar source={initialMarker} small />
            </Marker>
            <Marker
              coordinate={ride?.info?.route[ride?.info?.route.length - 1]}>
              <Avatar source={finalMarker} small />
            </Marker>
          </>
        )}
      </Map>
      <Container
        position="absolute"
        justify="space-between"
        align="flex-start"
        padding={20}
        zIndex={999}
        pointerEvents="box-none"
        style={{height: '100%'}}>
        {/* PARTE SUPERIOR */}
        <Container height={100} justify="flex-start" align="flex-start">
          {/* AVATAR */}
          {rideStatus() === 'empty' && !ride?.info && (
            <TouchableOpacity>
              <Avatar
                source={{
                  uri: `https://graph.facebook.com/${user.fbId}/picture?type=large&access_token=${user.accessToken}`,
                }}
              />
            </TouchableOpacity>
          )}

          {rideStatus() !== 'empty' && user.tipo === 'P' && ride?.info && (
            <Container elevation={50} justify="flex-end" color="light">
              <Container padding={20}>
                <Container justify="flex-start" row>
                  <Bullet />
                  <SubTitle numberOfLines={1}>
                    {' '}
                    {ride?.info?.start_address}
                  </SubTitle>
                </Container>
                <Spacer height={20} />
                <Container justify="flex-start" row>
                  <Bullet destination />
                  <SubTitle numberOfLines={1}>
                    {' '}
                    {ride?.info?.end_address}
                  </SubTitle>
                </Container>
              </Container>
              <Button type="dark" compact>
                <ButtonText color="light">Toque para editar</ButtonText>
              </Button>
            </Container>
          )}
        </Container>

        {/* PASSAGEIRO PROCURANDO CORRIDA */}
        {rideStatus() === 'inSearch' && user.tipo === 'P' && (
          <Container padding={20} zIndex={-1}>
            <PulseCircle
              numPulses={3}
              diameter={400}
              speed={20}
              dutarion={2000}
            />
          </Container>
        )}

        <Container elevation={50} height={150} color="light">
          {/* PASSAGEIRO SEM CORRIDA */}
          {user.tipo === 'P' && rideStatus() === 'empty' && !ride?.info && (
            <Container justify="flex-start" padding={20} align="flex-start">
              <SubTitle>Olá, Silvio Sampaio.</SubTitle>
              <Title>Pra onde você quer ir?</Title>
              <Spacer />
              <TouchableOpacity
                style={{width: '100%'}}
                onPress={() => {
                  navigation.navigate('Ride');
                }}>
                <Input editable={false} placeholder="Procure um destino..." />
              </TouchableOpacity>
            </Container>
          )}

          {/* PASSAGEIRO INFORMAÇÕES DA CORRIDA */}
          {user.tipo === 'P' && rideStatus() !== 'inRide' && ride?.info && (
            <Container justify="flex-end" align="flex-start">
              <Container padding={20}>
                <SubTitle>Drixerx Convencional</SubTitle>
                <Spacer />
                <Container row>
                  <Container>
                    <Title>R$ {ride?.info?.price}</Title>
                  </Container>
                  <VerticalSeparator />
                  <Container>
                    <Title>{ride?.info?.duration?.text}</Title>
                  </Container>
                </Container>
              </Container>
              <Button
                onPress={() => dispatch(requestRide())}
                type={rideStatus() === 'inSearch' ? 'muted' : 'primary'}>
                <ButtonText>
                  {rideStatus() === 'inSearch'
                    ? 'Cancelar Driverx'
                    : 'Chamar Driverx'}
                </ButtonText>
              </Button>
            </Container>
          )}

          {/* PASSEGEIRO EM CORRIDA */}
          {user.tipo === 'P' && rideStatus() === 'inRide' && (
            <Container border="primary" justify="flex-end" align="flex-start">
              <Container row padding={20}>
                <Container align="flex-start" row>
                  <Avatar
                    small
                    source={{
                      uri: `https://graph.facebook.com/${ride?.driver.fbId}/picture?type=large&access_token=${ride?.driver.accessToken}`,
                    }}
                  />
                  <Spacer width="10px" />

                  <Container align="flex-start">
                    <SubTitle bold>
                      {ride?.driver.nome} ({ride?.info.distance.text})
                    </SubTitle>
                    <SubTitle
                      small>{`${ride?.car.placa} - ${ride?.car.marca}, ${ride?.car.modelo} - ${ride?.car.cor}`}</SubTitle>
                  </Container>
                </Container>
                <VerticalSeparator />
                <Container padding={5} width={120}>
                  <Title>R$ {ride?.info.price}</Title>
                  <SubTitle bold color="primary">
                    Aprox. {ride?.info.duration.text}
                  </SubTitle>
                </Container>
              </Container>
              <Button type="muted">
                <ButtonText>Cancelar Corrida</ButtonText>
              </Button>
            </Container>
          )}

          {/* MOTORISTA SEM CORRIDA */}
          {user.tipo === 'M' && rideStatus() === 'empty' && (
            <Container>
              <SubTitle>Olá, Juliana.</SubTitle>
              <Title>Procurando corrida...</Title>
            </Container>
          )}

          {/* MOTORISTA ESTÁ EM CORRIDA */}
          {user.tipo === 'M' && ride?.info && (
            <Container border="primary" justify="flex-end" align="flex-start">
              <Container row padding={20}>
                <Container align="flex-start" row>
                  <Avatar
                    small
                    source={{
                      uri: `https://graph.facebook.com/${ride?.user?.fbId}/picture?type=large&access_token=${ride?.user?.accessToken}`,
                    }}
                  />
                  <Spacer width="10px" />

                  <Container align="flex-start">
                    <Container justify="flex-start" height={20} row>
                      <Bullet />
                      <SubTitle small numberOfLines={1}>
                        {' '}
                        {ride?.info.start_address}
                      </SubTitle>
                    </Container>
                    <Container justify="flex-start" height={20} row>
                      <Bullet destination />
                      <SubTitle small numberOfLines={1}>
                        {' '}
                        {ride?.info.end_address}
                      </SubTitle>
                    </Container>
                  </Container>
                  <Spacer width="10px" />
                </Container>
                <VerticalSeparator />
                <Container padding={5} width={100}>
                  <Title small>R$ {ride?.info.price}</Title>
                  <SubTitle bold small color="primary">
                    Aprox. {ride?.info.duration_text}
                  </SubTitle>
                </Container>
              </Container>
              <Button
                onPress={() => rideAccept()}
                type={rideStatus() !== 'inRide' ? 'primary' : 'muted'}>
                <ButtonText>
                  {rideStatus() !== 'inRide'
                    ? 'Aceitar Corrida'
                    : 'Cancelar Corrida'}
                </ButtonText>
              </Button>
            </Container>
          )}
        </Container>
      </Container>
    </Container>
  );
};

export default Home;
