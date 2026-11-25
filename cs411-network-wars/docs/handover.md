# TeamX Handover Document: Lagoon View Hotel Network

CS411 Computer Networks, Project 3 (Network Wars), Session 1. Prepared by Team X.

## 1. Business Description

Our network is for Lagoon View Hotel, a 40-room hotel. The ground floor has the front desk, a restaurant and a bar. Reception and back-office staff use computers to check guests in and out, and there are payment (POS) terminals at the restaurant, the bar and the front desk. Guests get free internet in the rooms and the lobby. The hotel also has a manager's office and a small server room.

We split the network into separate segments. Hotel guests should not be able to see the payment terminals or the reservation system. The POS terminals should only talk to the reservation server, which they use to post restaurant and bar bills to a guest's room.

| Area | Router | Devices |
| --- | --- | --- |
| Front desk, restaurant, bar and guest rooms | R2 | 3 staff PCs, 3 POS terminals, 2 guest laptops |
| Manager's office | R1 | Manager PC, Admin PC |
| Server room | R3 | Web/DNS server, Reservation server |

No passwords are set on any router or switch (no enable secret, console or VTY password).

## 2. Network Topology

[Insert screenshot of the Packet Tracer topology here]

The three routers (Cisco 2911) are connected in a triangle, so there are two possible paths between any two routers. R2 does the inter-VLAN routing for the front of house using subinterfaces (router-on-a-stick). All switches are Cisco 2960.

| Link | Device A | Device B | Cable type |
| --- | --- | --- | --- |
| R1 to R2 | R1 Gi0/1 | R2 Gi0/1 | Copper cross-over |
| R1 to R3 | R1 Gi0/2 | R3 Gi0/2 | Copper cross-over |
| R2 to R3 | R2 Gi0/2 | R3 Gi0/1 | Copper cross-over |
| R1 to SW4 | R1 Gi0/0 | SW4 Gi0/1 | Straight-through |
| R2 to SW1 | R2 Gi0/0 | SW1 Gi0/1 | Straight-through |
| R3 to SW3 | R3 Gi0/0 | SW3 Gi0/1 | Straight-through |
| SW1 to SW2 | SW1 Gi0/2 | SW2 Gi0/1 | Copper cross-over |

End devices are connected to the switch ports listed in the IP addressing table in section 3.

## 3. IP Addressing Plan

All LANs use /24 subnets with the router as .1. The links between routers use /30 subnets. Every device uses 192.168.50.10 as its DNS server.

### 3.1 Networks

| Network | Used for | Default gateway |
| --- | --- | --- |
| 192.168.10.0/24 | VLAN 10 Staff | 192.168.10.1 (R2 Gi0/0.10) |
| 192.168.20.0/24 | VLAN 20 POS | 192.168.20.1 (R2 Gi0/0.20) |
| 192.168.30.0/24 | VLAN 30 Guests (DHCP from R2, addresses .100 to .254) | 192.168.30.1 (R2 Gi0/0.30) |
| 192.168.40.0/24 | Management LAN | 192.168.40.1 (R1 Gi0/0) |
| 192.168.50.0/24 | Server LAN | 192.168.50.1 (R3 Gi0/0) |
| 10.0.12.0/30 | Link R1 to R2 | - |
| 10.0.13.0/30 | Link R1 to R3 | - |
| 10.0.23.0/30 | Link R2 to R3 | - |

### 3.2 Router interfaces

