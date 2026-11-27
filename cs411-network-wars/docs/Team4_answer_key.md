# Team4 Answer Key: Lagoon View Hotel Network

CS411 Computer Networks, Project 3 (Network Wars), Session 1. Prepared by Team 4. Confidential, for the instructor only.

## 1. Summary of Faults

We made a copy of Team4_working.pkt and added six faults to it to make Team4_broken.pkt. Each fault is on a different device. Faults 1 and 4 both affect POS terminals and look similar, but they have different causes.

| No. | Category | Device | What we changed | Symptom |
| --- | --- | --- | --- | --- |
| 1 | Layer 1/2 | SW2 Fa0/11 | Access VLAN changed from 20 to 30 | POS3 cannot reach its gateway or any other device |
| 2 | Layer 1/2 | SW1 Gi0/2 | VLAN 10 removed from the trunk allowed list | Staff-PC3 cannot reach anything; Staff-PC1 and Staff-PC2 work |
| 3 | Layer 3 | R1 | OSPF network statement for 192.168.40.0 removed | Management LAN cannot be reached from other networks |
| 4 | Layer 3 | POS2 | Default gateway changed to 192.168.20.254 | POS2 can only reach devices in its own VLAN |
| 5 | Security | R2 ACL GUEST-IN | Web server rules replaced with a permit for the whole server subnet | Guests can reach the Reservation server |
| 6 | Open | R3 Gi0/1 | OSPF hello interval changed to 5 seconds | R2 and R3 are no longer OSPF neighbours, but traffic still gets through via R1 |

## 2. Layer 1 and 2 Faults

### Fault 1: Wrong access VLAN for POS3

Change: On SW2, interface Fa0/11 was put in VLAN 30 instead of VLAN 20.

```
SW2(config)# interface FastEthernet0/11
SW2(config-if)# switchport access vlan 30
```

Symptom: POS3 (192.168.20.13) at the front desk cannot ping its gateway 192.168.20.1, the other POS terminals or SRV-RES. The port is up, so the cable looks fine. POS1 and POS2 still work.

How to find it: show vlan brief on SW2 lists Fa0/11 under VLAN 30 (GUESTS). The handover says Fa0/11 should be in VLAN 20.

Correction:

```
SW2(config)# interface FastEthernet0/11
SW2(config-if)# switchport access vlan 20
```

Check: show vlan brief shows Fa0/11 in VLAN 20, and POS3 can ping 192.168.50.20.

### Fault 2: VLAN 10 missing from the trunk between SW1 and SW2

Change: On SW1, VLAN 10 was removed from the allowed list on Gi0/2.

```
SW1(config)# interface GigabitEthernet0/2
SW1(config-if)# switchport trunk allowed vlan 20,30
```

Symptom: Staff-PC3 in the back office (on SW2) cannot ping its gateway 192.168.10.1 or anything else. Staff-PC1 and Staff-PC2 on SW1 work. POS3 and the guest laptops on SW2 still use the same trunk, so the link itself is up.

How to find it: show interfaces trunk on SW1 shows only VLANs 20 and 30 allowed on Gi0/2, while SW2 Gi0/1 allows 10, 20 and 30. The handover says both trunks allow 10, 20 and 30.

Correction:

```
SW1(config)# interface GigabitEthernet0/2
SW1(config-if)# switchport trunk allowed vlan 10,20,30
```

Check: show interfaces trunk on SW1 shows 10, 20 and 30 on Gi0/2, and Staff-PC3 can ping 192.168.50.20.

## 3. Layer 3 Faults

### Fault 3: Missing OSPF network statement on R1

Change: The Management LAN was removed from OSPF on R1.

```
R1(config)# router ospf 1
R1(config-router)# no network 192.168.40.0 0.0.0.255 area 0
```

Symptom: Manager-PC and Admin-PC can ping each other and their gateway 192.168.40.1, but they cannot reach anything past R1. No other network can reach 192.168.40.0/24. All OSPF neighbours are still FULL, so OSPF looks fine at first.

