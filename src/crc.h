#ifndef __CRC_MODULE_H_
#define __CRC_MODULE_H_

#include <node_api.h>

napi_value toBuffer(napi_env env, uint64_t value, uint8_t bits);
napi_value createFalse(napi_env env);

napi_value crc64iso(napi_env env, napi_callback_info info);
napi_value crc64jones(napi_env env, napi_callback_info info);
napi_value crc64ecma(napi_env env, napi_callback_info info);
napi_value crc64we(napi_env env, napi_callback_info info);
napi_value crc32ieee(napi_env env, napi_callback_info info);
napi_value crc32mhash(napi_env env, napi_callback_info info);
napi_value crc32c(napi_env env, napi_callback_info info);
napi_value crc16ibm(napi_env env, napi_callback_info info);
napi_value crc16ccitt(napi_env env, napi_callback_info info);
napi_value crc8atm(napi_env env, napi_callback_info info);
napi_value crc8cdma(napi_env env, napi_callback_info info);

#endif //__CRC_MODULE_H_