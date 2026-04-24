'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';

// ── Types ────────────────────────────────────────────────────────────────────
interface DataField { name: string; mockValue: string; description: string }

interface AlarmInfo {
  id: number;
  category: string;
  alarmNameEN: string;
  alarmNameTH: string;
  ledColor: string;
  motorControl: string;
  dataFields: DataField[];
}

interface AlarmLog {
  id: string;
  timestamp: string;
  alarmId: number;
  alarmName: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  value: string;
  status: 'ACTIVE' | 'RESOLVED' | 'MONITORING' | 'MAINTENANCE_PENDING' | 'ALERT';
  dataSnapshot: Record<string, string>;
}

// ── Alarm reference (data fields from README) ────────────────────────────────
const alarmInfoMap: Record<number, AlarmInfo> = {
  1:  { id:1,  category:'Safety & Compliance',      alarmNameEN:'Emergency Stop Activated',    alarmNameTH:'ปุ่มหยุดฉุกเฉินถูกกด',           ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'alarm_id',mockValue:'SAF-001',description:'รหัส Alarm'},{name:'timestamp',mockValue:'2026-04-23T10:15:33+07:00',description:'เวลาที่เกิด'},{name:'solution',mockValue:'Stop robot immediately, wait until safety zone is clear',description:'วิธีแก้ไข'},{name:'robot_pose.position.x',mockValue:'1.24',description:'ตำแหน่ง X ของหุ่น'},{name:'robot_pose.position.y',mockValue:'3.56',description:'ตำแหน่ง Y ของหุ่น'},{name:'robot_pose.orientation.z',mockValue:'0.71',description:'Orientation Z'},{name:'robot_pose.orientation.w',mockValue:'0.71',description:'Orientation W'}]},
  2:  { id:2,  category:'Safety & Compliance',      alarmNameEN:'Safety Scanner Triggered',    alarmNameTH:'เซฟตี้สแกนเนอร์ทำงาน',          ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'alarm_id',mockValue:'SAF-002',description:'รหัส Alarm'},{name:'event_name',mockValue:'Lidar not found init start',description:'ชื่อ Event'},{name:'timestamp',mockValue:'2026-04-23T10:15:33+07:00',description:'เวลาที่เกิด'},{name:'solution',mockValue:'Stop robot immediately, wait until safety zone is clear',description:'วิธีแก้ไข'}]},
  3:  { id:3,  category:'Safety & Compliance',      alarmNameEN:'Safety Zone Violation',       alarmNameTH:'ละเมิดเขตความปลอดภัย',           ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'alarm_id',mockValue:'SAF-003',description:'รหัส Alarm'},{name:'mapname',mockValue:'example map',description:'แผนที่ที่ใช้งาน'},{name:'status',mockValue:'ACTIVE',description:'สถานะ'},{name:'severity',mockValue:'CRITICAL',description:'ระดับความรุนแรง'},{name:'robot_pose.position.x',mockValue:'2.31',description:'ตำแหน่ง X ของหุ่น'},{name:'robot_pose.position.y',mockValue:'1.47',description:'ตำแหน่ง Y ของหุ่น'},{name:'robot_pose.orientation.z',mockValue:'0.38',description:'Orientation Z'},{name:'robot_pose.orientation.w',mockValue:'0.92',description:'Orientation W'},{name:'Wall_Zone.type',mockValue:'wall',description:'ประเภทของ Zone'},{name:'Wall_Zone.position.x',mockValue:'2.31',description:'พิกัด X ของโซน'},{name:'Wall_Zone.position.y',mockValue:'1.47',description:'พิกัด Y ของโซน'},{name:'Wall_Zone.orientation.z',mockValue:'0.38',description:'Zone Orientation Z'},{name:'Wall_Zone.orientation.w',mockValue:'0.92',description:'Zone Orientation W'},{name:'timestamp',mockValue:'2026-04-23T10:22:10+07:00',description:'เวลาที่เกิด'},{name:'solution',mockValue:'Stop robot immediately, wait until safety zone is clear',description:'วิธีแก้ไข'}]},
  4:  { id:4,  category:'Safety & Compliance',      alarmNameEN:'Reduced Speed Zone Violation',alarmNameTH:'ละเมิดโซนจำกัดความเร็ว',          ledColor:'RED',    motorControl:'RUNNING', dataFields:[{name:'alarm_id',mockValue:'SAF-004',description:'รหัส Alarm'},{name:'robot_pose.position.x',mockValue:'5.12',description:'ตำแหน่ง X ของหุ่น'},{name:'robot_pose.position.y',mockValue:'2.84',description:'ตำแหน่ง Y ของหุ่น'},{name:'robot_pose.orientation.z',mockValue:'0.52',description:'Orientation Z'},{name:'robot_pose.orientation.w',mockValue:'0.85',description:'Orientation W'},{name:'speed_detail.zone_name',mockValue:'reduced_speed_zone_A',description:'ชื่อโซนจำกัดความเร็ว'},{name:'speed_detail.max_speed_mps',mockValue:'0.3 m/s',description:'ความเร็วสูงสุดที่อนุญาต'},{name:'speed_detail.current_speed_mps',mockValue:'0.6 m/s',description:'ความเร็วปัจจุบัน'},{name:'timestamp',mockValue:'2026-04-23T10:35:20+07:00',description:'เวลาที่เกิด'},{name:'mapname',mockValue:'example map',description:'แผนที่ที่ใช้งาน'}]},
  5:  { id:5,  category:'Localization & Mapping',   alarmNameEN:'Lost Localization',           alarmNameTH:'ไม่สามารถระบุตำแหน่งได้',        ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'alarm_id',mockValue:'LOC-005',description:'รหัส Alarm'},{name:'localization_detail.amcl_topic',mockValue:'/amcl_pose',description:'ROS topic ของ AMCL'},{name:'localization_detail.last_pose_time',mockValue:'2026-04-23T10:41:02+07:00',description:'เวลา Pose สุดท้าย'},{name:'localization_detail.timeout_sec',mockValue:'2.0 s',description:'ระยะเวลา timeout'},{name:'timestamp',mockValue:'2026-04-23T10:41:05+07:00',description:'เวลาที่เกิด'},{name:'solution',mockValue:'Stop robot, check LiDAR, map alignment, TF, and reinitialize AMCL (2D Pose Estimate)',description:'วิธีแก้ไข'}]},
  6:  { id:6,  category:'Localization & Mapping',   alarmNameEN:'Localization Accuracy Low',   alarmNameTH:'ความแม่นยำของตำแหน่งต่ำ',        ledColor:'RED',    motorControl:'RUNNING', dataFields:[{name:'alarm_id',mockValue:'LOC-006',description:'รหัส Alarm'},{name:'lastest_poi',mockValue:'POI2',description:'จุดอ้างอิงล่าสุด'},{name:'lift_up_repeat',mockValue:'15',description:'จำนวนครั้งที่ยก'},{name:'robot_pose.position.x',mockValue:'3.45',description:'ตำแหน่ง X ของหุ่น'},{name:'robot_pose.position.y',mockValue:'1.92',description:'ตำแหน่ง Y ของหุ่น'},{name:'robot_pose.orientation.z',mockValue:'0.61',description:'Orientation Z'},{name:'robot_pose.orientation.w',mockValue:'0.79',description:'Orientation W'},{name:'timestamp',mockValue:'2026-04-23T10:48:40+07:00',description:'เวลาที่เกิด'},{name:'solution',mockValue:'example solutions',description:'วิธีแก้ไข'}]},
  7:  { id:7,  category:'Localization & Mapping',   alarmNameEN:'Map Mismatch',                alarmNameTH:'แผนที่ไม่ตรงกับหน้างาน',         ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'alarm_id',mockValue:'MAP-007',description:'รหัส Alarm'},{name:'robot_pose.frame_id',mockValue:'map',description:'Frame ID'},{name:'robot_pose.position.x',mockValue:'0.0',description:'ตำแหน่ง X ของหุ่น'},{name:'robot_pose.position.y',mockValue:'0.0',description:'ตำแหน่ง Y ของหุ่น'},{name:'robot_pose.orientation.z',mockValue:'0.0',description:'Orientation Z'},{name:'robot_pose.orientation.w',mockValue:'1.0',description:'Orientation W'},{name:'map_detail.current_map',mockValue:'warehouse_map_v1',description:'แผนที่ที่ใช้งานอยู่'},{name:'map_detail.expected_map',mockValue:'warehouse_map_v2',description:'แผนที่ที่ควรจะเป็น'},{name:'map_detail.mismatch_reason',mockValue:'static obstacles do not align',description:'สาเหตุที่ไม่ตรง'},{name:'map_detail.swap_method',mockValue:'Node-RED map swap',description:'วิธีสลับแผนที่'},{name:'timestamp',mockValue:'2026-04-23T10:55:30+07:00',description:'เวลาที่เกิด'},{name:'solution',mockValue:'Stop robot, cut motor power, verify correct map for the site, swap map via Node-RED',description:'วิธีแก้ไข'}]},
  8:  { id:8,  category:'Localization & Mapping',   alarmNameEN:'Marker / QR / RFID Not Found',alarmNameTH:'ไม่พบ Marker / QR / RFID',        ledColor:'RED',    motorControl:'RUNNING', dataFields:[{name:'alarm_id',mockValue:'LOC-008',description:'รหัส Alarm'},{name:'dock_detail.start_process_time_stamp',mockValue:'2026-04-23T11:05:10+07:00',description:'เวลาเริ่มกระบวนการ'},{name:'dock_detail.dock_id',mockValue:'dock_station_A',description:'ID ของ Dock station'},{name:'dock_detail.retry_count',mockValue:'5',description:'จำนวนครั้งที่ลองใหม่'},{name:'dock_detail.max_retry_allowed',mockValue:'4',description:'จำนวนครั้งสูงสุดที่อนุญาต'},{name:'dock_detail.end_process_time_stamp',mockValue:'2026-04-23T11:05:10+07:00',description:'เวลาสิ้นสุดกระบวนการ'},{name:'timestamp',mockValue:'2026-04-23T11:05:10+07:00',description:'เวลาที่เกิด'},{name:'solution',mockValue:'Check marker/QR/RFID visibility, clean sensor or camera, verify dock position, and retry',description:'วิธีแก้ไข'}]},
  9:  { id:9,  category:'Localization & Mapping',   alarmNameEN:'Re-localization Failed',      alarmNameTH:'ระบุตำแหน่งใหม่ไม่สำเร็จ',       ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'alarm_id',mockValue:'LOC-009',description:'รหัส Alarm'},{name:'current_map',mockValue:'warehouse_map_v1',description:'แผนที่ที่ใช้งาน'},{name:'robot_pose.position.x',mockValue:'0.0',description:'ตำแหน่ง X ของหุ่น'},{name:'robot_pose.position.y',mockValue:'0.0',description:'ตำแหน่ง Y ของหุ่น'},{name:'robot_pose.orientation.z',mockValue:'0.0',description:'Orientation Z'},{name:'robot_pose.orientation.w',mockValue:'1.0',description:'Orientation W'},{name:'timestamp',mockValue:'2026-04-23T11:12:45+07:00',description:'เวลาที่เกิด'},{name:'solution',mockValue:'Stop robot, check LiDAR and map alignment, manually set initial pose, verify lift mechanism state, and retry re-localization',description:'วิธีแก้ไข'}]},
  10: { id:10, category:'Navigation & Path Control',alarmNameEN:'Path Blocked',                alarmNameTH:'เส้นทางถูกกีดขวาง',              ledColor:'RED',    motorControl:'RUNNING', dataFields:[{name:'Timestamp',mockValue:'2026-04-23T11:20:10+07:00',description:'เวลาที่เกิด'},{name:'Lastest_POI',mockValue:'POI15',description:'จุดอ้างอิงล่าสุด'},{name:'MoveBase_Status',mockValue:'ABORTED',description:'สถานะ MoveBase'},{name:'Obstacle_Detection',mockValue:'0.35 m',description:'ระยะสิ่งกีดขวาง'},{name:'Robot_Pose_X',mockValue:'8.21',description:'ตำแหน่ง X ของหุ่น'},{name:'Robot_Pose_Y',mockValue:'4.33',description:'ตำแหน่ง Y ของหุ่น'},{name:'Current_Map',mockValue:'example map',description:'แผนที่ที่ใช้งาน'}]},
  11: { id:11, category:'Motion & Drive System',    alarmNameEN:'Motor Overtemperature',       alarmNameTH:'มอเตอร์ร้อนเกิน',                ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'Timestamp',mockValue:'2026-04-23T11:28:16+07:00',description:'เวลาที่เกิด'},{name:'Current_Temperature_C',mockValue:'78.5 °C',description:'อุณหภูมิมอเตอร์'},{name:'Temperature_Threshold',mockValue:'75.0 °C',description:'ค่า threshold'},{name:'Error_Status_Code',mockValue:'0x12 (OVER_TEMP)',description:'รหัส Error'},{name:'Robot_Pose_X',mockValue:'1.88',description:'ตำแหน่ง X ของหุ่น'},{name:'Robot_Pose_Y',mockValue:'6.42',description:'ตำแหน่ง Y ของหุ่น'},{name:'Current_Map',mockValue:'example map',description:'แผนที่ที่ใช้งาน'}]},
  12: { id:12, category:'Motion & Drive System',    alarmNameEN:'Drive Enable Fail',           alarmNameTH:'Drive Disable',                   ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'Timestamp',mockValue:'2026-04-23T11:34:51+07:00',description:'เวลาที่เกิด'},{name:'Drive_Status_Code',mockValue:'0x05 (DISABLED)',description:'รหัสสถานะ Drive'},{name:'Error_Details',mockValue:'Enable signal lost',description:'รายละเอียด Error'},{name:'Voltage_Reading',mockValue:'23.4 V',description:'แรงดันไฟที่วัดได้'},{name:'Robot_Pose_X',mockValue:'0.95',description:'ตำแหน่ง X ของหุ่น'},{name:'Robot_Pose_Y',mockValue:'2.13',description:'ตำแหน่ง Y ของหุ่น'}]},
  13: { id:13, category:'Motion & Drive System',    alarmNameEN:'Speed Feedback Error',        alarmNameTH:'ความเร็ว ผิดปกติ',               ledColor:'RED',    motorControl:'RUNNING', dataFields:[{name:'Timestamp',mockValue:'2026-04-23T11:42:30+07:00',description:'เวลาที่เกิด'},{name:'Current_Velocity_ms',mockValue:'0.45 m/s',description:'ความเร็วที่วัดได้'},{name:'Expected_Velocity_ms',mockValue:'0.50 m/s',description:'ความเร็วที่คาดหวัง'},{name:'NodeRed_MS_Velocity',mockValue:'0.50 m/s',description:'ค่าจาก Node-RED'},{name:'Robot_Pose_X',mockValue:'4.62',description:'ตำแหน่ง X ของหุ่น'},{name:'Robot_Pose_Y',mockValue:'3.18',description:'ตำแหน่ง Y ของหุ่น'},{name:'Current_Map',mockValue:'example map',description:'แผนที่ที่ใช้งาน'},{name:'Latest_POI',mockValue:'POI17',description:'จุดอ้างอิงล่าสุด'}]},
  14: { id:14, category:'Battery & Charging',       alarmNameEN:'Battery Low',                 alarmNameTH:'แบตเตอรี่ต่ำ',                   ledColor:'YELLOW', motorControl:'RUNNING', dataFields:[{name:'Timestamp',mockValue:'2026-04-23T15:10:42+07:00',description:'เวลาที่เกิด'},{name:'Battery_Percentage',mockValue:'29 %',description:'เปอร์เซ็นต์แบต'},{name:'Voltage_V',mockValue:'47.1 V',description:'แรงดันแบตเตอรี่รวม'},{name:'Cell_1_V',mockValue:'3.72 V',description:'แรงดัน Cell 1'},{name:'Cell_2_V',mockValue:'3.71 V',description:'แรงดัน Cell 2'},{name:'Cell_3_V',mockValue:'3.69 V',description:'แรงดัน Cell 3'},{name:'Cell_4_V',mockValue:'3.70 V',description:'แรงดัน Cell 4'},{name:'Cell_5_V',mockValue:'3.68 V',description:'แรงดัน Cell 5'},{name:'Cell_6_V',mockValue:'3.72 V',description:'แรงดัน Cell 6'},{name:'Cell_7_V',mockValue:'3.70 V',description:'แรงดัน Cell 7'},{name:'Cell_8_V',mockValue:'3.71 V',description:'แรงดัน Cell 8'},{name:'Robot_Pose_X',mockValue:'1.80',description:'ตำแหน่ง X ของหุ่น'},{name:'Robot_Pose_Y',mockValue:'4.25',description:'ตำแหน่ง Y ของหุ่น'},{name:'Current_Map',mockValue:'example map',description:'แผนที่ที่ใช้งาน'},{name:'Lastest_POI',mockValue:'POI17',description:'จุดอ้างอิงล่าสุด'}]},
  15: { id:15, category:'Battery & Charging',       alarmNameEN:'Battery Critical',            alarmNameTH:'แบตเตอรี่ต่ำระดับวิกฤต',         ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'Timestamp',mockValue:'2026-04-23T15:25:10+07:00',description:'เวลาที่เกิด'},{name:'Battery_Percentage',mockValue:'12 %',description:'เปอร์เซ็นต์แบต'},{name:'Pack_Voltage_V',mockValue:'44.2 V',description:'แรงดันรวม Pack'},{name:'Cell_1_V',mockValue:'3.30 V',description:'แรงดัน Cell 1'},{name:'Cell_2_V',mockValue:'3.28 V',description:'แรงดัน Cell 2'},{name:'Cell_3_V',mockValue:'3.31 V',description:'แรงดัน Cell 3'},{name:'Cell_4_V',mockValue:'3.29 V',description:'แรงดัน Cell 4'},{name:'Cell_5_V',mockValue:'3.27 V',description:'แรงดัน Cell 5'},{name:'Cell_6_V',mockValue:'3.30 V',description:'แรงดัน Cell 6'},{name:'Cell_7_V',mockValue:'3.28 V',description:'แรงดัน Cell 7'},{name:'Cell_8_V',mockValue:'3.29 V',description:'แรงดัน Cell 8'},{name:'Robot_Pose_X',mockValue:'0.0',description:'ตำแหน่ง X ของหุ่น'},{name:'Robot_Pose_Y',mockValue:'0.0',description:'ตำแหน่ง Y ของหุ่น'},{name:'Current_Map',mockValue:'example map',description:'แผนที่ที่ใช้งาน'},{name:'Lastest_POI',mockValue:'POI17',description:'จุดอ้างอิงล่าสุด'}]},
  16: { id:16, category:'Battery & Charging',       alarmNameEN:'Charging Current Abnormal',   alarmNameTH:'Current ผิดปกติ',                 ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'Timestamp',mockValue:'2026-04-23T15:40:55+07:00',description:'เวลาที่เกิด'},{name:'Charging_State',mockValue:'CHARGING',description:'สถานะการชาร์จ'},{name:'Charging_Voltage_V',mockValue:'54.2 V',description:'แรงดันขณะชาร์จ'},{name:'Charging_Current_A',mockValue:'8.5 A',description:'กระแสชาร์จที่วัดได้'},{name:'Expected_Current_Min_A',mockValue:'3.0 A',description:'กระแสต่ำสุดที่ยอมรับ'},{name:'Expected_Current_Max_A',mockValue:'6.0 A',description:'กระแสสูงสุดที่ยอมรับ'},{name:'Error_Status_Code',mockValue:'CHG_E_CURRENT_ABNORMAL',description:'รหัส Error'},{name:'Robot_Pose_X',mockValue:'10.50',description:'ตำแหน่ง X ของหุ่น'},{name:'Robot_Pose_Y',mockValue:'1.20',description:'ตำแหน่ง Y ของหุ่น'}]},
  17: { id:17, category:'Battery & Charging',       alarmNameEN:'Battery Communication Docking Error',alarmNameTH:'Battery Communication Error',ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'Timestamp',mockValue:'2026-04-23T15:55:20+07:00',description:'เวลาที่เกิด'},{name:'Dock_State',mockValue:'ATTEMPTING_CONNECTION',description:'สถานะ Dock'},{name:'Battery_Comm_Status',mockValue:'FAILED',description:'สถานะการสื่อสาร'},{name:'Dock_Station_Detected',mockValue:'dock_A',description:'Station ที่ตรวจพบ'},{name:'Expected_Station',mockValue:'dock_B',description:'Station ที่คาดว่าจะพบ'},{name:'Timeout_sec',mockValue:'5 s',description:'ระยะเวลา timeout'},{name:'Retry_Count',mockValue:'3',description:'จำนวน retry'},{name:'Max_Retry',mockValue:'3',description:'จำนวน retry สูงสุด'},{name:'Error_Code',mockValue:'BAT_DOCK_COMM_FAIL',description:'รหัส Error'},{name:'Robot_Pose_X',mockValue:'10.55',description:'ตำแหน่ง X'},{name:'Robot_Pose_Y',mockValue:'1.18',description:'ตำแหน่ง Y'}]},
  18: { id:18, category:'Battery & Charging',       alarmNameEN:'Power Supply Voltage Drop',   alarmNameTH:'Power Supply Voltage Drop',       ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'Timestamp',mockValue:'2026-04-23T16:10:05+07:00',description:'เวลาที่เกิด'},{name:'Supply_Voltage_V',mockValue:'42.5 V',description:'แรงดัน Supply ปัจจุบัน'},{name:'Supply_Current_A',mockValue:'6.8 A',description:'กระแส Supply'},{name:'Dock_State',mockValue:'CHARGING',description:'สถานะ Dock'},{name:'Dock_ID',mockValue:'dock_A',description:'ID ของ Dock'},{name:'Robot_Pose_X',mockValue:'10.52',description:'ตำแหน่ง X'},{name:'Robot_Pose_Y',mockValue:'1.15',description:'ตำแหน่ง Y'}]},
  19: { id:19, category:'Battery & Charging',       alarmNameEN:'Auto Charging Failed',        alarmNameTH:'การชาร์จอัตโนมัติล้มเหลว',       ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'Timestamp',mockValue:'2026-04-23T16:25:40+07:00',description:'เวลาที่เกิด'},{name:'Charging_Type',mockValue:'AUTO',description:'ประเภทการชาร์จ'},{name:'Dock_Attempt',mockValue:'2',description:'จำนวนครั้งที่พยายาม dock'},{name:'Max_Attempt',mockValue:'3',description:'จำนวนครั้งสูงสุด'},{name:'Dock_Status',mockValue:'FAILED',description:'สถานะ Dock'},{name:'Handshake_Status',mockValue:'TIMEOUT',description:'สถานะ Handshake'},{name:'Error_Code',mockValue:'AUTO_CHG_FAIL',description:'รหัส Error'},{name:'Dock_ID',mockValue:'dock_A',description:'ID ของ Dock'}]},
  20: { id:20, category:'Sensor & Vision',          alarmNameEN:'Lidar Fault',                 alarmNameTH:'Lidar ขัดข้อง',                   ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'Timestamp',mockValue:'2026-04-22 10:22:18',description:'เวลาที่เกิด'},{name:'Lidar_Status_Code',mockValue:'0x0F (FAULT)',description:'รหัสสถานะ Lidar'},{name:'Error_Details',mockValue:'Scan timeout exceeded',description:'รายละเอียด Error'},{name:'Realtime_Check_Data',mockValue:'NULL',description:'ข้อมูล realtime'}]},
  21: { id:21, category:'Sensor & Vision',          alarmNameEN:'Camera Offline',              alarmNameTH:'กล้องไม่ทำงาน',                  ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'Timestamp',mockValue:'2026-04-23T16:40:15+07:00',description:'เวลาที่เกิด'},{name:'Camera_Name',mockValue:'front_camera',description:'ชื่อกล้อง'},{name:'Camera_Status',mockValue:'OFFLINE',description:'สถานะกล้อง'},{name:'Last_Frame_Timestamp',mockValue:'2026-04-23T16:40:10+07:00',description:'เวลา frame สุดท้าย'},{name:'Error_Code',mockValue:'CAM_OFFLINE',description:'รหัส Error'},{name:'Robot_Pose_X',mockValue:'2.10',description:'ตำแหน่ง X'},{name:'Robot_Pose_Y',mockValue:'3.55',description:'ตำแหน่ง Y'}]},
  22: { id:22, category:'Sensor & Vision',          alarmNameEN:'IMU Error',                   alarmNameTH:'เซนเซอร์ IMU Error',             ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'Timestamp',mockValue:'2026-04-23T16:55:20+07:00',description:'เวลาที่เกิด'},{name:'IMU_Topic',mockValue:'/imu/data',description:'ROS topic ของ IMU'},{name:'IMU_Status',mockValue:'ERROR',description:'สถานะ IMU'},{name:'Error_Code',mockValue:'IMU_FAIL',description:'รหัส Error'}]},
  23: { id:23, category:'Sensor & Vision',          alarmNameEN:'Proximity Sensor Fault',      alarmNameTH:'เซนเซอร์ Proximity Error',       ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'Timestamp',mockValue:'2026-04-23T17:10:05+07:00',description:'เวลาที่เกิด'},{name:'Sensor_Type',mockValue:'proximity',description:'ประเภทเซนเซอร์'},{name:'Sensor_Location',mockValue:'lift up or down',description:'ตำแหน่งเซนเซอร์'},{name:'Sensor_Status',mockValue:'FAULT',description:'สถานะเซนเซอร์'},{name:'Robot_Pose_X',mockValue:'1.75',description:'ตำแหน่ง X'},{name:'Robot_Pose_Y',mockValue:'4.10',description:'ตำแหน่ง Y'},{name:'Lastest_POI',mockValue:'poi16',description:'จุดอ้างอิงล่าสุด'}]},
  24: { id:24, category:'IO / Electrical Alarm',    alarmNameEN:'IO Module Offline',           alarmNameTH:'โมดูล IO ออฟไลน์',               ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'Timestamp',mockValue:'2026-04-23T17:25:12+07:00',description:'เวลาที่เกิด'},{name:'Module_ID',mockValue:'IO_MOD_02',description:'ID ของโมดูล IO'},{name:'Connection_Status',mockValue:'OFFLINE',description:'สถานะการเชื่อมต่อ'},{name:'Last_Heartbeat',mockValue:'2026-04-23T17:24:58+07:00',description:'Heartbeat สุดท้าย'}]},
  25: { id:25, category:'IO / Electrical Alarm',    alarmNameEN:'Encoder Power Lost',          alarmNameTH:'Encoder Power Lost',              ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'Timestamp',mockValue:'2026-04-23T17:40:12+07:00',description:'เวลาที่เกิด'},{name:'Motor_ID',mockValue:'MOTOR_L',description:'ID มอเตอร์ที่เกิด Error'},{name:'Power_Status',mockValue:'0 V (Lost)',description:'สถานะไฟ Encoder'},{name:'Drive_Motor_Feedback',mockValue:'NO_FEEDBACK',description:'Feedback จาก Drive'},{name:'Lastest_POI',mockValue:'poi16',description:'จุดอ้างอิงล่าสุด'}]},
  26: { id:26, category:'Task / Mission',           alarmNameEN:'Lifter Failed',               alarmNameTH:'Lifter ยกงานไม่ได้',              ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'Timestamp',mockValue:'2026-04-23T17:55:20+07:00',description:'เวลาที่เกิด'},{name:'Lift_Command',mockValue:'UP',description:'คำสั่ง Lift'},{name:'Lift_Status',mockValue:'FAILED',description:'สถานะ Lift'},{name:'Lift_Auto_Check_Result',mockValue:'FAIL',description:'ผลการตรวจสอบอัตโนมัติ'},{name:'Current_Height',mockValue:'0.05 m',description:'ความสูงปัจจุบัน'},{name:'Motor_Status',mockValue:'STALLED',description:'สถานะมอเตอร์'},{name:'Error_Code',mockValue:'LIFT_FAIL',description:'รหัส Error'},{name:'Robot_Pose_X',mockValue:'3.20',description:'ตำแหน่ง X'},{name:'Robot_Pose_Y',mockValue:'1.85',description:'ตำแหน่ง Y'},{name:'Lastest_POI',mockValue:'poi16',description:'จุดอ้างอิงล่าสุด'}]},
  27: { id:27, category:'Software & Controller',    alarmNameEN:'Disk Full',                   alarmNameTH:'ดิสก์เต็ม',                       ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'Timestamp',mockValue:'2026-04-23T18:10:00+07:00',description:'เวลาที่เกิด'},{name:'Disk_Usage_Percent',mockValue:'98 %',description:'การใช้งาน disk'},{name:'Threshold_Percent',mockValue:'90 %',description:'ค่า threshold'},{name:'Available_Space_MB',mockValue:'120 MB',description:'พื้นที่คงเหลือ'},{name:'Robot_Pose_X',mockValue:'0.0',description:'ตำแหน่ง X'},{name:'Robot_Pose_Y',mockValue:'0.0',description:'ตำแหน่ง Y'}]},
  28: { id:28, category:'Software & Controller',    alarmNameEN:'Parameter Out of Range',      alarmNameTH:'พารามิเตอร์เกินควบคุม',           ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'Timestamp',mockValue:'2026-04-18 11:30:45',description:'เวลาที่เกิด'},{name:'Parameter_Name',mockValue:'max_linear_vel',description:'ชื่อพารามิเตอร์'},{name:'Current_Value',mockValue:'1.25 m/s',description:'ค่าปัจจุบัน'},{name:'Valid_Range',mockValue:'0.0 – 1.0 m/s',description:'ช่วงค่าที่ยอมรับ'}]},
  29: { id:29, category:'Software & Controller',    alarmNameEN:'CPU Overload',                alarmNameTH:'CPU Overload',                    ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'Timestamp',mockValue:'2026-04-23T18:40:10+07:00',description:'เวลาที่เกิด'},{name:'CPU_Usage_Percent',mockValue:'97 %',description:'การใช้งาน CPU'},{name:'CPU_Temperature_C',mockValue:'82 °C',description:'อุณหภูมิ CPU'},{name:'Load_Average',mockValue:'5.8 / 6.0 / 6.2',description:'ค่า Load Average'},{name:'Threshold_Percent',mockValue:'85 %',description:'ค่า threshold'}]},
  30: { id:30, category:'Software & Controller',    alarmNameEN:'Unexpected Reboot',           alarmNameTH:'ระบบรีสตาร์ทผิดปกติ',            ledColor:'RED',    motorControl:'STOPPED', dataFields:[{name:'Timestamp',mockValue:'2026-04-10 04:22:00',description:'เวลาที่เกิด'},{name:'Reboot_Reason',mockValue:'Kernel Panic',description:'สาเหตุการรีบูต'},{name:'PC_Shutdown_Log',mockValue:'shutdown_20260410.log',description:'ไฟล์ log การปิดระบบ'},{name:'Last_Boot_Log',mockValue:'boot_20260410_042205.log',description:'ไฟล์ log การบูต'}]},
  31: { id:31, category:'Maintenance & Warning',    alarmNameEN:'Preventive Maintenance Due',  alarmNameTH:'ถึงกำหนดบำรุงรักษา',             ledColor:'YELLOW', motorControl:'RUNNING', dataFields:[{name:'Timestamp',mockValue:'2026-04-22 07:00:00',description:'เวลาที่เกิด'},{name:'Maintenance_Schedule',mockValue:'PM-2026-Q2',description:'ตารางบำรุงรักษา'},{name:'Days_Remaining',mockValue:'3 วัน',description:'วันที่เหลือก่อนถึงกำหนด'},{name:'Operator_Info',mockValue:'Technician A',description:'ผู้ดูแลที่รับผิดชอบ'}]},
  32: { id:32, category:'Maintenance & Warning',    alarmNameEN:'Battery Lifetime Warning',    alarmNameTH:'ถึงกำหนดเปลี่ยนแบต',             ledColor:'YELLOW', motorControl:'RUNNING', dataFields:[{name:'Timestamp',mockValue:'2026-04-22 07:00:00',description:'เวลาที่เกิด'},{name:'Charge_Cycle_Count',mockValue:'920 cycles',description:'รอบชาร์จปัจจุบัน'},{name:'Total_Cycles_Limit',mockValue:'1000 cycles',description:'รอบสูงสุด'},{name:'Percent_Lifetime_Used',mockValue:'92 %',description:'อายุที่ใช้แล้ว'},{name:'Pack_Voltage_V',mockValue:'25.6 V',description:'แรงดันรวมของ Battery Pack'},{name:'Cell_1_Voltage_V',mockValue:'3.21 V',description:'แรงดัน Cell 1'},{name:'Cell_2_Voltage_V',mockValue:'3.20 V',description:'แรงดัน Cell 2'},{name:'Cell_3_Voltage_V',mockValue:'3.18 V',description:'แรงดัน Cell 3'},{name:'Cell_4_Voltage_V',mockValue:'3.22 V',description:'แรงดัน Cell 4'},{name:'Cell_5_Voltage_V',mockValue:'3.19 V',description:'แรงดัน Cell 5'},{name:'Cell_6_Voltage_V',mockValue:'3.20 V',description:'แรงดัน Cell 6'},{name:'Cell_7_Voltage_V',mockValue:'3.17 V',description:'แรงดัน Cell 7 (ต่ำสุด)'},{name:'Cell_Delta_V',mockValue:'0.05 V',description:'ความต่างแรงดันระหว่าง Cell สูงสุด-ต่ำสุด'}]},
  33: { id:33, category:'Maintenance & Warning',    alarmNameEN:'Motor Lifetime Warning',      alarmNameTH:'ถึงกำหนดเปลี่ยนมอเตอร์',         ledColor:'YELLOW', motorControl:'RUNNING', dataFields:[{name:'Timestamp',mockValue:'2026-04-22 07:00:00',description:'เวลาที่เกิด'},{name:'Runtime_Hours',mockValue:'8,750 ชม.',description:'ชั่วโมงสะสม'},{name:'Total_Hour_Limit',mockValue:'10,000 ชม.',description:'ชั่วโมงสูงสุด'},{name:'Request_Status',mockValue:'PENDING',description:'สถานะการขอเปลี่ยน'}]},
  34: { id:34, category:'Maintenance & Warning',    alarmNameEN:'Repeated Same Alarm',         alarmNameTH:'เกิด Alarm เดิมซ้ำบ่อย',          ledColor:'YELLOW', motorControl:'RUNNING', dataFields:[{name:'Timestamp',mockValue:'2026-04-22 18:30:00',description:'เวลาที่เกิด'},{name:'Alarm_ID',mockValue:'14 (Battery Low)',description:'Alarm ที่เกิดซ้ำ'},{name:'Occurrence_Count',mockValue:'14 ครั้ง',description:'ครั้งที่เกิดวันนี้'},{name:'Time_Period_Day',mockValue:'2026-04-22',description:'ช่วงเวลาที่นับ'},{name:'Threshold_10_Per_Day',mockValue:'10 ครั้ง/วัน',description:'ค่า threshold'}]},
};

