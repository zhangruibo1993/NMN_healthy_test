import {http} from './http'; 

// 登录
export function login(params){
  return  http('/xcx/login', 'post',params) 
}
//拼团列表

export function getuni(params){
  return  http('/sale/group/list', 'get',params) 
}