
export function getToken() {
    return window.sessionStorage.getItem("Token");
  }
  
  export function setToken(token) {
    window.sessionStorage.setItem("Token",token)
  }

  export function getMenu() {
    return JSON.parse(window.sessionStorage.getItem("menu"));
  }

  export function setMenu(data) {
    window.sessionStorage.setItem("menu",JSON.stringify(data))
  }
  
  export function removeToken() {
    sessionStorage.remove("Token")
  }