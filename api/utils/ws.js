// const { verifyToken } = require('../models/verification')
// const { updateUserInformation } = require('../models/register_model')
const express = require('express')
const SocketServer = require('ws').Server
const WebSocket = require('ws')
const PORT = 3500



const server = express().listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})

const wss = new SocketServer({ server })

wss.on('connection', (ws, req) => {
  // let userInfo = {}
  // if(req.url){
  //   const token = req.url.split('=')[1];
  //   verifyToken(token, true).then(tokenResult => {
  //     if (tokenResult.success === true) {
  //       userInfo = tokenResult.userInfo
  //       updateUserInformation(userInfo.id, { online: 2 })
  //     }
  //   })
  // }

  ws.on('message', data => {
    let clients = wss.clients
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        // const ip = req.socket.remoteAddress;
        client.send(data.toString());
      }
    })
  })

  // 當連線關閉
  ws.on('close', () => {
    // updateUserInformation(userInfo.id, { online: 0 })
  })
})