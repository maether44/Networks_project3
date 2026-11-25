# CS411 Project 3 - Network Wars (Session 1)

Lagoon View Hotel network, built in Cisco Packet Tracer.

**Keep this repo private.** It contains the answer key, which only the instructor may see.

## What we submit on Moodle

| File | Who gets it | Status |
| --- | --- | --- |
| `TeamX_working.pkt` | Instructor | [ ] build + verify |
| `TeamX_broken.pkt` | Receiving team | [ ] add 6 faults |
| `TeamX_answer_key.pdf` | Instructor | [x] written (`docs/answer_key.md`) |
| `TeamX_handover.pdf` | Receiving team | [x] written, needs topology screenshot (`docs/handover.md`) |

Replace `X` with our team number everywhere before submitting.

## Folders

- `docs/` - handover document and answer key
- `configs/build_configs.txt` - cabling list and CLI config for every router and switch, PC IPs, and the verification checklist
- `configs/ptbuilder_script.js` - script for the PTBuilder extension that places and cables all devices
- `configs/router_fix_blocks.txt` - clean config blocks for R1, R2, R3 (use these if a router config is wrong; no reload needed)
- `configs/fault_injection.txt` - the six fault commands to turn the working file into the broken file
- `pkt/` - put the .pkt files here
- `screenshots/` - topology and verification screenshots

## Progress

- [x] Devices placed and cabled (PTBuilder)
- [x] R2 configured and checked
- [ ] R3 configured (paste R3 block from `configs/router_fix_blocks.txt`)
- [ ] R1 re-checked (paste R1 block)
- [ ] SW1 and SW2 blocks re-pasted
- [ ] SRV-WEB DNS record `www.lagoonview.local` -> 192.168.50.10
- [ ] Guest laptops set to DHCP
- [ ] Verification pings done and screenshots saved
- [ ] Saved `TeamX_working.pkt`
- [ ] Saved as `TeamX_broken.pkt`, faults added, symptoms checked
- [ ] Topology screenshot added to handover
- [ ] Both documents exported to PDF
- [ ] Uploaded to Moodle

## Tips

- When a router CLI asks "initial configuration dialog? [yes/no]", always type `no`.
- `show` commands need `enable` first (prompt must end in `#`).
- Wait about a minute after changing OSPF before checking `show ip ospf neighbor`.
