// Column configurations for different lifting types (101-117)

// 吊带类型 (Lifting Sling) - 101-103
export const SLING_COLUMNS = {
  // 101: 扁平带 (Flat Belt)
  101: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "ratedLoad", label: "额定载荷(kg)", minWidth: 120 },
    { prop: "approximateWidth456", label: "近似宽度(4、5、6:1)", minWidth: 150 },
    { prop: "approximateWidth7", label: "近似宽度(7:1)", minWidth: 120 },
    { prop: "miniLength", label: "最小长度", minWidth: 120 },
    { prop: "eyeLength", label: "环眼长度", minWidth: 120 },
  ],
  // 102: 环形带 (Round Belt)
  102: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "ratedLoad", label: "额定载荷(kg)", minWidth: 120 },
    { prop: "approximateThickness", label: "近似厚度(mm)", minWidth: 120 },
    { prop: "approximateWidth", label: "近似宽度(mm)", minWidth: 120 },
    { prop: "miniLength", label: "最小长度L(m)", minWidth: 120 },
  ],
  // 103: 专用索具 (Special Rigging)
  103: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "ratedLoad", label: "额定载荷(kg)", minWidth: 120 },
    { prop: "approximateThickness", label: "近似厚度(mm)", minWidth: 120 },
    { prop: "approximateWidth", label: "近似宽度(mm)", minWidth: 120 },
    { prop: "miniLength", label: "最小长度L(m)", minWidth: 120 },
  ],
}

// 钢丝绳类型 (Wire Rope) - 108-114
export const WIRE_ROPE_COLUMNS = {
  // 108: 无接头绳圈 (Endless Rope Loop)
  108: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "diameter", label: "直径(mm)", minWidth: 100 },
    { prop: "minBreakingForce", label: "最小破断力(KN)", minWidth: 130 },
    { prop: "singleRatedLoad", label: "单只额定载荷(KN)", minWidth: 150 },
    { prop: "doubleRatedLoad45", label: "双只额定载荷(KN,a=45°)", minWidth: 180 },
    { prop: "doubleRatedLoad90", label: "双只额定载荷(KN,a=90°)", minWidth: 180 },
    { prop: "approximateWeight", label: "近似重量(kg/m)", minWidth: 130 },
  ],
  // 109: 吊装工程锁具（压制锁具）(Hoisting Lock - Compression)
  109: [
    { prop: "deviceModelHemp", label: "产品型号(麻芯)", minWidth: 140 },
    { prop: "deviceModelSteel", label: "产品型号(钢芯)", minWidth: 140 },
    { prop: "ropeDiameter", label: "钢丝绳直径(mm)", minWidth: 140 },
    { prop: "ratedLoadHemp", label: "额定载荷(麻芯)(kn)", minWidth: 150 },
    { prop: "ratedLoadSteel", label: "额定载荷(钢芯)(kn)", minWidth: 150 },
    { prop: "approximateSleeveLength", label: "近似套长(A)(mm)", minWidth: 140 },
  ],
  // 110: 吊装工程锁具（插遍锁具）(Hoisting Lock - Splice)
  110: [
    { prop: "deviceModelHemp", label: "产品型号(麻芯)", minWidth: 140 },
    { prop: "deviceModelSteel", label: "产品型号(钢芯)", minWidth: 140 },
    { prop: "ropeDiameter", label: "钢丝绳直径(mm)", minWidth: 140 },
    { prop: "ratedLoadHemp", label: "额定载荷(麻芯)(kn)", minWidth: 150 },
    { prop: "ratedLoadSteel", label: "额定载荷(钢芯)(kn)", minWidth: 150 },
    { prop: "approximateSleeveLength", label: "近似套长(A)(mm)", minWidth: 140 },
    { prop: "ringParams", label: "吊环参数AxBxd(mm)", minWidth: 160 },
    { prop: "hookModel", label: "吊钩型号(t)", minWidth: 120 },
    { prop: "hookLoad", label: "吊钩载荷(t)", minWidth: 120 },
  ],
  // 112: 单股钢丝绳拉锁 (Single-strand Wire Rope Lock)
  112: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "ropeDiameter", label: "钢丝绳直径(mm)", minWidth: 140 },
    { prop: "paramA", label: "A(mm)", minWidth: 100 },
    { prop: "paramB", label: "B(mm)", minWidth: 100 },
    { prop: "paramC", label: "C(mm)", minWidth: 100 },
    { prop: "paramE", label: "E(mm)", minWidth: 100 },
    { prop: "paramM", label: "M(mm)", minWidth: 100 },
    { prop: "paramL1", label: "L1(mm)", minWidth: 100 },
    { prop: "axisF", label: "轴F(mm)", minWidth: 100 },
  ],
  // 113: 建筑工程锁具（压制锁具）(Building Lock - Compression)
  113: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "ropeDiameter", label: "钢丝绳直径d(mm)", minWidth: 140 },
    { prop: "paramA", label: "A(mm)", minWidth: 100 },
    { prop: "paramB", label: "B(mm)", minWidth: 100 },
    { prop: "paramC", label: "C(mm)", minWidth: 100 },
    { prop: "paramD", label: "D(mm)", minWidth: 100 },
    { prop: "paramE", label: "E(mm)", minWidth: 100 },
    { prop: "paramM", label: "M(mm)", minWidth: 100 },
    { prop: "paramL1", label: "L1(mm)", minWidth: 100 },
    { prop: "axisF", label: "轴F(mm)", minWidth: 100 },
    { prop: "holeDiameter", label: "孔径(mm)", minWidth: 100 },
  ],
  // 114: 建筑工程锁具（浇灌锁具）(Building Lock - Casting)
  114: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "jointModel", label: "接头型号", minWidth: 120 },
    { prop: "ropeDiameter", label: "钢丝绳直径d(mm)", minWidth: 140 },
    { prop: "paramA", label: "A(mm)", minWidth: 100 },
    { prop: "paramB", label: "B(mm)", minWidth: 100 },
    { prop: "paramC", label: "C(mm)", minWidth: 100 },
    { prop: "paramM", label: "M(mm)", minWidth: 100 },
    { prop: "paramN", label: "N(mm)", minWidth: 100 },
    { prop: "axisF", label: "轴F(mm)", minWidth: 100 },
    { prop: "holeDiameterC", label: "孔径C(mm)", minWidth: 100 },
    { prop: "paramA1", label: "A1(mm)", minWidth: 100 },
    { prop: "paramB1", label: "B1(mm)", minWidth: 100 },
    { prop: "paramN1", label: "N1(mm)", minWidth: 100 },
  ],
}

