'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Lang = 'en' | 'th';

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

// ─── Translation table ─────────────────────────────────────────────────────
const translations: Record<string, Record<Lang, string>> = {
  // ── Navbar ──────────────────────────────────────────────────────────────────
  'nav.dashboard':         { en: 'Dashboard',   th: 'แดชบอร์ด' },
  'nav.logs':              { en: 'Logs',         th: 'บันทึก' },
  'nav.maintenance':       { en: 'Maintenance',  th: 'ซ่อมบำรุง' },
  'nav.search':            { en: 'Search',       th: 'ค้นหา' },
  'nav.searchPlaceholder': { en: 'Alarm ID...',  th: 'Alarm ID...' },
  'nav.delivery':          { en: 'Delivery Date', th: 'ส่งมอบหุ่นวันที่' },
  'nav.delivered':         { en: 'Delivered',    th: 'ส่งมอบแล้ว' },

  // ── Common ──────────────────────────────────────────────────────────────────
  'common.robotAlarmSystem': { en: 'Robot Alarm System', th: 'ระบบ Alarm หุ่นยนต์' },
  'common.lastUpdated':      { en: 'Last updated',       th: 'อัปเดตล่าสุด' },
  'common.all':              { en: 'All',                 th: 'ทั้งหมด' },
  'common.reset':            { en: 'Reset',               th: 'รีเซต' },

  // ── Table headers ────────────────────────────────────────────────────────────
  'table.rank':        { en: '#',              th: '#' },
  'table.id':          { en: 'ID',             th: 'ID' },
  'table.category':    { en: 'Category',       th: 'หมวดหมู่' },
  'table.name':        { en: 'Alarm Name',     th: 'ชื่อ Alarm' },
  'table.nameEN':      { en: 'Alarm Name (EN)', th: 'ชื่อ Alarm (EN)' },
  'table.nameTH':      { en: 'Name (TH)',      th: 'ชื่อ (TH)' },
  'table.count':       { en: 'Count',          th: 'จำนวน' },
  'table.led':         { en: 'LED',            th: 'LED' },
  'table.data':        { en: 'Data',           th: 'ข้อมูล' },
  'table.timestamp':   { en: 'Timestamp',      th: 'เวลา' },
  'table.severity':    { en: 'Severity',       th: 'ความรุนแรง' },
  'table.message':     { en: 'Message',        th: 'ข้อความ' },
  'table.value':       { en: 'Value',          th: 'ค่า' },
  'table.status':      { en: 'Status',         th: 'สถานะ' },
  'table.type':        { en: 'Type',           th: 'ประเภท' },
  'table.event':       { en: 'Event',          th: 'เหตุการณ์' },
  'table.technician':  { en: 'Technician',     th: 'ช่าง' },

  // ── Dashboard page ───────────────────────────────────────────────────────────
  'dashboard.title':         { en: 'Status Dashboard',    th: 'แดชบอร์ดสถานะ' },
  'dashboard.subtitle':      { en: 'Monitor alarm frequency, patterns, and maintenance requirements', th: 'ตรวจสอบความถี่ Alarm รูปแบบ และข้อกำหนดการบำรุงรักษา' },
  'dashboard.totalAlarms':   { en: 'Total Alarms',        th: 'Alarm ทั้งหมด' },
  'dashboard.critical':      { en: 'Critical (RED)',       th: 'วิกฤต (RED)' },
  'dashboard.warning':       { en: 'Warning (YELLOW)',     th: 'เตือน (YELLOW)' },
  'dashboard.motorStopped':  { en: 'Motor stopped',        th: 'มอเตอร์หยุด' },
  'dashboard.stillRunning':  { en: 'Still running',        th: 'ยังทำงานอยู่' },
  'dashboard.alarmTypes':    { en: 'alarm types',          th: 'ประเภท Alarm' },
  'dashboard.top10Title':    { en: 'Top 10 Most Frequent Alarms', th: 'Top 10 Alarm ที่เกิดบ่อยที่สุด' },
  'dashboard.top10Sub':      { en: 'Ranked by highest occurrence count', th: 'จัดอันดับจากจำนวนครั้งที่เกิดสูงสุด' },
  'dashboard.alarmRef':      { en: 'Alarm Reference',      th: 'ตารางอ้างอิง Alarm' },
  'dashboard.searchPlaceholder': { en: 'Search ID / Category / Name...', th: 'ค้นหา ID / Category / Name...' },
  'dashboard.noData':        { en: 'No data found',        th: 'ไม่พบข้อมูล' },
  'dashboard.view':          { en: 'View',                 th: 'ดู' },
  'dashboard.top10Repeated': { en: 'Top 10 Most Repeated Alarms', th: 'Top 10 Alarms ที่เกิดซ้ำบ่อย' },

  // ── Logs page ────────────────────────────────────────────────────────────────
  'logs.title':        { en: 'Alarm Logs',                    th: 'บันทึก Alarm' },
  'logs.alarmSystem':  { en: 'Alarm System',                  th: 'ระบบ Alarm' },
  'logs.allLogs':      { en: 'All Logs',                      th: 'บันทึกทั้งหมด' },
  'logs.dataFields':   { en: 'Data Fields',                   th: 'ช่องข้อมูล' },
  'logs.dataSnapshot': { en: 'Data Snapshot',                 th: 'ข้อมูลขณะเกิด Alarm' },
  'logs.totalLogs':    { en: 'Total Logs',                    th: 'บันทึกทั้งหมด' },
  'logs.critical':     { en: 'Critical',                      th: 'วิกฤต' },
  'logs.resolved':     { en: 'Resolved',                      th: 'แก้ไขแล้ว' },
  'logs.filterId':     { en: 'Alarm ID / Name',               th: 'Alarm ID / ชื่อ' },
  'logs.filterSev':    { en: 'Severity',                      th: 'ความรุนแรง' },
  'logs.filterSta':    { en: 'Status',                        th: 'สถานะ' },
  'logs.filterSort':   { en: 'Sort',                          th: 'เรียงลำดับ' },
  'logs.newestFirst':  { en: 'Newest first',                  th: 'ใหม่ก่อน' },
  'logs.oldestFirst':  { en: 'Oldest first',                  th: 'เก่าก่อน' },
  'logs.idOrName':     { en: 'ID or name...',                 th: 'ID หรือชื่อ...' },
  'logs.logEntries':   { en: 'Log Entries',                   th: 'รายการบันทึก' },
  'logs.clickExpand':  { en: 'Click row to expand data snapshot', th: 'คลิกแถวเพื่อดูข้อมูลเพิ่มเติม' },
  'logs.noLogs':       { en: 'No logs match your filters.',   th: 'ไม่พบบันทึกที่ตรงกัน' },
  'logs.clearFilters': { en: 'Clear filters',                 th: 'ล้างตัวกรอง' },
  'logs.breadcrumb':   { en: 'Dashboard',                     th: 'แดชบอร์ด' },

  // ── Maintenance page ─────────────────────────────────────────────────────────
  'maint.title':        { en: 'Maintenance & Warning',         th: 'ซ่อมบำรุง & คำเตือน' },
  'maint.subtitle':     { en: 'Solution guide and trigger conditions for maintenance alarms', th: 'แนวทางการแก้ปัญหาและเงื่อนไข Trigger สำหรับงานบำรุงรักษา' },
  'maint.serviceRequired': { en: '⚠ Service Required',        th: '⚠ ต้องดำเนินการ' },
  'maint.warrantyVoidBadge': { en: '🚫 WARRANTY VOID',        th: '🚫 หมดประกัน' },
  'maint.planService':  { en: '⚠ Plan Service Soon',           th: '⚠ วางแผนซ่อมเร็วๆ นี้' },
  'maint.trigger':      { en: 'Trigger:',                      th: 'เงื่อนไข:' },

  // Battery card
  'maint.bat.health1':   { en: '1 · Current Health Status',        th: '1 · สถานะสุขภาพปัจจุบัน' },
  'maint.bat.health':    { en: 'Battery Health',                    th: 'สุขภาพแบตเตอรี่' },
  'maint.bat.lifetimeLabel': { en: 'Lifetime used:',               th: 'อายุที่ใช้แล้ว:' },
  'maint.bat.belowSpec': { en: 'below standard',                   th: 'ต่ำกว่าเกณฑ์มาตรฐาน' },
  'maint.bat.cycleCount': { en: 'Charge Cycle Count',              th: 'รอบการชาร์จ' },
  'maint.bat.cyclesLeft': { en: 'cycles remaining until limit',    th: 'cycles เหลือก่อนถึงขีดจำกัด' },
  'maint.bat.packVoltage': { en: 'Pack Voltage',                   th: 'แรงดัน Pack' },
  'maint.bat.cellDelta':   { en: 'Cell Delta:',                    th: 'ความต่าง Cell:' },
  'maint.bat.lastService': { en: 'Last Service Date',              th: 'วันที่เข้าซ่อมล่าสุด' },
  'maint.save':            { en: 'Save',                           th: 'บันทึก' },
  'maint.edit':            { en: 'Edit',                           th: 'แก้ไข' },
  'maint.bat.risks':       { en: '2 · Risks to Watch Out For',     th: '2 · ความเสี่ยงที่ต้องระวัง' },
  'maint.bat.interim':     { en: '4 · Care While Waiting for Replacement', th: '4 · การดูแลระหว่างรอเปลี่ยน' },

  // Battery risks
  'maint.bat.r1.t': { en: '⚡ Performance Throttling',  th: '⚡ Performance Throttling' },
  'maint.bat.r1.d': { en: 'Degraded battery reduces machine performance. Speed and lifting power are reduced to protect the battery.', th: 'แบตเตอรี่ที่เสื่อมสภาพทำให้เครื่องทำงานช้าลง ความเร็วและแรงยกลดลงเพื่อปกป้องแบต' },
  'maint.bat.r2.t': { en: '🔴 Unpredictable Shutdown',  th: '🔴 Unpredictable Shutdown' },
  'maint.bat.r2.d': { en: 'The machine may suddenly shut down even when battery percentage still shows, due to capacity drift.', th: 'เครื่องอาจดับเองกะทันหันแม้จะยังมีเปอร์เซ็นต์แบตแสดงอยู่ เนื่องจาก capacity drift' },
  'maint.bat.r3.t': { en: '🔥 Battery Swelling Risk',   th: '🔥 Battery Swelling Risk' },
  'maint.bat.r3.d': { en: 'To prevent battery swelling, which can permanently damage the chassis and internal circuits.', th: 'เพื่อป้องกันแบตบวม ซึ่งอาจสร้างความเสียหายต่อ chassis และวงจรภายในถาวร' },

  // Battery tips
  'maint.bat.tip1': { en: 'Keep charger connected during heavy use to reduce battery draw.', th: 'เสียบสายชาร์จไว้ขณะใช้งานหนัก เพื่อลดการดึงจากแบต' },
  'maint.bat.tip2': { en: 'Avoid use in high temperature environments (>40 °C).', th: 'หลีกเลี่ยงการใช้งานในที่มีอุณหภูมิสูง (>40 °C)' },
  'maint.bat.tip3': { en: 'Enable Low Power Mode to reduce workload and heat generation.', th: 'เปิด Low Power Mode เพื่อลด workload และลดความร้อน' },
  'maint.bat.tip4': { en: 'Back up important data before sending the machine in for service.', th: 'สำรองข้อมูลสำคัญก่อนนำเครื่องเข้าซ่อม' },

  // Motor card
  'maint.mot.warrantyStatus':  { en: 'Warranty Status (All Motors)',  th: 'สถานะการรับประกัน (รวมทุกหลอด)' },
  'maint.mot.totalHours':      { en: 'Total Hours',                   th: 'ชั่วโมงรวม' },
  'maint.mot.totalDist':       { en: 'Total Distance',                th: 'ระยะทางรวม' },
  'maint.mot.totalWarranty':   { en: 'Total Warranty Status',         th: 'สถานะประกันรวม' },
  'maint.mot.lastService':     { en: 'Last Service Date',             th: 'วันที่เข้าซ่อมล่าสุด' },
  'maint.mot.health1':         { en: '1 · Current Health Status',     th: '1 · สถานะสุขภาพปัจจุบัน' },
  'maint.mot.risks':           { en: '2 · Risks to Watch Out For',    th: '2 · ความเสี่ยงที่ต้องระวัง' },
  'maint.mot.interim':         { en: '4 · Care While Waiting for Replacement', th: '4 · การดูแลระหว่างรอเปลี่ยน' },
  'maint.mot.urgentVoid':      { en: '3 · Urgent Action (Warranty Void)', th: '3 · การดำเนินการเร่งด่วน (ประกันหมด)' },

  // Warranty void banner
  'maint.mot.voidTitle': { en: 'Warranty Voided',   th: 'การรับประกันหมดทันที' },
  'maint.mot.voidOver':  { en: '▶ exceeds',         th: '▶ เกิน' },
  'maint.mot.voidHours': { en: 'Total runtime of all motors (', th: 'ชั่วโมงรวมทุกหลอด (' },
  'maint.mot.voidKm':    { en: 'Total distance (',  th: 'ระยะทางรวม (' },
  'maint.mot.voidEnd':   { en: '— warranty expired immediately', th: '— การรับประกันหมดอายุทันที' },

  // Motor risks
  'maint.mot.r0.t': { en: '🚫 Warranty Void',             th: '🚫 หมดการรับประกัน' },
  'maint.mot.r0.d': { en: 'If equipment fails now, repair costs and parts are NOT covered, including labor and shipping.', th: 'หากอุปกรณ์เสียหายในขณะนี้ ค่าซ่อมและอะไหล่จะไม่ได้รับการคุ้มครอง ทั้งหมด รวมถึงค่าแรงช่างและค่าขนส่ง' },
  'maint.mot.r1.t': { en: '⚡ Performance Degradation',   th: '⚡ Performance Degradation' },
  'maint.mot.r1.d': { en: 'A motor approaching its limit may have reduced torque, affecting lifting capacity.', th: 'มอเตอร์ที่ใกล้ถึงขีดจำกัดอาจมี torque ลดลง ส่งผลต่อความสามารถในการยกน้ำหนัก' },
  'maint.mot.r2.t': { en: '🔴 Unexpected Motor Failure',  th: '🔴 Unexpected Motor Failure' },
  'maint.mot.r2.d': { en: 'Motor may stop mid-operation without warning, causing mission failure.', th: 'มอเตอร์อาจหยุดทำงานกลางคันโดยไม่มีสัญญาณเตือนล่วงหน้า ส่งผลให้ mission ล้มเหลว' },
  'maint.mot.r3.t': { en: '🌡 Overheating Risk',          th: '🌡 Overheating Risk' },
  'maint.mot.r3.d': { en: 'Worn bearings may cause abnormal heat buildup, increasing safety alarm risk.', th: 'แบริ่งที่สึกหรออาจทำให้เกิดความร้อนสูงผิดปกติ เพิ่มความเสี่ยงต่อ safety alarm' },

  // Motor void tips
  'maint.mot.void.tip1': { en: 'Contact Service team immediately — provide S/N of motors that exceeded limits.', th: 'ติดต่อฝ่าย Service ทันที — แจ้งหมายเลข S/N ของหลอดที่เกินขีดจำกัด' },
  'maint.mot.void.tip2': { en: 'Prepare documents: runtime/odometer records at the time limits were exceeded.', th: 'จัดเตรียมเอกสาร: บันทึก runtime / odometer ณ วันที่เกินขีดจำกัด' },
  'maint.mot.void.tip3': { en: 'Consider stopping AMR operation until assessed by a qualified technician.', th: 'พิจารณาหยุดใช้งาน AMR จนกว่าจะได้รับการประเมินจากช่างผู้เชี่ยวชาญ' },
  'maint.mot.void.tip4': { en: 'Request a repair or motor replacement quote for motors that exceeded limits.', th: 'ขอใบเสนอราคาซ่อมหรือเปลี่ยนหลอดมอเตอร์ที่เกินขีดจำกัด' },

  // Motor normal tips
  'maint.mot.tip1': { en: 'Reduce duty cycle or mission frequency to lower motor hours.', th: 'ลด duty cycle หรือความถี่ mission เพื่อลดชั่วโมงมอเตอร์' },
  'maint.mot.tip2': { en: 'Check motor temperature every shift. If it exceeds 65 °C, stop immediately.', th: 'ตรวจสอบอุณหภูมิมอเตอร์ทุกกะ หากเกิน 65 °C ให้หยุดทันที' },
  'maint.mot.tip3': { en: 'If you hear abnormal sounds (loud/vibrating), report immediately.', th: 'หากได้ยินเสียงผิดปกติ (เสียงดัง/สั่น) ให้รายงานทันที' },
  'maint.mot.tip4': { en: 'Record actual hours and km for each motor to inform technicians before service.', th: 'จดบันทึก hours และ km จริงของแต่ละหลอดเพื่อแจ้งช่างก่อนเข้าซ่อม' },

  // Maintenance Log table
  'maint.log.title':    { en: 'Maintenance Log',                                          th: 'บันทึกการบำรุงรักษา' },
  'maint.log.subtitle': { en: 'Maintenance history with timestamps by type',              th: 'ประวัติการบำรุงรักษาพร้อม Timestamp แยกตามประเภท' },

  // Status badges
  'status.completed': { en: 'Completed', th: 'เสร็จสิ้น' },
  'status.scheduled': { en: 'Scheduled', th: 'นัดหมายแล้ว' },
  'status.pending':   { en: 'Pending',   th: 'รอดำเนินการ' },
};

// ─── Context ───────────────────────────────────────────────────────────────
const LanguageContext = createContext<LanguageContextValue>({
  lang: 'th',
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('th');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('amr-lang') as Lang | null;
      if (saved === 'en' || saved === 'th') setLangState(saved);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('amr-lang', l); } catch {}
  };

  const t = (key: string) => translations[key]?.[lang] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
