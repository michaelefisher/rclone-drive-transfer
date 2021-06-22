# rclone-drive-transfer

This is a thin wrapper around `rclone` that just makes syncs a bit easier to run.

## Usage

To list files in the default root of Google Drive (My Drive) in dry-run mode and with logging:
```
$ export REMOTE_FROM=foo_from_drive
$ export DIR=""

$ ./drive.js ls --dry-run --log-file=/var/log/rclone/$(date +%s)-log.log
```

To exclude files and/or directies, copy `.exclude-from.sample.txt` to `.exclude-from.txt`. To copy or sync files with an exclude list:
```
$ export REMOTE_FROM=foo_from_drive
$ export REMOTE_TO=bar_to_drive
$ export DIR_FROM=""
$ export DIR_TO=""

$ ./drive.js copy --log-file=/var/log/rclone/$(date +%s)-log.log --exclude-from=.exclude-from.txt
```
