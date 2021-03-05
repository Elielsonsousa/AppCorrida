import OAuthManager from 'react-native-social-login';

const social = new OAuthManager('corridaApp');

social.configure({ 
  facebook: {
    client_id: '470207741024453',
    client_secret: '25e853ec0f09031037539d7451a106dd',
  },
});

export default social;
