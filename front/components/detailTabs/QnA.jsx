import { useState, useEffect } from 'react';
import ItemContent from '@/components/commons/ItemContent.jsx';

export default function QnA({ pid }) {
  const [qnaData, setQnaData] = useState([]);

  useEffect(() => {
    const fetchQna = async () => {
      const res = await fetch('/data/productQnA.json');
      const all = await res.json();
      setQnaData(all.filter(item => String(item.pid) === String(pid)));
    };
    fetchQna();
  }, [pid]);

  return (
    <div>
      <div style={{ paddingTop: '20px' }}></div>
      <table className="review-list-content">
        <tbody>
          {qnaData.map((item, idx) => (
            <tr key={idx}>
              <td style={{ width: '10%' }}>
                {item.isComplete ? <span>답변완료</span> : <span>답변준비중</span>}
              </td>
              <td style={{ width: '60%' }}>
                <ItemContent item={item} />
              </td>
              <td style={{ width: '15%' }}>{item.id}</td>
              <td>{item.cdate}</td>
            </tr>
          ))}
          <tr><td colSpan={4}>{'<< '} 1 2 3 4 5 {' >>'}</td></tr>
        </tbody>
      </table>
    </div>
  );
}