| Router | Interface | IP address | Mask | Connected to |
| --- | --- | --- | --- | --- |
| R1 | Gi0/0 | 192.168.40.1 | 255.255.255.0 | SW4 |
| R1 | Gi0/1 | 10.0.12.1 | 255.255.255.252 | R2 |
| R1 | Gi0/2 | 10.0.13.1 | 255.255.255.252 | R3 |
| R2 | Gi0/0 | no IP address | - | SW1 (trunk) |
| R2 | Gi0/0.10 | 192.168.10.1 | 255.255.255.0 | VLAN 10 |
| R2 | Gi0/0.20 | 192.168.20.1 | 255.255.255.0 | VLAN 20 |
| R2 | Gi0/0.30 | 192.168.30.1 | 255.255.255.0 | VLAN 30 |
| R2 | Gi0/1 | 10.0.12.2 | 255.255.255.252 | R1 |
| R2 | Gi0/2 | 10.0.23.1 | 255.255.255.252 | R3 |
| R3 | Gi0/0 | 192.168.50.1 | 255.255.255.0 | SW3 |
| R3 | Gi0/1 | 10.0.23.2 | 255.255.255.252 | R2 |
| R3 | Gi0/2 | 10.0.13.2 | 255.255.255.252 | R1 |

### 3.3 End devices and servers

All masks are 255.255.255.0.

| Device | Location | Connected to | VLAN | IP address | Default gateway |
| --- | --- | --- | --- | --- | --- |
| Staff-PC1 | Front desk | SW1 Fa0/1 | 10 | 192.168.10.11 | 192.168.10.1 |
| Staff-PC2 | Front desk | SW1 Fa0/2 | 10 | 192.168.10.12 | 192.168.10.1 |
| Staff-PC3 | Back office | SW2 Fa0/1 | 10 | 192.168.10.13 | 192.168.10.1 |
| POS1 | Restaurant | SW1 Fa0/11 | 20 | 192.168.20.11 | 192.168.20.1 |
| POS2 | Bar | SW1 Fa0/12 | 20 | 192.168.20.12 | 192.168.20.1 |
| POS3 | Front desk | SW2 Fa0/11 | 20 | 192.168.20.13 | 192.168.20.1 |
| Guest-Laptop1 | Guest room | SW2 Fa0/21 | 30 | DHCP | DHCP |
| Guest-Laptop2 | Lobby | SW2 Fa0/22 | 30 | DHCP | DHCP |
| Manager-PC | Manager's office | SW4 Fa0/1 | 1 | 192.168.40.11 | 192.168.40.1 |
| Admin-PC | Manager's office | SW4 Fa0/2 | 1 | 192.168.40.12 | 192.168.40.1 |
| SRV-WEB | Server room | SW3 Fa0/1 | 1 | 192.168.50.10 | 192.168.50.1 |
| SRV-RES | Server room | SW3 Fa0/2 | 1 | 192.168.50.20 | 192.168.50.1 |

SRV-WEB hosts the hotel website and runs DNS. The DNS record www.lagoonview.local points to 192.168.50.10. SRV-RES is the reservation server (bookings and room bills).

## 4. VLAN List

The VLANs are created on SW1 and SW2. Both switches are in VTP transparent mode, so each one has its VLANs configured locally. SW3 and SW4 only use the default VLAN 1.

| VLAN ID | Name | Subnet | Ports on SW1 | Ports on SW2 |
| --- | --- | --- | --- | --- |
| 10 | STAFF | 192.168.10.0/24 | Fa0/1, Fa0/2 | Fa0/1 |
| 20 | POS | 192.168.20.0/24 | Fa0/11, Fa0/12 | Fa0/11 |
| 30 | GUESTS | 192.168.30.0/24 | none | Fa0/21, Fa0/22 |

Trunk links (802.1Q, native VLAN 1). On both trunks the allowed VLANs are 10, 20 and 30:

- SW1 Gi0/1 to R2 Gi0/0
- SW1 Gi0/2 to SW2 Gi0/1

## 5. Routing

All three routers use OSPF process 1, and everything is in area 0. We kept the default OSPF timers and the default interface costs, so every link has cost 1 because they are all Gigabit. We did not use any static or default routes.

| Router | Router ID | Networks in OSPF | Passive interfaces |
| --- | --- | --- | --- |
| R1 | 1.1.1.1 | 192.168.40.0/24, 10.0.12.0/30, 10.0.13.0/30 | Gi0/0 |
| R2 | 2.2.2.2 | 192.168.10.0/24, 192.168.20.0/24, 192.168.30.0/24, 10.0.12.0/30, 10.0.23.0/30 | Gi0/0.10, Gi0/0.20, Gi0/0.30 |
| R3 | 3.3.3.3 | 192.168.50.0/24, 10.0.23.0/30, 10.0.13.0/30 | Gi0/0 |

