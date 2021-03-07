const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.pagar.me/1',
});

const api_key = require('../data/keys.json').api_key;

module.exports = {
  createRecipient: async (data) => {//nesse caso essa seria a conta do motorista
    try {
      const response = await api.post('/recipients', {
        api_key,
        bank_account: {
          bank_code: '323',
          agencia: '000',
          agencia_dv: '1',
          conta: '2820277527',
          type: 'conta_corrente',
          conta_dv: '3',
          document_number: '10294192484',
          legal_name: data.name,
        },
        register_information: {
          type: 'corporation',
          document_number: '23780123000198',
          company_name: data.name,
          email: data.email,
          site_url: 'http://www.site.com',
          phone_numbers: [
            {
              ddd: '81',
              number: '996451629',
              type: 'mobile',
            },
          ],
        },
      });

      console.log(response.data + "retorno do pagar.e");
      return { error: false, data: response.data };
    } catch (err) {
      return { error: true, message: err.message + " erro do pagar.me" };
    }
  },
  createCreditCard: async (data) => {//aqui pega o cartão do passageiro
    try {
      const response = await api.post('/cards', {
        api_key,
        ...data,
      });

      return { error: false, data: response.data };
    } catch (err) {
      alert("Erro ao cadastrar cartão" + err)
      return { error: true, message: err.message };
    }
  },
  createSplitTransaction: async (data) => {
    try {
      const response = await api.post('/transactions', {
        api_key,
        ...data,
      });
      return { error: false, data: response.data };
    } catch (err) {
      return { error: true, message: err.message };
    }
  },
};
