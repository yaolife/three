const API_BASE_URL = "/server-api"

/**
 * 通用GET请求方法
 * @param {string} url - 接口路径
 * @returns {Promise} - 返回Promise对象
 */
async function get(url) {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("API请求失败:", error)
    throw error
  }
}

/**
 * 通用POST请求方法
 * @param {string} url - 接口路径
 * @param {object} data - 请求数据
 * @returns {Promise} - 返回Promise对象
 */
async function post(url, data = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("API请求失败:", error)
    throw error
  }
}

/**
 * 吊索具数据库分页接口
 * @param {object} params - 分页参数 { pageNum, pageSize, search }
 * @returns {Promise} - 返回分页数据
 */
export function getLiftingInfoPage(params) {
  return post("/template/liftingInfo/page", params)
}

/**
 * 吊索具数据库新增/更新接口
 * @param {object} data - 吊索具基本信息
 * @returns {Promise} - 返回操作结果
 */
export function addUpdateLiftingInfo(data) {
  return post("/template/liftingInfo/addUpdate", data)
}

/**
 * 吊索具详情分页接口
 * @param {object} params - 分页参数 { pageNum, pageSize, liftingInfoId }
 * @returns {Promise} - 返回详情分页数据
 */
export function getLiftingDetailPage(params) {
  return post("/template/liftingDetail/page", params)
}

/**
 * 吊索具详情新增/更新接口
 * @param {object} data - 吊索具详情数据
 * @returns {Promise} - 返回操作结果
 */
export function addUpdateLiftingDetail(data) {
  return post("/template/liftingDetail/addUpdate", data)
}

/**
 * 吊索具数据库新增/子类型
 * @param {string|number} type - 父类型ID
 * @returns {Promise} - 返回操作结果
 */
export async function getSubType(type) {
  try {
    const url = `/lifting/type/getByFatherType/${type}`
    return await get(url)
  } catch (error) {
    console.error("获取子类型API请求失败:", error)
    throw error
  }
}

/**
 * 吊索具数据库/删除模版数据
 * @param {string|number} id - 模版ID
 * @returns {Promise} - 返回操作结果
 */
export async function deleteTemplateItem(id) {
  try {
    const url = `/template/liftingInfo/delete/${id}`
    return await get(url)
  } catch (error) {
    console.error("删除吊索具模版数据API请求失败:", error)
    throw error
  }
}

/**
 * 吊索具数据库/删除子数据
 * @param {string|number} id - 子ID
 * @returns {Promise} - 返回操作结果
 */
export async function deleteSubItem(id) {
  try {
    const url = `/template/liftingDetail/delete/${id}`
    return await get(url)
  } catch (error) {
    console.error("删除吊索具子数据API请求失败:", error)
    throw error
  }
}
/**
 * 起重机数据库分页接口
 * @param {object} params - 分页参数 { pageNum, pageSize }
 * @returns {Promise} - 返回分页数据
 */
export function getCraneInfoPage(params) {
  return post("/template/crane/page", params)
}
/**
 * 起重机数据库新增修改接口
 * @param {object} params - 分页参数 { id, machineName, type,mode,prodBusiness }
 * @returns {Promise} - 返回操作结果
 */
export function editCraneInfo(params) {
  return post("/template/crane/addUpdate", params)
}

/**
 * 起重机数据库/删除数据
 * @param {string|number} id - 起重机ID
 * @returns {Promise} - 返回操作结果
 */
export async function deleteCraneItem(id) {
  try {
    const url = `/template/crane/delete/${id}`
    return await get(url)
  } catch (error) {
    console.error("删除起重机数据API请求失败:", error)
    throw error
  }
}
/**
 * 查询起重机详情
 * @param {string|number} id - 起重机ID
 * @returns {Promise} - 返回操作结果
 */
export async function getCraneDetail(id) {
  try {
    const url = `/template/craneDetail/detailByCraneInfoId/${id}`
    return await get(url)
  } catch (error) {
    console.error("获取起重机详情API请求失败:", error)
    throw error
  }
}
/**
 * 起重机数据库详情确认修改接口
 * @param {object} params - 参数 { }
 * @returns {Promise} - 返回操作结果
 */
export function confirmUpdateCraneDetail(params) {
  return post("/template/craneDetail/addUpdate", params)
}

/**
 * 设备数据库分页接口
 * @param {object} params - 分页参数 { pageNum, pageSize }
 * @returns {Promise} - 返回分页数据
 */
export function getDeviceInfoPage(params) {
  return post("/template/device/page", params)
}
/**
 * 设备数据库新增修改接口
 * @param {object} params - 分页参数 { id,deviceName,deviceType,prodBusiness,weight,length,width,height }
 * @returns {Promise} - 返回操作结果
 */
export function editDeviceInfo(params) {
  return post("/template/device/addUpdate", params)
}

/**
 * 设备数据库/删除数据
 * @param {string|number} id - 设备ID
 * @returns {Promise} - 返回操作结果
 */
export async function deleteDeviceItem(id) {
  try {
    const url = `/template/device/deleteById/${id}`
    return await get(url)
  } catch (error) {
    console.error("删除设备数据API请求失败:", error)
    throw error
  }
}
/**
 * 获取吊索具名称一级菜单
 * @param {string|number} id - 固定传0
 * @returns {Promise} - 返回操作结果
 */
export async function getLiftingMenuOne(id) {
  try {
    const url = `/lifting/type/getByFaterId/${id}`
    return await get(url)
  } catch (error) {
    console.error("获取吊索具名称一级菜单API请求失败:", error)
    throw error
  }
}
/**
 * 获取吊索具名称二级菜单
 * @param {object} params - 分页参数 { pageNum, pageSize,liftingType }
 * @returns {Promise} - 返回分页数据
 */
export function getLiftingMenuTwo(params) {
  return post("/template/liftingInfo/page", params)
}
/**
 * 获取吊索具名称 三级菜单
 * @param {object} params - 分页参数 { pageNum, pageSize,liftingInfoId }
 * @returns {Promise} - 返回分页数据
 */
export function getLiftingMenuThree(params) {
  return post("/template/liftingDetail/page", params)
}
/**
 * 通过第三级菜单返回的id查询吊索具详情
 * @param {string|number}  
 * @returns {Promise} - 返回操作结果
 */
export async function getLiftingDetail(id) {
  try {
    const url = `/template/liftingDetail/detail/${id}`
    return await get(url)
  } catch (error) {
    console.error("获取吊索具详情请求失败:", error)
    throw error
  }
}
/**
 * 获取设备名称的接口
 * @param {object} params - 分页参数 { pageNum, pageSize }
 * @returns {Promise} - 返回分页数据
 */
export function getDeviceList(params) {
  return post("/template/device/page", params)
}

export default {
  getLiftingInfoPage,
  addUpdateLiftingInfo,
  getLiftingDetailPage,
  addUpdateLiftingDetail,
  getSubType,
  deleteSubItem,
  deleteTemplateItem,
  getCraneInfoPage,
  editCraneInfo,
  deleteCraneItem,
  getCraneDetail,
  confirmUpdateCraneDetail,
  getDeviceInfoPage,
  editDeviceInfo,
  deleteDeviceItem,
  getLiftingMenuOne,
  getLiftingMenuTwo,
  getLiftingMenuThree,
  getLiftingDetail,
  getDeviceList
}
