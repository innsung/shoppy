import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PiGiftThin } from 'react-icons/pi';
import { ImageList } from '@/components/commons/ImageList.jsx';
import { StarRating } from '@/components/commons/StarRating.jsx';
import Tabs from '@/components/commons/Tabs.jsx';
import Detail from '@/components/detailTabs/Detail.jsx';
import Review from '@/components/detailTabs/Review.jsx';
import QnA from '@/components/detailTabs/QnA.jsx';
import Return from '@/components/detailTabs/Return.jsx';
import PurchaseActions from '@/components/product/PurchaseActions.jsx';
import { axiosGet } from '@/utils/dataFetch.js';

export default function ProductDetail() {
  const { pid } = useParams();
  const [product, setProduct] = useState(null);
  const [tabName, setTabName] = useState('detail');
  
  useEffect(() => {
    const fetchProduct = async () => {
      const product = await axiosGet(`/products/${pid}`);
      setProduct(product);
    };
    fetchProduct();
  }, [pid]);

  if (!product) return <div>로딩 중...</div>;

  const imgList = product.imgList ?? [];

  return (
    <div className="content">
      <div className="product-detail-top">
        <div className="product-detail-image-top">
          <img src={product.image} alt={product.name} />
          <ImageList className="product-detail-image-top-list" 
                    imgList={imgList} />
        </div>
        <ul className="product-detail-info-top">
          <li className="product-detail-title">{product.name}</li>
          <li className="product-detail-title">
            {`${parseInt(product.price).toLocaleString()}원`}
          </li>
          <li className="product-detail-subtitle">{product.info}</li>
          <li className="product-detail-subtitle-star">
            <StarRating totalRate={parseFloat(product.rate)} style="star-coral" />
            <span>527개 리뷰 &nbsp;&nbsp; {">"} </span>
          </li>
          <li>
            <p className="product-detail-box">신규회원, 무이자할부 등</p>
          </li>
          <PurchaseActions pid={product.pid} />
          <li>
            <ul className="product-detail-summary-info">
              <li>상품 요약 정보</li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="product-detail-tab">
        <Tabs currentTab={tabName} onTabChange={setTabName} />
        <div className="tabs_contents">
          {tabName === 'detail' && <Detail imgList={imgList} pid={pid} detailInfo={product.detailInfo} />}
          {tabName === 'review' && <Review />}
          {tabName === 'qna' && <QnA pid={pid} />}
          {tabName === 'return' && <Return />}
        </div>
        <div style={{ marginBottom: '50px' }}></div>
      </div>
    </div>
  );
}
