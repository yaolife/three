// Column configurations for different lifting types (101-117)

// 吊带类型 (Lifting Sling) - 101-103
export const SLING_COLUMNS = {
  // 101: 扁平带 (Flat Belt)
  101: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "pq", label: "额定载荷(kg)", minWidth: 120 },
    { prop: "approximateWidth", label: "近似宽度(4、5、6:1)", minWidth: 150 },
    { prop: "approximateWidthTwo", label: "近似宽度(7:1)", minWidth: 120 },
    { prop: "miniLength", label: "最小长度", minWidth: 120 },
    { prop: "eyeLength", label: "环眼长度", minWidth: 120 },
  ],
  // 102: 环形带 (Round Belt)
  102: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "pq", label: "额定载荷(kg)", minWidth: 120 },
    { prop: "approximateThickness", label: "近似厚度(mm)", minWidth: 120 },
    { prop: "approximateWidth", label: "近似宽度(mm)", minWidth: 120 },
    { prop: "miniLength", label: "最小长度L(m)", minWidth: 120 },
  ],
  // 103: 专用索具 (Special Rigging)
  103: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "pq", label: "额定载荷(kg)", minWidth: 120 },
    { prop: "approximateWidth", label: "近似宽度(mm)", minWidth: 120 },
    { prop: "miniLength", label: "最小长度L(m)", minWidth: 120 },
    { prop: "eyeLength", label: "环眼长度(mm)", minWidth: 120 },
   { prop: "weight", label: "环重(kg)", minWidth: 120 },
  ],
}

// 钢丝绳类型 (Wire Rope) - 108-114
export const WIRE_ROPE_COLUMNS = {
  // 108: 无接头绳圈 (Endless Rope Loop)
  108: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "diameter", label: "直径(mm)", minWidth: 100 },
        { prop: "diameterTwo", label: "子绳直径(mm)", minWidth: 100 },
          { prop: "diameterThree", label: "成品直径(mm)", minWidth: 100 },
    { prop: "smalPull", label: "最小破断力(KN)", minWidth: 130 },
      { prop: "pqFour", label: "额定载荷(KN)", minWidth: 130 },
        { prop: "smalPullTwo", label: "破断载荷(KN)", minWidth: 130 },
    { prop: "pq", label: "单只额定载荷(KN)", minWidth: 150 },
    { prop: "pqTwo", label: "双只额定载荷(KN,a=45°)", minWidth: 180 },
    { prop: "pqThree", label: "双只额定载荷(KN,a=90°)", minWidth: 180 },
            { prop: "size", label: "环眼尺寸(mm)", minWidth: 130 },
    { prop: "weight", label: "近似重量(kg/m)", minWidth: 130 },
  ],
  // 109: 吊装工程锁具（压制锁具）(Hoisting Lock - Compression)
  109: [
    { prop: "deviceModel", label: "产品型号", minWidth: 140 },
    { prop: "deviceModelTwo", label: "产品型号(麻芯/钢芯)", minWidth: 160 },
      { prop: "pqFour", label: "额定载荷(KN)", minWidth: 130 },
    { prop: "diameter", label: "钢丝绳直径(mm)", minWidth: 140 },
    { prop: "axBxd", label: "吊环参数AxBxd(mm)", minWidth: 160 },
    { prop: "pq", label: "额定载荷(麻芯)(kn)", minWidth: 150 },
    { prop: "pqTwo", label: "额定载荷(钢芯)(kn)", minWidth: 150 },
      { prop: "hookType", label: "吊钩型号(t)", minWidth: 120 },
    { prop: "hookLoad", label: "吊钩载荷(t)", minWidth: 120 },
    { prop: "setLength", label: "近似套长(A)(mm)", minWidth: 140 },
  ],
  // 110: 吊装工程锁具（插遍锁具）(Hoisting Lock - Splice)
  110: [
    { prop: "deviceModel", label: "产品型号(麻芯)", minWidth: 140 },
    { prop: "deviceModelTwo", label: "产品型号(钢芯)", minWidth: 140 },
    { prop: "diameter", label: "钢丝绳直径(mm)", minWidth: 140 },
    { prop: "pq", label: "额定载荷(麻芯)(kn)", minWidth: 150 },
    { prop: "pqTwo", label: "额定载荷(钢芯)(kn)", minWidth: 150 },
    { prop: "setLength", label: "近似套长(A)(mm)", minWidth: 140 },
    { prop: "axBxd", label: "吊环参数AxBxd(mm)", minWidth: 160 },
    { prop: "hookType", label: "吊钩型号(t)", minWidth: 120 },
    { prop: "hookLoad", label: "吊钩载荷(t)", minWidth: 120 },
  ],
  // 112: 单股钢丝绳拉锁 (Single-strand Wire Rope Lock)
  112: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "diameter", label: "钢丝绳直径(mm)", minWidth: 140 },
    { prop: "a", label: "A(mm)", minWidth: 100 },
    { prop: "b", label: "B(mm)", minWidth: 100 },
    { prop: "c", label: "C(mm)", minWidth: 100 },
    { prop: "e", label: "E(mm)", minWidth: 100 },
    { prop: "m", label: "M(mm)", minWidth: 100 },
    { prop: "l1", label: "L1(mm)", minWidth: 100 },
    { prop: "f", label: "轴F(mm)", minWidth: 100 },
  ],
  // 113: 建筑工程锁具（压制锁具）(Building Lock - Compression)
  113: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "diameter", label: "钢丝绳直径d(mm)", minWidth: 140 },
    { prop: "a", label: "A(mm)", minWidth: 100 },
    { prop: "b", label: "B(mm)", minWidth: 100 },
    { prop: "c", label: "C(mm)", minWidth: 100 },
    { prop: "d", label: "D(mm)", minWidth: 100 },
    { prop: "e", label: "E(mm)", minWidth: 100 },
    { prop: "m", label: "M(mm)", minWidth: 100 },
    { prop: "l1", label: "L1(mm)", minWidth: 100 },
    { prop: "f", label: "轴F(mm)", minWidth: 100 },
    { prop: "aperture", label: "孔径(mm)", minWidth: 100 },
  ],
  // 114: 建筑工程锁具（浇灌锁具）(Building Lock - Casting)
  114: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "deviceModelTwo", label: "接头型号", minWidth: 120 },
    { prop: "diameter", label: "钢丝绳直径d(mm)", minWidth: 140 },
    { prop: "a", label: "A(mm)", minWidth: 100 },
    { prop: "b", label: "B(mm)", minWidth: 100 },
    { prop: "c", label: "C(mm)", minWidth: 100 },
    { prop: "m", label: "M(mm)", minWidth: 100 },
    { prop: "n", label: "N(mm)", minWidth: 100 },
    { prop: "f", label: "轴F(mm)", minWidth: 100 },
    { prop: "aperture", label: "孔径C(mm)", minWidth: 100 },
    { prop: "a1", label: "A1(mm)", minWidth: 100 },
    { prop: "b1", label: "B1(mm)", minWidth: 100 },
    { prop: "n1", label: "N1(mm)", minWidth: 100 },
  ],
}

