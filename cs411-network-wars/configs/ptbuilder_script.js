// Lagoon View Hotel network - PTBuilder script
// Paste everything into Extensions > Builder Code Editor and click Run.

// ---------- Devices ----------
addDevice("R1", "2911", 500, 280);
addDevice("R2", "2911", 300, 460);
addDevice("R3", "2911", 700, 460);

addDevice("SW4", "2960-24TT", 500, 160);
addDevice("SW1", "2960-24TT", 300, 580);
addDevice("SW2", "2960-24TT", 300, 720);
addDevice("SW3", "2960-24TT", 700, 580);

addDevice("Manager-PC", "PC-PT", 430, 50);
addDevice("Admin-PC", "PC-PT", 570, 50);

addDevice("Staff-PC1", "PC-PT", 110, 540);
addDevice("Staff-PC2", "PC-PT", 110, 640);
addDevice("POS1", "PC-PT", 470, 540);
addDevice("POS2", "PC-PT", 470, 640);

addDevice("Staff-PC3", "PC-PT", 110, 800);
addDevice("POS3", "PC-PT", 230, 850);
addDevice("Guest-Laptop1", "Laptop-PT", 370, 850);
addDevice("Guest-Laptop2", "Laptop-PT", 490, 800);

addDevice("SRV-WEB", "Server-PT", 630, 700);
addDevice("SRV-RES", "Server-PT", 770, 700);

// ---------- Links ----------
addLink("R1", "GigabitEthernet0/1", "R2", "GigabitEthernet0/1", "cross");
addLink("R1", "GigabitEthernet0/2", "R3", "GigabitEthernet0/2", "cross");
addLink("R2", "GigabitEthernet0/2", "R3", "GigabitEthernet0/1", "cross");

addLink("R1", "GigabitEthernet0/0", "SW4", "GigabitEthernet0/1", "straight");
addLink("R2", "GigabitEthernet0/0", "SW1", "GigabitEthernet0/1", "straight");
addLink("R3", "GigabitEthernet0/0", "SW3", "GigabitEthernet0/1", "straight");
addLink("SW1", "GigabitEthernet0/2", "SW2", "GigabitEthernet0/1", "cross");

addLink("SW4", "FastEthernet0/1", "Manager-PC", "FastEthernet0", "straight");
addLink("SW4", "FastEthernet0/2", "Admin-PC", "FastEthernet0", "straight");

addLink("SW1", "FastEthernet0/1", "Staff-PC1", "FastEthernet0", "straight");
addLink("SW1", "FastEthernet0/2", "Staff-PC2", "FastEthernet0", "straight");
addLink("SW1", "FastEthernet0/11", "POS1", "FastEthernet0", "straight");
addLink("SW1", "FastEthernet0/12", "POS2", "FastEthernet0", "straight");

addLink("SW2", "FastEthernet0/1", "Staff-PC3", "FastEthernet0", "straight");
addLink("SW2", "FastEthernet0/11", "POS3", "FastEthernet0", "straight");
addLink("SW2", "FastEthernet0/21", "Guest-Laptop1", "FastEthernet0", "straight");
addLink("SW2", "FastEthernet0/22", "Guest-Laptop2", "FastEthernet0", "straight");

addLink("SW3", "FastEthernet0/1", "SRV-WEB", "FastEthernet0", "straight");
addLink("SW3", "FastEthernet0/2", "SRV-RES", "FastEthernet0", "straight");

