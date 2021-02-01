import {http} from './http'; 

// 登录
export function login(params){
  return  http('/xcx/login', 'post',params) 
}
// 注册
export function regist(params) {
  return http('/xcx/user/info', 'PUT', params)
}
// 获取用户信息
export function userInfo(params) {
  return http('/xcx/user/info', 'GET', params, true)
}
// 获取验证码
export function valiCode(params) {
  return http('/sms/valiCode', 'GET', params)
}
// 获取拼团信息
export function memberGroup(params){
  return  http('/group/member', 'get', params, true) 
}
// 获取订单各状态数量
export function orderCount(params) {
  return http('/order/count', 'GET', params, true)
}
// 获取订单列表
export function orderList(params) {
  return http('/order/list', 'GET', params)
}
// 获取购买金额配置
export function priceConfig(params) {
  return http('/sys/config', 'GET', params, true)
}
// 支付（需要微信支付）
export function pay(params) {
  return http('/wx/pay', 'POST', params)
}
// 支付（不需要微信支付）
export function rewardPay(params) {
  return http('/reward/pay', 'POST', params)
}
// 获取银行卡列表
export function bankcardList(params) {
  return http('/bankcard/list', 'GET', params)
}
// 解绑银行卡
export function deleteBankcard(params) {
  return http('/bankcard', 'DELETE', params)
}
// 绑定银行卡
export function addBankcard(params) {
  return http('/bankcard', 'POST', params)
}
// 奖励金明细列表
export function rewardList(params) {
  return http('/reward/list', 'GET', params)
}
// 奖励金明细列表
export function rewardDrawal(params) {
  return http('/reward/drawal', 'POST', params)
}