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
 * 查询起重机详情(新建的起重机详情)
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
/**
 * 通过设备列表返回的id查询设备详情
 * @param {string|number}  id
 * @returns {Promise} - 返回操作结果
 */
export async function getDeviceDetail(id) {
  try {
    const url = `/template/device/detailById/${id}`
    return await get(url)
  } catch (error) {
    console.error("获取设备详情请求失败:", error)
    throw error
  }
}
/**
 * 获取起重机名称的接口
 * @param {object} params - 分页参数 { pageNum, pageSize }
 * @returns {Promise} - 返回分页数据
 */
export function getCraneList(params) {
  return post("/template/crane/page", params)
}

/**
 * 通过起重列表选择后返回的id查询起重机详情
 * @param {string|number}  id
 * @returns {Promise} - 返回操作结果
 */
export async function getCraneDataDetail(id) {
  try {
    const url = `/template/craneDetail/detailByCraneInfoId/${id}`
    return await get(url)
  } catch (error) {
    console.error("获取起重机详情请求失败:", error)
    throw error
  }
}
/**
 * 全部项目分页接口
 * @param {object} params - 分页参数 { pageNum, pageSize }
 * @returns {Promise} - 返回分页数据
 */
export function getAllProject(params) {
  return post("/projectInfo/page", params)
}
/**
 * 新增/修改项目（有id修改，没有新增）
 * @param {object} params - 分页参数 { pageNum, pageSize }
 * @returns {Promise} - 返回分页数据
 */
export function handleEditProject(params) {
  return post("/projectInfo/addUpdate", params)
}
/**
 * 通过项目id查询项目详情
 * @param {string|number}  id
 * @returns {Promise} - 返回操作结果
 */
export async function getProjectDetail(id) {
  try {
    const url = `/projectInfo/detailById/${id}`
    return await get(url)
  } catch (error) {
    console.error("获取项目详情请求失败:", error)
    throw error
  }
}
/**
 * 项目列表/删除数据
 * @param {string|number} id - 相目ID
 * @returns {Promise} - 返回操作结果
 */
export async function deleteProjectItem(id) {
  try {
    const url = `/projectInfo/deleteById/${id}`
    return await get(url)
  } catch (error) {
    console.error("删除项目数据API请求失败:", error)
    throw error
  }
}

/**
 * 起重机智能选型接口
 * @param {object} params - 参数 { deviceName, deviceModel, deviceNumber, deviceWeight }
 * @returns {Promise} - 返回智能选型结果
 */
export function intelligentCraneSelection(params) {
  return post("/template/crane/getTemplateCraneInfo", params)
}
/**
 * 通过起重机信息获取作业半径与额定载荷信息
 * @param {object} params - 参数 { }
 * @returns {Promise} - 返回智能选型结果
 */
export function getCalculateInfo(params) {
  return post("/crane/detail/calculate", params)
}
/**
 * 计算吊索具高度、角度、sinQ相关数据
 * @param {object} params - 参数 { }
 * @returns {Promise} - 返回智能选型结果
 */
export function getCalculateHeightOrAngle(params) {
  return post("/lifting/detail/calculate", params)
}

/**
 * 起重机校核/吊索具校核/地基承载力校核 保存的接口
 * @param {object} params - }
 * @returns {Promise} - 
 */
export function saveProjectDetail(params) {
  return post("/projectInfo/addUpdateDetail", params)
}


/**
 * 拿到项目的所有信息
 * @param {string|number} id - 项目ID
 * @returns {Promise} - 返回操作结果
 */
export async function getProjectAllDetail(id) {
  try {
    const url = `/projectInfo/getProjectDetailById/${id}`
    return await get(url)
  } catch (error) {
    console.error("获取项目所有数据API请求失败:", error)
    throw error
  }
}

/**
 * 文件上传接口（form-data，文件流形式）
 * @param {File|Blob} file - 上传的文件（File 或 Blob 对象）
 * @param {string} fileName - 文件名（可选，如果是 Blob 需要提供）
 * @returns {Promise} - 返回上传结果
 */
export async function uploadImage(file, fileName = "image.png") {
  try {
    // 确保是 File 对象，如果是 Blob 则转换为 File
    let fileToUpload = file;
    if (file instanceof Blob && !(file instanceof File)) {
      fileToUpload = new File([file], fileName, { type: file.type || "image/png" });
    }
    
    const formData = new FormData();
    formData.append("file", fileToUpload);
    
    const response = await fetch(`${API_BASE_URL}/file/upload/upload`, {
      method: "POST",
      body: formData,
      // 不要手动设置 Content-Type，让浏览器自动设置（包括 boundary）
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("文件上传API请求失败:", error);
    throw error;
  }
}
/**
 * 总平规划/保存的接口
 * @param {object} params - 参数{ pageNum, pageSize,liftingInfoId }
 * @returns {Promise} - 
 */
export function saveGeneralPing(params) {
  return post("/projectFlat/addUpdate", params)
}
/**
 * 获取总平详情
 * @param {string|number} id - 项目ID
 * @returns {Promise} - 返回操作结果
 */
export async function getGeneralDetails(projectId) {
  try {
    const url = `/projectFlat/getDetailByProjectId/${projectId}`
    return await get(url)
  } catch (error) {
    console.error("获取总平详情API请求失败:", error)
    throw error
  }
}
/**
 * 复制选中项目
 * @param {string|number} id - 项目ID
 * @returns {Promise} - 返回操作结果
 */
export async function copyProjectItem(id) {
  try {
    const url = `/projectInfo/copy/${id}`
    return await get(url)
  } catch (error) {
    console.error("复制项目数据API请求失败:", error)
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
  getDeviceList,
  getDeviceDetail,
  getCraneList,
  getCraneDataDetail,
  getAllProject,
  handleEditProject,
  getProjectDetail,
  deleteProjectItem,
  intelligentCraneSelection,
  getCalculateInfo,
  getCalculateHeightOrAngle,
  saveProjectDetail,
  getProjectAllDetail,
  uploadImage,
  saveGeneralPing,
  getGeneralDetails,
  copyProjectItem
}
