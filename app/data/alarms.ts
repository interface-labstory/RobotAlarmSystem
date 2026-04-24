export interface DataField {
  name: string;
  mockValue: string;
  description: string;
}

export interface Alarm {
  id: number;
  category: string;
  alarmNameEN: string;
  alarmNameTH: string;
  occurrenceCount: number;
  ledColor: string;
  motorControl: string;
  dataFields: DataField[];
}

export interface MaintenanceAlarm extends Alarm {
  description: string;
  solutions: string[];
  triggerCondition: string;
}

export const allAlarms: Alarm[] = [
  { id: 1, category: 'Safety & Compliance', alarmNameEN: 'Emergency Stop Activated', alarmNameTH: 'ปุ่มหยุดฉุกเฉินถูกกด', occurrenceCount: 12, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 15:45:23', description: 'เวลาที่ Alarm เกิด' },
    { name: 'IO_Status', mockValue: 'TRIGGERED', description: 'สถานะ IO ของปุ่ม E-Stop' },
    { name: 'Button_State', mockValue: '1 (Pressed)', description: 'สถานะปุ่ม: 0=ปกติ, 1=กด' },
    { name: 'CSV_Log_File', mockValue: 'estop_20260422.csv', description: 'ไฟล์ log ที่บันทึก' },
  ]},
  { id: 2, category: 'Safety & Compliance', alarmNameEN: 'Safety Scanner Triggered', alarmNameTH: 'เซฟตี้สแกนเนอร์ทำงาน', occurrenceCount: 76, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 14:32:10', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Lidar_Status_Code', mockValue: '0x03', description: 'รหัสสถานะ Lidar Safety' },
    { name: 'Error_Code', mockValue: 'ZONE_1_BREACH', description: 'รหัส Error ที่เกิด' },
    { name: 'Detection_Zone', mockValue: 'Zone A (Front)', description: 'โซนที่ตรวจพบ' },
  ]},
  { id: 3, category: 'Safety & Compliance', alarmNameEN: 'Safety Zone Violation', alarmNameTH: 'ละเมิดเขตความปลอดภัย', occurrenceCount: 34, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 10:15:44', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Wall_Zone_Coordinates', mockValue: 'X:2.5, Y:3.1', description: 'พิกัดขอบเขตโซน' },
    { name: 'Robot_Pose_X', mockValue: '2.48 m', description: 'ตำแหน่ง X ของหุ่น' },
    { name: 'Robot_Pose_Y', mockValue: '3.09 m', description: 'ตำแหน่ง Y ของหุ่น' },
    { name: 'Robot_Pose_Theta', mockValue: '45.2°', description: 'มุมหัวหุ่น' },
  ]},
  { id: 4, category: 'Safety & Compliance', alarmNameEN: 'Reduced Speed Zone Violation', alarmNameTH: 'ละเมิดโซนจำกัดความเร็ว', occurrenceCount: 21, ledColor: 'RED', motorControl: 'RUNNING', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 09:50:02', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Speed_Zone_Coordinates', mockValue: 'Zone B (Aisle 3)', description: 'โซนจำกัดความเร็ว' },
    { name: 'Robot_Pose_X', mockValue: '5.12 m', description: 'ตำแหน่ง X ของหุ่น' },
    { name: 'Current_Speed', mockValue: '0.72 m/s', description: 'ความเร็วปัจจุบัน' },
    { name: 'Zone_Speed_Limit', mockValue: '0.50 m/s', description: 'ความเร็วสูงสุดที่อนุญาต' },
  ]},
  { id: 5, category: 'Localization & Mapping', alarmNameEN: 'Lost Localization', alarmNameTH: 'ไม่สามารถระบุตำแหน่งได้', occurrenceCount: 45, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-21 16:22:30', description: 'เวลาที่ Alarm เกิด' },
    { name: 'AMCL_Pose_Available', mockValue: 'FALSE', description: 'สถานะ AMCL Pose' },
    { name: 'Pose_Uncertainty', mockValue: '2.34 m', description: 'ค่าความไม่แน่นอนของตำแหน่ง' },
    { name: 'Last_Valid_Position', mockValue: 'X:4.1 Y:2.7', description: 'ตำแหน่งสุดท้ายที่ถูกต้อง' },
    { name: 'Log_File', mockValue: 'localization_20260421.log', description: 'ไฟล์ log' },
  ]},
  { id: 6, category: 'Localization & Mapping', alarmNameEN: 'Localization Accuracy Low', alarmNameTH: 'ความแม่นยำของตำแหน่งต่ำ', occurrenceCount: 156, ledColor: 'RED', motorControl: 'RUNNING', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 11:04:18', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Current_Pose_Accuracy', mockValue: '0.85 m', description: 'ค่าความแม่นยำปัจจุบัน' },
    { name: 'Threshold_Value', mockValue: '0.50 m', description: 'ค่า threshold ที่ยอมรับได้' },
    { name: 'Occurrence_Count', mockValue: '12 ครั้ง', description: 'จำนวนครั้งที่เกิดวันนี้' },
  ]},
  { id: 7, category: 'Localization & Mapping', alarmNameEN: 'Map Mismatch', alarmNameTH: 'แผนที่ไม่ตรงกับหน้างาน', occurrenceCount: 18, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-20 08:35:55', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Current_Map_ID', mockValue: 'map_v3.2', description: 'แผนที่ที่ใช้งานอยู่' },
    { name: 'Expected_Map_ID', mockValue: 'map_v3.5', description: 'แผนที่ที่ควรจะเป็น' },
    { name: 'NoRed_Swap_Status', mockValue: 'PENDING', description: 'สถานะการสลับแผนที่' },
  ]},
  { id: 8, category: 'Localization & Mapping', alarmNameEN: 'Marker / QR / RFID Not Found', alarmNameTH: 'ไม่พบ Marker / QR / RFID', occurrenceCount: 87, ledColor: 'RED', motorControl: 'RUNNING', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 13:55:40', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Expected_Marker_ID', mockValue: 'QR_DOCK_03', description: 'ID ของ Marker ที่ต้องการ' },
    { name: 'Dock_Log_File', mockValue: 'dock_log_20260422.csv', description: 'ไฟล์ log การ dock' },
    { name: 'Scan_Attempts', mockValue: '5 ครั้ง', description: 'จำนวนครั้งที่พยายาม scan' },
  ]},
  { id: 9, category: 'Localization & Mapping', alarmNameEN: 'Re-localization Failed', alarmNameTH: 'ระบุตำแหน่งใหม่ไม่สำเร็จ', occurrenceCount: 29, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-21 17:10:25', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Lift_Reset_Status', mockValue: 'NOT_RESET', description: 'สถานะการ reset Lift' },
    { name: 'Retry_Count', mockValue: '3 ครั้ง', description: 'จำนวนการลองใหม่' },
    { name: 'Log_File', mockValue: 'relocal_20260421.log', description: 'ไฟล์ log' },
  ]},
  { id: 10, category: 'Navigation & Path Control', alarmNameEN: 'Path Blocked', alarmNameTH: 'เส้นทางถูกกีดขวาง', occurrenceCount: 143, ledColor: 'RED', motorControl: 'RUNNING', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 14:20:05', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Path_Coordinates', mockValue: 'X:6.3 Y:1.8 → X:8.0 Y:1.8', description: 'เส้นทางที่ถูกขวาง' },
    { name: 'Goal_Coordinates', mockValue: 'X:10.2 Y:1.8', description: 'เป้าหมายปลายทาง' },
    { name: 'MoveBase_Status', mockValue: 'ABORTED', description: 'สถานะ MoveBase' },
    { name: 'Obstacle_Detection', mockValue: '0.35 m (ด้านหน้า)', description: 'ระยะสิ่งกีดขวาง' },
  ]},
  { id: 11, category: 'Motion & Drive System', alarmNameEN: 'Motor Overtemperature', alarmNameTH: 'มอเตอร์ร้อนเกิน', occurrenceCount: 134, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 12:48:33', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Current_Temperature_C', mockValue: '78.5 °C', description: 'อุณหภูมิมอเตอร์ปัจจุบัน' },
    { name: 'Temperature_Threshold', mockValue: '75.0 °C', description: 'ค่า threshold ที่กำหนด' },
    { name: 'Error_Status_Code', mockValue: '0x12 (OVER_TEMP)', description: 'รหัส Error' },
  ]},
  { id: 12, category: 'Motion & Drive System', alarmNameEN: 'Drive Enable Fail', alarmNameTH: 'Drive Disable', occurrenceCount: 41, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-21 09:12:44', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Drive_Status_Code', mockValue: '0x05 (DISABLED)', description: 'รหัสสถานะ Drive' },
    { name: 'Error_Details', mockValue: 'Enable signal lost', description: 'รายละเอียด Error' },
    { name: 'Voltage_Reading', mockValue: '23.4 V', description: 'แรงดันไฟที่วัดได้' },
  ]},
  { id: 13, category: 'Motion & Drive System', alarmNameEN: 'Speed Feedback Error', alarmNameTH: 'ความเร็ว ผิดปกติ', occurrenceCount: 189, ledColor: 'RED', motorControl: 'RUNNING', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 15:30:12', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Current_Velocity_ms', mockValue: '0.45 m/s', description: 'ความเร็วที่วัดได้จริง' },
    { name: 'Expected_Velocity_ms', mockValue: '0.50 m/s', description: 'ความเร็วที่คาดหวัง' },
    { name: 'NodeRed_MS_Velocity', mockValue: '0.50 m/s', description: 'ค่าจาก Node-RED' },
  ]},
  { id: 14, category: 'Battery & Charging', alarmNameEN: 'Battery Low', alarmNameTH: 'แบตเตอรี่ต่ำ', occurrenceCount: 245, ledColor: 'YELLOW', motorControl: 'RUNNING', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 16:05:50', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Battery_Percentage', mockValue: '28 %', description: 'เปอร์เซ็นต์แบต' },
    { name: 'Voltage_V', mockValue: '22.8 V', description: 'แรงดันแบตเตอรี่' },
    { name: 'Current_A', mockValue: '2.3 A', description: 'กระแสไฟ' },
    { name: 'Threshold_30Percent', mockValue: '30 %', description: 'ค่า threshold' },
  ]},
  { id: 15, category: 'Battery & Charging', alarmNameEN: 'Battery Critical', alarmNameTH: 'แบตเตอรี่ต่ำระดับวิกฤต', occurrenceCount: 98, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 17:45:20', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Battery_Percentage', mockValue: '12 %', description: 'เปอร์เซ็นต์แบต' },
    { name: 'Voltage_V', mockValue: '21.2 V', description: 'แรงดันแบตเตอรี่' },
    { name: 'Current_A', mockValue: '1.8 A', description: 'กระแสไฟ' },
    { name: 'Dock_Charging_Cycle', mockValue: 'Cycle #847', description: 'รอบการชาร์จปัจจุบัน' },
  ]},
  { id: 16, category: 'Battery & Charging', alarmNameEN: 'Charging Current Abnormal', alarmNameTH: 'Current ผิดปกติ', occurrenceCount: 33, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-20 22:10:05', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Current_A', mockValue: '8.5 A', description: 'กระแสชาร์จที่วัดได้' },
    { name: 'Expected_Current_Range', mockValue: '3.0 – 5.0 A', description: 'ช่วงกระแสปกติ' },
    { name: 'Voltage_V', mockValue: '25.6 V', description: 'แรงดันขณะชาร์จ' },
  ]},
  { id: 17, category: 'Battery & Charging', alarmNameEN: 'Battery Communication Docking Error', alarmNameTH: 'Battery Communication Error', occurrenceCount: 27, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-19 23:55:30', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Timeout_ms', mockValue: '5000 ms', description: 'ระยะเวลา timeout' },
    { name: 'Retry_Loop_Count', mockValue: '3 ครั้ง', description: 'จำนวน retry' },
    { name: 'Communication_Status', mockValue: 'FAILED', description: 'สถานะการสื่อสาร' },
  ]},
  { id: 18, category: 'Battery & Charging', alarmNameEN: 'Power Supply Voltage Drop', alarmNameTH: 'Power Supply Voltage Drop', occurrenceCount: 15, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-18 14:33:00', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Current_Voltage_V', mockValue: '20.1 V', description: 'แรงดันปัจจุบัน' },
    { name: 'Normal_Voltage_Range', mockValue: '23.0 – 25.2 V', description: 'ช่วงแรงดันปกติ' },
    { name: 'Docking_Status', mockValue: 'DOCKED', description: 'สถานะการ dock' },
  ]},
  { id: 19, category: 'Battery & Charging', alarmNameEN: 'Auto Charging Failed', alarmNameTH: 'การชาร์จอัตโนมัติล้มเหลว', occurrenceCount: 52, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 21:05:15', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Charge_Type_AUTO', mockValue: 'AUTO', description: 'ประเภทการชาร์จ' },
    { name: 'Dock_Status', mockValue: 'MISALIGNED', description: 'สถานะ dock' },
    { name: 'Retry_Count', mockValue: '5 ครั้ง', description: 'จำนวนการลองใหม่' },
  ]},
  { id: 20, category: 'Sensor & Vision', alarmNameEN: 'Lidar Fault', alarmNameTH: 'Lidar ขัดข้อง', occurrenceCount: 167, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 10:22:18', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Lidar_Status_Code', mockValue: '0x0F (FAULT)', description: 'รหัสสถานะ Lidar' },
    { name: 'Error_Details', mockValue: 'Scan timeout exceeded', description: 'รายละเอียด Error' },
    { name: 'Realtime_Check_Data', mockValue: 'NULL', description: 'ข้อมูล realtime check' },
  ]},
  { id: 21, category: 'Sensor & Vision', alarmNameEN: 'Camera Offline', alarmNameTH: 'กล้องไม่ทำงาน', occurrenceCount: 38, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-21 11:40:08', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Camera_Status', mockValue: 'OFFLINE', description: 'สถานะกล้อง' },
    { name: 'Last_Frame_Timestamp', mockValue: '2026-04-21 11:39:55', description: 'เวลา frame สุดท้าย' },
    { name: 'Error_Code', mockValue: '0x07 (NO_SIGNAL)', description: 'รหัส Error' },
  ]},
  { id: 22, category: 'Sensor & Vision', alarmNameEN: 'IMU Error', alarmNameTH: 'เซนเซอร์ IMU Error', occurrenceCount: 22, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-20 13:15:42', description: 'เวลาที่ Alarm เกิด' },
    { name: 'IMU_Status_Code', mockValue: '0x02 (CALIB_ERR)', description: 'รหัสสถานะ IMU' },
    { name: 'Acceleration_X', mockValue: '0.12 m/s²', description: 'ความเร่งแกน X' },
    { name: 'Acceleration_Y', mockValue: '-0.05 m/s²', description: 'ความเร่งแกน Y' },
    { name: 'Acceleration_Z', mockValue: '9.75 m/s²', description: 'ความเร่งแกน Z' },
  ]},
  { id: 23, category: 'Sensor & Vision', alarmNameEN: 'Proximity Sensor Fault', alarmNameTH: 'เซนเซอร์ Proximity Error', occurrenceCount: 44, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 09:30:55', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Sensor_Status', mockValue: 'FAULT', description: 'สถานะเซนเซอร์' },
    { name: 'Lift_Dolly_Proximity', mockValue: 'N/A', description: 'ระยะ Lift/Dolly' },
    { name: 'Distance_Reading', mockValue: '-1 (Error)', description: 'ค่าระยะที่อ่านได้' },
  ]},
  { id: 24, category: 'IO / Electrical Alarm', alarmNameEN: 'IO Module Offline', alarmNameTH: 'โมดูล IO ออฟไลน์', occurrenceCount: 19, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-19 16:48:20', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Module_ID', mockValue: 'IO_MOD_02', description: 'ID ของโมดูล IO' },
    { name: 'Connection_Status', mockValue: 'OFFLINE', description: 'สถานะการเชื่อมต่อ' },
    { name: 'Last_Heartbeat', mockValue: '2026-04-19 16:47:55', description: 'Heartbeat สุดท้าย' },
  ]},
  { id: 25, category: 'IO / Electrical Alarm', alarmNameEN: 'Encoder Power Lost', alarmNameTH: 'Encoder Power Lost', occurrenceCount: 11, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-17 10:22:35', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Motor_ID', mockValue: 'MOTOR_L', description: 'ID มอเตอร์ที่เกิด Error' },
    { name: 'Power_Status', mockValue: '0 V (Lost)', description: 'สถานะไฟ Encoder' },
    { name: 'Drive_Motor_Feedback', mockValue: 'NO_FEEDBACK', description: 'Feedback จาก Drive' },
  ]},
  { id: 26, category: 'Task / Mission', alarmNameEN: 'Lifter Failed', alarmNameTH: 'Lifter ยกงานไม่ได้', occurrenceCount: 58, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 13:05:30', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Lift_Auto_Check_Result', mockValue: 'FAIL', description: 'ผลการตรวจสอบ Lift' },
    { name: 'Current_Height', mockValue: '0.05 m', description: 'ความสูงปัจจุบัน' },
    { name: 'Motor_Status', mockValue: 'STALLED', description: 'สถานะมอเตอร์ Lift' },
  ]},
  { id: 27, category: 'Software & Controller', alarmNameEN: 'Disk Full', alarmNameTH: 'ดิสก์เต็ม', occurrenceCount: 9, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-15 03:10:00', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Disk_Usage_Percent', mockValue: '97.8 %', description: 'การใช้งาน disk' },
    { name: 'Available_Space_GB', mockValue: '0.5 GB', description: 'พื้นที่คงเหลือ' },
    { name: 'Partition_Info', mockValue: '/dev/sda1 (Root)', description: 'พาร์ติชันที่เต็ม' },
  ]},
  { id: 28, category: 'Software & Controller', alarmNameEN: 'Parameter Out of Range', alarmNameTH: 'พารามิเตอร์เกินควบคุม', occurrenceCount: 16, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-18 11:30:45', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Parameter_Name', mockValue: 'max_linear_vel', description: 'ชื่อพารามิเตอร์' },
    { name: 'Current_Value', mockValue: '1.25 m/s', description: 'ค่าปัจจุบัน' },
    { name: 'Valid_Range', mockValue: '0.0 – 1.0 m/s', description: 'ช่วงค่าที่ยอมรับ' },
  ]},
  { id: 29, category: 'Software & Controller', alarmNameEN: 'CPU Overload', alarmNameTH: 'CPU Overload', occurrenceCount: 24, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 08:55:10', description: 'เวลาที่ Alarm เกิด' },
    { name: 'CPU_Usage_Percent', mockValue: '96.2 %', description: 'การใช้งาน CPU' },
    { name: 'Load_Average', mockValue: '7.82 (1-min avg)', description: 'ค่า Load Average' },
    { name: 'Temperature_C', mockValue: '88.5 °C', description: 'อุณหภูมิ CPU' },
  ]},
  { id: 30, category: 'Software & Controller', alarmNameEN: 'Unexpected Reboot', alarmNameTH: 'ระบบรีสตาร์ทผิดปกติ', occurrenceCount: 7, ledColor: 'RED', motorControl: 'STOPPED', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-10 04:22:00', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Reboot_Reason', mockValue: 'Kernel Panic', description: 'สาเหตุการรีบูต' },
    { name: 'PC_Shutdown_Log', mockValue: 'shutdown_20260410.log', description: 'ไฟล์ log การปิดระบบ' },
    { name: 'Last_Boot_Log', mockValue: 'boot_20260410_042205.log', description: 'ไฟล์ log การบูต' },
  ]},
  { id: 31, category: 'Maintenance & Warning', alarmNameEN: 'Preventive Maintenance Due', alarmNameTH: 'ถึงกำหนดบำรุงรักษา', occurrenceCount: 65, ledColor: 'YELLOW', motorControl: 'RUNNING', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 07:00:00', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Maintenance_Schedule', mockValue: 'PM-2026-Q2', description: 'ตารางบำรุงรักษา' },
    { name: 'Days_Remaining', mockValue: '3 วัน', description: 'วันที่เหลือก่อนถึงกำหนด' },
    { name: 'Operator_Info', mockValue: 'Technician A', description: 'ผู้ดูแลที่รับผิดชอบ' },
  ]},
  { id: 32, category: 'Maintenance & Warning', alarmNameEN: 'Battery Lifetime Warning', alarmNameTH: 'ถึงกำหนดเปลี่ยนแบต', occurrenceCount: 42, ledColor: 'YELLOW', motorControl: 'RUNNING', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 07:00:00', description: 'เวลาที่ Alarm เกิด (ขณะชาร์จ Dock)' },
    { name: 'Charge_Cycle_Count', mockValue: '920 cycles', description: 'จำนวนรอบชาร์จปัจจุบัน' },
    { name: 'Total_Cycles_Limit', mockValue: '1000 cycles', description: 'จำนวนรอบสูงสุด' },
    { name: 'Percent_Lifetime_Used', mockValue: '92 %', description: 'อายุการใช้งานที่ใช้ไปแล้ว' },
    { name: 'Pack_Voltage_V', mockValue: '25.6 V', description: 'แรงดันรวมของ Battery Pack' },
    { name: 'Cell_1_Voltage_V', mockValue: '3.21 V', description: 'แรงดัน Cell 1' },
    { name: 'Cell_2_Voltage_V', mockValue: '3.20 V', description: 'แรงดัน Cell 2' },
    { name: 'Cell_3_Voltage_V', mockValue: '3.18 V', description: 'แรงดัน Cell 3' },
    { name: 'Cell_4_Voltage_V', mockValue: '3.22 V', description: 'แรงดัน Cell 4' },
    { name: 'Cell_5_Voltage_V', mockValue: '3.19 V', description: 'แรงดัน Cell 5' },
    { name: 'Cell_6_Voltage_V', mockValue: '3.20 V', description: 'แรงดัน Cell 6' },
    { name: 'Cell_7_Voltage_V', mockValue: '3.17 V', description: 'แรงดัน Cell 7 (ต่ำสุด)' },
    { name: 'Cell_Delta_V', mockValue: '0.05 V', description: 'ความต่างแรงดันระหว่าง Cell สูงสุด-ต่ำสุด' },
  ]},
  { id: 33, category: 'Maintenance & Warning', alarmNameEN: 'Motor Lifetime Warning', alarmNameTH: 'ถึงกำหนดเปลี่ยนมอเตอร์', occurrenceCount: 28, ledColor: 'YELLOW', motorControl: 'RUNNING', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 07:00:00', description: 'เวลาที่ Alarm เกิด (ขณะชาร์จ Dock)' },
    { name: 'Runtime_Hours', mockValue: '8,750 ชม.', description: 'ชั่วโมงรันมอเตอร์สะสม' },
    { name: 'Total_Hour_Limit', mockValue: '10,000 ชม.', description: 'ชั่วโมงสูงสุดที่กำหนด' },
    { name: 'Request_Status', mockValue: 'PENDING REQUEST', description: 'สถานะการขอเปลี่ยน' },
  ]},
  { id: 34, category: 'Maintenance & Warning', alarmNameEN: 'Repeated Same Alarm', alarmNameTH: 'เกิด Alarm เดิมซ้ำบ่อย', occurrenceCount: 19, ledColor: 'YELLOW', motorControl: 'RUNNING', dataFields: [
    { name: 'Timestamp', mockValue: '2026-04-22 18:30:00', description: 'เวลาที่ Alarm เกิด' },
    { name: 'Alarm_ID', mockValue: '14 (Battery Low)', description: 'Alarm ID ที่เกิดซ้ำ' },
    { name: 'Occurrence_Count', mockValue: '14 ครั้ง', description: 'จำนวนครั้งที่เกิดวันนี้' },
    { name: 'Time_Period_Day', mockValue: '2026-04-22 (วันนี้)', description: 'ช่วงเวลาที่นับ' },
    { name: 'Threshold_10_Per_Day', mockValue: '10 ครั้ง/วัน', description: 'ค่า threshold' },
  ]},
];

