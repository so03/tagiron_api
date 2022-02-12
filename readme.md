TODO  
- deploy auto re-build, run

Cloud Server
```
ssh dev-mine-ec2-user
```

Docker build
```
docker build . -t tagiron-api
```

Docker run
```
docker run --rm -p 3000:3000 tagiron-api
```

Docker run (for production)
```
sudo docker run --rm -d -p 80:3000 tagiron-api
```

Docker exec (コンテナに入る)
```
docker exec -it <container id> bash
```


Run
```
yarn serve
```

Test
```
yarn test
```


POST /players
```
curl -X POST localhost:3000/players -d '{ "name": "sasaki" }' -H 'Content-Type: application/json' --verbose
```

POST /init
```
curl -X POST localhost:3000/players -d '{ "name": "sasaki" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/players -d '{ "name": "sawada" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/players -d '{ "name": "sakai" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/players -d '{ "name": "saeki" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/init -H 'Content-Type: application/json' --verbose
```

GET /game
```
uuid=$(curl -sb -X POST localhost:3000/players -d '{ "name": "sasaki" }' -H 'Content-Type: application/json' --verbose | jq '.uuid' | sed 's/"//g' | awk '{print $1}') &&
curl -X POST localhost:3000/players -d '{ "name": "sawada" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/players -d '{ "name": "sakai" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/players -d '{ "name": "saeki" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/init -H 'Content-Type: application/json' --verbose
curl localhost:3000/game -H 'Content-Type: application/json' -H "Authorization: uuid $uuid" --verbose
```

POST /declare
```
uuid=$(curl -sb -X POST localhost:3000/players -d '{ "name": "sasaki" }' -H 'Content-Type: application/json' --verbose | jq '.uuid' | sed 's/"//g' | awk '{print $1}') &&
curl -X POST localhost:3000/players -d '{ "name": "sawada" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/players -d '{ "name": "sakai" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/players -d '{ "name": "saeki" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/init -H 'Content-Type: application/json' --verbose
curl -X POST localhost:3000/declare -d \
'{ "cards": [{ "number": 1, "color": "red" }, { "number": 2, "color": "red" }, { "number": 3, "color": "red" }, { "number": 4, "color": "red" }]}' \
-H 'Content-Type: application/json' -H "Authorization: uuid $uuid" --verbose
```

GET /result
```
uuid=$(curl -sb -X POST localhost:3000/players -d '{ "name": "sasaki" }' -H 'Content-Type: application/json' --verbose | jq '.uuid' | sed 's/"//g' | awk '{print $1}') &&
curl -X POST localhost:3000/players -d '{ "name": "sawada" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/players -d '{ "name": "sakai" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/players -d '{ "name": "saeki" }' -H 'Content-Type: application/json' --verbose &&
curl -X POST localhost:3000/init -H 'Content-Type: application/json' --verbose
curl -X POST localhost:3000/declare -d \
'{ "cards": [{ "number": 1, "color": "red" }, { "number": 2, "color": "red" }, { "number": 3, "color": "red" }, { "number": 4, "color": "red" }]}' \
-H 'Content-Type: application/json' -H "Authorization: uuid $uuid" --verbose
curl localhost:3000/result \
-H 'Content-Type: application/json' --verbose
```

GET /valid
valid example
```
curl localhost:3000/valid -H 'Content-Type: application/json' -H 'Authorization: uuid test-uuid' --verbose
```
invalid example
```
curl localhost:3000/valid -H 'Content-Type: application/json' -H 'Authorization: uuid hogehoge' --verbose
```