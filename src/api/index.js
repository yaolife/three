const API_BASE_URL = "/api"

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
    const url = `/lifting/type/getByFatherType/${type}`;
    return await get(url);
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
    const url = `/template/liftingInfo/delete/${id}`;
    return await get(url);
  } catch (error) {
    console.error("删除模版数据API请求失败:", error)
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
    const url = `/template/liftingDetail/delete/${id}`;
    return await get(url);
  } catch (error) {
    console.error("删除子数据API请求失败:", error)
    throw error
  }
}
export default {
  getLiftingInfoPage,
  addUpdateLiftingInfo,
  getLiftingDetailPage,
  addUpdateLiftingDetail,
  getSubType,
  deleteSubItem,
  deleteTemplateItem,
}
