import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegUser } from 'react-icons/fa6';
import { FaLock } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore.js';
import { axiosPost } from '@/utils/dataFetch.js';

export default function Login() {
  const navigate = useNavigate();
  const idRef = useRef(null);
  const pwdRef = useRef(null);
  const [formData, setFormData] = useState({ id: '', pwd: '' });
  const [errors, setErrors] = useState({ id: '', pwd: '' });
  const login = useAuthStore((s) => s.login);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ id: '', pwd: '' });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id) { setErrors(prev => ({ ...prev, id: '아이디를 입력해주세요' })); idRef.current.focus(); return; }
    if (!formData.pwd) { setErrors(prev => ({ ...prev, pwd: '비밀번호를 입력해주세요' })); pwdRef.current.focus(); return; }

    // JSON 모드: 간단 로그인 시뮬레이션 (id/pwd 모두 입력 시 성공)
    const result = await axiosPost('/member/login', formData);
    if(result.isLogin) {
      // 로그인 인증 관리 => 전역 객체 리덕스에 등록
      login({ userId: formData.id, 
              role: result.role, 
              accessToken: result.accessToken,
              isLogin: result.isLogin });    
      alert('로그인에 성공하셨습니다.');      
      navigate('/');      
    } else {
      alert('로그인에 실패하셨습니다.');
    }
  };

  return (
    <div className="content">
      <div className="center-layout login-form">
        <h1 className="center-title">로그인</h1>
        <form onSubmit={handleLoginSubmit}>
          <ul>
            <li><p>아이디 비밀번호를 입력하신 후, 로그인 버튼을 클릭해 주세요.</p></li>
            <li>
              <div className="login-form-input">
                <FaRegUser />
                <input type="text" name="id" value={formData.id} ref={idRef}
                  onChange={handleFormChange} placeholder="아이디를 입력해주세요" />
              </div>
              <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.id}</span>
            </li>
            <li>
              <div className="login-form-input">
                <FaLock />
                <input type="password" name="pwd" value={formData.pwd} ref={pwdRef}
                  onChange={handleFormChange} placeholder="패스워드를 입력해주세요" />
              </div>
              <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.pwd}</span>
            </li>
            <li>
              <button type="submit" className="btn-main-color">로그인</button>
            </li>
            <li>
              <div>
                <input type="checkbox" name="status" />
                <label htmlFor="id">아이디 저장</label>
              </div>
            </li>
            <li>
              <button className="btn-main-color-naver" type="button">네이버 로그인</button>
            </li>
          </ul>
          <div style={{ margin: '30px 0 0 30px', display: 'flex' }}>
            <img src="/images/sns_login_.png" alt="SNS Login" />
          </div>
        </form>
      </div>
    </div>
  );
}