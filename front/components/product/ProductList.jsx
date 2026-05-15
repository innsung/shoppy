import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductAvatar from '@/components/product/ProductAvatar.jsx';
import { groupByRows, axiosGet } from '@/utils/dataFetch.js';

export default function ProductList() {
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const number = 3;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await axiosGet('/products'); 
        setProductList(groupByRows(products, number));
      } catch (error) {
        console.error('상품 목록을 불러오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      {productList.map((rowArray, idx) => (
        <div className="product-list" key={idx}>
          {rowArray.map((product) => (
            <Link to={`/products/${product.pid}`} key={product.pid}>
              <ProductAvatar img={product.image} />
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
