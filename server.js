
var tg = require('telegram-node-bot')('200079124:AAEtwa2GsbLJki_gnJxV4ppdNDNcpI_TlQA');
var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var phone;
var codigo;
var send;
var login;
var nombre;
var apellido;
var balance;
var id;

tg.router.
  when(['/login'], 'loginController').
  when(['/codigo :code'], 'codigoController').
  when(['/enviar'], 'enviarController').
  when(['/saldo'], 'saldoController').
  when(['/helper'], 'helperController').
  when(['/registro'], 'registroController').
  when(['/salir'], 'salirController')

  tg.controller('loginController', (res) => {
    tg.for('/login', (res) => {
      res.sendMessage('Como va todo? dame tu numero para enviarte un codigo!');
      res.waitForRequest((res) => {
        phone = res.message.text;
        var info = JSON.stringify({
                      "phone": phone
                    });
        request.post({
              type: "POST",
              url: 'http://api.minka.io:8081/telegram/code',
              headers: {
                "content-type": "application/json",
              },
              body: info,
              dataType: 'json'
            }, function(err, response, body){
              var datos = JSON.parse(body);
              if(err){
                console.log(err);
              }else if(datos.verificadoPhone){
                send = true;
                res.sendMessage('gracias por darme tu numero '+ phone +', te envie un codigo, ingresalo con el comando /codigo ej: /codigo 1234');
              }else{
                send = false;
                res.sendMessage('lo siento ese numero no esta registrado, por fa registrate y vuelve :c');
              }
            });
      })
    })
  })

  tg.controller('enviarController', ($) =>{
    tg.for('/enviar', ($) =>{
      if(login == true){
        var form = {
          valor: {
              q: 'Cuanto vas a enviar',
              error: 'Lo siento, ingresaste un valor incorrecto',
              validator: (input, callback) => {
                  if(input['text']) {
                      callback(true)
                      return
                  }
                  callback(false)
              }
          },
          phoneReceive: {
              q: 'A cual numero vas a enviar',
              error: 'Lo siento, ingresaste un valor incorrecto',
              validator: (input, callback) => {
                  if(input['text']) {
                      callback(true)
                      return
                  }
                  callback(false)
              }
          }
        }
        $.runForm(form, (result) => {
          //$.sendMessage('esta opcion aun no esta disponible! SALUDOS')
          var info = JSON.stringify({
                        "phoneSend": phone,
                        "phoneReceive": result.phoneReceive,
                        "amount": {
                          "currency": "45646514",
                          "value": result.valor
                        }
                      });
                      console.log(info);
          request.post({
                type: "POST",
                url: 'http://api.minka.io:8081/transfer',
                headers: {
                  "content-type": "application/json",
                },
                body: info,
                dataType: 'json'
              }, function(err, response, body){
                var datos = JSON.parse(body);
                if(err){
                  console.log(err)
                }else if(datos != null && datos.status){
                  $.sendMessage('Tu transferencia/pago se realizo con exito, si quieres ejecuta el comando /saldo y mira como quedo tu saldo');
                }else{
                  $.sendMessage('Tu transferencia/pago no se pudo procesar');
                }
              });
          })
      }else{
        $.sendMessage("Aun no te has logueado y si no me dejas saber quien eres no te puedo ayudar :c, dime quien eres con el comando /login");
      }
    })
  })

  tg.controller('registroController', ($) =>{
    tg.for('/registro', ($) =>{
      if(login == true){
        $.sendMessage(nombre + " ya estas logueado como para que quieres registrarte de nuevo -_-");
      }else{
      var form = {
        Nombre: {
            q: 'Dime tu primer nombre?',
            error: 'Lo siento, ingresaste un valor incorrecto',
            validator: (input, callback) => {
                if(input['text']) {
                    callback(true)
                    return
                }
                callback(false)
            }
        },
        Apellido: {
            q: 'Dime tu apellido',
            error: 'Lo siento, ingresaste un valor incorrecto',
            validator: (input, callback) => {
                if(input['text']) {
                    callback(true)
                    return
                }
                callback(false)
            }
        },
        Pais: {
            q: 'Cual es tu pais actual?',
            error: 'Lo siento, ingresaste un valor incorrecto',
            validator: (input, callback) => {
                if(input['text']) {
                    callback(true)
                    return
                }
                callback(false)
            }
        },
        Ciudad: {
            q: 'En que ciudad?',
            error: 'Lo siento, ingresaste un valor incorrecto',
            validator: (input, callback) => {
                if(input['text']) {
                    callback(true)
                    return
                }
                callback(false)
            }
        },
        Direccion: {
            q: 'En que direccion?',
            error: 'Lo siento, ingresaste un valor incorrecto',
            validator: (input, callback) => {
                if(input['text']) {
                    callback(true)
                    return
                }
                callback(false)
            }
        },
        Telefono: {
            q: 'Dime tu numero celular',
            error: 'Lo siento, ingresaste un valor incorrecto',
            validator: (input, callback) => {
                if(input['text']) {
                    callback(true)
                    return
                }
                callback(false)
            }
        },
        Correo: {
            q: 'Dame tu correo',
            error: 'Lo siento, ingresaste un valor incorrecto',
            validator: (input, callback) => {
                if(input['text']) {
                    callback(true)
                    return
                }
                callback(false)
            }
        },
      }
      $.runForm(form, (result) => {
        var info = JSON.stringify({
                    "firstname": result.Nombre,
                    "lastname": result.Apellido,
                    "address": result.Direccion,
                    "city": result.Ciudad,
                    "country": result.Pais,
                    "email": result.Correo,
                    "phone": result.Telefono
                    });
        request.post({
              type: "POST",
              url: 'http://api.minka.io:8081/person',
              headers: {
                "content-type": "application/json",
              },
              body: info,
              dataType: 'json'
            }, function(err, response, body){
              var datos = JSON.parse(body);
              if(err){
                console.log(err)
              }else if(datos != null){
                $.sendMessage(datos.firstname + ' te has registrado en nuestra plataforma, mira con el comando /helper todo lo que puedes hacer');
              }else{
                $.sendMessage('Algo paso en el proceso de registro :c, vuelve a realizar el proceso con el comando /registro');
              }
            });
      })
    }
    })
  })

  tg.controller('codigoController', ($) => {
    tg.for('/codigo :code', ($) => {
      if(send == true){
        codigo = $.query.code;
        var info = JSON.stringify({
                      "phone": phone,
                      "code": codigo
                    });
        request.post({
              type: "POST",
              url: 'http://api.minka.io:8081/telegram/login',
              headers: {
                "content-type": "application/json",
              },
              body: info,
              dataType: 'json'
            }, function(err, response, body){
              var datos = JSON.parse(body);
              if(err){
                console.log(err)
              }else if(datos.verificado && send){
                login = true;
                nombre = datos.nombre;
                apellido = datos.apellido;
                phone = datos.phone;
                balance = datos.balance;
                id = datos.id;
                $.sendMessage(nombre + ' bienvenido al bot de minka ejecuta el comando /helper y mira todo lo que puedes hacer');
              }else{
                $.sendMessage('lo siento algo salio mal vuelve a intentarlo :c');
              }
            });
      }else{
        $.sendMessage('Nosotros no te hemos enviado el codigo, si no se quien eres no te puedo ayudar');
      }
    })
})

