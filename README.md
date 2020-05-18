# writecrc
utility for calculating crc over a file and optionally write it into the file.

# requirements
* for building the project nodejs is required
* for running the executable there are no requirements

# installation
* run `npm install` in the root dir

# test
* run `node main.js -h` for a list of available commands

# usage
* run 'node main.js -f main.js -c crc32stm -s 2 -t outputmain.js -w 4 -v'
    
    *calculated crc32stm starting from offset 2 with a length of 4170 bytes: 0xacd54fa6*
    
    *written CRC att offset 4 to the file outputmain.js*
