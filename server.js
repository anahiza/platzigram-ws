'use strict'

const http = require('http')
const socketio = require('socket.io')
const r = require('rethinkdb')
const config = require('./config')

const server = http.createServer()
const io = socketio(server)

const port = process.env.PORT||5151

r.connect(config.db, (err, conn)=>{
  if (err) return console.log(err.message)
  r.table('images').changes().run(conn, (err, cursor) => {
     if (err) return console.log(err.message)
      cursor.on('data', data =>{
        let image = data.new_val
        if (image.publicId != null){
          io.sockets.emmit('image', image)
        }

      })
  })
})

server.listen(port, () => console.log(`listening on port ${port}`))
