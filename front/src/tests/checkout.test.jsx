import {it,expect,vi} from 'vitest';
import {render,screen,fireEvent} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import Checkout from '../pages/Checkout.jsx';
const mocks=vi.hoisted(()=>({post:vi.fn()}));
vi.mock('../../utils/dataFetch.js',()=>({axiosPost:mocks.post}));
vi.mock('../../components/commons/QRModal.jsx',()=>({default:()=> <div>결제 QR</div>}));
it('moves the PC checkout to completion only after server approval',async()=>{
 window.scrollTo=vi.fn();
 mocks.post.mockImplementation(async path=>{
  if(path==='/carts/list')return [{pid:1,name:'상품',total_price:15000,price:15000,qty:1}];
  if(path==='/kakao/ready')return {tid:'test',statusToken:'private-token',next_redirect_mobile_url:'https://example.com'};
  if(path==='/kakao/status')return {state:'approved',orderId:'test-order',amount:15000};
 });
 render(<MemoryRouter><Checkout/></MemoryRouter>);
 await screen.findByText(/상품, /);
 expect(screen.queryByText('결제가 완료되었습니다')).toBeNull();
 fireEvent.click(screen.getByLabelText(/구매조건 확인/));fireEvent.click(screen.getByLabelText(/개인정보 국외/));
 fireEvent.click(screen.getByRole('button',{name:'결제하기'}));
 await screen.findByRole('heading',{name:'결제가 완료되었습니다'});
 expect(screen.getByText('결제 금액: 15,000원')).toBeTruthy();expect(screen.queryByText('결제 QR')).toBeNull();
 expect(mocks.post).toHaveBeenCalledWith('/kakao/status',expect.objectContaining({statusToken:'private-token'}));
});
