# rclone-drive-transfer

This is a thin wrapper around `rclone` that just makes syncs a bit easier to run.

## Usage

To list files in the default root of Google Drive (My Drive) in dry-run mode and with logging:
```
$ ./drive.js ls config.yml --dry-run --log-file=/var/log/rclone/$(date +%s)-log.log
```

To exclude files and/or directies, copy `.exclude-from.sample.txt` to `.exclude-from.txt`. To copy or sync files with an exclude list:

```
$ ./drive.js copy config.yml --log-file=/var/log/rclone/$(date +%s)-log.log --exclude-from=.exclude-from.txt
```

Mapping configuration can be found in config.yml.example
