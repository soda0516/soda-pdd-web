/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  // const valid_map = ['测试账号', 'editor', '添加一条数据', '第一个帐号', '第二个帐号', '第三个帐号']
  // return valid_map.indexOf(str.trim()) >= 0
  return str.trim().length > 3
}
