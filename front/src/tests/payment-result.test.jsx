import {it,expect,vi} from 'vitest';
import {render,screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import PayResult from '../pages/PayResult.jsx';
vi.mock('../../utils/dataFetch.js',()=>({axiosPost:vi.fn(async()=>({state:'approved',itemName:'테스트 상품',amount:45000,orderId:'test-order',approvedAt:'2026-09-28T17:00:00+09:00'}))}));
it('shows verified payment details and working navigation destinations',async()=>{
 render(<MemoryRouter initialEntries={['/payresult?orderId=test-order&token=test-token']}><PayResult/></MemoryRouter>);
 await screen.findByRole('heading',{name:'결제가 완료되었습니다!'});
 expect(screen.getByText('45,000원')).toBeTruthy();expect(screen.getByText('테스트 상품')).toBeTruthy();
 expect(screen.getByRole('link',{name:'홈으로'}).getAttribute('href')).toBe('/');
 expect(screen.getByRole('link',{name:'쇼핑 계속하기'}).getAttribute('href')).toBe('/products');
});
