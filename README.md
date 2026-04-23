
## Emergency Stop Activated
{
  "alarm_id": "SAF-001",
  "category": "Safety & Compliance",
  "event_name": "Emergency Stop Activated",
  "timestamp": "2026-04-23T10:15:33+07:00",
  "solution": "Stop robot immediately, wait until safety zone is clear",
  "robot_pose": {
    "position": {
      "x": 1.24,
      "y": 3.56
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.71,
      "w": 0.71
    }
  }
}

## Safety Scanner Triggered

{
  "alarm_id": "SAF-002",
  "category": "Safety & Compliance",
  "event_name": "Lidar not found init start",
  "timestamp": "2026-04-23T10:15:33+07:00",
  "solution": "Stop robot immediately, wait until safety zone is clear"
}

## Safety Zone Violation
{
  "alarm_id": "SAF-003",
  "category": "Safety & Compliance",
  "event_name": "Safety Zone Violation",
  "mapname": "example map",
  "status": "ACTIVE",
  "severity": "CRITICAL",
  "robot_pose": {
    "position": {
      "x": 2.31,
      "y": 1.47
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.38,
      "w": 0.92
    }
  },
  "Wall & Zone ": {
    "type": wall ,
    "position": {
      "x": 2.31,
      "y": 1.47
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.38,
      "w": 0.92
    }
  },
  "timestamp": "2026-04-23T10:22:10+07:00",
  "solution": "Stop robot immediately, wait until safety zone is clear",
}


## Reduced Speed Zone Violation

{
  "alarm_id": "SAF-004",
  "category": "Safety & Compliance",
  "event_name": "Reduced Speed Zone Violation",
  "robot_pose": {
    "position": {
      "x": 5.12,
      "y": 2.84
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.52,
      "w": 0.85
    }
  },
  "speed_detail": {
    "zone_name": "reduced_speed_zone_A",
    "max_speed_mps": 0.3,
    "current_speed_mps": 0.6
  },
  "timestamp": "2026-04-23T10:35:20+07:00",
  "mapname": "example map"
}

## Lost Localization
{
  "alarm_id": "LOC-005",
  "category": "Localization & Mapping",
  "event_name": "Lost Localization",
  "localization_detail": {
    "amcl_topic": "/amcl_pose",
    "last_pose_time": "2026-04-23T10:41:02+07:00",
    "timeout_sec": 2.0,
  },
  "timestamp": "2026-04-23T10:41:05+07:00",
  "solution": "Stop robot, check LiDAR, map alignment, TF, and reinitialize AMCL (2D Pose Estimate)",
}

## Localization Accuracy Low

{
  "alarm_id": "LOC-006",
  "category": "Localization & Mapping",
  "event_name": "Localization Accuracy Low",
  "lastest_poi": "POI2",
  "lift up repeat": "15",
  "robot_pose": {
    "position": {
      "x": 3.45,
      "y": 1.92
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.61,
      "w": 0.79
    }
  },
  "timestamp": "2026-04-23T10:48:40+07:00"
  "solution": "example solutions",

}

## Map Mismatch
{
  "alarm_id": "MAP-007",
  "category": "Localization & Mapping",
  "event_name": "Map Mismatch",
  "robot_pose": {
    "position": {
      "x": 0.0,
      "y": 0.0
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0,
      "w": 1.0
    }
  },
  "map_detail": {
    "current_map": "warehouse_map_v1",
    "expected_map": "warehouse_map_v2",
    "mismatch_reason": "static obstacles do not align",
    "swap_method": "Node-RED map swap"
  },
  "timestamp": "2026-04-23T10:55:30+07:00",
  "solution": "Stop robot, cut motor power, verify correct map for the site, swap map via Node-RED, then 
}

## Marker / QR / RFID Not Found

