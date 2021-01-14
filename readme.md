# Rich Relevance Proxy

Micro serviço que tem como função redirecionar as requisições às funcionalidades da Rich Relevance, evitando os bloqueadores de publicidade.


### Tecnologias utilizadas
```
NodeJS 12.13.0
Redis 5.0.7 
docker-compose
``` 

### Health Check
```
https://rr.usereserva.com/status
```

### Limpeza de cache
O MS carrega as requisições da Rich e armazena as mesmas por 5 min num armazenamento do Redis, essa funcionalidade foi feita unicamente pra evitar a latência de acessar a rich a cada requisição.

Uma funcionalidade que na prática não haverá necessidade de ser usada, mas foi implementada assim mesmo pelo baixo custo da implementação.
```
https://rr.usereserva.com/clear_cache
```

### Desenvolvimento

Requisitos

```
docker
docker-compose
VSCode (opcional para debug)
```

Rodando o micro serviço

```
docker-compose -f docker-compose.dev.yml up
```

É esperado a seguinte resposta no terminal, após o processo de build a imagem:

```
rr-proxy_1  | > rr-proxy@1.0.0 dev /usr/src/app
rr-proxy_1  | > nodemon --inspect=0.0.0.0 src/index.js
rr-proxy_1  |
rr-proxy_1  | [nodemon] 2.0.1
rr-proxy_1  | [nodemon] to restart at any time, enter `rs`
rr-proxy_1  | [nodemon] watching dir(s): *.*
rr-proxy_1  | [nodemon] watching extensions: js,mjs,json
rr-proxy_1  | [nodemon] starting `node --inspect=0.0.0.0 src/index.js`
rr-proxy_1  | Debugger listening on ws://0.0.0.0:9229/102a8893-1cc1-40e3-a0e3-f47af2a71c32
rr-proxy_1  | For help, see: https://nodejs.org/en/docs/inspector
rr-proxy_1  | Running on enviroment DEV*
```

O micro serviço usa o pacote nodemon para auto refresh da aplicação durante o desenvolvimento. A partir desse pode pode-se alterar os código presentes em _./src_ e eles refletiram automaticamente na imagem.

### Produção

- Faça uma cópia (ou renomeie) do arquivo docker-compose.prod.yml renomeando para docker-compose.yml
```
cp docker-compose.prod.yml docker-compose.yml
```

- Verifique se as informações no arquivo _src/config.js_ estão corretas em relação ao acesso ao banco de dados

```
  production: {
    redis: {
      readOnly: {
        host: 'rr-proxy-redis-ro.us3fk3.ng.0001.use2.cache.amazonaws.com'
      },
      write: {
        host: 'rr-proxy-redis.us3fk3.ng.0001.use2.cache.amazonaws.com'
      }
    },
    RR_API_KEY: '1a37b6c52222480d'
  }
```

Estando na pasta raiz do repositório, rode o comando para iniciar o MS

```
docker-compose up
```

### Testes

Rode o comando

```
 docker-compose -f docker-compose.test.yml up
```

Resposta esperada no terminal

```
rr-proxy_1  |
rr-proxy_1  | > rr-proxy@1.0.0 test /usr/src/app
rr-proxy_1  | > ava --verbose
rr-proxy_1  |
rr-proxy_1  |
rr-proxy_1  | Running on enviroment DEV
rr-proxy_1  |   ✔ RichRelevance getting recomendations from generated data (/p13n_generated.js) (395ms)
rr-proxy_1  |   ✔ RichRelevance search + hardcoded params (/search?...) (414ms)
rr-proxy_1  |   ✔ RichRelevance JS Lib p13n.js (428ms)
rr-proxy_1  |   ✔ Health check (438ms)
rr-proxy_1  |
rr-proxy_1  |   4 tests passed
rr-proxy_1  |
rr-proxy_rr-proxy_1 exited with code 0
```

### Testes de performance

Teste simulando 1000 requisições com concorrência de 100 usuários, usando a biblioteca loadtest (testados no Node.js 12.13)

```
npx loadtest -n 1000 -c 100 -k http://localhost:8080/p13n.js

[Tue Dec 10 2019 16:46:54 GMT-0200 (Brasilia Summer Time)] INFO Requests: 0 (0%), requests per second: 0, mean latency: 0 ms
[Tue Dec 10 2019 16:46:58 GMT-0200 (Brasilia Summer Time)] INFO
[Tue Dec 10 2019 16:46:58 GMT-0200 (Brasilia Summer Time)] INFO Target URL:          http://localhost:8080/p13n.js
[Tue Dec 10 2019 16:46:58 GMT-0200 (Brasilia Summer Time)] INFO Max requests:        1000
[Tue Dec 10 2019 16:46:58 GMT-0200 (Brasilia Summer Time)] INFO Concurrency level:   100
[Tue Dec 10 2019 16:46:58 GMT-0200 (Brasilia Summer Time)] INFO Agent:               keepalive
[Tue Dec 10 2019 16:46:58 GMT-0200 (Brasilia Summer Time)] INFO
[Tue Dec 10 2019 16:46:58 GMT-0200 (Brasilia Summer Time)] INFO Completed requests:  1000
[Tue Dec 10 2019 16:46:58 GMT-0200 (Brasilia Summer Time)] INFO Total errors:        0
[Tue Dec 10 2019 16:46:58 GMT-0200 (Brasilia Summer Time)] INFO Total time:          3.9631216910000004 s
[Tue Dec 10 2019 16:46:58 GMT-0200 (Brasilia Summer Time)] INFO Requests per second: 252
[Tue Dec 10 2019 16:46:58 GMT-0200 (Brasilia Summer Time)] INFO Mean latency:        245.1 ms
[Tue Dec 10 2019 16:46:58 GMT-0200 (Brasilia Summer Time)] INFO
[Tue Dec 10 2019 16:46:58 GMT-0200 (Brasilia Summer Time)] INFO Percentage of the requests served within a certain time
[Tue Dec 10 2019 16:46:58 GMT-0200 (Brasilia Summer Time)] INFO   50%      70 ms
[Tue Dec 10 2019 16:46:58 GMT-0200 (Brasilia Summer Time)] INFO   90%      580 ms
[Tue Dec 10 2019 16:46:58 GMT-0200 (Brasilia Summer Time)] INFO   95%      1079 ms
[Tue Dec 10 2019 16:46:58 GMT-0200 (Brasilia Summer Time)] INFO   99%      1574 ms
[Tue Dec 10 2019 16:46:58 GMT-0200 (Brasilia Summer Time)] INFO  100%      3495 ms (longest request)
```
