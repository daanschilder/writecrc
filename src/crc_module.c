#include <node_api.h>

#include <stdint.h>

#include "crc.h"

uint64_t crcstm(char *data, size_t dataLength, uint64_t initial, uint64_t finalXor)
{
  uint32_t *p_data = (uint32_t *)data;
  size_t length = dataLength / sizeof(uint32_t);

  for (unsigned int a = 0; a < length; a++)
  {
    int i;

    initial = initial ^ p_data[a];

    for (i = 0; i < 32; i++)
    {
      if ((initial & 0x80000000) != 0)
        initial = (initial << 1) ^ 0x04C11DB7; // Polynomial used in STM32
      else
        initial = (initial << 1);
    }
  }

  return initial ^ finalXor;
}

napi_value crc32stm(napi_env env, napi_callback_info info)
{
  size_t argsLength = 1;
  napi_value args[1];
  napi_get_cb_info(env, info, &argsLength, args, 0, 0);

  if (argsLength < 1)
  {
    return createFalse(env);
  }
  char *data;
  size_t dataLength;

  napi_get_buffer_info(env, args[0], (void **)(&data), &dataLength);

  uint64_t sum = crcstm(data, dataLength, 0xFFFFFFFF, 0x00000000);

  return toBuffer(env, sum, 32);
}

napi_property_descriptor allDesc[] = {
    {"crc64iso", 0, crc64iso, 0, 0, 0, napi_default, 0},
    {"crc64jones", 0, crc64jones, 0, 0, 0, napi_default, 0},
    {"crc64ecma", 0, crc64ecma, 0, 0, 0, napi_default, 0},
    {"crc64we", 0, crc64we, 0, 0, 0, napi_default, 0},
    {"crc64", 0, crc64ecma, 0, 0, 0, napi_default, 0},
    {"crc32ieee", 0, crc32ieee, 0, 0, 0, napi_default, 0},
    {"crc32b", 0, crc32ieee, 0, 0, 0, napi_default, 0},
    {"crc32", 0, crc32ieee, 0, 0, 0, napi_default, 0},
    {"crc32c", 0, crc32c, 0, 0, 0, napi_default, 0},
    {"crc32mhash", 0, crc32mhash, 0, 0, 0, napi_default, 0},
    {"crc32stm", 0, crc32stm, 0, 0, 0, napi_default, 0},
    {"crc16ibm", 0, crc16ibm, 0, 0, 0, napi_default, 0},
    {"crc16", 0, crc16ibm, 0, 0, 0, napi_default, 0},
    {"crc16ccitt", 0, crc16ccitt, 0, 0, 0, napi_default, 0},
    {"crcccitt", 0, crc16ccitt, 0, 0, 0, napi_default, 0},
    {"crc8atm", 0, crc8atm, 0, 0, 0, napi_default, 0},
    {"crc8", 0, crc8atm, 0, 0, 0, napi_default, 0},
    {"crc8cdma", 0, crc8cdma, 0, 0, 0, napi_default, 0}};


napi_value Init(napi_env env, napi_value exports)
{
  napi_define_properties(env, exports, sizeof(allDesc) / sizeof(allDesc[0]), allDesc);
  return exports;
}

NAPI_MODULE(crc, Init);