{
  "alarm_id": "LOC-008",
  "category": "Localization & Mapping",
  "event_name": "Marker / QR / RFID Not Found",
  "dock_detail": {
    "start_process_time_stamp" : "2026-04-23T11:05:10+07:00",
    "dock_id": "dock_station_A",
    "retry_count": 5,
    "max_retry_allowed": 4
    "end_process_time_stamp" : "2026-04-23T11:05:10+07:00",
  },
  "timestamp": "2026-04-23T11:05:10+07:00",
  "solution": "Check marker/QR/RFID visibility, clean sensor or camera, verify dock position, and retry 
}


## Re-localization Failed
{
  "alarm_id": "LOC-009",
  "category": "Localization & Mapping",
  "event_name": "Re-localization Failed",
  "current_map": "warehouse_map_v1",
  "robot_pose": {
    "position": {
      "x": 0.0,
      "y": 0.0
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0,
      "w": 1.0
    }
  },
  "timestamp": "2026-04-23T11:12:45+07:00",
  "solution": "Stop robot, check LiDAR and map alignment, manually set initial pose, verify lift mechanism state, and retry re-localization"
}

## Path Blocked

{
  "alarm_id": "NAV-010",
  "category": "Navigation & Path Control",
  "event_name": "Path Blocked",
  "lastest_poi": "POI15",
  "robot_pose": {
    "position": {
      "x": 8.21,
      "y": 4.33
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.24,
      "w": 0.97
    }
  },

  "timestamp": "2026-04-23T11:20:10+07:00",
  "solution": "example solution",
  "current_map": "example map"
}

## Motion & Drive System

{
  "alarm_id": "DRV-011",
  "category": "Motion & Drive System",
  "event_name": "Motor Overtemperature",
  "robot_pose": {
    "position": {
      "x": 1.88,
      "y": 6.42
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.91,
      "w": 0.41
    }
  },
  "current_map": "example map",
  "timestamp": "2026-04-23T11:28:16+07:00",
  "solution": "Stop robot immediately, cut motor power, allow motor to cool down, check load and ventilation, and inspect motor driver",
}

## Drive Enable Fail

{
  "alarm_id": "DRV-012",
  "category": "Motion & Drive System",
  "event_name": "Drive Enable Fail",
  "robot_pose": {
    "position": {
      "x": 0.95,
      "y": 2.13
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.08,
      "w": 1.00
    }
  },
  "timestamp": "2026-04-23T11:34:51+07:00",
  "solution": "Stop robot, check emergency stop, safety relay, power supply, and motor driver error code, then re-enable drive",
}

## Speed Feedback Error

{
  "alarm_id": "DRV-013",
  "category": "Motion & Drive System",
  "event_name": "Speed Feedback Error",
  "robot_pose": {
    "frame_id": "map",
    "position": {
      "x": 4.62,
      "y": 3.18
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.33,
      "w": 0.94
    }
  },
  "timestamp": "2026-04-23T11:42:30+07:00",
  "solution": "Check encoder connection, verify velocity scaling, inspect wheel slip, and review Node-RED velocity configuration",
  "currentmap": "example map",
  "latest_poi": "POI17"
}

## Battery Low
{
  "AlarmID": "BAT-014",
  "Category": "Battery & Charging",
  "EventName": "Battery Low",
  "RobotPose": {
    "position": {
      "x": 1.80,
      "y": 4.25
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.45,
      "w": 0.89
    }
  },
  "EventData": {
    "battery_percent": 29,
    "voltage": 47.1,
    "cell_voltage": {
      "cell_1": 3.72,
      "cell_2": 3.71,
      "cell_3": 3.69,
      "cell_4": 3.70,
      "cell_5": 3.68,
      "cell_6": 3.72,
      "cell_7": 3.70,
      "cell_8": 3.71
    }
  },
  "Timestamp": "2026-04-23T15:10:42+07:00",
  "Solution": "Monitor battery level and return to charging station before reaching critical level",
  "Current map": "Example map"
  "lastest_poi": "POI17"
}

## Battery Critical