How to find it: show ip route on R2 and R3 has no route to 192.168.40.0/24, so there are 7 networks instead of 8. On R1, show ip protocols lists only the two /30 networks under "Routing for Networks".

Correction:

```
R1(config)# router ospf 1
R1(config-router)# network 192.168.40.0 0.0.0.255 area 0
```

Check: R2 and R3 show an O route for 192.168.40.0/24, and Manager-PC can ping 192.168.10.11 and 192.168.50.20.

### Fault 4: Wrong default gateway on POS2

Change: On POS2 (the bar), Desktop > IP Configuration, the default gateway was changed from 192.168.20.1 to 192.168.20.254.

Symptom: POS2 can still ping 192.168.20.1 and POS1 because they are in the same subnet and no gateway is needed. It cannot reach SRV-RES. It looks like the same problem as POS3 in Fault 1, but the cause is different.

How to find it: ipconfig on POS2 shows the gateway as 192.168.20.254, but the handover says 192.168.20.1. tracert 192.168.50.20 from POS2 gets no reply from the first hop.

Correction: On POS2, Desktop > IP Configuration, set the default gateway back to 192.168.20.1.

Check: POS2 can ping 192.168.50.20, and tracert shows 192.168.20.1 as the first hop.

## 4. Security Fault

### Fault 5: Guest ACL allows the whole server subnet

Change: GUEST-IN on R2 was deleted and created again. The three rules for the Web server were replaced by one rule that permits the whole 192.168.50.0/24 subnet.

```
R2(config)# no ip access-list extended GUEST-IN
R2(config)# ip access-list extended GUEST-IN
R2(config-ext-nacl)# permit udp any any eq bootps
R2(config-ext-nacl)# permit icmp 192.168.30.0 0.0.0.255 host 192.168.30.1
R2(config-ext-nacl)# permit ip 192.168.30.0 0.0.0.255 192.168.50.0 0.0.0.255
R2(config-ext-nacl)# deny ip any any
```

Symptom: Everything guests should be able to do still works, so nothing looks broken. But a guest laptop can ping the Reservation server 192.168.50.20, which goes against policy rule 1.

How to find it: Ping 192.168.50.20 from a guest laptop succeeds, but test 9 in the handover says it should fail. show access-lists on R2 shows the line permit ip 192.168.30.0 0.0.0.255 192.168.50.0 0.0.0.255 instead of the host rules listed in the handover.

Correction:

```
R2(config)# no ip access-list extended GUEST-IN
R2(config)# ip access-list extended GUEST-IN
R2(config-ext-nacl)# permit udp any any eq bootps
R2(config-ext-nacl)# permit icmp 192.168.30.0 0.0.0.255 host 192.168.30.1
R2(config-ext-nacl)# permit icmp 192.168.30.0 0.0.0.255 host 192.168.50.10
R2(config-ext-nacl)# permit tcp 192.168.30.0 0.0.0.255 host 192.168.50.10 eq www
R2(config-ext-nacl)# permit udp 192.168.30.0 0.0.0.255 host 192.168.50.10 eq domain
R2(config-ext-nacl)# deny ip any any
```

The ip access-group GUEST-IN in command is still on Gi0/0.30, so the new list takes effect straight away.

Check: A guest ping to 192.168.50.20 fails. A guest can still ping 192.168.50.10 and open http://www.lagoonview.local.

## 5. Open Category Fault

### Fault 6: OSPF hello timer mismatch hidden by the redundant path