tg.controller('helperController', ($) => {
  tg.for('/helper', ($) => {
    $.sendMessage("hola, gracias por contar conmigo\n"+
      "puedes utilizar los siguientes comandos para hablar conmigo\n"+
      "/registro \t crea una cuenta en nuestra app\n"+
      "/login \t\t ingresa a la app\n"+
      "/codigo \t\t verifica el codigo para entrar\n"+
      "/enviar \t envia dinero a otra cuenta\n"+
      "/saldo \t consulta tu saldo\n"+
      "/salir \t salir del sistema\n"+
      "/helper \t menu de comandos\n"+
      "Espero poder ayudarte en todo lo que necesites");
  })
})

tg.controller('saldoController', ($) => {
  tg.for('/saldo', ($) => {
    if(login == true){
      request.get({
            type: "GET",
            url: 'http://api.minka.io:8081/person/'+id+'/balance',
            headers: {
              "content-type": "application/json",
            },
            dataType: 'json'
          }, function(err, response, body){
            var datos = JSON.parse(body);
            var saldo = datos.wallet;
            if(err){
              console.log(err)
            }else if(datos.wallet){
                $.sendMessage(nombre +" tu saldo en estos momentos es de " + saldo.balance + " LUK");
            }
          });
    }else{
      $.sendMessage("Aun no te has logueado y si no me dejas saber quien eres no te puedo ayudar :c, dime quien eres con el comando /login");
    }
  })
})

tg.controller('salirController', ($) => {
  tg.for('/salir', ($) => {
    if(login == true){
      login = false;
      nombre = '';
      apellido = '';
      phone = '';
      balance = '';
      id = '';
      $.sendMessage("Adios, vuelve pronto. att: MinkaBot");
    }else{
      $.sendMessage("Aun no te has logueado y si no me dejas saber quien eres no te puedo ayudar :c, dime quien eres con el comando /login");
    }
  })
})
