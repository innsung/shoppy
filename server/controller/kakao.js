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
            // "approval_url":  `http://192.168.7.25:9000/kakao/approve`,  //카카오에서 redirection url
            "approval_url":  `https://fried-padding-professor.ngrok-free.dev/kakao/approve?partner_order_id=${orderId}`,  //카카오에서 redirection url
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
        const { tid, next_redirect_mobile_url } = readyResponse.data;
console.log(tid, next_redirect_mobile_url);
        
        
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
    //req ==> 카카오 페이 서버에서 보내는 요청!!!
    // console.log(req.query);
    const { partner_order_id, pg_token } = req.query;
    const appSavedData = approvalData[partner_order_id];
console.log(appSavedData);
    
    try {
        const approveURL = `https://open-api.kakaopay.com/online/v1/payment/approve`;
        const data = {
            "cid": "TC0ONETIME",  //무료 테스트 고정
            "tid": appSavedData.tid,
            "partner_order_id": appSavedData.orderId,
            "partner_user_id": appSavedData.userId,
            "pg_token": pg_token
        }
        const config = {
            headers: {
                'Authorization': `SECRET_KEY ${process.env.KAKAO_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        }

        const result = await axios.post(approveURL, data, config);
console.log('approve result -->', result.data);

        //결제 완료 후 자동으로 http://192.168.7.25:3000/success  페이지로 자동 이동!!
        /**
         * http://192.168.7.25:3000/success 페이지 이동 코드 추가
         * 
         * res.redirect('http://192.168.7.25:3000/success');
         */


        
    } catch (error) {
        console.log('kakao approve :: ',error);        
    }
    
}