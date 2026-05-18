import { useState, useEffect } from 'react';
import { axiosGet } from '../../utils/dataFetch';

export default function Return() {
  const [returnData, setReturnData] = useState(null);

  useEffect(() => {
    const fetchReturn = async () => {
      // const res = await fetch('/data/productReturn.json');
      const returnData = await axiosGet('/return');
      setReturnData(returnData)
      // const data = await res.json();
      // setReturnData(Array.isArray(data) ? data[0] : data);
    };
    fetchReturn();
  }, []);

  if (!returnData) return <div>로딩 중...</div>;

  return (
    <div>
      <div style={{ paddingTop: '20px' }}></div>
      <h4>{returnData.title}</h4>
      <p style={{ paddingBottom: '20px' }}>{returnData.description}</p>
      <table className="review-list-content">
        <tbody>
          {returnData.list && returnData.list.map((item, idx) => (
            <tr key={idx}>
              <td style={{ width: '30%', textAlign: 'center' }}>{item.title}</td>
              <td>
                <ul style={{ textAlign: 'left' }}>
                  {item.infoList?.map((info, i) => <li key={i}>{info}</li>)}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
