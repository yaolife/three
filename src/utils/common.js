// 类型翻译函数
export const translateLiftingType = (type) => {
  const typeMap = {
    0: '钢丝绳',
    1: '吊带',
    2: '卸扣',
    3: '缆绳',
  };
  
  // 如果是数字字符串，直接翻译
  if (typeMap[type]) {
    return typeMap[type];
  }
  
  // 如果已经是中文，直接返回
  if (['钢丝绳', '吊带', '卸扣', '缆绳'].includes(type)) {
    return type;
  }
  
  // 默认返回原值
  return type;
};