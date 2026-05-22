import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

let approvalData = {}

/**
 * 1단계 - 카카오페이 결제 준비
 */
export const getReady = async(req, res, next) => {
    const { orderId, userId, itemName, quantity, totalAmount } = req.body;

    try {
        //1. 카카오페이 결제 준비
        const readyURL = `https://open-api.kakaopay.com/online/v1/payment/ready`;
        const data = {
            "cid": "TC0ONETIME",
            "partner_order_id": orderId,
            "partner_user_id": userId,
            "item_name": itemName,
            "quantity": quantity,
            "total_amount": totalAmount,
            "vat_amount": 0,
            "tax_free_amount": 0,
            "approval_url": "http://192.168.7.25:3000/kakao/approve",
            // "approval_url": "https://fried-padding-professor.ngrok-free.dev/kakao/approve",  //카카오에서 redirection url
            "fail_url": "http://192.168.7.25:3000/fail",
            "cancel_url": "http://192.168.7.25:3000/cancel"
        }
        const config = {
            headers : {
                "Authorization": `SECRET_KEY ${process.env.KAKAO_SECRET_KEY}`,
                "Content-Type": "application/json"
            }
        }

        const readyResponse = await axios.post(readyURL, data, config);
        const {tid, next_redirect_mobile_url} = readyResponse.data;

        
        //tid, orderId, userId => getApprove 호출 시 사용되므로, 저장해둠
        approvalData[orderId] = { tid, orderId, userId }

        res.json({
            tid, 
            next_redirect_mobile_url
        });

        


        
    } catch (error) {
        console.log('getReady :: ', error);        
    }  

}

/**
 * 2단계 - 카카오페이 결제 실행
 */
export const getApprove = async(req, res, next) => {
    //req ==> 카카오 페이 서버에서 보내는 요청!!
    console.log(req.query);
    
}