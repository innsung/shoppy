import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import * as repository from '../repository/member.js';
dotenv.config();

/**
 * 로그아웃 - 리프레시 토큰 삭제(쿠키 비우기)
 */
export const getLogout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false, // 개발환경
    sameSite: "lax", // 개발환경
  });
  return res.status(200).json({ message: "로그아웃 완료" });
};

/**
 * 리프레시 토큰 확인 및 액세스 토큰 생성
 */
export const getRefresh = async (req, res, next) => {
  // ① 쿠키에서 refreshToken 추출
  const refreshToken = req.cookies?.refreshToken;
  console.log("\n🍪 [refresh] 쿠키 수신:", refreshToken ? "있음" : "없음");

  const ACCESS_SECRET = process.env.ACCESS_SECRET;
  const REFRESH_SECRET = process.env.REFRESH_SECRET;

  if (!refreshToken) {
    console.warn("❌ [refresh] refreshToken 없음 → 401");
    return res.status(401).json({ message: "refreshToken 없음" });
  }

  try {
    // ② refreshToken 검증
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    console.log("✅ [refresh] 토큰 검증 성공 → userId:", decoded.id);
    console.log(
      "토큰 만료시각:",
      new Date(decoded.exp * 1000).toLocaleString(),
    );
    console.log("현재 시각:    ", new Date().toLocaleString());
    console.log("남은 시간(초):", decoded.exp - Math.floor(Date.now() / 1000));

    // ③ 새 accessToken 발급
    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      ACCESS_SECRET,
      { expiresIn: "15m" },
    );

    console.log("✅ [refresh] 새 accessToken 발급 완료");

    // ④ 새 accessToken JSON으로 응답
    return res.status(200).json({
      accessToken,
      userId: decoded.id,
      role: decoded.role,
    });
  } catch (error) {
    console.error("❌ [refresh] 토큰 검증 실패:", error.message);

    // refreshToken 만료 또는 위조 → 쿠키 삭제
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // 개발환경 고정
      sameSite: "lax", // 개발환경 고정
    });
    return res.status(401).json({ message: "refreshToken 만료" });
  }
};


/**
 * 액세스 토큰 검증 
 */
export const verifyToken = (req, res, next) => {
  console.log("[verifyToken] 토큰 만료 확인");
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.error("❌ accessToken 만료 → 토큰 없음"); // ← 토큰 자체가 없음
    return res.status(401).json({ message: "토큰 없음" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
    console.log("✅ [verifyToken] 토큰 유효 → userId:", decoded.id); // ← 정상
    req.user = decoded;
    next();
  } catch (error) {
    console.log("⏰ [verifyToken] 토큰 만료 또는 위조 →", error.message); // ← 만료된 경우
    return res.status(401).json({ message: "토큰 만료 또는 유효하지 않음" });
  }
};



/**
 * 로그인 - 액세스, 리프레시 토큰 생성 및 전송
 */
export const getLogin = async (req, res, next) => {
  const { id, pwd } = req.body;
  const pwdHash = await repository.getPassword(id);

  //(1) .env 파일에서 JWT 시크릿 키, 만료 시간 가져오기
  const ACCESS_SECRET = process.env.ACCESS_SECRET;
  const REFRESH_SECRET = process.env.REFRESH_SECRET;
  const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || "10s";
  const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || "7d";

  try {
    if (!pwdHash) {
      res.json({ isLogin: false });
    } else {
      const isLogin = await bcrypt.compare(pwd, pwdHash.pwd); //pwdHash = {"pwd": ~~}
      let token = "";
      if (isLogin) {
        //로그인 인증 - jwttoken
        // token = await jwt.sign({id}, 'secret', {expiresIn : '7d'});

        //(2) AccessToken(메모리 저장), RefreshToken(HttpOnly 쿠키 저장) 발급
        const accessToken = jwt.sign(
          { id, role: pwdHash.role },
          ACCESS_SECRET,
          { expiresIn: ACCESS_EXPIRES },
        );
        const refreshToken = jwt.sign(
          { id, role: pwdHash.role },
          REFRESH_SECRET,
          { expiresIn: REFRESH_EXPIRES },
        );

        // console.log('token--> ', token);
        // res.json({isLogin, token, "role": pwdHash.role});

        //(3) Refresh Token → HttpOnly 쿠키로 전달
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false, // 개발환경 고정
          sameSite: "lax", // 개발환경 고정
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7일 (ms) : 쿠키의 유효기간
        });

        //(4) Access Token만 JSON으로 응답 (Refresh Token은 포함하지 않음)
        res.status(200).json({
          //return을 붙이면 끝을 직관적으로 명시함!
          isLogin,
          accessToken,
          role: pwdHash.role,
        });
      } else {
        return res.status(401).json({ isLogin: false });
      }
    }
  } catch (error) {
    console.log("login error :: ", error);
  }
};



/**
 * 로그인
 */
// export const getLogin  = async(req, res, next) => {
//     const {id, pwd} = req.body;
//     const pwdHash = await repository.getPassword(id);

//     try {
//         if(!pwdHash) {
//             res.json({"isLogin": false});
//         } else {
//             const isLogin = await bcrypt.compare(pwd, pwdHash.pwd);   //pwdHash = {"pwd": ~~}
//             let token = '';
//             if(isLogin) {
//                 //로그인 인증 - jwttoken
//                 token = await jwt.sign({id}, 'secret', {expiresIn : '7d'});
//             }
//             console.log('token--> ', token);
            
//             res.json({isLogin, token, "role": pwdHash.role});    
//         }
        
//     } catch (error) {
        
//     }
// }



/**
 * 아이디 중복 체크
 */
export const getIdCheck = async(req, res, next) => {
    const {id} = req.body;
    const result = await repository.getIdCheck(id);
    res.json(result);  //{"isFind": 1}
}

/**
 * 회원 가입
 */
export const getSignup = async(req, res, next) => {
    const { id, pwd, name, phone, emailDomain, emailName } = req.body;
    const pwdHash = await bcrypt.hash(pwd, 10);
    const email = emailName.concat('@',emailDomain);
    const member = {...req.body, "pwdHash": pwdHash, "email": email};
    
    const result = await repository.getSignup(member);    
    res.json({"isSignup": result});
}