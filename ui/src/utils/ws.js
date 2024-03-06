let ws = null

function createWs(token){
    let url = 'ws://localhost:3500?token=' + token
    ws = new WebSocket(url)
    return ws
}

function getWs(){
    return ws
}

export { createWs , getWs }