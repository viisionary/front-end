/**
 * 正则表达式校验类
 */

/**
 * 手机号验证
 * @param phone
 * @returns {boolean}
 */
export function checkPhone(phone) {
    let reg = new RegExp(/^1[345678]\d{9}$/);
    return reg.test(phone);
}

/**
 * 身份证验证
 * @param idCard
 * @returns {boolean}
 */
export function checkIdCard(idCard) {
    let id1 = new RegExp(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/);
    let id2 = new RegExp(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/);
    return id1.test(idCard) || id2.test(idCard);
}

/**
 * Email检测
 * @param email
 * @returns {boolean}
 */
export function checkEmail(email) {
    let reg = new RegExp(/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+(([.-])[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/);
    return reg.test(email);
}

/**
 * 中文检测
 * @param str
 * @returns {boolean}
 */
export function checkChinese(str) {
    let reg = new RegExp(/^([\u4E00-\u9FA5])*$/);
    return reg.test(str);
}

/**
 * 数字检测
 * @param num
 * @returns {boolean}
 */
export function checkNum(num) {
    let reg = new RegExp(/^[0-9]*$/);
    return reg.test(num);
}

export function check(value, verify) {
    let reg = new RegExp(eval('/' + verify + '/'));
    return reg.test(value);
}

/**
 * url 检测
 */

export function checkUrl(value) {
    let reg = new RegExp(/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/);
    return reg.test(value)
}