{
  "AlarmID": "BAT-015",
  "Category": "Battery & Charging",
  "EventName": "Battery Critical",
  "EventDescriptionTH": "แบตเตอรี่ต่ำระดับวิกฤต",
  "RobotPose": {
    "position": {
      "x": 0.0,
      "y": 0.0
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0,
      "w": 1.0
    }
  },
  "EventData": {
    "battery_percent": 12,
    "pack_voltage": 44.2,
    "cell_voltage": {
      "cell_1": 3.30,
      "cell_2": 3.28,
      "cell_3": 3.31,
      "cell_4": 3.29,
      "cell_5": 3.27,
      "cell_6": 3.30,
      "cell_7": 3.28,
      "cell_8": 3.29
    }
  },
  "Timestamp": "2026-04-23T15:25:10+07:00",
  "Solution": "Stop current cycle, return to charging station immediately, and resume task after charging reaches safe threshold",
  "Current map": "Example map"
  "lastest_poi": "POI17"
}


## Charging Current Abnormal

{
  "AlarmID": "BAT-016",
  "Category": "Battery & Charging",
  "EventName": "Charging Current Abnormal",
  "RobotPose": {
    "position": {
      "x": 10.50,
      "y": 1.20
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.98,
      "w": 0.18
    }
  },
  "EventData": {
    "charging_state": "CHARGING",
    "charging_voltage": 54.2,
    "charging_current": 8.5,
    "expected_current_range": {
      "min": 3.0,
      "max": 6.0
    },
    "error_status_code": "CHG_E_CURRENT_ABNORMAL"
  },
  "Timestamp": "2026-04-23T15:40:55+07:00",
  "Solution": "Stop charging process, check charger output, battery pack condition, wiring, and current sensor calibration",
}

## Battery Communication Docking Error

{
  "AlarmID": "BAT-017",
  "Category": "Battery & Charging",
  "EventName": "Battery Communication Docking Error",
  "RobotPose": {
    "position": {
      "x": 10.55,
      "y": 1.18
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.99,
      "w": 0.14
    }
  },
  "EventData": {
    "dock_state": "ATTEMPTING_CONNECTION",
    "battery_comm_status": "FAILED",
    "dock_station_detected": "dock_A",
    "expected_station": "dock_B",
    "timeout_sec": 5,
    "retry_count": 3,
    "max_retry": 3,
    "error_code": "BAT_DOCK_COMM_FAIL"
  },
  "Timestamp": "2026-04-23T15:55:20+07:00",
  "Solution": "Verify correct docking station, restart communication handshake, check battery dock interface and network/IO connection",
}

## Power Supply Voltage Drop

{
  "AlarmID": "BAT-018",
  "Category": "Battery & Charging",
  "EventName": "Power Supply Voltage Drop",
  "RobotPose": {
    "position": {
      "x": 10.52,
      "y": 1.15
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.97,
      "w": 0.24
    }
  },
  "EventData": {
    "supply_voltage_v": 42.5,
    "supply_current_a": 6.8,
    "dock_state": "CHARGING",
    "dockid": "asdasdasd"

  },
  "Timestamp": "2026-04-23T16:10:05+07:00",
  "Solution": "Check power supply unit, wiring, docking contacts, and load condition. Ensure stable input voltage before charging continues",
}

## Auto Charging Failed

{
  "AlarmID": "BAT-019",
  "Category": "Battery & Charging",
  "EventName": "Auto Charging Failed",
  "EventData": {
    "charging_type": "AUTO",
    "dock_attempt": 2,
    "max_attempt": 3,
    "dock_status": "FAILED",
    "handshake_status": "TIMEOUT",
    "error_code": "AUTO_CHG_FAIL",
    "dockid": "asdasdasd"
  },
  "Timestamp": "2026-04-23T16:25:40+07:00",
  "Solution": "Check docking alignment, verify auto charging station availability, inspect communication link, and retry auto docking sequence or switch to manual docking mode"
}

## Camera Offline

{
  "AlarmID": "SEN-021",
  "Category": "Sensor & Vision",
  "EventName": "Camera Offline",
  "RobotPose": {
    "position": {
      "x": 2.10,
      "y": 3.55
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.42,
      "w": 0.91
    }
  },
  "EventData": {
    "camera_name": "front_camera",
    "camera_status": "OFFLINE",
    "timestamp": "2026-04-23T16:40:10+07:00",
    "error_code": "CAM_OFFLINE"
  },
  "Timestamp": "2026-04-23T16:40:15+07:00",
  "Solution": "Check camera power supply, USB/GMSL connection, driver status, and restart camera node or ROS launch file",
}

