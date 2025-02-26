






/**
     * BLE 장치 연결
     */
    fun connectToDevice(
      device: BluetoothDevice,
      onGattServiceResultCallback: (Boolean) -> Unit
  ): BluetoothGatt? {
//    fun connectToDevice(device: BluetoothDevice, onGattServiceResultCallback: BluetoothGattCallback):BluetoothGatt? {
      Log.d(logTagBleController,"connectToDevice >> ${device}")
      // 블루투스 연결 권한 확인
      hasBluetoothConnectPermission() ?: return null
      try {
          if (device.bondState == BluetoothDevice.BOND_NONE) {
              device.createBond() // 페어링 시도
          }

          // GATT 서버에 연결 시도
          val gtServer: BluetoothGatt = device.connectGatt(
              context, false, object : BluetoothGattCallback() {
                  // GAP 연결 시도 결과 콜백
                  override fun onConnectionStateChange(
                      gatt: BluetoothGatt,
                      status: Int,
                      newState: Int
                  ) {
                      super.onConnectionStateChange(gatt, status, newState)
                      when (newState) {
                          BluetoothProfile.STATE_CONNECTED -> {
                              // GAP 서버에 연결 성공
                              Log.d(logTagBleController, "GAP 서버에 연결되었습니다.${newState}")

                              Log.d(logTagBleController, "GATT 연결 시도중 ...${gatt}")
                              // GATT 전송 버퍼 크기 지정
                              gatt.requestMtu(247)
                              if (!gatt.discoverServices()) { // GATT 서비스 검색 실패
                                  throw Exception("GATT Service 검색 실패")
                              }

                              onGattServiceResultCallback(true)
                          }

                          BluetoothProfile.STATE_DISCONNECTED -> {
                              // GATT 서버 연결 해제
                              Log.d(logTagBleController, "GAP 서버 연결이 해제되었습니다. : $gatt")
                              onGattServiceResultCallback(false)
                          }

                          else -> {
                              Log.w(logTagBleController, "알 수 없는 GAP 상태: $newState")
                              useToastOnSubThread("알 수 없는 GAP 상태: $newState")
                          }
                      }
                  }

                  override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
                      /**
                       * gatt.discoverServices() // GATT 서비스 검색 << 이후 발동 되는 함수
                       * */
                      super.onServicesDiscovered(gatt, status)
                      // GATT 서비스 검색
                      if (status != BluetoothGatt.GATT_SUCCESS) {
                          Log.e(logTagBleController, "GATT 서비스 검색 실패: $status")
//                            Log.e(logTagBleController, "GATT CLOSE ${gatt.close()}")
                          useToastOnSubThread("GATT 서비스 검색 실패: $status")
                          return
                      }
                      Log.d(logTagBleController, "GATT 서비스 검색 성공")
                      gtMap[device.address] = gatt

                      val charList = mutableListOf<Any>()
                      // 검색된 모든 서비스와 특성을 로그로 출력
                      for (service in gatt.services) {
                          Log.d(logTagBleController, "서비스 UUID: ${service.uuid}")
                          charList.add("서비스 : ${service.uuid}")
                          for (characteristic in service.characteristics) {
                              charList.add("${getPropertiesString(characteristic.properties)} >> ${characteristic.uuid}")
                              Log.d(logTagBleController, "  특성 UUID: ${characteristic.uuid}")
                              charList.add(" - ")
                          }
                          charList.add(" ========= ")
                      }
                      updateReadData(charList)

                      // 서비스 UUID 찾기
                      val service = gatt.getService(serviceUuid)
                      if (service == null) {
                          Log.e(logTagBleController, "특정 서비스를 찾을 수 없습니다: $serviceUuid")
                          useToastOnSubThread("특정 서비스를 찾을 수 없습니다: $serviceUuid")
                          return // service 없으면 read 고 write 고 특성 찾기 종료 처리
                      }
                      Log.d(logTagBleController, "특정 서비스 발견: $serviceUuid")

                      // 쓰기 특성 등록
                      service.getCharacteristic(writeCharacteristicUuid).apply {
                          if (this == null) Log.e(logTagBleController, "쓰기 특성을 찾을 수 없습니다.")
                      }

                      // 읽기 특성 등록
                      service.getCharacteristic(readCharacteristicUuid).apply {
                          if (this == null) Log.e(logTagBleController, "읽기 특성을 찾을 수 없습니다.")
                      }

                  }

                  // ( 트리거 : IoT기기 ) 기기가 Data 전송 > App 이 읽음
                  // 읽기 특성에 대한 알림(Notification)이 활성화된 경우, 데이터가 수신될 때 호출되는 콜백
                  override fun onCharacteristicChanged(
                      gatt: BluetoothGatt,
                      characteristic: BluetoothGattCharacteristic,
                      recievedData: ByteArray
                  ) {
                      super.onCharacteristicChanged(gatt, characteristic, recievedData)
                      if (characteristic.uuid == readCharacteristicUuid) {
                          val receivedString = String(recievedData) // ByteArray를 문자열로 변환
                          Log.i(logTagBleController, "수신된 데이터: $recievedData")
                      }
                  }

                  override fun onCharacteristicRead(
                      gatt: BluetoothGatt,
                      characteristic: BluetoothGattCharacteristic,
                      receivedData: ByteArray,
                      status: Int
                  ) {
                      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                          // Android 13 이상에서 실행
                          super.onCharacteristicRead(gatt, characteristic, receivedData, status)
                          Log.i(
                              logTagBleController,
                              "신형 READ FROM ${device.name} : ${device.address}"
                          )
                          handleCharacteristicRead(device, receivedData, status)
                      }
                  }

                  @Deprecated("Deprecated in Java")
                  override fun onCharacteristicRead(
                      gatt: BluetoothGatt,
                      characteristic: BluetoothGattCharacteristic,
                      status: Int
                  ) {
                      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
                          // Android 13 미만에서 실행
                          super.onCharacteristicRead(gatt, characteristic, status)
                          Log.i(
                              logTagBleController,
                              "구형 READ FROM ${device.name} : ${device.address}"
                          )
                          if (characteristic.value == null) {
                              Log.e(logTagBleController, "characteristic value is NULL")
                          } else {
                              handleCharacteristicRead(device, characteristic.value, status)
                          }
                      }
                  }

                  // 데이터를 썼을 때 호출되는 콜백
                  override fun onCharacteristicWrite(
                      gatt: BluetoothGatt,
                      characteristic: BluetoothGattCharacteristic,
                      status: Int
                  ) {
                      super.onCharacteristicWrite(gatt, characteristic, status)
                      if (status == BluetoothGatt.GATT_SUCCESS) {
                          Log.i(logTagBleController, "데이터 전송 성공: $status")
                      } else {
                          Log.e(logTagBleController, "데이터 전송 실패: $status")
                          Log.d(logTagBleController, "디버깅중 < writeData 실패로 인해 GATT 서비스 재검색")
                          reDiscoverGattService(gatt)
                      }
                  }
              }
          )
          return gtServer
      } catch (e: SecurityException) {
          Log.e(logTagBleController, "SecurityException 에러 : ${e.message}")
          return null
      } catch (e: Exception) {
          Log.e(logTagBleController, "블루투스 연결 시도 중 보안 예외 발생: ${e.message}")
          return null
      }
  }















































      /**
     * BLE 장치 연결
     */
      fun connectToDevice(
        device: BluetoothDevice,
        onGattServiceResultCallback: (Boolean) -> Unit
    ): BluetoothGatt? {
//    fun connectToDevice(device: BluetoothDevice, onGattServiceResultCallback: BluetoothGattCallback):BluetoothGatt? {
        Log.d(logTagBleController,"connectToDevice >> ${device}")
        // 블루투스 연결 권한 확인
        hasBluetoothConnectPermission() ?: return null
        try {
            if (device.bondState == BluetoothDevice.BOND_NONE) {
                device.createBond() // 페어링 시도
            }

            // GATT 서버에 연결 시도
            val gtServer: BluetoothGatt = device.connectGatt(
                context, false, object : BluetoothGattCallback() {
                    // GAP 연결 시도 결과 콜백
                    override fun onConnectionStateChange(
                        gatt: BluetoothGatt,
                        status: Int,
                        newState: Int
                    ) {
                        super.onConnectionStateChange(gatt, status, newState)
                        when (newState) {
                            BluetoothProfile.STATE_CONNECTED -> {
                                // GAP 서버에 연결 성공
                                Log.d(logTagBleController, "GAP 서버에 연결되었습니다.${newState}")

                                Log.d(logTagBleController, "GATT 연결 시도중 ...${gatt}")
                                // GATT 전송 버퍼 크기 지정
                                gatt.requestMtu(247)
                                if (!gatt.discoverServices()) { // GATT 서비스 검색 실패
                                    throw Exception("GATT Service 검색 실패")
                                }

                                onGattServiceResultCallback(true)
                            }

                            BluetoothProfile.STATE_DISCONNECTED -> {
                                // GATT 서버 연결 해제
                                Log.d(logTagBleController, "GAP 서버 연결이 해제되었습니다. : $gatt")
                                onGattServiceResultCallback(false)
                            }

                            else -> {
                                Log.w(logTagBleController, "알 수 없는 GAP 상태: $newState")
                                useToastOnSubThread("알 수 없는 GAP 상태: $newState")
                            }
                        }
                    }

                    override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
                        /**
                         * gatt.discoverServices() // GATT 서비스 검색 << 이후 발동 되는 함수
                         * */
                        super.onServicesDiscovered(gatt, status)
                        // GATT 서비스 검색
                        if (status != BluetoothGatt.GATT_SUCCESS) {
                            Log.e(logTagBleController, "GATT 서비스 검색 실패: $status")
//                            Log.e(logTagBleController, "GATT CLOSE ${gatt.close()}")
                            useToastOnSubThread("GATT 서비스 검색 실패: $status")
                            return
                        }
                        Log.d(logTagBleController, "GATT 서비스 검색 성공")
                        gtMap[device.address] = gatt

                        val charList = mutableListOf<Any>()
                        // 검색된 모든 서비스와 특성을 로그로 출력
                        for (service in gatt.services) {
                            Log.d(logTagBleController, "서비스 UUID: ${service.uuid}")
                            charList.add("서비스 : ${service.uuid}")
                            for (characteristic in service.characteristics) {
                                charList.add("${getPropertiesString(characteristic.properties)} >> ${characteristic.uuid}")
                                Log.d(logTagBleController, "  특성 UUID: ${characteristic.uuid}")
                                charList.add(" - ")
                            }
                            charList.add(" ========= ")
                        }
                        updateReadData(charList)

                        // 서비스 UUID 찾기
                        val service = gatt.getService(serviceUuid)
                        if (service == null) {
                            Log.e(logTagBleController, "특정 서비스를 찾을 수 없습니다: $serviceUuid")
                            useToastOnSubThread("특정 서비스를 찾을 수 없습니다: $serviceUuid")
                            return // service 없으면 read 고 write 고 특성 찾기 종료 처리
                        }
                        Log.d(logTagBleController, "특정 서비스 발견: $serviceUuid")

                        // 쓰기 특성 등록
                        service.getCharacteristic(writeCharacteristicUuid).apply {
                            if (this == null) Log.e(logTagBleController, "쓰기 특성을 찾을 수 없습니다.")
                        }

                        // 읽기 특성 등록
                        service.getCharacteristic(readCharacteristicUuid).apply {
                            if (this == null) Log.e(logTagBleController, "읽기 특성을 찾을 수 없습니다.")
                        }

                        // Notification Subscribe 기능 사용 할 일이 없으므로 주석처리
//                    // CCCD 설정 // Notification Subscribe
//                    if (bleInfo.readCharacteristic != null) {
//                        gatt.setCharacteristicNotification(
//                            bleInfo.readCharacteristic, true)
//
//                        // CCCD 설정 // Subscribe 요청 --> IoT
//                        val descriptor =
//                            bleInfo.readCharacteristic!!.getDescriptor(
//                                UUID.fromString("00002902-0000-1000-8000-00805f9b34fb"))
//                        descriptor!!.value = BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
//                        gatt.writeDescriptor(descriptor)
//                        Log.d(logTagBleController, "읽기 특성에 대한 Notification 활성화 완료")
//                    }

//                    onGattServiceResultCallback(true)
                    }

                    // ( 트리거 : IoT기기 ) 기기가 Data 전송 > App 이 읽음
                    // 읽기 특성에 대한 알림(Notification)이 활성화된 경우, 데이터가 수신될 때 호출되는 콜백
                    override fun onCharacteristicChanged(
                        gatt: BluetoothGatt,
                        characteristic: BluetoothGattCharacteristic,
                        recievedData: ByteArray
                    ) {
                        super.onCharacteristicChanged(gatt, characteristic, recievedData)
                        if (characteristic.uuid == readCharacteristicUuid) {
                            val receivedString = String(recievedData) // ByteArray를 문자열로 변환
                            Log.i(logTagBleController, "수신된 데이터: $recievedData")
                        }
                    }

                    override fun onCharacteristicRead(
                        gatt: BluetoothGatt,
                        characteristic: BluetoothGattCharacteristic,
                        receivedData: ByteArray,
                        status: Int
                    ) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                            // Android 13 이상에서 실행
                            super.onCharacteristicRead(gatt, characteristic, receivedData, status)
                            Log.i(
                                logTagBleController,
                                "신형 READ FROM ${device.name} : ${device.address}"
                            )
                            handleCharacteristicRead(device, receivedData, status)
                        }
                    }

                    @Deprecated("Deprecated in Java")
                    override fun onCharacteristicRead(
                        gatt: BluetoothGatt,
                        characteristic: BluetoothGattCharacteristic,
                        status: Int
                    ) {
                        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
                            // Android 13 미만에서 실행
                            super.onCharacteristicRead(gatt, characteristic, status)
                            Log.i(
                                logTagBleController,
                                "구형 READ FROM ${device.name} : ${device.address}"
                            )
                            if (characteristic.value == null) {
                                Log.e(logTagBleController, "characteristic value is NULL")
                            } else {
                                handleCharacteristicRead(device, characteristic.value, status)
                            }
                        }
                    }