When the network is working correctly:

- Each router has 2 OSPF neighbours in FULL state.
- Each routing table has all 8 networks (5 LANs and 3 router links).
- Traffic between two routers goes over the direct link between them. If that link goes down, it goes through the third router instead.

## 6. Access Policy

1. Guests (VLAN 30) can only reach the hotel Web server (192.168.50.10) for ping, HTTP and DNS. They can also ping their own gateway and get an address by DHCP. They cannot reach anything else, including the Reservation server.
2. POS terminals (VLAN 20) can only start connections to the Reservation server (192.168.50.20) and ping their own gateway. They can reply to pings from Staff and Management so the terminals can be monitored.
3. Staff (VLAN 10) and the Management LAN can reach Staff, POS, Management and both servers.
4. No other segment can connect to devices in the Guest VLAN.

The policy is enforced with two named extended ACLs on R2, both applied inbound:

- GUEST-IN on Gi0/0.30 (rules 1 and 4)
- POS-IN on Gi0/0.20 (rule 2)

The ACLs should contain these entries in this order:

```
ip access-list extended GUEST-IN
 permit udp any any eq bootps
 permit icmp 192.168.30.0 0.0.0.255 host 192.168.30.1
 permit icmp 192.168.30.0 0.0.0.255 host 192.168.50.10
 permit tcp 192.168.30.0 0.0.0.255 host 192.168.50.10 eq www
 permit udp 192.168.30.0 0.0.0.255 host 192.168.50.10 eq domain
 deny ip any any

ip access-list extended POS-IN
 permit icmp 192.168.20.0 0.0.0.255 host 192.168.20.1
 permit ip 192.168.20.0 0.0.0.255 host 192.168.50.20
 permit icmp 192.168.20.0 0.0.0.255 any echo-reply
 deny ip any any
```

## 7. Expected Network Behaviour

These are the results we got on our working network. The first ping sometimes times out because of ARP, so try again before deciding a test failed.

| Test | From | To | Expected result |
| --- | --- | --- | --- |
| 1 | All Staff PCs | SRV-RES, SRV-WEB, Manager-PC | Ping succeeds |
| 2 | Staff-PC1 | POS1, POS2, POS3 | Ping succeeds |
| 3 | Manager-PC, Admin-PC | Staff PCs, POS terminals, both servers | Ping succeeds |
| 4 | All POS terminals | SRV-RES (192.168.50.20) | Ping succeeds |
| 5 | All POS terminals | Own gateway, other POS terminals | Ping succeeds |
| 6 | All POS terminals | SRV-WEB, Staff PCs, Manager-PC | Ping fails (rule 2) |
| 7 | Guest laptops | DHCP | Get an address from 192.168.30.100 upwards, gateway 192.168.30.1, DNS 192.168.50.10 |
| 8 | Guest laptops | SRV-WEB | Ping succeeds, and the web page http://www.lagoonview.local opens |
| 9 | Guest laptops | SRV-RES, POS, Staff PCs, Manager-PC | Ping fails (rule 1) |
| 10 | Staff-PC1 or Manager-PC | Guest laptop | Ping fails (rule 4) |
| 11 | Staff-PC1 | tracert 192.168.50.20 | 192.168.10.1, 10.0.23.2, 192.168.50.20 |
| 12 | Manager-PC | tracert 192.168.10.11 | 192.168.40.1, 10.0.12.2, 192.168.10.11 |

Useful commands for checking the routers and switches:

- show ip interface brief (all interfaces in use should be up/up)
- show ip ospf neighbor (2 neighbours on every router)
- show ip route (8 networks on every router)
- show access-lists (on R2)
- show vlan brief and show interfaces trunk (on SW1 and SW2)
