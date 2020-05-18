var fs = require('fs')
const crc = require('bindings')('crc')

var crc_types = []

var verbose = false


const getMethods = (obj) => {
  let properties = new Set()
  let currentObj = obj
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)))
  return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}

function logverbose(arg) {
  if(verbose)
    console.log(arg)
}

var argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .alias('h', 'help')
  .options({
    'file <file>': {
      alias: 'f',
      desc: 'list all contents of the file'
    },
    'target <file>': {
      alias: 't',
      desc: 'target destination for writing CRC (default the file itself)'
    },
    'writeoffset': {
      alias: 'w',
      desc: 'write-offset for CRC',
      default: 0
    },
    'startoffset <decimal>': {
      alias: 's',
      default: 0,
      desc: 'startoffset for calculation'
    },
    'endoffset <decimal>': {
      alias: 'e',
      desc: 'endoffset for calculation'
    },
    'length <decimal>': {
      alias: 'l',
      desc: 'length for calculation'
    },
    'output <file>': {
      alias: 'o',
      desc: 'output file destination',
    },
    'crctype': {
      alias: 'c',
      desc: 'type of the crc',
      default: 'crc32'
    },
    'crcopt': {
      alias: 'o',
      desc: 'print a list op CRC-type options'
    },
    'verbose': {
      alias: 'v',
      desc: 'show verbose information'
    }
  }
  )
  .wrap(72)
  .argv

var methods = getMethods(crc)
for (var i = 0; i < methods.length; i++) {
  if (methods[i] == 'constructor')
    break;
  if (methods[i] != 'crc')
    crc_types.push(methods[i])
}


if(argv.v != undefined) {
  verbose = true
}

if (argv.o != undefined) {
  crc_types.forEach(element => {
    console.log(element)
  })
}

if (argv.f == undefined) {
  console.log('no file specified for CRC calculation')
  return
}

if (!fs.existsSync(argv.f)) {
  console.log('file ' + argv.f + ' does not exist')
  return
}

if (typeof (argv.s) != 'number') {
  console.log('paramater for startoffset specifier should be of numeric format')
  return
}

if (argv.e != undefined) {
  if (typeof (argv.e) != 'number') {
    console.log('paramater for endoffset specifier should be of numeric format')
    return
  }
}
else {
  argv.e = fs.statSync(argv.f)['size']
}

if (typeof (argv.w) != 'number') {
  console.log('paramater for writeoffset specifier should be of numeric format')
  return
}

if (argv.l != undefined) {
  if (typeof (argv.l) != 'number') {
    console.log('paramater for length specifier should be of numeric format')
    return
  }
}

if (!crc_types.includes(argv.c)) {
  console.log('invalid CRC-type argument')
  return
}

//calculate offsets and length
if (argv.e < argv.s) {
  console.log('endoffset of ' + argv.e + ' should be bigger then start offset ' + argv.s)
  return
}

var calc_length = fs.statSync(argv.f)['size']

if (argv.e != undefined) {
  if (calc_length < argv.e) {
    console.log('invalid end offset, it exceeds the filesize')
    console.log('end offset set to filezise <' + calc_length + '>')
    argv.e = calc_length
  }
}
else {
  argv.e = calc_length
}

if(argv.f == undefined) {
  return
}

//calculate length without start- and end-offset
calc_length -= (calc_length - argv.e)
calc_length -= argv.s

if (argv.l != undefined) {
  if (argv.l > calc_length)
    logverbose('length-field is ignored due to file-size')
  else
    calc_length = argv.l
}

var endoffset = argv.s + calc_length;
var data = fs.readFileSync(argv.f).slice(argv.s, endoffset)

var result = crc[argv.c](data)
logverbose('calculated ' + argv.c + ' starting from offset ' + argv.s + ' with a length of ' + calc_length + ' bytes: 0x' + result.toString('hex'))  


if(argv.t != undefined) {
  data = fs.readFileSync(argv.f)

  if(fs.existsSync(argv.t)) {
    fs.unlinkSync(argv.t)
  }
  
  
  var fd = fs.openSync(argv.t, 'w+')
  fs.writeSync(fd, data)
  fs.writeSync(fd, result, 0, result.length, argv.w)
  fs.closeSync(fd)

  logverbose('written CRC att offset ' + argv.w + ' to the file ' + argv.t)
}