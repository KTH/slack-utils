# Slack Scripts 

1. Create a directory `/data` in the rot of the repo. The directory is git ignored.
2. Get the list of all users from Slack and put them in `/data/slack-kth-se-members.csv`
3. Run `node index.js`
4. You will now have your users separted into files under `/data/results`. Deactivated accounts are not added to results.

```bash
# ls /your/repos/slack-utils/data/reports.
bots.txt
external-domains-single-channel-member.txt
external-domains.txt
kth-domains-single-channel-member.txt
kth-domains.txt
kthse-account-single-channel-member.txt
kthse-account.txt
```
