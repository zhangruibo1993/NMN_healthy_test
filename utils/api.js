import {http} from './http'; 

// 登录
export function login(params){
  return  http('/xcx/login', 'post',params) 
}
