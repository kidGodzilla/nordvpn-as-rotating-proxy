# NordVPN as a Rotating Proxy
Use NordVPN as a rotating proxy for light web scraping

## Build & Install NordVPN Proxy

1. Install the NordVPN for Linux package from source, here: https://github.com/kidGodzilla/nordvpn (do not use prebuilt binaries, this source has been modified). You will also need to `apt-get install openvpn` if you don't already have it.
2. Run `nordvpn` once to set everything up (you just need your username & password)
3. Set up a `crontab -e` for:

```
*/5 * * * * killall -q -o 4m openvpn & sudo /usr/local/bin/nordvpn
```

## Setup this repo

1. Clone this repo
2. `npm install` to install
3. `pm2 start index.js` to start index.js
4. `pm2 save` to save settings

## Setup IP Tables

See: https://unix.stackexchange.com/questions/391364/how-do-i-route-only-outgoing-traffic-over-an-openvpn-client

1. Get your default gateway: `ip r | grep ^def`
2. Setup iptables for ports 80,443,22: `iptables -t mangle -A OUTPUT -p tcp -m multiport --sports 80,443,22 -j MARK --set-mark 10`
3. Setup the following routes:

```
# add new routing table 100 and set its default routing to your default gw
ip route add table 100 default via $DEFAULT_GW

# add rule to use the new table for packets marked 10
ip rule add fwmark 10 table 100

# flush routing cache
ip route flush cache
```

## Check your IP

```
curl https://api.mr365.co/whatismyip
```

## Testing proxy rotation

```
killall openvpn && nordvpn &
```

(press enter when finished)

## Usage

Now that setup is complete, you can proxy requests through the built-in node request pipe (powered by Superagent)

Example:

```
https://example.com/pipe?url=google.com
```