export const topAlarms: Alarm[] = [...allAlarms]
  .filter((a) => a.category !== 'Maintenance & Warning')
  .sort((a, b) => b.occurrenceCount - a.occurrenceCount)
  .slice(0, 10);

export const maintenanceAlarms: MaintenanceAlarm[] = [
  {
    ...allAlarms.find((a) => a.id === 32)!,
    description: 'Battery charge cycle is reaching its limit',
    solutions: [
      '"cell_1": 3.72,\n"cell_2": 3.71,\n"cell_3": 3.69,\n"cell_4": 3.70,\n"cell_5": 3.68,\n"cell_6": 3.72,\n"cell_7": 3.70,\n"cell_8": 3.71',
    ],
    triggerCondition: 'Alarm triggers when charging at dock only — LED Yellow',
  },
  {
    ...allAlarms.find((a) => a.id === 33)!,
    description: 'Motor runtime hours are reaching the operational limit',
    solutions: [
      '"motor_1": 1250 km,',
    ],
    triggerCondition: 'Alarm triggers when charging at dock only — LED Yellow',
  },
  {
    ...allAlarms.find((a) => a.id === 34)!,
    description: 'Same alarm has been triggered repeatedly beyond threshold',
    solutions: ['Investigate root cause of repeated alarm', 'Check relevant parameters and settings', 'Review and apply filter parameters', 'Contact technical support if issue persists'],
    triggerCondition: 'More than 10 times / day — parameter filter adjustable',
  },
];

export const categoryColors: Record<string, string> = {
  'Safety & Compliance': 'text-red-400',
  'Localization & Mapping': 'text-orange-400',
  'Navigation & Path Control': 'text-yellow-400',
  'Motion & Drive System': 'text-pink-400',
  'Battery & Charging': 'text-amber-400',
  'Sensor & Vision': 'text-cyan-400',
  'IO / Electrical Alarm': 'text-purple-400',
  'Task / Mission': 'text-green-400',
  'Software & Controller': 'text-blue-400',
  'Maintenance & Warning': 'text-yellow-300',
};