// 卸扣类型 (Shackle) - 115-117
export const SHACKLE_COLUMNS = {
  // 115: 大吨位卸扣 (Heavy-duty Shackle)
  115: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "ratedLoad", label: "额定载荷(t)", minWidth: 120 },
    { prop: "paramW", label: "W(mm)", minWidth: 100 },
    { prop: "paramD", label: "D(mm)", minWidth: 100 },
    { prop: "paramP", label: "P(mm)", minWidth: 100 },
    { prop: "paramA", label: "A(mm)", minWidth: 100 },
    { prop: "paramO", label: "O(mm)", minWidth: 100 },
    { prop: "paramS", label: "S(mm)", minWidth: 100 },
    { prop: "paramLowerD", label: "d(mm)", minWidth: 100 },
    { prop: "paramE", label: "E(mm)", minWidth: 100 },
    { prop: "selfWeight", label: "自重(kg)", minWidth: 100 },
  ],
  // 116: S6级卸扣 (S6-Grade Shackle)
  116: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "ratedLoad", label: "额定载荷(t)", minWidth: 120 },
    { prop: "paramW", label: "W(mm)", minWidth: 100 },
    { prop: "paramD", label: "D(mm)", minWidth: 100 },
    { prop: "paramP", label: "P(mm)", minWidth: 100 },
    { prop: "paramO", label: "O(mm)", minWidth: 100 },
    { prop: "paramS", label: "S(mm)", minWidth: 100 },
    { prop: "paramLowerD", label: "d(mm)", minWidth: 100 },
    { prop: "paramE", label: "E(mm)", minWidth: 100 },
    { prop: "selfWeight", label: "自重(kg)", minWidth: 100 },
    { prop: "weightBW", label: "L(BW型)(kg)", minWidth: 120 },
  ],
  // 117: T8级卸扣 (T8-Grade Shackle)
  117: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "ratedLoad", label: "额定载荷(t)", minWidth: 120 },
    { prop: "paramW", label: "W(mm)", minWidth: 100 },
    { prop: "paramD", label: "D(mm)", minWidth: 100 },
    { prop: "paramP", label: "P(mm)", minWidth: 100 },
    { prop: "paramO", label: "O(mm)", minWidth: 100 },
    { prop: "paramS", label: "S(mm)", minWidth: 100 },
    { prop: "paramLowerD", label: "d(mm)", minWidth: 100 },
    { prop: "paramE", label: "E(mm)", minWidth: 100 },
    { prop: "selfWeightBW", label: "自重(BW型)(kg)", minWidth: 130 },
    { prop: "selfWeightBX", label: "自重(BX型)(kg)", minWidth: 130 },
    { prop: "selfWeightDW", label: "自重(DW型)(kg)", minWidth: 130 },
    { prop: "selfWeightDX", label: "自重(DX型)(kg)", minWidth: 130 },
    { prop: "weightLBW", label: "L(BW型)(kg)", minWidth: 120 },
    { prop: "weightLBX", label: "L(BX型)(kg)", minWidth: 120 },
    { prop: "weightLDW", label: "L(DW型)(kg)", minWidth: 120 },
    { prop: "weightLDX", label: "L(BX型)(kg)", minWidth: 120 },
  ],
}