//                    // ( 트리거 : APP ) App 이 Read 요청 > 기기가 Data 전송 > App 이 읽음
//                    override fun onCharacteristicRead(
//                        // 구형 안드로이드 버전의 경우
//                        gatt: BluetoothGatt,
//                        characteristic: BluetoothGattCharacteristic,
//                        status: Int
//                    ) {
//                        super.onCharacteristicRead(gatt, characteristic, status)
//                        Log.i(
//                            logTagBleController,
//                            " 구형 READ FROM ${device.name} : ${device.address}"
//                        )
//                        if (characteristic.value == null) {
//                            Log.e(logTagBleController, "characteristic value is NULL")
//                        } else {
//                            handleCharacteristicRead(device, characteristic.value, status)
//                        }
//                    }
//
//                    override fun onCharacteristicRead(
//                        // 일반 안드로이드 버전의 경우
//                        gatt: BluetoothGatt,
//                        characteristic: BluetoothGattCharacteristic,
//                        receivedData: ByteArray,
//                        status: Int
//                    ) {
//                        super.onCharacteristicRead(gatt, characteristic, receivedData, status)
//                        Log.i(
//                            logTagBleController,
//                            " 신형 READ FROM ${device.name} : ${device.address}"
//                        )
//                        handleCharacteristicRead(device, receivedData, status)
//                    }

                    // 데이터를 썼을 때 호출되는 콜백
                    override fun onCharacteristicWrite(
                        gatt: BluetoothGatt,
                        characteristic: BluetoothGattCharacteristic,
                        status: Int
                    ) {
                        super.onCharacteristicWrite(gatt, characteristic, status)
                        if (status == BluetoothGatt.GATT_SUCCESS) {
                            Log.i(logTagBleController, "데이터 전송 성공: $status")
                        } else {
                            Log.e(logTagBleController, "데이터 전송 실패: $status")
                            Log.d(logTagBleController, "디버깅중 < writeData 실패로 인해 GATT 서비스 재검색")
                            reDiscoverGattService(gatt)
                        }
                    }
                }
            )
            return gtServer
        } catch (e: SecurityException) {
            Log.e(logTagBleController, "SecurityException 에러 : ${e.message}")
            return null
        } catch (e: Exception) {
            Log.e(logTagBleController, "블루투스 연결 시도 중 보안 예외 발생: ${e.message}")
            return null
        }
    }