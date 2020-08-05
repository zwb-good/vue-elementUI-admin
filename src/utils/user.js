export function getToken() {
  return window.sessionStorage.getItem("Token") || window.localStorage.getItem("Token");
}

export function setToken(token,remeberMe) {
  if(remeberMe){
    window.localStorage.setItem("Token",token)
  }else{
    window.sessionStorage.setItem("Token",token)
  }
}

export function removeToken() {
  sessionStorage.removeItem("Token")
  localStorage.removeItem("Token")
}

export function getMenu() {
  return JSON.parse(window.sessionStorage.getItem("menu"));
}

export function setMenu(data) {
  window.sessionStorage.setItem("menu",JSON.stringify(data))
}

