import { ImageList } from '@/components/commons/ImageList.jsx';

export default function Detail({ imgList, pid, detailInfo }) {
  if (!detailInfo) return <div>상세 정보가 없습니다.</div>;

  return (
    <div>
      <DetailImages imgList={imgList} />
      <DetailInfo info={detailInfo} />
    </div>
  );
}

export function DetailImages({ imgList }) {
  return (
    <div className="detail-images">
      <div style={{ padding: '20px' }}></div>
      <img src="/images/holidays_notice.jpg" alt="notice" />
      <ImageList imgList={imgList} className="detail-images-list" />
    </div>
  );
}

export function DetailInfo({ info }) {
  return (
    <div className="detail-info">
      <h4 className="detail-info-title-top">
        {info?.title_en} / {info?.title_ko}
        {info?.list && info.list.map((item, idx) => (
          <div key={idx}>
            <h5 className="detail-info-title">[{item.title}]</h5>
            {item.title === 'SIZE' || item.title === 'MODEL SIZE' ? (
              <ul className="nolist">
                <li>{item.type}</li>
                {item.title === 'MODEL SIZE' && <><li>{item.height}</li><li>{item.size}</li></>}
                {item.title === 'SIZE' && (
                  <>
                    <li>총길이: {item.totalLength}</li>
                    <li>어깨너비: {item.shoulderWidth}</li>
                    <li>가슴너비: {item.chestWidth}</li>
                    <li>소매길이: {item.sleeveLength}</li>
                  </>
                )}
              </ul>
            ) : (
              <ul className="list nolist">
                {item.title === 'FABRIC' && <><li>Color: {item.color}</li><li>{item.material}</li></>}
                {item.description?.map((desc, i) => <li key={i}>{desc}</li>)}
              </ul>
            )}
          </div>
        ))}
      </h4>
    </div>
  );
}