// 卸扣类型 (Shackle) - 115-117
export const SHACKLE_COLUMNS = {
  // 115: 大吨位卸扣 (Heavy-duty Shackle)
  115: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "pq", label: "额定载荷(t)", minWidth: 120 },
    { prop: "w", label: "W(mm)", minWidth: 100 },
    { prop: "D", label: "D(mm)", minWidth: 100 },
    { prop: "p", label: "P(mm)", minWidth: 100 },
    { prop: "a", label: "A(mm)", minWidth: 100 },
    { prop: "o", label: "O(mm)", minWidth: 100 },
    { prop: "s", label: "S(mm)", minWidth: 100 },
    { prop: "d", label: "d(mm)", minWidth: 100 },
    { prop: "e", label: "E(mm)", minWidth: 100 },
    { prop: "weight", label: "自重(kg)", minWidth: 100 },
  ],
  // 116: S6级卸扣 (S6-Grade Shackle)
  116: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "pq", label: "额定载荷(t)", minWidth: 120 },
    { prop: "w", label: "W(mm)", minWidth: 100 },
    { prop: "d", label: "D(mm)", minWidth: 100 },
    { prop: "p", label: "P(mm)", minWidth: 100 },
    { prop: "o", label: "O(mm)", minWidth: 100 },
    { prop: "s", label: "S(mm)", minWidth: 100 },
    { prop: "d", label: "d(mm)", minWidth: 100 },
    { prop: "e", label: "E(mm)", minWidth: 100 },
    { prop: "weight", label: "自重(kg)", minWidth: 100 },
    { prop: "l", label: "L(BW型)(kg)", minWidth: 120 },
  ],
  // 117: T8级卸扣 (T8-Grade Shackle)
  117: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "pq", label: "额定载荷(t)", minWidth: 120 },
    { prop: "w", label: "W(mm)", minWidth: 100 },
    { prop: "d", label: "D(mm)", minWidth: 100 },
    { prop: "p", label: "P(mm)", minWidth: 100 },
    { prop: "o", label: "O(mm)", minWidth: 100 },
    { prop: "s", label: "S(mm)", minWidth: 100 },
    { prop: "d", label: "d(mm)", minWidth: 100 },
    { prop: "e", label: "E(mm)", minWidth: 100 },
    { prop: "weight", label: "自重(BW型)(kg)", minWidth: 130 },
    { prop: "weightTwo", label: "自重(BX型)(kg)", minWidth: 130 },
    { prop: "weightThree", label: "自重(DW型)(kg)", minWidth: 130 },
    { prop: "weightFour", label: "自重(DX型)(kg)", minWidth: 130 },
    { prop: "l", label: "L(BW型)(kg)", minWidth: 120 },
    { prop: "l1", label: "L(BX型)(kg)", minWidth: 120 },
    { prop: "l2", label: "L(DW型)(kg)", minWidth: 120 },
    { prop: "l3", label: "L(BX型)(kg)", minWidth: 120 },
  ],
}

