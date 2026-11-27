# CS411 Project 3 - Network Wars (Session 1)

Lagoon View Hotel network, built in Cisco Packet Tracer 8.2.2. Team 4.

**Keep this repo private.** It contains the answer key, which only the instructor may see.

## What we submit on Moodle

| File | Who gets it | Source | Status |
| --- | --- | --- | --- |
| `Team4_working.pkt` | Instructor | `pkt/Team4_working.pkt` | [x] built and verified |
| `Team4_answer_key.pdf` | Instructor | `docs/Team4_answer_key.pdf` | [x] written, symptoms verified, PDF exported |
| `Team4_broken.pkt` | Receiving team | `pkt/Team4_broken.pkt` | [x] 6 faults injected and verified |
| `Team4_handover.pdf` | Receiving team | `docs/Team4_handover.pdf` | [x] written, topology image added, PDF exported |

## Requirements check

| Requirement | Ours |
| --- | --- |
| At least 3 routers, redundant path | 3 x 2911 in a triangle (R1, R2, R3) |
| At least 3 switches | 4 x 2960-24TT |
| At least 3 VLANs, inter-VLAN routing | VLAN 10 STAFF, 20 POS, 30 GUESTS; router-on-a-stick on R2 |
| At least 8 end devices | 8 PCs + 2 laptops |
| At least 1 server | SRV-WEB (HTTP, DNS), SRV-RES |
| OSPF on all routers | OSPF 1, area 0 on R1, R2, R3 |
| At least 1 ACL for the policy | GUEST-IN and POS-IN on R2 |
| Access policy of 3-5 rules | 4 rules (handover section 6) |
| 6 faults: 2 L1/2, 2 L3, 1 security, 1 open | Faults 1-2, 3-4, 5, 6 in the answer key |
| No removed devices/links, no passwords | None removed, no passwords set |

## Folders

- `docs/` - handover document and answer key
- `pkt/` - working and broken .pkt files (saved with PT 8.2.2)
- `screenshots/` - `topology.png` (used in the handover) and earlier screenshots
- `configs/build_configs.txt` - cabling list, CLI config for every router and switch, PC IPs, verification checklist
- `configs/ptbuilder_script.js` - PTBuilder script that places, cables and configures everything
- `configs/router_fix_blocks.txt` - clean config blocks for R1, R2, R3
- `configs/fault_injection.txt` - the six fault changes that turn the working file into the broken file

## Progress

- [x] Devices placed and cabled
- [x] Routers and switches configured
- [x] SRV-WEB DNS record `www.lagoonview.local` -> 192.168.50.10
- [x] Guest laptops on DHCP (got .100 and .101)
- [x] Baseline verified (OSPF, routes, allowed and blocked pings, tracert)
- [x] Saved `Team4_working.pkt`
- [x] Faults injected, every symptom checked, saved `Team4_broken.pkt`
- [x] Topology screenshot added to handover
- [x] Both documents exported to PDF (`docs/*.pdf`)
- [ ] Uploaded to Moodle

## Tips

- When a router CLI asks "initial configuration dialog? [yes/no]", always type `no`.
- `show` commands need `enable` first (prompt must end in `#`).
- After opening a .pkt, wait about a minute (or use Fast Forward Time) before checking `show ip ospf neighbor`.
