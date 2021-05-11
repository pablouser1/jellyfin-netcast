export default class Cookies {
  /**
   * Get document cookie
   * @param {string} name Cookie Name
   * @returns {string} Cookie data
  */
  static get (name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift()
    return ''
  }

  /**
   * Set document cookie
   * @param {string} cname Cookie Name
   * @param {string} cvalue Cookie Value
   * @param {number} exdays Days before expiring
  */
  static set (cname, cvalue, exdays) {
    const d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    const expires = `expires= + ${d.toUTCString()}`
    document.cookie = `${cname}=${cvalue}; ${expires}; path=/`
  }

  /**
   * Remove cookie
   * @param {string} cname Cookie Name
  */
  static delete (cname) {
    document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`
  }
}