// 缆绳类型 (Cable Rope) - 104-107
export const CABLE_COLUMNS = {
  // 104: 八股及十二股缆绳 (8-strand & 12-strand Rope)
  104: [
     { prop: "deviceModel", label: "产品型号(L+直径)", minWidth: 100 },
    { prop: "diameter", label: "直径(mm)", minWidth: 100 },
    { prop: "gardenWeek", label: "圆周(INCH)", minWidth: 120 },
    { prop: "kTex", label: "线密度(Ktex)", minWidth: 130 },
    { prop: "deviation", label: "偏差(%)", minWidth: 100 },
    { prop: "weight", label: "理论重量(kg/200M)", minWidth: 150 },
    { prop: "fractureForce", label: "最低断裂强力(KN)", minWidth: 150 },
    { prop: "fractureForceTwo", label: "最低断裂强力(Ton)", minWidth: 160 },
    { prop: "fractureForceThree", label: "最低断裂强力(未插编)(KN)", minWidth: 200 },
    { prop: "fractureForceFour", label: "最低断裂强力(带环眼绳索)(KN)", minWidth: 220 },
  ],
  // 105: 三股缆绳 (3-strand Rope)
  105: [
         { prop: "deviceModel", label: "产品型号(L+直径)", minWidth: 100 },
    { prop: "diameter", label: "直径(mm)", minWidth: 100 },
     { prop: "spec", label: "规格型号", minWidth: 100 },
       { prop: "traction", label: "牵引力(KN)", minWidth: 100 },
    { prop: "gardenWeek", label: "圆周(INCH)", minWidth: 120 },
    { prop: "kTex", label: "线密度(Ktex)", minWidth: 130 },
     { prop: "effLength", label: "有效长度(m)", minWidth: 130 },
    { prop: "deviation", label: "偏差(%)", minWidth: 100 },
    { prop: "weight", label: "理论重量(kg/200M)", minWidth: 150 },
    { prop: "fractureForce", label: "最低断裂强力(KN)", minWidth: 150 },
    { prop: "fractureForceTwo", label: "最低断裂强力(Ton)", minWidth: 160 },
    { prop: "fractureForceThree", label: "最低断裂强力(未插编)(KN)", minWidth: 200 },
    { prop: "fractureForceFour", label: "最低断裂强力(带环眼绳索)(KN)", minWidth: 220 },
  ],
  // 106: 海工海事双编缆绳 (Marine Double-braid Rope)
  106: [
         { prop: "deviceModel", label: "产品型号(L+直径)", minWidth: 100 },
    { prop: "diameter", label: "直径(mm)", minWidth: 100 },
    { prop: "gardenWeek", label: "圆周(INCH)", minWidth: 120 },
    { prop: "kTex", label: "线密度(Ktex)", minWidth: 130 },
    { prop: "deviation", label: "偏差(%)", minWidth: 100 },
    { prop: "weight", label: "理论重量(kg/200M)", minWidth: 150 },
    { prop: "fractureForce", label: "最低断裂强力(KN)", minWidth: 150 },
    { prop: "fractureForceTwo", label: "最低断裂强力(Ton)", minWidth: 160 },
  ],
  // 107: 高性能牵引绳 (High-performance Traction Rope)
  107: [
         { prop: "deviceModel", label: "产品型号(L+直径)", minWidth: 100 },
    { prop: "pq", label: "破断载荷(kg)", minWidth: 130 },
    { prop: "diameter", label: "近似直径(mm)", minWidth: 130 },
    { prop: "miniLength", label: "最小长度(m)", minWidth: 120 },
    { prop: "maxLength", label: "最大长度(m)", minWidth: 120 },
    { prop: "setLength", label: "套长(mm)", minWidth: 100 },
    { prop: "weight", label: "每米重量(kg/m)", minWidth: 130 },
  ],
}

// Get column configuration by liftingType
export function getColumnsByType(liftingType) {
  const typeStr = String(liftingType)

  // Check each category
  if (SLING_COLUMNS[typeStr]) {
    return SLING_COLUMNS[typeStr]
  }
  if (WIRE_ROPE_COLUMNS[typeStr]) {
    return WIRE_ROPE_COLUMNS[typeStr]
  }
  if (SHACKLE_COLUMNS[typeStr]) {
    return SHACKLE_COLUMNS[typeStr]
  }
  if (CABLE_COLUMNS[typeStr]) {
    return CABLE_COLUMNS[typeStr]
  }

  // Default columns if type not found
  return [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "ratedLoad", label: "额定载荷", minWidth: 120 },
  ]
}

// Get category name by liftingType
export function getCategoryByType(liftingType) {
  const typeStr = String(liftingType)

  if (SLING_COLUMNS[typeStr]) return "sling"
  if (WIRE_ROPE_COLUMNS[typeStr]) return "wireRope"
  if (SHACKLE_COLUMNS[typeStr]) return "shackle"
  if (CABLE_COLUMNS[typeStr]) return "cable"

  return "default"
}