// ---------- Routers ----------
configureIosDevice("R1", [
  "hostname R1",
  "no ip domain-lookup",
  "interface GigabitEthernet0/0",
  " description Management LAN",
  " ip address 192.168.40.1 255.255.255.0",
  " no shutdown",
  "interface GigabitEthernet0/1",
  " description Link to R2",
  " ip address 10.0.12.1 255.255.255.252",
  " no shutdown",
  "interface GigabitEthernet0/2",
  " description Link to R3",
  " ip address 10.0.13.1 255.255.255.252",
  " no shutdown",
  "exit",
  "router ospf 1",
  " router-id 1.1.1.1",
  " network 192.168.40.0 0.0.0.255 area 0",
  " network 10.0.12.0 0.0.0.3 area 0",
  " network 10.0.13.0 0.0.0.3 area 0",
  " passive-interface GigabitEthernet0/0",
  "end",
  "write memory"
].join("\n"));

configureIosDevice("R2", [
  "hostname R2",
  "no ip domain-lookup",
  "interface GigabitEthernet0/0",
  " description Trunk to SW1",
  " no ip address",
  " no shutdown",
  "interface GigabitEthernet0/0.10",
  " description VLAN10 STAFF",
  " encapsulation dot1Q 10",
  " ip address 192.168.10.1 255.255.255.0",
  "interface GigabitEthernet0/0.20",
  " description VLAN20 POS",
  " encapsulation dot1Q 20",
  " ip address 192.168.20.1 255.255.255.0",
  "interface GigabitEthernet0/0.30",
  " description VLAN30 GUESTS",
  " encapsulation dot1Q 30",
  " ip address 192.168.30.1 255.255.255.0",
  "interface GigabitEthernet0/1",
  " description Link to R1",
  " ip address 10.0.12.2 255.255.255.252",
  " no shutdown",
  "interface GigabitEthernet0/2",
  " description Link to R3",
  " ip address 10.0.23.1 255.255.255.252",
  " no shutdown",
  "exit",
  "ip dhcp excluded-address 192.168.30.1 192.168.30.99",
  "ip dhcp pool GUESTS",
  " network 192.168.30.0 255.255.255.0",
  " default-router 192.168.30.1",
  " dns-server 192.168.50.10",
  "exit",
  "ip access-list extended GUEST-IN",
  " permit udp any any eq bootps",
  " permit icmp 192.168.30.0 0.0.0.255 host 192.168.30.1",
  " permit icmp 192.168.30.0 0.0.0.255 host 192.168.50.10",
  " permit tcp 192.168.30.0 0.0.0.255 host 192.168.50.10 eq www",
  " permit udp 192.168.30.0 0.0.0.255 host 192.168.50.10 eq domain",
  " deny ip any any",
  "exit",
  "ip access-list extended POS-IN",
  " permit icmp 192.168.20.0 0.0.0.255 host 192.168.20.1",
  " permit ip 192.168.20.0 0.0.0.255 host 192.168.50.20",
  " permit icmp 192.168.20.0 0.0.0.255 any echo-reply",
  " deny ip any any",
  "exit",
  "interface GigabitEthernet0/0.20",
  " ip access-group POS-IN in",
  "interface GigabitEthernet0/0.30",
  " ip access-group GUEST-IN in",
  "exit",
  "router ospf 1",
  " router-id 2.2.2.2",
  " network 192.168.10.0 0.0.0.255 area 0",
  " network 192.168.20.0 0.0.0.255 area 0",
  " network 192.168.30.0 0.0.0.255 area 0",
  " network 10.0.12.0 0.0.0.3 area 0",
  " network 10.0.23.0 0.0.0.3 area 0",
  " passive-interface GigabitEthernet0/0.10",
  " passive-interface GigabitEthernet0/0.20",
  " passive-interface GigabitEthernet0/0.30",
  "end",
  "write memory"
].join("\n"));

configureIosDevice("R3", [
  "hostname R3",
  "no ip domain-lookup",
  "interface GigabitEthernet0/0",
  " description Server LAN",
  " ip address 192.168.50.1 255.255.255.0",
  " no shutdown",
  "interface GigabitEthernet0/1",
  " description Link to R2",
  " ip address 10.0.23.2 255.255.255.252",
  " no shutdown",
  "interface GigabitEthernet0/2",
  " description Link to R1",
  " ip address 10.0.13.2 255.255.255.252",
  " no shutdown",
  "exit",
  "router ospf 1",
  " router-id 3.3.3.3",
  " network 192.168.50.0 0.0.0.255 area 0",
  " network 10.0.23.0 0.0.0.3 area 0",
  " network 10.0.13.0 0.0.0.3 area 0",
  " passive-interface GigabitEthernet0/0",
  "end",
  "write memory"
].join("\n"));

