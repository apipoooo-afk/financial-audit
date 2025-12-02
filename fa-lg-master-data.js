<!-- fa-lg-master-data.js -->
<script>
/**
 * ศูนย์กลาง Master Data อปท. จาก localStorage: fa-db-data-gov
 * ทุกหน้าในระบบ FA / Tracking / Review / Learning / Cash Board
 * ให้ include ไฟล์นี้ แล้วเรียก LG.getAll(), LG.findByCode(), LG.filterByProvince() ฯลฯ
 */

const LG = (function(){
  const STORAGE_KEY = "fa-db-data-gov";

  function _loadRaw(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY) || "[]";
      const arr = JSON.parse(raw);
      if(!Array.isArray(arr)) return [];
      return arr;
    }catch(e){
      console.error("อ่าน fa-db-data-gov ผิดพลาด:", e);
      return [];
    }
  }

  /** ดึงข้อมูลทั้งหมด */
  function getAll(){
    return _loadRaw();
  }

  /** หาหน่วยรับตรวจจาก code (r.code) */
  function findByCode(code){
    if(!code) return null;
    const data = _loadRaw();
    return data.find(r => String(r.code) === String(code)) || null;
  }

  /** ดึงเฉพาะจังหวัดทั้งหมดจากฐาน (unique) */
  function getProvinces(){
    const data = _loadRaw();
    const set = new Set();
    data.forEach(r=>{
      if(r.province) set.add(r.province);
    });
    return Array.from(set).sort();
  }

  /** กรองตามจังหวัด */
  function filterByProvince(province){
    if(!province) return _loadRaw();
    return _loadRaw().filter(r=> (r.province||"") === province);
  }

  /** กรองตามจังหวัด + อำเภอ + ตำบล + หน่วยรับตรวจ (แบบ fuzzy) */
  function search(options){
    const opt = options || {};
    const unit   = (opt.unit   || "").toLowerCase().trim();
    const prov   = (opt.province || "").trim();
    const dist   = (opt.district || "").toLowerCase().trim();
    const subd   = (opt.subdistrict || "").toLowerCase().trim();
    const vill   = (opt.village || "").toLowerCase().trim();

    let rows = _loadRaw();

    if(unit){
      rows = rows.filter(r=>{
        const name = (r.name||"").toLowerCase();
        const u    = (r.unit||"").toLowerCase();
        return name.includes(unit) || u.includes(unit);
      });
    }
    if(prov){
      rows = rows.filter(r=> (r.province||"") === prov);
    }
    if(dist){
      rows = rows.filter(r=> (r.district||"").toLowerCase().includes(dist));
    }
    if(subd){
      rows = rows.filter(r=> (r.subdistrict||"").toLowerCase().includes(subd));
    }
    if(vill){
      rows = rows.filter(r=> (r.village||"").toLowerCase().includes(vill));
    }

    return rows;
  }

  /** เติมตัวเลือกจังหวัดใน <select> ที่ส่งเข้ามา */
  function fillProvinceSelect(selectEl, includeBlank=true){
    if(!selectEl) return;
    selectEl.innerHTML = "";
    if(includeBlank){
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "-- ทุกจังหวัด --";
      selectEl.appendChild(opt);
    }
    getProvinces().forEach(p=>{
      const o = document.createElement("option");
      o.value = p;
      o.textContent = p;
      selectEl.appendChild(o);
    });
  }

  return {
    getAll,
    findByCode,
    getProvinces,
    filterByProvince,
    search,
    fillProvinceSelect
  };
})();
</script>