// ── Mock log data ─────────────────────────────────────────────────────────────
const allLogs: AlarmLog[] = [
  { id:'L001', timestamp:'2026-04-22 16:05:50', alarmId:14, alarmName:'Battery Low',              severity:'WARNING',  message:'Battery level dropped below 30%',             value:'28%',                  status:'ACTIVE',              dataSnapshot:{Battery_Percentage:'28%',Voltage_V:'22.8V',Current_A:'2.3A'} },
  { id:'L002', timestamp:'2026-04-22 15:42:10', alarmId:13, alarmName:'Speed Feedback Error',     severity:'CRITICAL', message:'Motor speed feedback mismatch detected',       value:'0.45 vs 0.50 m/s',     status:'RESOLVED',            dataSnapshot:{Current_Velocity_ms:'0.45 m/s',Expected_Velocity_ms:'0.50 m/s'} },
  { id:'L003', timestamp:'2026-04-22 15:38:55', alarmId:20, alarmName:'Lidar Fault',              severity:'CRITICAL', message:'Lidar sensor not responding',                  value:'Timeout 5000ms',       status:'ACTIVE',              dataSnapshot:{Lidar_Status_Code:'0x0F',Error_Details:'Scan timeout'} },
  { id:'L004', timestamp:'2026-04-22 15:35:42', alarmId:6,  alarmName:'Localization Accuracy Low',severity:'WARNING',  message:'Position uncertainty exceeds threshold',       value:'0.85m (thr: 0.50m)',   status:'MONITORING',          dataSnapshot:{Current_Pose_Accuracy:'0.85m',Threshold_Value:'0.50m'} },
  { id:'L005', timestamp:'2026-04-22 15:30:15', alarmId:32, alarmName:'Battery Lifetime Warning', severity:'WARNING',  message:'Battery charge cycles approaching limit',      value:'920 / 1000 cycles',    status:'MAINTENANCE_PENDING', dataSnapshot:{Charge_Cycle_Count:'920',Total_Cycles_Limit:'1000'} },
  { id:'L006', timestamp:'2026-04-22 15:28:03', alarmId:33, alarmName:'Motor Lifetime Warning',   severity:'WARNING',  message:'Motor runtime hours approaching limit',        value:'8750 / 10000 hrs',     status:'MAINTENANCE_PENDING', dataSnapshot:{Runtime_Hours:'8750 hrs',Total_Hour_Limit:'10000 hrs'} },
  { id:'L007', timestamp:'2026-04-22 15:25:41', alarmId:34, alarmName:'Repeated Same Alarm',      severity:'WARNING',  message:'Alarm ID 14 triggered 14 times today',        value:'14 occurrences',       status:'ALERT',               dataSnapshot:{Alarm_ID:'14',Occurrence_Count:'14',Threshold:'10/day'} },
  { id:'L008', timestamp:'2026-04-22 15:20:30', alarmId:10, alarmName:'Path Blocked',             severity:'CRITICAL', message:'Obstacle detected on planned path',            value:'Distance: 0.35m',      status:'RESOLVED',            dataSnapshot:{MoveBase_Status:'ABORTED',Obstacle_Detection:'0.35m'} },
  { id:'L009', timestamp:'2026-04-22 14:20:05', alarmId:10, alarmName:'Path Blocked',             severity:'CRITICAL', message:'Robot path obstructed at aisle 3',             value:'Distance: 0.28m',      status:'RESOLVED',            dataSnapshot:{MoveBase_Status:'ABORTED',Obstacle_Detection:'0.28m'} },
  { id:'L010', timestamp:'2026-04-22 13:55:40', alarmId:8,  alarmName:'Marker / QR Not Found',    severity:'WARNING',  message:'Failed to scan docking QR marker',            value:'5 scan attempts',      status:'RESOLVED',            dataSnapshot:{Expected_Marker_ID:'QR_DOCK_03',Scan_Attempts:'5'} },
  { id:'L011', timestamp:'2026-04-22 12:48:33', alarmId:11, alarmName:'Motor Overtemperature',    severity:'CRITICAL', message:'Motor temperature exceeded safe limit',        value:'78.5°C (thr: 75°C)',   status:'RESOLVED',            dataSnapshot:{Current_Temperature_C:'78.5°C',Temperature_Threshold:'75°C'} },
  { id:'L012', timestamp:'2026-04-22 11:04:18', alarmId:6,  alarmName:'Localization Accuracy Low',severity:'WARNING',  message:'AMCL uncertainty too high near aisle junction','value':'0.92m',               status:'RESOLVED',            dataSnapshot:{Current_Pose_Accuracy:'0.92m',Occurrence_Count:'8'} },
  { id:'L013', timestamp:'2026-04-22 10:22:18', alarmId:20, alarmName:'Lidar Fault',              severity:'CRITICAL', message:'Lidar returned no scan data for 2 cycles',    value:'2 missed cycles',      status:'RESOLVED',            dataSnapshot:{Lidar_Status_Code:'0x0F',Realtime_Check_Data:'NULL'} },
  { id:'L014', timestamp:'2026-04-22 09:05:20', alarmId:14, alarmName:'Battery Low',              severity:'WARNING',  message:'Battery dropped below threshold during task', value:'27%',                  status:'RESOLVED',            dataSnapshot:{Battery_Percentage:'27%',Voltage_V:'22.5V'} },
  { id:'L015', timestamp:'2026-04-21 17:45:00', alarmId:15, alarmName:'Battery Critical',         severity:'CRITICAL', message:'Battery at critical level, returning to dock','value':'12%',                status:'RESOLVED',            dataSnapshot:{Battery_Percentage:'12%',Dock_Charging_Cycle:'Cycle #847'} },
  { id:'L016', timestamp:'2026-04-21 16:30:10', alarmId:13, alarmName:'Speed Feedback Error',     severity:'CRITICAL', message:'Encoder feedback lost on left motor',          value:'0 m/s (expected 0.5)', status:'RESOLVED',            dataSnapshot:{Current_Velocity_ms:'0 m/s',Expected_Velocity_ms:'0.5 m/s'} },
  { id:'L017', timestamp:'2026-04-21 14:15:55', alarmId:2,  alarmName:'Safety Scanner Triggered', severity:'CRITICAL', message:'Person detected in safety zone',               value:'Zone A',               status:'RESOLVED',            dataSnapshot:{Lidar_Status_Code:'0x03',Detection_Zone:'Zone A'} },
  { id:'L018', timestamp:'2026-04-21 11:00:00', alarmId:32, alarmName:'Battery Lifetime Warning', severity:'WARNING',  message:'Battery cycle count approaching limit',        value:'918 / 1000 cycles',    status:'MAINTENANCE_PENDING', dataSnapshot:{Charge_Cycle_Count:'918',Percent_Lifetime_Used:'91.8%'} },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const severityConfig = {
  CRITICAL: { dot: 'bg-red-500',    text: 'text-red-400',    badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
  WARNING:  { dot: 'bg-amber-400',  text: 'text-amber-400',  badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
  INFO:     { dot: 'bg-blue-400',   text: 'text-blue-400',   badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE:              { label: 'Active',      color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20' },
  RESOLVED:            { label: 'Resolved',    color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
  MONITORING:          { label: 'Monitoring',  color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20' },
  MAINTENANCE_PENDING: { label: 'Maintenance', color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20' },
  ALERT:               { label: 'Alert',       color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
};

function LedBadge({ color }: { color: string }) {
  if (color === 'RED')
    return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20"><span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />RED</span>;
  return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />YELLOW</span>;
}

// ── Log Row with expandable data snapshot ─────────────────────────────────────
function LogRow({ log }: { log: AlarmLog }) {
  const [open, setOpen] = useState(false);
  const sev = severityConfig[log.severity];
  const sta = statusConfig[log.status];

  return (
    <>
      <tr
        className="border-b border-[#1a1a24] hover:bg-[#13131c] transition-colors cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${sev.dot}`} />
            <span className="font-mono text-xs text-zinc-500">{log.timestamp}</span>
          </div>
        </td>
        <td className="px-4 py-3.5">
          <span className="font-mono font-bold text-white text-sm">{log.alarmId}</span>
        </td>
        <td className="px-4 py-3.5 text-sm font-medium text-zinc-200">{log.alarmName}</td>
        <td className="px-4 py-3.5">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold border ${sev.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
            {log.severity}
          </span>
        </td>
        <td className="px-4 py-3.5 text-sm text-zinc-300 max-w-xs">{log.message}</td>
        <td className="px-4 py-3.5 font-mono text-xs text-amber-300">{log.value || '—'}</td>
        <td className="px-4 py-3.5">
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${sta.bg} ${sta.color}`}>
            {sta.label}
          </span>
        </td>
        <td className="px-4 py-3.5 text-center">
          <svg className={`w-4 h-4 text-zinc-600 mx-auto transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </td>
      </tr>

      {open && (
        <tr className="bg-[#0a0a12] border-b border-[#1a1a24]">
          <td colSpan={8} className="px-6 py-4">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Data Snapshot</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(log.dataSnapshot).map(([k, v]) => (
                <div key={k} className="bg-[#16161f] border border-[#2a2a3a] rounded-lg px-3 py-2 min-w-32">
                  <p className="text-[10px] font-mono text-zinc-500 mb-0.5">{k}</p>
                  <p className="text-sm font-mono font-semibold text-amber-300">{v}</p>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LogsPage() {
  return (
    <Suspense fallback={null}>
      <LogsPageInner />
    </Suspense>
  );
}

function LogsPageInner() {
  const searchParams = useSearchParams();
  const initId = searchParams.get('alarmId') ?? '';

  const [filterAlarmId, setFilterAlarmId] = useState(initId);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilterAlarmId(initId);
  }, [initId]);

  const filteredLogs = allLogs
    .filter((log) => {
      const byId  = filterAlarmId === '' || log.alarmId.toString() === filterAlarmId || log.alarmName.toLowerCase().includes(filterAlarmId.toLowerCase());
      const bySev = filterSeverity === 'ALL' || log.severity === filterSeverity;
      const bySta = filterStatus === 'ALL' || log.status === filterStatus;
      return byId && bySev && bySta;
    })
    .sort((a, b) => {
      const d = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? -d : d;
    });

  const selectedInfo = initId ? alarmInfoMap[Number(initId)] : null;

  const criticalCount = filteredLogs.filter(l => l.severity === 'CRITICAL').length;
  const activeCount   = filteredLogs.filter(l => l.status === 'ACTIVE').length;
  const resolvedCount = filteredLogs.filter(l => l.status === 'RESOLVED').length;

  return (
    <>
      <Navbar currentPage="logs" />
      <div className="min-h-screen bg-[#07070d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          {/* Breadcrumb + Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs text-zinc-600 mb-3">
              <Link href="/" className="hover:text-zinc-300 transition">Dashboard</Link>
              <span>/</span>
              <span className="text-zinc-300">Logs</span>
              {selectedInfo && <><span>/</span><span className="text-cyan-400">ID {selectedInfo.id}</span></>}
            </div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs font-semibold text-cyan-500 uppercase tracking-widest mb-1">Alarm System</p>
                <h1 className="text-3xl font-bold text-white">
                  {selectedInfo ? `${selectedInfo.alarmNameEN}` : 'Alarm Logs'}
                </h1>
                {selectedInfo && <p className="text-zinc-500 text-sm mt-1">{selectedInfo.alarmNameTH} · ID {selectedInfo.id}</p>}
              </div>
              {selectedInfo && (
                <Link href="/logs" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-300 border border-[#2a2a3a] hover:text-white hover:border-[#3a3a4a] transition">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  All Logs
                </Link>
              )}
            </div>
          </div>

          {/* Alarm Info Panel — shown when filtered by ID */}
          {selectedInfo && (
            <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-2xl overflow-hidden mb-6">
              <div className="px-6 py-5 border-b border-[#1e1e2e] flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        ID {selectedInfo.id}
                      </span>
                      <LedBadge color={selectedInfo.ledColor} />
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${selectedInfo.motorControl === 'STOPPED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                        {selectedInfo.motorControl}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">{selectedInfo.category}</p>
                  </div>
                </div>
              </div>

              {/* Data Fields */}
              <div className="p-6">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Data Fields</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedInfo.dataFields.map((field, i) => (
                    <div key={i} className="bg-[#16161f] border border-[#2a2a3a] rounded-xl px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs text-zinc-500">{field.name}</span>
                        <span className="text-[10px] text-zinc-700 font-mono">F{i + 1}</span>
                      </div>
                      <p className="font-mono text-sm font-semibold text-amber-300">{field.mockValue}</p>
                      <p className="text-xs text-zinc-600 mt-1">{field.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stat row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl px-4 py-3.5 flex items-center gap-3">
              <div className="w-2 h-8 rounded-full bg-zinc-600" />
              <div>
                <p className="text-2xl font-bold text-white">{filteredLogs.length}</p>
                <p className="text-xs text-zinc-500">Total Logs</p>
              </div>
            </div>
            <div className="bg-[#0d0d14] border border-red-500/10 rounded-xl px-4 py-3.5 flex items-center gap-3">
              <div className="w-2 h-8 rounded-full bg-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-400">{criticalCount}</p>
                <p className="text-xs text-zinc-500">Critical</p>
              </div>
            </div>
            <div className="bg-[#0d0d14] border border-green-500/10 rounded-xl px-4 py-3.5 flex items-center gap-3">
              <div className="w-2 h-8 rounded-full bg-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-400">{resolvedCount}</p>
                <p className="text-xs text-zinc-500">Resolved</p>
              </div>
            </div>
          </div>

          {/* Filter bar */}
          <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-2xl px-5 py-4 mb-6">
            <div className="flex flex-wrap gap-3 items-end">
              {/* Alarm ID search */}
              <div className="flex-1 min-w-40">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Alarm ID / Name</label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="ID or name..."
                    value={filterAlarmId}
                    onChange={(e) => setFilterAlarmId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#16161f] border border-[#2a2a3a] rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  />
                  {filterAlarmId && (
                    <button onClick={() => setFilterAlarmId('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Severity */}
              <div className="min-w-36">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Severity</label>
                <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#16161f] border border-[#2a2a3a] rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-cyan-500/50 transition-all">
                  <option value="ALL">All</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="WARNING">Warning</option>
                  <option value="INFO">Info</option>
                </select>
              </div>

              {/* Status */}
              <div className="min-w-40">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Status</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-[#16161f] border border-[#2a2a3a] rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-cyan-500/50 transition-all">
                  <option value="ALL">All</option>
                  <option value="ACTIVE">Active</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="MONITORING">Monitoring</option>
                  <option value="MAINTENANCE_PENDING">Maintenance</option>
                  <option value="ALERT">Alert</option>
                </select>
              </div>

              {/* Sort */}
              <div className="min-w-36">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Sort</label>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                  className="w-full px-3 py-2 bg-[#16161f] border border-[#2a2a3a] rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-cyan-500/50 transition-all">
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>

              {/* Reset */}
              <button
                onClick={() => { setFilterAlarmId(''); setFilterSeverity('ALL'); setFilterStatus('ALL'); setSortOrder('newest'); }}
                className="px-4 py-2 rounded-lg text-sm text-zinc-500 border border-[#2a2a3a] hover:text-zinc-300 hover:border-[#3a3a4a] transition-all"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1e1e2e] flex items-center justify-between">
              <h2 className="text-base font-bold text-white">
                Log Entries
                <span className="ml-2 text-sm font-normal text-zinc-500">({filteredLogs.length})</span>
              </h2>
              <span className="text-xs text-zinc-600">Click row to expand data snapshot</span>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-zinc-600 text-base">No logs match your filters.</p>
                <button onClick={() => { setFilterAlarmId(''); setFilterSeverity('ALL'); setFilterStatus('ALL'); }}
                  className="mt-3 text-sm text-cyan-500 hover:text-cyan-400 transition">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1e1e2e]">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Timestamp</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-16">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Alarm Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Severity</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Message</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Value</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => <LogRow key={log.id} log={log} />)}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-zinc-700 text-xs pb-4">
            Last updated: {new Date().toLocaleString()} ·AMR ALARM SYSTEM
          </div>
        </div>
      </div>
    </>
  );
}
