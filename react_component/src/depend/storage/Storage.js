/**
 * cookie有效时间
 * @type {number}
 */
const CookieTime = 60 * 60 * 24 * 30 * 3 * 1000;
/**
 * cookie相关操作
 * @type {{get: CookieUtil.get, put: CookieUtil.put, remove: CookieUtil.remove, clear: CookieUtil.clear}}
 */
const CookieStorage = {
    getItem: function (name) {
        let cookieName = encodeURIComponent(name) + '=',
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null;
        if (cookieStart > -1) {
            let cookieEnd = document.cookie.indexOf(';', cookieStart);
            if (cookieEnd === -1) {
                cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
        }
        return cookieValue;
    },
    setItem: function (name, value) {
        let cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
        cookieText += '; max-age=' + CookieTime;
        cookieText += '; path=' + '/';
        document.cookie = cookieText;
    },

    removeItem: function (name) {
        let cookieName = encodeURIComponent(name);
        this.setItem(cookieName, '', 0);
    },

    clear: function () {
        let list = document.cookie.split("; ");
        for (let i = 0; i < list.length; i++) {
            let cookieText = list[i];
            let p = cookieText.indexOf("=");
            let name = cookieText.substring(0, p);
            this.setItem(name, '', 0);
        }
    }
};

/**
 * 若cookie和localStorage都不可用，内部存储
 * @type {{}}
 */
const Storage = {
    data: {},
    getItem: function (key) {
        return this.data[key];
    },
    setItem: function (key, data) {
        this.data[key] = data;
    },
    removeItem: function (key) {
        if (this.data[key]) {
            this.data[key] = null;
            delete this.data[key];
        }
    },
    clear: function () {
        for (let key in this.data) {
            this[key] = null;
            delete this.data[key];
        }
    }
};
/**
 * localStorage存储封装类。
 * 参数和值做 encodeURIComponent，decodeURIComponent处理
 * @type {{getItem: LocalStorage.getItem, setItem: LocalStorage.setItem, removeItem: LocalStorage.removeItem, clear: LocalStorage.clear}}
 */
const LocalStorage = {
    getItem: function (key) {
        let lsKey = encodeURIComponent(key);
        let lsValue = decodeURIComponent(localStorage.getItem(lsKey));
        return lsValue;
    },
    setItem: function (key, value) {
        let lsKey = encodeURIComponent(key);
        let lsValue = encodeURIComponent(value);
        localStorage.setItem(lsKey, lsValue);
    },
    removeItem: function (key) {
        let lsKey = encodeURIComponent(key);
        localStorage.removeItem(lsKey);
    },
    clear: function () {
        localStorage.clear();
    }
};

/**
 * 根据浏览器环境选择相应的存储方式。1、localStorage  2、cookie    3、内存（保证在单次使用过程中正常）
 * @returns {*}
 */
function getStorage() {
    if (window.localStorage) {
        return LocalStorage;
    }
    try {
        if (document.cookie && navigator.cookieEnabled) {
            return CookieStorage;
        }
    } catch (e) {
    }
    return Storage;
}

export default getStorage();