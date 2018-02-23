const axios = require('axios')
const fs = require('fs')

// Caminho do arquivo que serão salvos os dados
const path_file = 'C:\\temp\\fipe.txt'

// Instancia axios com as configurações da requisição http
const http = axios.create({
  baseURL: 'http://fipeapi.appspot.com/api/1/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'application/json'}
})

// Recupera todas as marcas.
async function getMarcas () {
  return new Promise((resolve, reject) => {
    http.get('/carros/marcas.json')
    .then(function (response) {
      resolve(response)
    })
    .catch(function (error) {
      reject(error)
    });
  })  
}

// Recupera todos os veículos
async function getVeiculos (idMarca) {
  return new Promise((resolve, reject) => {
    http.get(`/carros/veiculos/${idMarca}.json`)
    .then(function (response) {
      resolve(response)
    })
    .catch(function (error) {
      reject(error)
    });
  })
}

// Cria arquivo com as configurações de cabeçalho que será salvo os dados
function createFile () {
  fs.writeFile(path_file, "name;fipe_name;order;key;id;fipe_marca;name;marca;key;id;fipe_name", function(erro) {
    if(erro) {
      throw erro;
    }
  })
}

// Adiciona novo registro no arquivo
function appendFile (marca, veiculo) {
  let registro = `${marca.name};${marca.fipe_name};${marca.order};${marca.key};${marca.id};${veiculo.fipe_marca};${veiculo.name};
    ${veiculo.marca};${veiculo.key};${veiculo.id};${veiculo.fipe_name}`
  fs.appendFile(path_file, `\r\n${registro}`, function(erro) {
    if (erro) {
      throw erro;
    }    
  })    
}

// Função de inicialização
async function main () {
  console.log("importação inicializada " + new Date())
  try {
    createFile()
    let resMarca = await getMarcas()
    if (resMarca.status === 200) {
      for (let marca of resMarca.data) {
        let resVeiculo = await getVeiculos(marca.id)
        if (resVeiculo.status === 200) {
          for (let veiculo of resVeiculo.data) {
            appendFile(marca, veiculo)
          }
        }
      }
      console.log("importação concluída " + new Date())
    }  
  } catch (error) {
    console.log(error.message)
  }
}

// Inicio
main()