// ---------- Switches ----------
configureIosDevice("SW1", [
  "hostname SW1",
  "no ip domain-lookup",
  "vtp mode transparent",
  "vlan 10",
  " name STAFF",
  "vlan 20",
  " name POS",
  "vlan 30",
  " name GUESTS",
  "exit",
  "interface range FastEthernet0/1 - 2",
  " switchport mode access",
  " switchport access vlan 10",
  "interface range FastEthernet0/11 - 12",
  " switchport mode access",
  " switchport access vlan 20",
  "interface GigabitEthernet0/1",
  " description Trunk to R2",
  " switchport mode trunk",
  " switchport trunk allowed vlan 10,20,30",
  "interface GigabitEthernet0/2",
  " description Trunk to SW2",
  " switchport mode trunk",
  " switchport trunk allowed vlan 10,20,30",
  "end",
  "write memory"
].join("\n"));

configureIosDevice("SW2", [
  "hostname SW2",
  "no ip domain-lookup",
  "vtp mode transparent",
  "vlan 10",
  " name STAFF",
  "vlan 20",
  " name POS",
  "vlan 30",
  " name GUESTS",
  "exit",
  "interface FastEthernet0/1",
  " switchport mode access",
  " switchport access vlan 10",
  "interface FastEthernet0/11",
  " switchport mode access",
  " switchport access vlan 20",
  "interface range FastEthernet0/21 - 22",
  " switchport mode access",
  " switchport access vlan 30",
  "interface GigabitEthernet0/1",
  " description Trunk to SW1",
  " switchport mode trunk",
  " switchport trunk allowed vlan 10,20,30",
  "end",
  "write memory"
].join("\n"));

configureIosDevice("SW3", "hostname SW3\nno ip domain-lookup\nend\nwrite memory");
configureIosDevice("SW4", "hostname SW4\nno ip domain-lookup\nend\nwrite memory");

// ---------- PCs, laptops, servers ----------
// configurePcIp(name, dhcp, ip, mask, gateway, dns)
configurePcIp("Staff-PC1", false, "192.168.10.11", "255.255.255.0", "192.168.10.1", "192.168.50.10");
configurePcIp("Staff-PC2", false, "192.168.10.12", "255.255.255.0", "192.168.10.1", "192.168.50.10");
configurePcIp("Staff-PC3", false, "192.168.10.13", "255.255.255.0", "192.168.10.1", "192.168.50.10");
configurePcIp("POS1", false, "192.168.20.11", "255.255.255.0", "192.168.20.1", "192.168.50.10");
configurePcIp("POS2", false, "192.168.20.12", "255.255.255.0", "192.168.20.1", "192.168.50.10");
configurePcIp("POS3", false, "192.168.20.13", "255.255.255.0", "192.168.20.1", "192.168.50.10");
configurePcIp("Manager-PC", false, "192.168.40.11", "255.255.255.0", "192.168.40.1", "192.168.50.10");
configurePcIp("Admin-PC", false, "192.168.40.12", "255.255.255.0", "192.168.40.1", "192.168.50.10");
configurePcIp("SRV-WEB", false, "192.168.50.10", "255.255.255.0", "192.168.50.1", "192.168.50.10");
configurePcIp("SRV-RES", false, "192.168.50.20", "255.255.255.0", "192.168.50.1", "192.168.50.10");
configurePcIp("Guest-Laptop1", true);
configurePcIp("Guest-Laptop2", true);