Change: On R3, the OSPF hello interval on the link to R2 was changed to 5 seconds. R2 stays at the default 10 seconds. (Packet Tracer 8.2.2 leaves R3's dead interval at 40, so only the hello timers differ.)

```
R3(config)# interface GigabitEthernet0/1
R3(config-if)# ip ospf hello-interval 5
```

Symptom: No ping fails because of this fault on its own. OSPF sends traffic between the front of house and the server room through R1 instead, which hides the problem. From Staff-PC1, tracert 192.168.50.20 shows 192.168.10.1, 10.0.12.1, 10.0.13.2, 192.168.50.20. That is one hop more than the path in the handover. If the R1 link also failed, the front desk would lose the servers completely.

How to find it: show ip ospf neighbor on R2 and on R3 shows only one neighbour (1.1.1.1), but the handover says each router should have two. show ip ospf interface GigabitEthernet0/1 on R3 shows "Hello 5, Dead 40" and "Neighbor Count is 0", while show ip ospf interface GigabitEthernet0/2 on R2 shows Hello 10, Dead 40. show ip route on R2 has 192.168.50.0/24 via 10.0.12.1 with cost 3 instead of via 10.0.23.2 with cost 2.

Correction:

```
R3(config)# interface GigabitEthernet0/1
R3(config-if)# no ip ospf hello-interval
```

(ip ospf hello-interval 10 works too.)

Check: R2 and R3 each show two FULL neighbours, and the tracert from Staff-PC1 goes back to 192.168.10.1, 10.0.23.2, 192.168.50.20.

## 6. Verification Evidence

Both files were built and tested in Cisco Packet Tracer 8.2.2 on 2026-11-27.

### Baseline (Team4_working.pkt)

| Check | Result |
| --- | --- |
| OSPF neighbours | R1, R2 and R3 each have 2 neighbours in FULL state |
| Routing tables | All 8 networks on every router; R2 reaches 192.168.50.0 via 10.0.23.2 (cost 2) |
| Guest DHCP | Guest-Laptop1 got 192.168.30.101, Guest-Laptop2 got 192.168.30.100, gateway 192.168.30.1 |
| Allowed pings | Staff-PC1 to 192.168.50.20, Staff-PC2 to 192.168.50.10, Staff-PC3 to 192.168.40.11, Staff-PC1 to 192.168.20.12, Manager-PC to 192.168.20.13, Admin-PC to 192.168.10.13, POS3 to 192.168.50.20, POS1 to 192.168.20.13, Guest-Laptop1 to 192.168.50.10: all replied |
| DNS | nslookup www.lagoonview.local from Guest-Laptop2 returned 192.168.50.10 |
| Blocked pings | POS1 to 192.168.50.10, POS2 to 192.168.10.11, Guest-Laptop1 to 192.168.50.20, Guest-Laptop2 to 192.168.20.11: "Destination host unreachable" from the gateway. Staff-PC1 to 192.168.30.101: timed out |
| Paths | Staff-PC1 tracert 192.168.50.20: 192.168.10.1, 10.0.23.2, 192.168.50.20. Manager-PC tracert 192.168.10.11: 192.168.40.1, 10.0.12.2, 192.168.10.11 |

### Faulty network (Team4_broken.pkt)

| Fault | Observed symptom |
| --- | --- |
| 1 | POS3 ping 192.168.20.1: 2 of 2 timed out |
| 2 | Staff-PC3 ping 192.168.10.1: 2 of 2 timed out |
| 3 | Manager-PC ping 192.168.50.20: timed out. R2 has no route to 192.168.40.0/24 |
| 4 | POS2 ping 192.168.20.1 replies; POS2 ping 192.168.50.20 times out |
| 5 | Guest-Laptop1 ping 192.168.50.20 replies (TTL 125). show access-lists GUEST-IN shows the /24 permit |
| 6 | R2 and R3 each list only 1.1.1.1 as a neighbour. Staff-PC1 tracert 192.168.50.20: 192.168.10.1, 10.0.12.1, 10.0.13.2, 192.168.50.20 |

Faults 5 and 6 overlap: because of Fault 6, guest traffic to the servers goes through R1, so the guest ping in Fault 5 has TTL 125 instead of 126. Fixing either fault does not hide the other.

## 7. Notes

- After making the changes we waited about one minute for the OSPF dead timer to expire, then checked that every symptom above appeared.
- No devices or links were removed and no passwords were set. Each fault can be fixed with one or two commands, or by changing one setting on a PC.