## IMU Error

{
  "AlarmID": "SEN-022",
  "Category": "Sensor & Vision",
  "EventName": "IMU Error",
  "EventData": {
    "imu_topic": "/imu/data",
    "imu_status": "ERROR",
    "error_code": "IMU_FAIL"
  },
  "Timestamp": "2026-04-23T16:55:20+07:00",
  "Solution": "Check IMU power supply, wiring connection, mounting stability, and restart IMU driver or ROS node"
}

## Proximity Sensor Fault

{
  "AlarmID": "SEN-023",
  "Category": "Sensor & Vision",
  "EventName": "Proximity Sensor Fault",
  "RobotPose": {
    "position": {
      "x": 1.75,
      "y": 4.10
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.58,
      "w": 0.81
    }
  },
  "EventData": {
    "sensor_type": "proximity",
    "sensor_location": "lift up or down",
    "sensor_status": "FAULT"
  },
  "Timestamp": "2026-04-23T17:10:05+07:00",
  "Solution": "Check proximity sensor wiring, clean sensor surface, verify mounting alignment, and restart sensor node or controller",
  "currentmap": true,
  "lastest_poi: "poi16"
}

## IO Module Offline
{
  "AlarmID": "IO-024",
  "Category": "IO / Electrical Alarm",
  "EventName": "IO Module Offline",
  "Timestamp": "2026-04-23T17:25:12+07:00",
  "Solution": "Check IO power supply, communication cable (RS485/CAN/EtherCAT), controller status, and restart IO module or main controller",
}

## Encoder Power Lost

{
  "AlarmID": "IO-025",
  "Category": "IO / Electrical Alarm",
  "EventName": "Encoder Power Lost",
  "Timestamp": "2026-04-23T17:40:12+07:00",
  "Solution": "Check encoder power supply (5V/12V), wiring harness, motor driver output, and verify connector seating or replace encoder cable if damaged",
  "currentmap": true,
  "lastest_poi: "poi16"
}

## Lifter Failed

{
  "AlarmID": "TASK-026",
  "Category": "Task / Mission",
  "EventName": "Lifter Failed",
  "RobotPose": {
    "position": {
      "x": 3.20,
      "y": 1.85
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.62,
      "w": 0.78
    }
  },
  "EventData": {
    "lift_command": "UP",
    "lift_status": "FAILED",
    "error_code": "LIFT_FAIL"
  },
  "Timestamp": "2026-04-23T17:55:20+07:00",
  "Solution": "Check lift motor load, mechanical jam, limit switch, encoder feedback, and lift driver current. Clear obstruction and retry lift operation",
  "currentmap": true,
  "lastest_poi: "poi16"
}

## Disk Full

{
  "AlarmID": "SW-027",
  "Category": "Software & Controller",
  "EventName": "Disk Full",
  "RobotPose": {
    "position": {
      "x": 0.0,
      "y": 0.0
    },
    "orientation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0,
      "w": 1.0
    }
  },
  "EventData": {
    "disk_usage_percent": 98,
    "threshold_percent": 90,
    "available_space_mb": 120,
  },
  "Timestamp": "2026-04-23T18:10:00+07:00",
}

## CPU Overload

{
  "AlarmID": "SW-029",
  "Category": "Software & Controller",
  "EventName": "CPU Overload",
  "EventDescriptionTH": "CPU ทำงานหนักเกินกำหนด",
  "EventData": {
    "cpu_usage_percent": 97,
    "cpu_temperature_c": 82,
    "load_average": "5.8 / 6.0 / 6.2",
    "threshold_percent": 85,
  },
  "Timestamp": "2026-04-23T18:40:10+07:00",
  "Solution": "Reduce running processes, restart heavy nodes, optimize perception/planning load, check memory leaks, and enable CPU throttling or task prioritization"
}