// 缆绳类型 (Cable Rope) - 104-107
export const CABLE_COLUMNS = {
  // 104: 八股及十二股缆绳 (8-strand & 12-strand Rope)
  104: [
    { prop: "diameter", label: "直径(mm)", minWidth: 100 },
    { prop: "circumference", label: "圆周(INCH)", minWidth: 120 },
    { prop: "linearDensity", label: "线密度(Ktex)", minWidth: 130 },
    { prop: "deviation", label: "偏差(%)", minWidth: 100 },
    { prop: "theoreticalWeight", label: "理论重量(kg/200M)", minWidth: 150 },
    { prop: "minBreakingStrengthKN", label: "最低断裂强力(KN)", minWidth: 150 },
    { prop: "minBreakingStrengthTon", label: "最低断裂强力(Ton)", minWidth: 160 },
    { prop: "minBreakingStrengthUnbraided", label: "最低断裂强力(未插编)(KN)", minWidth: 200 },
    { prop: "minBreakingStrengthEye", label: "最低断裂强力(带环眼绳索)(KN)", minWidth: 220 },
  ],
  // 105: 三股缆绳 (3-strand Rope)
  105: [
    { prop: "diameter", label: "直径(mm)", minWidth: 100 },
    { prop: "circumference", label: "圆周(INCH)", minWidth: 120 },
    { prop: "linearDensity", label: "线密度(Ktex)", minWidth: 130 },
    { prop: "deviation", label: "偏差(%)", minWidth: 100 },
    { prop: "theoreticalWeight", label: "理论重量(kg/200M)", minWidth: 150 },
    { prop: "minBreakingStrengthKN", label: "最低断裂强力(KN)", minWidth: 150 },
    { prop: "minBreakingStrengthTon", label: "最低断裂强力(Ton)", minWidth: 160 },
    { prop: "minBreakingStrengthUnbraided", label: "最低断裂强力(未插编)(KN)", minWidth: 200 },
    { prop: "minBreakingStrengthEye", label: "最低断裂强力(带环眼绳索)(KN)", minWidth: 220 },
  ],
  // 106: 海工海事双编缆绳 (Marine Double-braid Rope)
  106: [
    { prop: "diameter", label: "直径(mm)", minWidth: 100 },
    { prop: "circumference", label: "圆周(INCH)", minWidth: 120 },
    { prop: "linearDensity", label: "线密度(Ktex)", minWidth: 130 },
    { prop: "deviation", label: "偏差(%)", minWidth: 100 },
    { prop: "theoreticalWeight", label: "理论重量(kg/200M)", minWidth: 150 },
    { prop: "minBreakingStrengthKN", label: "最低断裂强力(KN)", minWidth: 150 },
    { prop: "minBreakingStrengthTon", label: "最低断裂强力(Ton)", minWidth: 160 },
  ],
  // 107: 高性能牵引绳 (High-performance Traction Rope)
  107: [
    { prop: "deviceModel", label: "产品型号", minWidth: 120 },
    { prop: "breakingLoad", label: "破断载荷(kg)", minWidth: 130 },
    { prop: "approximateDiameter", label: "近似直径(mm)", minWidth: 130 },
    { prop: "minLength", label: "最小长度(m)", minWidth: 120 },
    { prop: "maxLength", label: "最大长度(m)", minWidth: 120 },
    { prop: "sleeveLength", label: "套长(mm)", minWidth: 100 },
    { prop: "weightPerMeter", label: "每米重量(kg/m)", minWidth: 130 },
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
