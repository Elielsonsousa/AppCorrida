const server = require('./index');

server.set('port', process.env.PORT || 8000);

server.listen(server.get('port'), () => {
    console.log('Servidor rodando na porta => ' + server.get('port'));
});