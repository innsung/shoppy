# Shoppy - AI 맞춤 상품 추천 쇼핑몰

강의용 React·Express·MySQL 쇼핑몰을 기반으로, 취향 설정과 MiniLM 기반 상품 추천을 추가한 개인 확장 프로젝트입니다. 상품 탐색부터 추천 피드백, 좋아요 목록, 장바구니와 KakaoPay 테스트 결제까지 하나의 쇼핑 흐름으로 연결했습니다.

## 프로젝트 정보

- 형태: 기존 강의용 쇼핑몰을 확장한 개인 프로젝트
- 주요 확장 내용: AI 추천 API, 취향·피드백 저장, 좋아요 목록, 실시간 검색·카테고리 필터, UI 개선과 결제 결과 화면
- 주 사용 언어: JavaScript, SQL, HTML, CSS

## 시연영상

[▶ Shoppy 주요 기능 시연영상 보기 (약 2분 12초)](https://youtu.be/Tb5i9hwnWIg)

회원가입·로그인, 상품 검색·상세 조회, 조건별 AI 추천, 장바구니와 KakaoPay 테스트 결제 후 PC 완료 화면으로 돌아오는 흐름을 확인할 수 있습니다.

## 주요 기능

- 회원가입, bcrypt 비밀번호 해시와 JWT 기반 로그인
- 대표 상품 중심의 메인 화면과 공통 헤더·푸터
- 상품명·스타일·색상 실시간 검색, 카테고리 필터와 가격 정렬
- 검색어 삭제 시 선택한 카테고리의 전체 상품 복원
- 스타일·선호 색상·예산에 맞는 AI 상품 추천
- 상품 상세의 유사 상품 추천과 조건에 기반한 추천 이유 표시
- 좋아요·관심 없음 저장, 좋아요 목록 조회·취소와 헤더 수량 표시
- 로그아웃 시 저장된 좋아요와 헤더 수량 초기화
- 장바구니 상품 관리와 KakaoPay 테스트 결제
- 결제 승인 후 상품명·금액·일시·주문번호 표시 및 홈·상품 목록 이동

## 서비스 흐름

```text
React 화면
  → Axios / Express API
  → 회원·상품·장바구니 처리 / MySQL
  → 결과 표시

취향 설정
  → 스타일·색상·예산 저장
  → MiniLM으로 취향과 상품 설명의 문장 벡터 생성
  → 예산·태그·관심 없음 조건으로 후보 필터링
  → 의미 유사도와 태그 일치 점수로 정렬
  → 추천 상품과 조건별 추천 이유 표시

PC 결제 요청
  → KakaoPay 결제 준비 API
  → 카카오페이 PC 전용 결제 화면 / 휴대폰 인증
  → PC 브라우저에서 localhost 승인 콜백 호출
  → 서버 승인 결과 확인
  → Shoppy 헤더·푸터가 있는 결제 완료 페이지
```

## AI 추천 모델과 데이터 처리

### MiniLM 기반 콘텐츠 추천

- 모델: `Xenova/paraphrase-multilingual-MiniLM-L12-v2`
- 실행: Node.js의 Transformers.js에서 양자화된 ONNX 모델 사용
- 구조: Transformer 기반 사전학습 딥러닝 모델
- 입력: 사용자 취향과 상품의 스타일·색상·카테고리·설명·계절 정보
- 출력: 평균 풀링과 정규화를 적용한 384차원 문장 벡터

모델은 문장의 의미를 벡터로 변환하고, 추천 로직은 코사인 유사도와 명시적인 조건을 결합합니다. 상품 사진을 분석하거나 추천 문구를 생성하는 방식은 아닙니다. 모델을 직접 학습하거나 파인튜닝하지 않았으며, Python 서버 없이 JavaScript 환경에서 추론합니다.

### 추천 기준

- 예산 초과 상품과 관심 없음 상품 제외
- 선택한 스타일 중 하나 이상 일치하는 상품 사용
- 색상을 선택했다면 선택 색상 중 하나 이상 일치해야 함
- 개인 추천은 코사인 유사도 0.50 이상을 대상으로 점수순 정렬
- 기본 점수: 의미 유사도 × 0.70 + 스타일 일치 × 0.20 + 색상 일치 × 0.10
- 색상을 선택하지 않으면 스타일 일치 가중치를 0.30으로 적용
- 좋아요가 있으면 취향 벡터 × 0.65와 정규화한 좋아요 상품 평균 벡터 × 0.35를 합한 뒤 다시 정규화
- 조건을 통과한 상품만 반환하며, 결과를 일정 개수로 채우지 않음
- 유사 상품은 동일 카테고리·겹치는 스타일·유사도 0.65 이상 조건으로 최대 4개 표시

유사도 기준과 가중치는 시연용 설정이며, 측정된 추천 정확도를 의미하지 않습니다. 좋아요 반영은 추천 벡터 계산이며 모델 재학습은 아닙니다.

벡터는 모델이 문장의 의미를 표현한 숫자 목록입니다. 코사인 유사도는 두 벡터의 방향이 얼마나 비슷한지를 비교하는 점수로, 범위는 -1부터 1이며 값이 클수록 방향이 유사합니다. 개인 추천의 0.50과 유사 상품 추천의 0.65는 후보를 통과시키는 최소 점수입니다. 반면 취향 벡터의 0.65와 좋아요 상품 평균 벡터의 0.35는 두 정보를 섞는 가중치이며, 유사도 기준과는 다른 용도입니다. 여기서는 점수와 가중치 모두 소수점으로 표기하며, 0.50을 추천 정확도 50%로 해석하지 않습니다.

### 캐시와 피드백

상품 벡터는 모델 설정과 상품 내용의 해시를 기준으로 디스크에 캐시합니다. 취향 문장의 벡터는 메모리에 캐시합니다. 최초 실행 시 모델 파일을 다운로드하며, 이후 추론은 로컬에서 수행합니다.

좋아요·관심 없음은 DB에 즉시 저장하되 현재 화면의 상품 순서는 유지합니다. F5, 페이지 재진입 또는 새로운 추천 요청에서 저장된 피드백을 반영합니다. 추천 이유는 실제 스타일·색상 일치와 예산 조건을 표시합니다.

## 데이터베이스 관리

| 구분 | 저장 내용 |
|---|---|
| 기존 쇼핑몰 테이블 | 회원, 상품·상세 정보, 장바구니 등 |
| `recommendation_tags` | 상품별 스타일·색상 JSON, 카테고리, 계절, 설명 |
| `recommendation_profiles` | 브라우저별 취향 JSON과 상품별 피드백 JSON |

- 추천 태그는 `pid`로 상품과 연결합니다.
- 좋아요는 별도 테이블 대신 `recommendation_profiles.feedback`에 저장합니다.
- 서명된 HTTP-only 쿠키의 임의 식별자로 추천 프로필을 구분합니다.
- 취향·피드백은 브라우저 단위이며 로그인 계정 간 동기화는 구현하지 않았습니다.
- 로그아웃 시 좋아요는 삭제하고 취향·관심 없음은 유지합니다.

## 기술 스택

| 구분 | 기술 |
|---|---|
| Frontend | JavaScript, React 19, Vite, React Router, Zustand, Axios, CSS |
| Backend | Node.js, Express, JWT, bcrypt, cookie-parser |
| AI | MiniLM, Transformers.js, ONNX, 코사인 유사도 |
| Database | MySQL, mysql2, JSON 컬럼 |
| Payment | KakaoPay API, 테스트 CID `TC0ONETIME` |
| Test | Vitest, React Testing Library, 추천 API 검증 스크립트 |

## 프로젝트 구조

```text
front/src/pages/                  메인·상품·좋아요·결제 결과 페이지
front/components/commons/         헤더·푸터·공통 UI
front/components/recommendations/ 추천 화면과 피드백 처리
front/store/                      로그인·장바구니·좋아요 상태
front/utils/                      API 호출
front/styles/                     쇼핑몰·추천·결제 결과 스타일
server/routes/                    API 경로
server/controller/                회원·결제 요청 처리
server/repository/                SQL 조회와 데이터 접근
server/db/                        MySQL 연결
server/recommendations/            추천 엔진·API·샘플 데이터·검증
```

## 실행 방법

Node.js와 MySQL이 설치된 로컬 환경을 기준으로 합니다. Frontend와 Backend는 각각 별도 터미널에서 실행합니다.

### Database

루트의 `shoppy.sql`, `shoppy_dump.sql`을 참고해 `shoppy` 데이터베이스와 기존 쇼핑몰 테이블·기초 상품 데이터를 준비합니다. 기존 데이터가 있다면 초기화·삭제 구문과 중복 INSERT 여부를 확인하고 필요한 구문만 실행합니다. 추천 초기화 스크립트는 기존 상품 테이블과 기초 데이터가 준비된 상태에서 실행합니다.

### Backend

`server/.env`에 로컬 설정을 작성합니다.

```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=shoppy
SERVER_PORT=9000
ACCESS_SECRET=replace_with_a_random_access_secret
REFRESH_SECRET=replace_with_a_different_random_refresh_secret
ACCESS_EXPIRES=15m
REFRESH_EXPIRES=7d
KAKAO_SECRET_KEY=your_kakaopay_test_secret_key
```

```powershell
cd server
npm ci
# 최초 추천 테이블·샘플 데이터 준비
node recommendations/seed.mjs
# 시연용 상품 정보와 이미지 구성 (기존 샘플 상품을 변경하므로 최초 구성 시 실행)
node recommendations/refresh-catalog.mjs
npm start
```

### Frontend

```powershell
cd front
npm ci
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:9000`
- 최초 AI 추천 시 모델 다운로드를 위한 인터넷 연결이 필요합니다.
- 결제에는 KakaoPay 테스트 Secret Key와 해당 앱의 도메인 설정이 필요합니다.
- 현재 PC 전용 결제는 승인 주소 `http://localhost:9000/kakao/approve`를 사용하므로 ngrok이 필요하지 않습니다. 휴대폰에서 쇼핑몰 자체를 여는 구성과는 다릅니다.

## 검증

```powershell
# front 디렉터리
npm test
npm run build

# Backend 실행 후 server 디렉터리
node recommendations/verify.mjs
```

Frontend 테스트는 한글 검색 입력, 좋아요 수량, 피드백 저장 실패, 추천 목록 유지, 결제 결과 표시 등을 확인합니다. 추천 API 검증은 프로필 분리, DB 저장, 예산·관심 없음 제외, 유사 상품과 입력 검증 등을 확인합니다. 결제 화면 테스트에는 모의 승인 응답을 사용하며, 실제 테스트 결제 흐름은 시연영상에서 확인할 수 있습니다.

## 구현 범위와 데이터 출처

- 28개 시연 상품을 사용하는 소규모 콘텐츠 기반 추천입니다. 별도의 추천 정확도나 사용자 만족도 평가는 수행하지 않았습니다.
- 결제 정보는 서버 메모리에서 임시 관리하므로 재시작 시 초기화됩니다. 주문 내역의 DB 저장과 결제 후 장바구니 자동 정리는 구현하지 않았습니다.
- 추가한 21개 시연 상품 이미지는 [DummyJSON](https://dummyjson.com/docs/products)을 사용하며, 한국어 상품명·태그와 원화 가격은 시연용으로 구성했습니다. 출처는 [이미지 목록](front/public/images/catalog/sources.json)에 기록했습니다.

> 실제 비밀번호, JWT Secret, 결제 API 키와 `.env` 파일은 Git에 커밋하지 않습니다.
