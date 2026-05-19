import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosPost } from '../../utils/dataFetch.js';

const initForm = (keys) => keys.reduce((acc, k) => ({ ...acc, [k]: '' }), {});

export default function Signup() {
  const navigate = useNavigate();
  const idRef = useRef(null);
  const initArray = ['id', 'pwd', 'cpwd', 'name', 'phone', 'emailName', 'emailDomain'];
  const [form, setForm] = useState(initForm(initArray));
  const [errors, setErrors] = useState(initForm(initArray));

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors(initForm(initArray));
  };

  const handleResetForm = () => setForm(initForm(initArray));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.id) { setErrors(p => ({ ...p, id: '아이디를 입력해주세요' })); return; }
    if (!form.pwd) { setErrors(p => ({ ...p, pwd: '비밀번호를 입력해주세요' })); return; }
    if (form.pwd !== form.cpwd) { setErrors(p => ({ ...p, cpwd: '비밀번호가 일치하지 않습니다' })); return; }
    
    
    try {
      const result = await axiosPost('/member/signup', form);   
      if(result.isSignup) navigate('/login');      
    } catch (error) {
      console.log('Signup Error ::', error);      
    }
  };

  const handleIdCheck = async() => {
    //1. id 유효성 체크
    if(idRef.current.value === '') {
      alert('아이디를 입력해주세요');
      idRef.current.focus();
      return false;      
    } else {
      //2. 서버에 id 전송 
      const result = await axiosPost('/member/idCheck', {"id": form.id.trim()}); 
      if(result.isFind) {
        alert('이미 사용중인 아이디 입니다. 다시 입력해주세요');
        idRef.current.focus();
      } else {
        alert('사용이 가능한 아이디 입니다.');
        //패스워드 입력 위치로 포커스 이동
      }
    }
  }

  return (
    <div className="content">
      <div className="join-form center-layout">
        <h1 className="center-title">회원가입</h1>
        <form onSubmit={handleSubmit}>
          <ul>
            <li>
              <label htmlFor="id"><b>아이디</b></label>
              {errors.id && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.id}</span>}
              <div>
                <input  type="text" 
                        id="id" name="id" 
                        value={form.id} 
                        ref={idRef}
                        onChange={handleChangeForm} 
                        placeholder="아이디 입력(6~20자)"
                        />
                <button type="button" onClick={handleIdCheck}> 중복확인</button>
              </div>
            </li>
            <li>
              <label htmlFor="pwd"><b>비밀번호</b></label>
              <div><input type="password" id="pwd" name="pwd" value={form.pwd} onChange={handleChangeForm} placeholder="비밀번호 입력" /></div>
            </li>
            <li>
              <label htmlFor="cpwd"><b>비밀번호 확인</b></label>
              {errors.cpwd && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.cpwd}</span>}
              <div><input type="password" id="cpwd" name="cpwd" value={form.cpwd} onChange={handleChangeForm} placeholder="비밀번호 재입력" /></div>
            </li>
            <li>
              <label htmlFor="name"><b>이름</b></label>
              <div><input type="text" id="name" name="name" value={form.name} onChange={handleChangeForm} placeholder="이름을 입력해주세요" /></div>
            </li>
            <li>
              <label htmlFor="phone"><b>전화번호</b></label>
              <div><input type="text" id="phone" name="phone" value={form.phone} onChange={handleChangeForm} placeholder="휴대폰 번호 입력('-' 포함)" /></div>
            </li>
            <li>
              <label htmlFor="emailName"><b>이메일 주소</b></label>
              <div>
                <input type="text" id="emailName" name="emailName" value={form.emailName} onChange={handleChangeForm} placeholder="이메일 주소" />
                <span>@</span>
                <select name="emailDomain" value={form.emailDomain} onChange={handleChangeForm}>
                  <option value="">선택</option>
                  <option value="naver.com">naver.com</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="daum.net">daum.net</option>
                </select>
              </div>
            </li>
            <li>
              <button type="submit">가입하기</button>
              <button type="reset" onClick={handleResetForm}>다시쓰기</button>
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
}