const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const generate = require('gerador-validador-cpf').generate;

const user = new Schema({
  fbId: { type: String, required: true },
  nome: { type: String, required: true },
  email: { type: String, required: true },
  cpf: {// retorna um cpf aleatorio, modificar depois
    type: String,
    default: () => {
      return generate();
    },
  },
  tipo: {//só aceita esses 2 tipos
    type: String,
    enum: ['M', 'P'],
    required: true,
  },
  accessToken: { type: String, required: true },
  recipientId: {//cadastra/pede o cartão p o motorista receber
    type: String,
    required: function () {
      return this.tipo === 'M';
    },
  },
  location: {// faz com que o Mongoose faça uma pesquisa por aproximação
    type: { type: String },
    coordinates: [],
  },
  socketId: String,
  dataCadastro: {
    type: Date,
    default: Date.now(),
  },
});

user.index({ location: '2dsphere' });

module.exports = mongoose.model('User', user);
