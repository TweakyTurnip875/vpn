const openvpn = require("node-openvpn")
const http = require('http');

p = 1337;
h = '127.0.0.1'


const vpnStart = () => {
  console.log(1)
  const opts = {
    host: h,
    port: p,
    timeout: 1500
  }
  const auth = {
    user: process.env.vpnuser,
    pass: process.env.vpnpass
  }

  const vpn = openvpn.connect(opts)

  vpn.on('connected', () => {
    console.log("\n--- vpn authorized ---")
    openvpn.authorize(auth)
  })

  vpn.on('console-output', out => {
    console.log(out)
  })

  vpn.on('state-change', state => {
    console.log(state)
  })
  vpn.on('error', err => {
    console.log(err)
  })

  //vpn.getLog(console.log)

  //openvpn.disconnect()

  vpn.on('disconnected', () => {
    console.log("disconnected...")
    openvpn.destroy();
  })
}

const reqListener = (req, res) => {
  res.writeHead(200)
  res.end(vpnStart())
}

const templateServer = http.createServer(reqListener);
templateServer.listen(p, h, () => {
  console.log("--- connected to server ---")
  console.log(`port: ${p}\nhost: ${h}`)

})

