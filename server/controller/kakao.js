import dotenv from 'dotenv';
import axios from 'axios';
import {randomUUID} from 'node:crypto';
dotenv.config();
const approvals = new Map();
// PC payment returns through the browser on this computer; no tunnel is needed.
const publicUrl = () => 'http://localhost:9000';
const config = () => ({headers:{Authorization:`SECRET_KEY ${process.env.KAKAO_SECRET_KEY}`,'Content-Type':'application/json'},timeout:20000});
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function page(res, status, title, message, details='') {
  return res.status(status).set('Cache-Control','no-store').type('html').send(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · Shoppy</title><style>*{box-sizing:border-box}body{margin:0;background:#f7f8f4;color:#202923;font-family:system-ui,-apple-system,sans-serif;min-height:100svh;display:grid;place-items:center;padding:24px}.card{background:white;border:1px solid #e1e6df;border-radius:24px;padding:36px 24px;width:100%;max-width:440px;text-align:center}.brand{font-weight:800;font-size:27px;letter-spacing:-1px}.brand span{color:#668568}.symbol{margin:30px auto 24px;border-radius:50%;background:#edf3e9;color:#486b4c;width:68px;height:68px;display:grid;place-items:center;font-size:32px}h1{font-size:24px;line-height:1.4}p{color:#626e64;line-height:1.7;word-break:keep-all}.details{margin:24px 0;padding:18px;background:#f7f8f4;border-radius:12px;overflow-wrap:anywhere;line-height:1.8}.note{font-size:13px;margin-top:24px}</style></head><body><main class="card"><div class="brand">shoppy<span>.</span></div><div class="symbol">${status===200?'✓':'!'}</div><h1>${title}</h1><p>${message}</p>${details}<p class="note">카카오페이 테스트 결제입니다.<br>결제 결과 확인이 완료되었습니다.</p></main></body></html>`);
}
export const getReady = async(req,res) => {
 const {orderId,userId,itemName,quantity,totalAmount}=req.body;
 try {
  const {data}=await axios.post('https://open-api.kakaopay.com/online/v1/payment/ready',{
   cid:'TC0ONETIME',partner_order_id:orderId,partner_user_id:userId,item_name:itemName,quantity,total_amount:totalAmount,vat_amount:0,tax_free_amount:0,
   approval_url:`${publicUrl()}/kakao/approve?partner_order_id=${encodeURIComponent(orderId)}`,
   fail_url:`${publicUrl()}/kakao/fail`,cancel_url:`${publicUrl()}/kakao/cancel`
  },config());
  const statusToken=randomUUID();
  approvals.set(orderId,{tid:data.tid,orderId,userId,itemName,state:'ready',statusToken});
  res.json({tid:data.tid,next_redirect_pc_url:data.next_redirect_pc_url,next_redirect_mobile_url:data.next_redirect_mobile_url,statusToken});
 } catch {res.status(502).json({message:'결제 준비에 실패했습니다. 잠시 후 다시 시도해주세요.'});}
};
export const getStatus=(req,res)=>{
 const saved=approvals.get(req.body.orderId);
 res.set('Cache-Control','no-store');
 if(!saved||!req.body.statusToken||saved.statusToken!==req.body.statusToken)return res.status(404).json({message:'결제 정보를 찾을 수 없습니다.'});
 return res.json({state:saved.state,...(saved.state==='approved'?{orderId:saved.orderId,amount:saved.amount,itemName:saved.itemName,approvedAt:saved.approvedAt}:{})});
};
export const getApprove = async(req,res) => {
 const {partner_order_id,pg_token}=req.query;
 const saved=typeof partner_order_id==='string'?approvals.get(partner_order_id):null;
 if(!saved||typeof pg_token!=='string'||!pg_token) return page(res,400,'결제 정보를 확인할 수 없습니다','서버가 재시작되었거나 결제 정보가 만료되었습니다. PC에서 결제를 다시 시작해 주세요.');
 const success=()=>res.redirect(`http://localhost:3000/payresult?${new URLSearchParams({orderId:saved.orderId,token:saved.statusToken})}`);
 if(saved.state==='approved')return success();
 if(saved.state!=='ready')return page(res,409,'결제 승인 확인 중입니다','중복 승인을 방지하기 위해 다시 요청하지 않았습니다. 결제 상태를 확인해 주세요.');
 saved.state='processing';
 try {
  const {data}=await axios.post('https://open-api.kakaopay.com/online/v1/payment/approve',{cid:'TC0ONETIME',tid:saved.tid,partner_order_id:saved.orderId,partner_user_id:saved.userId,pg_token},config());
  if(data.tid!==saved.tid||!data.approved_at||!Number.isFinite(data.amount?.total))throw new Error('Invalid approval response');
  saved.state='approved';saved.amount=data.amount.total;saved.approvedAt=data.approved_at;return success();
 } catch {
  saved.state='unknown';return page(res,502,'결제 승인을 확인하지 못했습니다','통신 오류 또는 승인 실패로 결과를 확인하지 못했습니다. 결제 내역을 먼저 확인해 주세요.');
 }
};
export const getFail=(req,res)=>page(res,400,'결제가 완료되지 않았습니다','카카오페이 결제에 실패했습니다. PC에서 다시 시도해 주세요.');
export const getCancel=(req,res)=>page(res,200,'결제가 취소되었습니다','결제를 취소했습니다. PC 쇼핑몰에서 계속 둘러보실 수 있습니다.');
